from flask import Flask, render_template, request
import os
import requests
import pandas as pd
from pymongo import MongoClient
from datetime import datetime, timedelta
from sklearn.preprocessing import MinMaxScaler
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, VotingClassifier
from sklearn.linear_model import LogisticRegression

app = Flask(__name__)

# Add custom template filters
@app.template_filter('clamp')
def clamp_filter(value, min_value=0, max_value=100):
    return max(min_value, min(float(value), max_value))

@app.template_filter('comma')
def comma_filter(value):
    return "{:,}".format(value)

@app.template_filter('format_date')
def format_date_filter(value):
    return value.strftime('%Y-%m-%d')

# MongoDB Connection

MONGO_URI ="add you mongodb uri with database"

client = MongoClient(MONGO_URI)
db = client["fake2"]
collection = db["twitter_users"]

@app.template_filter('format_date')
def format_date_filter(date_str):
    if not date_str or date_str == 'N/A':
        return 'N/A'
    try:
        date_obj = datetime.strptime(date_str, '%Y-%m-%dT%H:%M:%S.%fZ')
        return date_obj.strftime('%b %d, %Y')
    except ValueError:
        return date_str
    
@app.template_filter('comma')
def comma_filter(value):
    return f"{int(value):,}"

# Twitter API Configuration
BEARER_TOKENS = [
    os.getenv("BEARER_TOKEN_1", "twitterapitokenhere"),
    os.getenv("BEARER_TOKEN_2", "here"),
    os.getenv("BEARER_TOKEN_3", "here"),
    os.getenv("BEARER_TOKEN_4", " and here")
]
API_ENDPOINT = "https://api.twitter.com/2/users/by/username/"
REQUIRED_FEATURES = ['followers_count', 'friends_count', 'statuses_count', 'listed_count']
@app.route('/')
def home():
    # Load static usernames from both CSV files
    users_df = pd.read_csv('users.csv')
    fusers_df = pd.read_csv('fusers.csv')
    static_usernames = list(users_df['screen_name']) + list(fusers_df['screen_name'])
    return render_template('index.html', static_usernames=static_usernames)


class TwitterAccountAnalyzer:
    def __init__(self):
        self.models = {}
        self.scaler = MinMaxScaler()
        self.static_data = self.load_static_data()
        self.initialize_models()
        self.train_models()

    def initialize_models(self):
        self.models['rf'] = RandomForestClassifier(n_estimators=150, random_state=42)
        self.models['gb'] = GradientBoostingClassifier(n_estimators=150, random_state=42)
        self.models['lr'] = LogisticRegression(max_iter=1000)
        self.models['voting'] = VotingClassifier(
            estimators=[('rf', self.models['rf']), ('gb', self.models['gb']), ('lr', self.models['lr'])],
            voting='soft'
        )

    def train_models(self):
        X = self.static_data[REQUIRED_FEATURES]
        y = self.static_data['label']
        X_scaled = self.scaler.fit_transform(X)
        for name, model in self.models.items():
            if name != 'voting':
                model.fit(X_scaled, y)
        self.models['voting'].fit(X_scaled, y)

    def load_static_data(self):
        users_df = pd.read_csv('users.csv')
        fusers_df = pd.read_csv('fusers.csv')
        users_df['label'] = 0
        fusers_df['label'] = 1
        return pd.concat([users_df, fusers_df], ignore_index=True)

    def predict(self, user_df):
        X = user_df[REQUIRED_FEATURES]
        X_scaled = self.scaler.transform(X)
        prediction = self.models['voting'].predict(X_scaled)
        probability = self.models['voting'].predict_proba(X_scaled)[0]
        return prediction, probability

analyzer = TwitterAccountAnalyzer()

