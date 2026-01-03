from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)

    photo_path = Column(String(255), default="uploads/profiles/default_avatar.png")

    age = Column(Integer)
    gender = Column(String(50))
    height_cm = Column(Float)
    weight_kg = Column(Float)
    smoking_status = Column(String(50))
    activity_level = Column(String(50))
    known_conditions = Column(String(255))

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    scans = relationship("ScanResult", back_populates="user", cascade="all, delete")


class ScanResult(Base):
    __tablename__ = "scan_results"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))

    heart_rate = Column(Float)
    perfusion = Column(Float)
    stress_index = Column(Float)
    risk_label = Column(String(50))
    risk_probability = Column(Float)
    scan_quality = Column(String(50))

    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    user = relationship("User", back_populates="scans")
