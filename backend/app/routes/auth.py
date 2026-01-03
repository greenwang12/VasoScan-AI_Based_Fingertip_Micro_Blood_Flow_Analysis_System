from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from app.db.database import SessionLocal
from app.db.models import User

router = APIRouter(tags=["Authentication"])  # ✅ NO prefix here

DEFAULT_AVATAR = "uploads/profiles/default_avatar.png"


# ============================
# Request Schemas
# ============================

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    age: int
    gender: str
    height_cm: float
    weight_kg: float
    smoking_status: str
    activity_level: str
    known_conditions: str = ""


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# ============================
# Register User
# ============================

@router.post("/register")
def register(data: RegisterRequest):
    db = SessionLocal()

    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="User already exists")

    user = User(
        email=data.email,
        password=data.password,
        age=data.age,
        gender=data.gender,
        height_cm=data.height_cm,
        weight_kg=data.weight_kg,
        smoking_status=data.smoking_status,
        activity_level=data.activity_level,
        known_conditions=data.known_conditions,
        photo_path=DEFAULT_AVATAR
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "message": "User registered successfully",
        "user_id": user.id,
        "avatar": user.photo_path
    }


# ============================
# Login User
# ============================

@router.post("/login")
def login(data: LoginRequest):
    db = SessionLocal()

    user = db.query(User).filter(
        User.email == data.email,
        User.password == data.password
    ).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "message": "Login successful",
        "user_id": user.id,
        "email": user.email,
        "avatar": user.photo_path,
        "age": user.age,
        "activity_level": user.activity_level
    }
