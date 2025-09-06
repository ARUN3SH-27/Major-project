this project was co-developed by Surajith pranav
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


---

### ⚡ How to Run Your App

Since your main entry point is `app.py`, here’s what to do:

#### 1. Install dependencies

Navigate into the `Dynamic` folder and install the required libraries:

```bash
cd Dynamic
pip install -r requirements.txt
```

#### 2. Run the Streamlit app

Now run:

```bash
streamlit run app.py
```

#### 3. Access in browser

* Streamlit will start a server and give you a link like:

  ```
  http://localhost:8501
  ```
* Open it in your browser → you’ll see your Air Quality Detection dashboard.

---

⚠️ One thing I noticed: your project has `Templates/` and `Static/` folders (Flask/Django style). If `app.py` is actually a **Flask app** (not Streamlit), then the way to run it changes:

```bash
python app.py
```

and then open `http://127.0.0.1:5000` in the browser.

---
