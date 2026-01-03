import joblib
import numpy as np
import os

MODEL_PATH = os.path.join("app", "models", "vasoscan_rf.pkl")
model = joblib.load(MODEL_PATH)

def predict_risk(features):
    pred = model.predict([features])[0]
    prob = model.predict_proba([features]).max()
    return pred, round(float(prob), 3)
