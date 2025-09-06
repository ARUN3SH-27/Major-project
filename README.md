🌍 LRX: Air Quality Index (AQI) Prediction and Visualization

This repository contains the implementation of LRX, a hybrid predictive model for real-time Air Quality Index (AQI) forecasting and visualization.
The model combines Long Short-Term Memory (LSTM), Random Forest Regressor (RFR), and XGBoost (XGB) to capture temporal patterns, non-linear dependencies, and fine-tuned accuracy improvements.

🔍 Overview

Problem: Air pollution significantly impacts public health, yet existing forecasting methods often lack robustness across varying conditions.
Proposed Solution: LRX, a hybrid model leveraging the strengths of:
LSTM → captures temporal dependencies in AQI data.
RFR → enhances stability by handling non-linear relationships.
XGB → improves fine-grained prediction accuracy.

Key Features:
Data preprocessing (missing value handling, encoding, normalization).
Hybrid ensemble prediction pipeline.
Visualization of AQI distribution and state-wise maps.