# Update the get_twitter_data function to include profile_image_url
def get_twitter_data(username):
    params = {"user.fields": "public_metrics,created_at,description,verified,profile_image_url"}
    
    # Try each bearer token in sequence
    for token in BEARER_TOKENS:
        headers = {"Authorization": f"Bearer {token}"}
        try:
            response = requests.get(
                f"{API_ENDPOINT}{username}",
                headers=headers,
                params=params
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException:
            continue  # Move to next token if this one fails
    
    return None  # Return None if all tokens fail


def parse_twitter_data(user_data):
    metrics = user_data['data']['public_metrics']
    return {
        'followers_count': metrics['followers_count'],
        'friends_count': metrics['following_count'],
        'statuses_count': metrics['tweet_count'],
        'listed_count': metrics['listed_count'],
        'created_at': user_data['data'].get('created_at', 'N/A'),
        'verified': user_data['data'].get('verified', False),
        'description': user_data['data'].get('description', '')
    }
def home():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    username = request.form['username'].strip().lstrip('@')
    analysis_type = request.form.get('analysis_type', 'dynamic')  # Get analysis type
    
    if not username:
        return render_template('error.html', error="Please enter a username"), 400
    
    try:
        if analysis_type == 'static':
            # Static analysis - get data from CSV files
            users_df = pd.read_csv('users.csv')
            fusers_df = pd.read_csv('fusers.csv')
            all_users = pd.concat([users_df, fusers_df])
            
            user_data = all_users[all_users['screen_name'] == username].iloc[0].to_dict()
            
            # Convert to expected format
            parsed_data = {
                'followers_count': user_data.get('followers_count', 0),
                'friends_count': user_data.get('friends_count', 0),
                'statuses_count': user_data.get('statuses_count', 0),
                'listed_count': user_data.get('listed_count', 0),
                'created_at': user_data.get('created_at', 'N/A'),
                'verified': user_data.get('verified', False),
                'description': user_data.get('description', ''),
                'username': username,
                'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
            
            prediction, probability = analyzer.predict(pd.DataFrame([parsed_data]))
            confidence = round(max(probability) * 100, 1)
            
            return render_template('result.html', result={
                'username': username,
                'prediction': 'fake' if prediction[0] == 1 else 'genuine',
                'confidence': confidence,
                'features': parsed_data,
                'account_data': {
                    'created_at': parsed_data['created_at'],
                    'verified': parsed_data['verified'],
                    'description': parsed_data['description'],
                    'source': 'Static Dataset'
                }
            })
        else:
            # Dynamic analysis - original code
            user_data = collection.find_one({"username": username})
            if user_data:
                last_fetched_time = datetime.strptime(user_data['timestamp'], '%Y-%m-%d %H:%M:%S')
                time_diff = datetime.now() - last_fetched_time
                if time_diff < timedelta(hours=3):
                    prediction, probability = analyzer.predict(pd.DataFrame([user_data]))
                    confidence = round(max(probability) * 100, 1)
                    return render_template('result.html', result={
                        'username': username,
                        'prediction': 'fake' if prediction[0] == 1 else 'genuine',
                        'confidence': confidence,
                        'features': user_data,
                        'account_data': {
                            'created_at': user_data['created_at'],
                            'verified': user_data['verified'],
                            'description': user_data['description'],
                            'source': 'MongoDB Cache'
                        }
                    })
            
            # Fetch from API if data is outdated or not found
            twitter_data = get_twitter_data(username)
            if twitter_data and 'data' in twitter_data:
                parsed_data = parse_twitter_data(twitter_data)
                parsed_data['username'] = username
                parsed_data['timestamp'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                collection.update_one({"username": username}, {"$set": parsed_data}, upsert=True)
                prediction, probability = analyzer.predict(pd.DataFrame([parsed_data]))
                confidence = round(max(probability) * 100, 1)
                return render_template('result.html', result={
                    'username': username,
                    'prediction': 'fake' if prediction[0] == 1 else 'genuine',
                    'confidence': confidence,
                    'features': parsed_data,
                    'account_data': {
                        'created_at': parsed_data['created_at'],
                        'verified': parsed_data['verified'],
                        'description': parsed_data['description'],
                        'source': 'Twitter API'
                    }
                })
            return render_template('error.html', error="User not found"), 404
    except Exception as e:
        return render_template('error.html', error=str(e)), 500
if __name__ == '__main__':

    app.run(debug=True)
