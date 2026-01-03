from fastapi import APIRouter, UploadFile, File
import shutil, os
from app.db.database import SessionLocal
from app.db.models import ScanResult
from app.services.vppg import extract_vppg, extract_features, scan_quality
from app.services.model import predict_risk
from app.services.rules import stress_index, explain_factors, precautions

router = APIRouter()

UPLOAD_DIR = "uploads/videos"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# =========================================================
# 1️⃣ VIDEO UPLOAD & AI PREDICTION
# =========================================================
@router.post("/video")
def predict_from_video(user_id: int, file: UploadFile = File(...)):
    video_path = f"{UPLOAD_DIR}/{user_id}_{file.filename}"

    with open(video_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # -------- vPPG Extraction --------
    signal = extract_vppg(video_path)
    quality = scan_quality(signal)

    if quality == "Poor":
        os.remove(video_path)
        return {
            "error": "Poor scan quality detected. Please retry with proper lighting and minimal motion."
        }

    # -------- Feature Extraction --------
    hr, hrv, amp, var, freq = extract_features(signal)

    # -------- ML Prediction --------
    risk_label, risk_prob = predict_risk([hr, hrv, amp, var, freq])

    # -------- Stress Index --------
    stress = stress_index(hrv, amp)

    # -------- Trend Analysis --------
    db = SessionLocal()
    history = (
        db.query(ScanResult)
        .filter(ScanResult.user_id == user_id)
        .order_by(ScanResult.created_at)
        .all()
    )

    trend = "Stable"
    if len(history) >= 2 and stress > history[-1].stress_index:
        trend = "Increasing"

    # -------- Save Scan --------
    scan = ScanResult(
        user_id=user_id,
        heart_rate=round(hr, 2),
        perfusion=round(amp, 3),
        stress_index=round(stress, 3),
        risk_label=str(risk_label),
        risk_probability=round(risk_prob, 3),
        scan_quality=quality
    )

    db.add(scan)
    db.commit()
    os.remove(video_path)

    # -------- Final Dashboard Response --------
    return {
        "heart_rate": round(hr, 2),
        "blood_flow_quality": (
            "Low" if amp < 0.30 else
            "Moderate" if amp < 0.55 else
            "Good"
        ),
        "circulation_risk": str(risk_label),
        "risk_probability": round(risk_prob, 3),
        "stress_index": round(stress, 3),
        "scan_quality": quality,
        "key_factors": explain_factors(hrv, amp),
        "risk_trend": trend,
        "decision_support": precautions(risk_label, trend)
    }


# =========================================================
# 2️⃣ LATEST RESULT (Dashboard Card)
# =========================================================
@router.get("/latest")
def latest_result(user_id: int):
    db = SessionLocal()
    scan = (
        db.query(ScanResult)
        .filter(ScanResult.user_id == user_id)
        .order_by(ScanResult.created_at.desc())
        .first()
    )

    if not scan:
        return {"message": "No scan data available"}

    return {
        "heart_rate": scan.heart_rate,
        "blood_flow_quality": (
            "Low" if scan.perfusion < 0.30 else
            "Moderate" if scan.perfusion < 0.55 else
            "Good"
        ),
        "circulation_risk": scan.risk_label,
        "risk_probability": scan.risk_probability,
        "stress_index": scan.stress_index,
        "scan_quality": scan.scan_quality,
        "timestamp": scan.created_at
    }


# =========================================================
# 3️⃣ GRAPH-READY HISTORY (Time-Series)
# =========================================================
@router.get("/history/graph")
def history_graph(user_id: int):
    db = SessionLocal()
    scans = (
        db.query(ScanResult)
        .filter(ScanResult.user_id == user_id)
        .order_by(ScanResult.created_at)
        .all()
    )

    if not scans:
        return {"message": "No history available"}

    heart_rate, stress_series, perfusion_series = [], [], []

    for s in scans:
        ts = s.created_at.isoformat()
        heart_rate.append({"x": ts, "y": s.heart_rate})
        stress_series.append({"x": ts, "y": s.stress_index})
        perfusion_series.append({"x": ts, "y": s.perfusion})

    trend = "Stable"
    if len(stress_series) >= 2 and stress_series[-1]["y"] > stress_series[0]["y"]:
        trend = "Increasing"

    return {
        "user_id": user_id,
        "metrics": {
            "heart_rate": heart_rate,
            "stress_index": stress_series,
            "perfusion": perfusion_series
        },
        "trend_summary": {
            "risk_trend": trend,
            "note": "Time-series physiological indicators derived from vPPG analysis"
        }
    }
