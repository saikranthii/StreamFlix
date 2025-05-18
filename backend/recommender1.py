import pandas as pd
import ast
import requests
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import os
import random

class MovieRecommender:
    def __init__(self, telugu_movies_path="data/TeluguMovies_enhanced.csv", tmdb_api_key="8265bd1679663a7ea12ac168da84d2e8"):
        # Load Telugu movies dataset
        print("Loading Telugu movies dataset...")
        self.telugu_movies_df = pd.read_csv(telugu_movies_path)
        print(f"Loaded Telugu movies dataset with shape: {self.telugu_movies_df.shape}")
        print(f"Sample Telugu titles: {self.telugu_movies_df['title'].head().tolist()}")
        print(f"Sample Telugu IDs: {self.telugu_movies_df['id'].head().tolist()}")

        # Ensure required columns exist
        required_columns = ['id', 'title', 'genres', 'original_language']
        if not all(col in self.telugu_movies_df.columns for col in required_columns):
            raise ValueError(f"Dataset must contain columns: {required_columns}")

        # Parse genres
        print("Parsing genres for Telugu movies...")
        def safe_parse_genres(x):
            if pd.isna(x):
                return ''
            try:
                parsed = ast.literal_eval(x)
                return ' '.join([d['name'] for d in parsed]) if isinstance(parsed, list) else ' '.join([g.strip() for g in x.split(',') if g.strip()])
            except (ValueError, SyntaxError):
                return ' '.join([g.strip() for g in x.split(',') if g.strip()])
        self.telugu_movies_df['genres'] = self.telugu_movies_df['genres'].apply(safe_parse_genres)
        print("Genres parsing completed.")

        # Initialize poster column
        self.telugu_movies_df['poster'] = self.telugu_movies_df.get('poster', '').fillna('')
        self.poster_cache = {}  # Cache for fetched posters (keyed by movie_id and title)
        self.tmdb_api_key = tmdb_api_key

        # Prepare recommendation data
        self.telugu_movies_df['tags'] = self.telugu_movies_df['genres'].fillna('')
        print(f"Sample posters (Telugu): {self.telugu_movies_df['poster'].head().tolist()}")
        print(f"Total unique posters (Telugu): {len(self.telugu_movies_df['poster'][self.telugu_movies_df['poster'] != ''].unique())}")

        self.prepare_model()
        print("Initialization completed.")

    def fetch_poster(self, movie_id, title, year=None):
        """
        Fetch a poster URL from TMDB API or local data folder with enhanced accuracy.
        """
        if not title:
            print("Title is required for poster fetching")
            return "https://via.placeholder.com/200x300"

        # Create a cache key combining movie_id and title for uniqueness
        cache_key = f"{movie_id}:{title.lower().strip()}:{year or ''}"
        if cache_key in self.poster_cache:
            print(f"Returning cached poster for {cache_key}")
            return self.poster_cache[cache_key]

        # Check if dataset already has a valid TMDB poster
        movie_row = self.telugu_movies_df[self.telugu_movies_df['title'].str.lower() == title.lower()]
        if not movie_row.empty and movie_row['poster'].iloc[0].startswith('https://image.tmdb.org'):
            self.poster_cache[cache_key] = movie_row['poster'].iloc[0]
            print(f"Using dataset poster for '{title}': {movie_row['poster'].iloc[0]}")
            return movie_row['poster'].iloc[0]

        # Check local data folder
        local_poster = f"data/{title.replace(' ', '_').lower()}.jpg"
        if os.path.exists(local_poster):
            poster_url = f"file://{os.path.abspath(local_poster)}"  # Use file:// for local files
            self.poster_cache[cache_key] = poster_url
            print(f"Using local poster for '{title}': {poster_url}")
            return poster_url

        # Try TMDB API with movie_id
        url = f"https://api.themoviedb.org/3/movie/{movie_id}?api_key={self.tmdb_api_key}&language=en-US"
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            data = response.json()
            poster_path = data.get('poster_path')
            if poster_path and data.get('title', '').lower() == title.lower():
                full_path = f"https://image.tmdb.org/t/p/w500/{poster_path}"
                self.poster_cache[cache_key] = full_path
                print(f"Successfully fetched poster for ID {movie_id}: {full_path}")
                return full_path
        except (requests.exceptions.RequestException, KeyError, ValueError) as e:
            print(f"Error fetching poster for ID {movie_id}: {e}")

        # Fallback: Search by title and year
        search_url = f"https://api.themoviedb.org/3/search/movie?api_key={self.tmdb_api_key}&query={requests.utils.quote(title)}&language=en-US"
        if year:
            search_url += f"&year={year}"
        try:
            response = requests.get(search_url, timeout=10)
            response.raise_for_status()
            data = response.json()
            if data['results']:
                # Prioritize exact title and year match
                matches = [
                    r for r in data['results']
                    if r['title'].lower() == title.lower() and (not year or str(r.get('release_date', '')[:4]) == str(year))
                ]
                if matches:
                    best_match = matches[0]
                else:
                    # Fallback to highest popularity if no exact match
                    best_match = max(data['results'], key=lambda x: x.get('popularity', 0))
                poster_path = best_match.get('poster_path')
                if poster_path:
                    full_path = f"https://image.tmdb.org/t/p/w500/{poster_path}"
                    self.poster_cache[cache_key] = full_path
                    print(f"Poster fetched via title search for '{title}': {full_path}")
                    return full_path
            print(f"No results found for '{title}'")
        except (requests.exceptions.RequestException, KeyError, ValueError) as e:
            print(f"Error in title search for '{title}': {e}")

        # Cache placeholder to avoid repeated failed attempts
        self.poster_cache[cache_key] = "https://via.placeholder.com/200x300"
        print(f"Poster fetch failed for '{title}'. Using placeholder.")
        return "https://via.placeholder.com/200x300"

    def prepare_model(self):
        print("Preparing model for Telugu movies...")
        self.cv = CountVectorizer(max_features=5000, stop_words='english')
        self.vector = self.cv.fit_transform(self.telugu_movies_df['tags'].astype(str))
        print(f"Vector shape: {self.vector.shape}")
        self.similarity = cosine_similarity(self.vector)
        print("Similarity matrix computed.")

    def get_recommendations(self, movie_title, num_recommendations=None):
        print(f"Searching for title: {movie_title}")
        normalized_title = movie_title.lower().strip()
        available_titles = [t.lower().strip() for t in self.telugu_movies_df['title'].values]
        if normalized_title not in available_titles:
            print(f"Title '{movie_title}' not found. Returning random Telugu movies.")
            return self.get_random_telugu_movies(num_recommendations or 5)

        index = self.telugu_movies_df.index[self.telugu_movies_df['title'].str.lower() == normalized_title].tolist()[0]
        movie_id = self.telugu_movies_df.at[index, 'id']
        year = self.telugu_movies_df.at[index, 'year'] if 'year' in self.telugu_movies_df.columns else None

        # Fetch poster for input movie
        if not self.telugu_movies_df.at[index, 'poster'].startswith('https://image.tmdb.org'):
            self.telugu_movies_df.at[index, 'poster'] = self.fetch_poster(movie_id, movie_title, year)

        print(f"Found index for '{movie_title}': {index}")
        print(f"Language of {movie_title}: te")
        print(f"Genres of {movie_title}: {self.telugu_movies_df.at[index, 'genres']}")

        # Get trending movies to exclude from recommendations
        trending_movies = self.get_trending_telugu_movies()
        trending_indices = [
            self.telugu_movies_df.index[self.telugu_movies_df['title'].str.lower() == t.lower().strip()].tolist()[0]
            for t in trending_movies['title'].tolist()
            if t.lower().strip() in available_titles
        ]

        num_recommendations = random.randint(4, 8) if num_recommendations is None else min(num_recommendations, 8)
        print(f"Selected {num_recommendations} recommendations")

        # Get similar movies based on cosine similarity
        distances = sorted(list(enumerate(self.similarity[index])), reverse=True, key=lambda x: x[1])
        sim_indices = [i[0] for i in distances[1:] if i[0] != index and i[0] not in trending_indices][:num_recommendations]

        # Fill remaining slots with random movies if needed
        if len(sim_indices) < num_recommendations:
            remaining = num_recommendations - len(sim_indices)
            available_indices = [
                i for i in range(len(self.telugu_movies_df))
                if i not in sim_indices and i != index and i not in trending_indices
            ]
            sim_indices.extend(random.sample(available_indices, min(remaining, len(available_indices))))
            sim_indices = sim_indices[:num_recommendations]

        recommendations_df = self.telugu_movies_df.iloc[sim_indices].copy()
        for idx in recommendations_df.index:
            if not recommendations_df.at[idx, 'poster'].startswith('https://image.tmdb.org'):
                year = recommendations_df.at[idx, 'year'] if 'year' in recommendations_df.columns else None
                recommendations_df.at[idx, 'poster'] = self.fetch_poster(
                    recommendations_df.at[idx, 'id'], recommendations_df.at[idx, 'title'], year
                )

        # Relaxed genre filtering: Include movies with overlapping genres
        target_genres = set(self.telugu_movies_df.at[index, 'genres'].split())
        recommendations_df['genre_match'] = recommendations_df['genres'].apply(
            lambda x: len(set(x.split()) & target_genres) > 0
        )
        recommendations = recommendations_df[recommendations_df['genre_match']][['title', 'genres', 'original_language', 'poster']]
        if len(recommendations) < num_recommendations:
            print(f"Insufficient genre matches for '{movie_title}'. Including top similar movies.")
            recommendations = recommendations_df[['title', 'genres', 'original_language', 'poster']][:num_recommendations]

        print(f"Recommendations for '{movie_title}': {[(rec['title'], rec['genres'], rec['poster']) for rec in recommendations.to_dict('records')]}")
        return recommendations

    def get_random_telugu_movies(self, num_movies=5):
        """Return a list of random Telugu movies with fetched posters."""
        if len(self.telugu_movies_df) == 0:
            print("No Telugu movies found in dataset.")
            return pd.DataFrame(columns=['title', 'genres', 'original_language', 'poster'])

        random_indices = random.sample(range(len(self.telugu_movies_df)), min(num_movies, len(self.telugu_movies_df)))
        random_movies = self.telugu_movies_df.iloc[random_indices].copy()

        for idx in random_movies.index:
            if not random_movies.at[idx, 'poster'].startswith('https://image.tmdb.org'):
                year = random_movies.at[idx, 'year'] if 'year' in random_movies.columns else None
                random_movies.at[idx, 'poster'] = self.fetch_poster(
                    random_movies.at[idx, 'id'], random_movies.at[idx, 'title'], year
                )

        return random_movies[['title', 'genres', 'original_language', 'poster']]

    def get_trending_telugu_movies(self):
        """Return a list of trending Telugu movies with correct posters."""
        trending_movies = [
            {"title": "Kalki 2898 AD", "tmdb_id": 900352, "year": 2024},
            {"title": "Salaar", "tmdb_id": 934632, "year": 2023},
            {"title": "RRR", "tmdb_id": 614933, "year": 2022},
            {"title": "Pushpa 2: The Rule", "tmdb_id": 614934, "year": 2024},
            {"title": "Hi Nanna", "tmdb_id": 1121402, "year": 2023},
            {"title": "Saripodhaa Sanivaaram", "tmdb_id": 1080802, "year": 2024},  # Corrected title and added TMDB ID
            {"title": "Saaho", "tmdb_id": 614932, "year": 2019},
        ]

        trending_df = pd.DataFrame(columns=['title', 'genres', 'original_language', 'poster', 'id'])
        for movie in trending_movies:
            title = movie['title']
            tmdb_id = movie['tmdb_id'] or "0"
            year = movie['year']
            poster = self.fetch_poster(tmdb_id, title, year)
            trending_df = pd.concat([trending_df, pd.DataFrame([{
                'title': title,
                'genres': '',  # Genres can be fetched from dataset if available
                'original_language': 'te',
                'poster': poster,
                'id': tmdb_id
            }])], ignore_index=True)

        print(f"Trending movies with posters: {trending_df['title'].tolist()}")
        return trending_df[['title', 'genres', 'original_language', 'poster']]

if __name__ == "__main__":
    recommender = MovieRecommender()
    recommendations = recommender.get_recommendations("Baahubali: The Beginning")
    print("Recommendations for 'Baahubali: The Beginning':")
    print(recommendations)
    random_telugu = recommender.get_random_telugu_movies(5)
    print("Random Telugu Movies:")
    print(random_telugu)
    trending_telugu = recommender.get_trending_telugu_movies()
    print("Trending Movies:")
    print(trending_telugu)