from flask import Flask, request, jsonify
from flask_cors import CORS
from recommender import MovieRecommender as GeneralRecommender
from recommender1 import MovieRecommender as TeluguRecommender
import os
import requests
import time
import json
import atexit
import pandas as pd

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")}})
movies_path = os.path.join(os.path.dirname(__file__), 'data', 'movies.csv')
credits_path = os.path.join(os.path.dirname(__file__), 'data', 'credits.csv')
telugu_movies_path = os.path.join(os.path.dirname(__file__), 'data', 'TeluguMovies_enhanced.csv')
tmdb_api_key = os.getenv("TMDB_API_KEY", "8265bd1679663a7ea12ac168da84d2e8")
poster_cache_file = os.path.join(os.path.dirname(__file__), 'data', 'poster_cache.json')
poster_cache = {}

# Load persistent poster cache
try:
    if os.path.exists(poster_cache_file):
        with open(poster_cache_file, 'r') as f:
            poster_cache = json.load(f)
        print(f"Loaded {len(poster_cache)} posters from cache.")
except Exception as e:
    print(f"Error loading poster cache: {e}")

# Save poster cache on exit
def save_poster_cache():
    try:
        with open(poster_cache_file, 'w') as f:
            json.dump(poster_cache, f)
        print(f"Saved {len(poster_cache)} posters to cache.")
    except Exception as e:
        print(f"Error saving poster cache: {e}")

atexit.register(save_poster_cache)

# Initialize recommenders
try:
    print("Initializing recommenders...")
    general_recommender = GeneralRecommender(movies_path=movies_path, credits_path=credits_path, tmdb_api_key=tmdb_api_key)
    telugu_recommender = TeluguRecommender(telugu_movies_path=telugu_movies_path, tmdb_api_key=tmdb_api_key)
    # Sync poster caches
    poster_cache.update(general_recommender.poster_cache)
    poster_cache.update(telugu_recommender.poster_cache)
    print(f"Dataset loaded with {len(general_recommender.movies_df)} general movies and {len(telugu_recommender.telugu_movies_df)} Telugu movies.")
except Exception as e:
    print(f"Error initializing recommenders: {e}")
    raise

def fetch_tmdb_poster(movie_id, title, recommender, year=None, max_retries=3):
    """Fetch poster using recommender's fetch_poster method with fallback to TMDB API."""
    cache_key = f"{movie_id}:{title.lower().strip()}:{year or ''}"
    if cache_key in poster_cache:
        return poster_cache[cache_key]

    # Use recommender's fetch_poster method first
    poster = recommender.fetch_poster(movie_id, title, year)
    if poster and poster != "https://via.placeholder.com/200x300":
        poster_cache[cache_key] = poster
        return poster

    # Fallback to TMDB title search
    for attempt in range(max_retries):
        try:
            search_url = f"https://api.themoviedb.org/3/search/movie?api_key={tmdb_api_key}&query={requests.utils.quote(title)}"
            if year:
                search_url += f"&year={year}"
            response = requests.get(search_url, timeout=5)
            response.raise_for_status()
            data = response.json()
            if data['results']:
                matches = [
                    r for r in data['results']
                    if r['title'].lower().strip() == title.lower().strip() and
                    (not year or str(r.get('release_date', '')[:4]) == str(year))
                ]
                if matches:
                    best_match = matches[0]
                else:
                    best_match = max(data['results'], key=lambda x: x.get('popularity', 0))
                if best_match.get('poster_path'):
                    poster = f"https://image.tmdb.org/t/p/w500/{best_match['poster_path']}"
                    poster_cache[cache_key] = poster
                    return poster
        except (requests.exceptions.RequestException, ValueError) as e:
            print(f"Attempt {attempt + 1}/{max_retries} failed for {title} (ID: {movie_id}): {e}")
            if attempt < max_retries - 1:
                time.sleep(1)
        except Exception as e:
            print(f"Unexpected error for {title} (ID: {movie_id}): {e}")
            break

    print(f"Poster fetch failed for {title}. Using placeholder.")
    poster_cache[cache_key] = "https://via.placeholder.com/200x300"
    return poster_cache[cache_key]

@app.route('/api/csv/movies', methods=['GET'])
def get_movies_csv():
    try:
        if not os.path.exists(movies_path):
            raise FileNotFoundError(f"movies.csv not found at {movies_path}")
        df = pd.read_csv(movies_path)
        print(f"Loaded movies.csv with {len(df)} rows, columns: {df.columns.tolist()}")
        if 'title' not in df.columns:
            raise ValueError("Expected 'title' column in movies.csv")
        df.columns = [col.title() for col in df.columns]
        df = df.fillna('N/A')
        data = [df.columns.tolist()] + df.values.tolist()
        print(f"Returning {len(data)-1} rows for movies.csv")
        return jsonify({"headers": df.columns.tolist(), "data": data})
    except Exception as e:
        print(f"Error fetching movies.csv: {str(e)}")
        return jsonify({"error": f"Failed to fetch movies data: {str(e)}"}), 500

