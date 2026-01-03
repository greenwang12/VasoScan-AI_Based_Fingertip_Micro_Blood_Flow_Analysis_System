# VasoScan  
### AI-Based Fingertip Micro Blood Flow Analysis System

---

## Project Overview
VasoScan is an AI-powered **decision-support system** that analyzes fingertip videos using  
**video-based photoplethysmography (vPPG)** to derive physiological indicators related to  
micro blood flow and peripheral circulation quality.

The system is developed **strictly for academic and research purposes** and does **not**
provide medical diagnosis or clinical measurements.

---

## Objectives
- Extract vPPG signals from fingertip video recordings
- Compute meaningful physiological **indicators and indices**
- Estimate a **circulation risk score** using machine learning
- Visualize **longitudinal health trends** across multiple scans
- Provide **decision-support insights** and precautionary suggestions

---

## System Outputs (Safe & Strong Claims)
The system generates the following **non-diagnostic outputs**:

- Heart Rate **Indicator**
- Blood Flow Quality **Index**
- Circulation **Risk Score** (Machine Learning–based)
- Stress / Low-Perfusion **Indicator**
- Decision-Support **Precautionary Insights**
- Time-Series **Health Trend Visualizations**

> All outputs are expressed as **indicators, proxies, indices, or risk scores**,  
> and are **not clinical diagnoses**.

---

## What the System Does NOT Provide
- Medical diagnosis
- SpO₂ measurement
- Clinical stress score
- Disease confirmation or prediction

This limitation is intentional to ensure **ethical, academic, and legal safety**.

---

## Technology Stack

### Backend
- FastAPI
- Python
- SQLAlchemy
- MySQL
- Random Forest (Machine Learning)

### Machine Learning
- vPPG signal extraction and preprocessing
- Feature extraction (Heart Rate, HRV, signal amplitude, variability)
- Supervised learning using a trained Random Forest model

### Frontend (Planned)
- Interactive dashboard
- Fingertip video upload interface
- Latest scan summary card
- Historical health trend graphs
- Risk trend visualization

---

## Project Structure
VasoScan_App/
├── backend/
│ ├── main.py
│ ├── .env # Environment variables (ignored)
│ └── app/
│ ├── routes/
│ ├── services/
│ ├── models/
│ └── db/
├── frontend/
├── .gitignore
└── README.md


---

## Privacy & Security
- Uploaded videos are processed temporarily and removed after analysis
- No biometric images are permanently stored
- Default avatars are used instead of real profile photos
- Sensitive data and credentials are excluded using `.gitignore`

---

## Disclaimer
This project is a **prototype developed for academic demonstration only**.

> It is **NOT a medical device** and must not be used for diagnosis,  
> treatment, or clinical decision-making.

---

## Academic Relevance
This project demonstrates practical application of:
- Signal processing techniques
- Machine learning in healthcare-related contexts
- Ethical AI system design
- Backend system architecture
- Data-driven decision-support systems

---

## Conclusion
VasoScan illustrates how **AI and computer vision** can be responsibly applied  
to derive meaningful **physiological indicators** while maintaining strong  
ethical boundaries, data privacy, and academic integrity.
