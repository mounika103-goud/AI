from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from config.database import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True, nullable=False)
    date_of_birth = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    
    # Blood values
    glucose = Column(Float, nullable=False)
    haemoglobin = Column(Float, nullable=False)
    cholesterol = Column(Float, nullable=False)
    
    # AI Prediction
    remarks = Column(String, nullable=True)
    
    # Metadata
    created_at = Column(DateTime, default=datetime.utcnow)