@app.route('/api/csv/credits', methods=['GET'])
def get_credits_csv():
    try:
        if not os.path.exists(credits_path):
            raise FileNotFoundError(f"credits.csv not found at {credits_path}")
        df = pd.read_csv(credits_path)
        print(f"Loaded credits.csv with {len(df)} rows, columns: {df.columns.tolist()}")
        df.columns = [col.title() for col in df.columns]
        df = df.fillna('N/A')
        data = [df.columns.tolist()] + df.values.tolist()
        print(f"Returning {len(data)-1} rows for credits.csv")
        return jsonify({"headers": df.columns.tolist(), "data": data})
    except Exception as e:
        print(f"Error fetching credits.csv: {str(e)}")
        return jsonify({"error": f"Failed to fetch credits data: {str(e)}"}), 500

@app.route('/api/csv/telugu', methods=['GET'])
def get_telugu_csv():
    try:
        if not os.path.exists(telugu_movies_path):
            raise FileNotFoundError(f"TeluguMovies_enhanced.csv not found at {telugu_movies_path}")
        df = pd.read_csv(telugu_movies_path)
        print(f"Loaded TeluguMovies_enhanced.csv with {len(df)} rows, columns: {df.columns.tolist()}")
        if 'title' not in df.columns:
            raise ValueError("Expected 'title' column in TeluguMovies_enhanced.csv")
        df.columns = [col.title() for col in df.columns]
        df = df.fillna('N/A')
        data = [df.columns.tolist()] + df.values.tolist()
        print(f"Returning {len(data)-1} rows for TeluguMovies_enhanced.csv")
        return jsonify({"headers": df.columns.tolist(), "data": data})
    except Exception as e:
        print(f"Error fetching TeluguMovies_enhanced.csv: {str(e)}")
        return jsonify({"error": f"Failed to fetch Telugu movies data: {str(e)}"}), 500

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    movie_title = data.get('movie_title')
    if not movie_title:
        return jsonify({"error": "No movie title provided"}), 400

    telugu_titles = [t.lower().strip() for t in telugu_recommender.telugu_movies_df['title'].values]
    recommender = telugu_recommender if movie_title.lower().strip() in telugu_titles else general_recommender
    recommendations = recommender.get_recommendations(movie_title, num_recommendations=5)

    if isinstance(recommendations, str):
        return jsonify({"error": recommendations}), 404

    recs = recommendations.to_dict('records')
    for rec in recs:
        year = rec.get('year') if 'year' in rec else None
        rec['poster'] = fetch_tmdb_poster(rec.get('id', '0'), rec['title'], recommender, year)

    return jsonify(recs)

@app.route('/random-telugu', methods=['GET'])
def random_telugu():
    random_telugu = telugu_recommender.get_random_telugu_movies(num_movies=5)
    if random_telugu.empty:
        return jsonify({"error": "Failed to fetch Telugu movies"}), 404

    recs = random_telugu.to_dict('records')
    for rec in recs:
        year = rec.get('year') if 'year' in rec else None
        rec['poster'] = fetch_tmdb_poster(rec.get('id', '0'), rec['title'], telugu_recommender, year)

    return jsonify(recs)

@app.route('/autocomplete', methods=['POST'])
def autocomplete():
    data = request.get_json()
    query = data.get('query', '').lower().strip()
    if not query:
        return jsonify([]), 200

    general_titles = general_recommender.movies_with_credits[['title', 'id', 'original_language', 'genres']].to_dict('records')
    telugu_titles = telugu_recommender.telugu_movies_df[['title', 'id', 'original_language', 'genres']].to_dict('records')
    
    suggestions = []
    seen_titles = set()
    for movie in general_titles + telugu_titles:
        title = movie['title'].lower().strip()
        if title.startswith(query) and title not in seen_titles:
            recommender = telugu_recommender if title in [t.lower().strip() for t in telugu_recommender.telugu_movies_df['title']] else general_recommender
            year = movie.get('year') if 'year' in movie else None
            poster = fetch_tmdb_poster(movie['id'], movie['title'], recommender, year)
            suggestions.append({
                'title': movie['title'],
                'id': movie['id'],
                'poster': poster,
                'original_language': movie['original_language'] or 'N/A',
                'genres': movie['genres'] or 'N/A'
            })
            seen_titles.add(title)

    suggestions.sort(key=lambda x: (x['title'].lower() != query, x['title'].lower()))
    return jsonify(suggestions[:5]), 200

@app.route('/movie', methods=['POST'])
def get_movie():
    data = request.get_json()
    title = data.get('title', '').lower().strip()
    if not title:
        return jsonify({"error": "No title provided"}), 400

    general_titles = general_recommender.movies_with_credits[['title', 'id', 'original_language', 'genres']].to_dict('records')
    telugu_titles = telugu_recommender.telugu_movies_df[['title', 'id', 'original_language', 'genres']].to_dict('records')
    
    for movie in general_titles + telugu_titles:
        if movie['title'].lower().strip() == title:
            recommender = telugu_recommender if title in [t.lower().strip() for t in telugu_recommender.telugu_movies_df['title']] else general_recommender
            year = movie.get('year') if 'year' in movie else None
            poster = fetch_tmdb_poster(movie['id'], movie['title'], recommender, year)
            return jsonify({
                'title': movie['title'],
                'id': movie['id'],
                'poster': poster,
                'original_language': movie['original_language'] or 'N/A',
                'genres': movie['genres'] or 'N/A'
            }), 200
    
    return jsonify({"error": "Movie not found"}), 404

if __name__ == '__main__':
    app.run(port=5000, debug=True)