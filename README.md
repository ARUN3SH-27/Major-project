🕵️ Fake Social Media Account Detection

This repository contains the implementation of a Fake Social Media Account Detection system. The project combines machine learning techniques with a Flask-based web application to classify accounts as real or fake based on behavioral and profile features.

🔍 Overview

Problem
Fake accounts on social media spread misinformation, scams, and spam, undermining trust and security. Traditional detection methods often fail to adapt to diverse patterns of fake accounts.

Proposed Solution
We developed a detection system that leverages a hybrid of:

Random Forest (RF) → captures non-linear dependencies and improves robustness.

Gradient Boosting (GB) → enhances detection accuracy with iterative boosting.

Logistic Regression (LR) → provides a simple yet effective baseline for interpretability.

Key Features

Preprocessing pipeline: missing value handling, feature encoding, normalization.

Model training and evaluation using RF, GB, and LR.

Feature importance analysis for explainability.

Flask web interface (Templates/ + Static/) for real-time account classification.

MongoDB integration for raw data collection, exported into users.csv (real) and fusers.csv (fake) while introducing a cache mechanism.
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

📊 Results

Achieved high accuracy with Random Forest and XGBoost classifiers.

Feature importance shows profile completeness, activity ratio, and engagement patterns as strong indicators of fake accounts.

Visualizations included for interpretability and model evaluation.
