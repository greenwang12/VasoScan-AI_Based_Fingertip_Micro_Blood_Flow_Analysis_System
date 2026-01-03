from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.auth import router as auth_router
from app.routes.predict import router as predict_router
from app.db.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="VasoScan Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth")
app.include_router(predict_router, prefix="/predict")

@app.get("/")
def root():
    return {"status": "VasoScan backend running"}
