🕵️ Fake Social Media Account Detection

This repository contains the implementation of a Fake Social Media Account Detection system. The project combines machine learning techniques with a Flask-based web application to classify accounts as real or fake based on behavioral and profile features.

🔍 Overview

Problem
Fake accounts on social media spread misinformation, scams, and spam, undermining trust and security. Traditional detection methods often fail to adapt to diverse patterns of fake accounts.

Proposed Solution
We built a detection system that leverages:

Random Forest & SVM → baseline classification accuracy.

XGBoost → fine-tuned detection and better handling of feature importance.

Flask Web App → provides an interactive interface for users to test accounts.

Key Features

Preprocessing pipeline: missing value handling, feature encoding, normalization.

Model training and evaluation with accuracy metrics & feature importance plots.

Flask-based web interface (Templates/ + Static/) for real-time account classification.

MongoDB integration for storing and exporting datasets (users.csv, fusers.csv).

⚡ How to Run Your App

Since your main entry point is app.py, here’s what to do:

1. Install dependencies

Navigate into the Dynamic folder and install the required libraries:

cd Dynamic
pip install -r requirements.txt

2. Run the Flask app
python app.py

3. Access in browser

Flask will start a server at:

👉 http://127.0.0.1:5000

Open it in your browser → you’ll see the Fake Account Detection dashboard.

📂 Project Structure
.
├── Dynamic/
│   ├── app.py           # Main Flask application
│   ├── fusers.csv       # Fake users dataset
│   ├── users.csv        # Real users dataset
│   ├── image.py         # Supporting script
│   ├── test.py          # Testing utilities
│   ├── requirements.txt # Dependencies
│   ├── Static/          # CSS, JS, assets
│   └── Templates/       # HTML templates

📊 Results

Achieved high accuracy with Random Forest and XGBoost classifiers.

Feature importance shows profile completeness, activity ratio, and engagement patterns as strong indicators of fake accounts.

Visualizations included for interpretability and model evaluation.
