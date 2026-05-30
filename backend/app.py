from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config.database import engine, Base
from routes import patients

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Health Prediction API",
    description="API for Health Prediction Application",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include routes
app.include_router(patients.router)

@app.get("/")
def root():
    return {"message": "Welcome to the Health Prediction API"}
