import pandas as pd
import ast
import requests
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import os
from fuzzywuzzy import fuzz

class MovieRecommender:
    def __init__(self, movies_path="data/movies.csv", credits_path="data/credits.csv", tmdb_api_key="8265bd1679663a7ea12ac168da84d2e8"):
        # Validate dataset paths
        if not os.path.exists(movies_path) or not os.path.exists(credits_path):
            raise FileNotFoundError(f"Dataset files not found: {movies_path}, {credits_path}")

        # Load datasets
        self.movies_df = pd.read_csv(movies_path)
        self.credits_df = pd.read_csv(credits_path)
        print(f"Loaded movies dataset with shape: {self.movies_df.shape}")
        print(f"Loaded credits dataset with shape: {self.credits_df.shape}")

        # Validate required columns
        required_movie_cols = ['id', 'title', 'genres', 'original_language']
        required_credit_cols = ['movie_id', 'title', 'cast', 'crew']
        if not all(col in self.movies_df.columns for col in required_movie_cols):
            raise ValueError(f"movies.csv missing required columns: {required_movie_cols}")
        if not all(col in self.credits_df.columns for col in required_credit_cols):
            raise ValueError(f"credits.csv missing required columns: {required_credit_cols}")

        # Parse genres
        def safe_parse_genres(x):
            if pd.isna(x):
                return ''
            try:
                return ' '.join([d['name'] for d in ast.literal_eval(x)])
            except (ValueError, SyntaxError) as e:
                print(f"Error parsing genres: {e}")
                return ''
        self.movies_df['genres'] = self.movies_df['genres'].apply(safe_parse_genres)

        # Parse cast and crew
        def safe_parse_cast(x):
            if pd.isna(x):
                return ''
            try:
                return ' '.join([d['name'] for d in ast.literal_eval(x)[:3]])
            except (ValueError, SyntaxError) as e:
                print(f"Error parsing cast: {e}")
                return ''
        def safe_parse_crew(x):
            if pd.isna(x):
                return ''
            try:
                return ' '.join([d['name'] for d in ast.literal_eval(x) if d['job'] == 'Director'])
            except (ValueError, SyntaxError) as e:
                print(f"Error parsing crew: {e}")
                return ''
        self.credits_df['cast'] = self.credits_df['cast'].apply(safe_parse_cast)
        self.credits_df['crew'] = self.credits_df['crew'].apply(safe_parse_crew)

        # Initialize poster column
        if 'poster' not in self.movies_df.columns:
            self.movies_df['poster'] = ''
        else:
            self.movies_df['poster'] = self.movies_df['poster'].fillna('')
        self.poster_cache = {}  # Cache for fetched posters
        self.tmdb_api_key = tmdb_api_key

        # Merge datasets
        self.movies_with_credits = pd.merge(
            self.movies_df[['id', 'title', 'genres', 'original_language', 'poster']],
            self.credits_df[['movie_id', 'title', 'cast', 'crew']],
            on='title',
            how='inner'  # Ensure only matched titles are included
        )
        self.movies_with_credits['tmdb_id'] = self.movies_with_credits['movie_id'].combine_first(self.movies_with_credits['id'])
        self.movies_with_credits['tags'] = (
            self.movies_with_credits['original_language'].fillna('') + ' ' +
            self.movies_with_credits['genres'].fillna('') + ' ' +
            self.movies_with_credits['cast'].fillna('') + ' ' +
            self.movies_with_credits['crew'].fillna('')
        )
        print(f"Merged dataset shape: {self.movies_with_credits.shape}")

        self.prepare_model()

    def fetch_poster(self, movie_id, title, year=None):
        """Fetch poster from TMDB API with title and year fallback."""
        cache_key = f"{movie_id}:{title.lower().strip()}:{year or ''}"
        if cache_key in self.poster_cache:
            return self.poster_cache[cache_key]

        # Check dataset for existing valid poster
        matching_rows = self.movies_with_credits[self.movies_with_credits['title'].str.lower() == title.lower()]
        if not matching_rows.empty:
            poster = matching_rows['poster'].iloc[0]
            if poster and poster.startswith('https://image.tmdb.org'):
                self.poster_cache[cache_key] = poster
                return poster

        # Try TMDB API with movie_id
        try:
            url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={self.tmdb_api_key}&language=en-US"
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            data = response.json()
            if data.get('title', '').lower() == title.lower() and data.get('poster_path'):
                full_path = f"https://image.tmdb.org/t/p/w500/{data['poster_path']}"
                self.poster_cache[cache_key] = full_path
                return full_path
        except (requests.exceptions.RequestException, KeyError, ValueError) as e:
            print(f"Error fetching poster for movie ID {movie_id}, title {title}: {e}")

        # Fallback: Search by title and year
        search_url = f"https://api.themoviedb.org/3/search/movie?api_key={self.tmdb_api_key}&query={requests.utils.quote(title)}"
        if year:
            search_url += f"&year={year}"
        try:
            response = requests.get(search_url, timeout=10)
            response.raise_for_status()
            data = response.json()
            if data['results']:
                matches = [
                    r for r in data['results']
                    if r['title'].lower() == title.lower() and
                    (not year or str(r.get('release_date', '')[:4]) == str(year))
                ]
                if matches:
                    best_match = matches[0]
                else:
                    best_match = max(data['results'], key=lambda x: x.get('popularity', 0))
                if best_match.get('poster_path'):
                    full_path = f"https://image.tmdb.org/t/p/w500/{best_match['poster_path']}"
                    self.poster_cache[cache_key] = full_path
                    return full_path
        except (requests.exceptions.RequestException, KeyError, ValueError) as e:
            print(f"Error in title search for {title}: {e}")

        self.poster_cache[cache_key] = "https://via.placeholder.com/200x300"
        return self.poster_cache[cache_key]

    def prepare_model(self):
        self.cv = CountVectorizer(max_features=5000, stop_words='english')
        self.vector = self.cv.fit_transform(self.movies_with_credits['tags'].astype(str))
        print(f"Vector shape: {self.vector.shape}")
        self.similarity = cosine_similarity(self.vector)
        print("Similarity matrix computed.")

    def get_recommendations(self, movie_title, num_recommendations=5):
        normalized_title = movie_title.lower().strip()
        available_titles = [t.lower().strip() for t in self.movies_with_credits['title'].values]

        # Fuzzy match for similar titles
        title_matches = [
            (title, fuzz.ratio(normalized_title, title.lower().strip()))
            for title in self.movies_with_credits['title']
        ]
        title_matches.sort(key=lambda x: x[1], reverse=True)
        if not title_matches or title_matches[0][1] < 80:  # Threshold for fuzzy match
            print(f"Title '{movie_title}' not found. Closest matches: {title_matches[:3]}")
            return pd.DataFrame(columns=['title', 'genres', 'original_language', 'poster', 'id'])

        best_title = title_matches[0][0]
        if normalized_title != best_title.lower().strip():
            print(f"Using closest match '{best_title}' for '{movie_title}'")

        index = self.movies_with_credits.index[self.movies_with_credits['title'].str.lower() == best_title.lower().strip()].tolist()[0]
        movie_id = self.movies_with_credits.at[index, 'tmdb_id']
        year = self.movies_with_credits.get('release_year', pd.Series([None] * len(self.movies_with_credits))).iloc[index]

        # Fetch poster for the input movie
        if not self.movies_with_credits.at[index, 'poster'] or self.movies_with_credits.at[index, 'poster'] == "https://via.placeholder.com/200x300":
            self.movies_with_credits.at[index, 'poster'] = self.fetch_poster(movie_id, best_title, year)

        distances = sorted(list(enumerate(self.similarity[index])), reverse=True, key=lambda x: x[1])
        sim_indices = [i[0] for i in distances[1:num_recommendations + 1] if i[0] != index][:num_recommendations]

        # Fetch posters for recommended movies
        for idx in sim_indices:
            if not self.movies_with_credits.at[idx, 'poster'] or self.movies_with_credits.at[idx, 'poster'] == "https://via.placeholder.com/200x300":
                rec_movie_id = self.movies_with_credits.at[idx, 'tmdb_id']
                rec_title = self.movies_with_credits.at[idx, 'title']
                rec_year = self.movies_with_credits.get('release_year', pd.Series([None] * len(self.movies_with_credits))).iloc[idx]
                self.movies_with_credits.at[idx, 'poster'] = self.fetch_poster(rec_movie_id, rec_title, rec_year)

        recommendations = self.movies_with_credits.iloc[sim_indices][['title', 'genres', 'original_language', 'poster', 'tmdb_id']].rename(columns={'tmdb_id': 'id'})
        print(f"Recommendations for '{best_title}': {recommendations.to_dict('records')}")
        return recommendations

if __name__ == "__main__":
    recommender = MovieRecommender()
    recommendations = recommender.get_recommendations("Avatar", 5)
    print("Recommendations for 'Avatar':")
    print(recommendations)