from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from config.database import get_db
from models import patient as patient_model
from models import schemas
from services.prediction import generate_health_remarks

router = APIRouter(
    prefix="/patients",
    tags=["patients"]
)

@router.post("/", response_model=schemas.PatientResponse, status_code=status.HTTP_201_CREATED)
def create_patient(patient: schemas.PatientCreate, db: Session = Depends(get_db)):
    # Check if email already exists
    db_patient = db.query(patient_model.Patient).filter(patient_model.Patient.email == patient.email).first()
    if db_patient:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Generate remarks based on health data
    remarks = generate_health_remarks(
        glucose=patient.glucose,
        haemoglobin=patient.haemoglobin,
        cholesterol=patient.cholesterol
    )
    
    # Create new patient record
    new_patient = patient_model.Patient(
        full_name=patient.full_name,
        date_of_birth=patient.date_of_birth,
        email=patient.email,
        glucose=patient.glucose,
        haemoglobin=patient.haemoglobin,
        cholesterol=patient.cholesterol,
        remarks=remarks
    )
    
    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)
    return new_patient

@router.get("/", response_model=List[schemas.PatientResponse])
def get_patients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    patients = db.query(patient_model.Patient).offset(skip).limit(limit).all()
    return patients

@router.get("/{patient_id}", response_model=schemas.PatientResponse)
def get_patient(patient_id: int, db: Session = Depends(get_db)):
    patient = db.query(patient_model.Patient).filter(patient_model.Patient.id == patient_id).first()
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient

@router.put("/{patient_id}", response_model=schemas.PatientResponse)
def update_patient(patient_id: int, patient_update: schemas.PatientUpdate, db: Session = Depends(get_db)):
    db_patient = db.query(patient_model.Patient).filter(patient_model.Patient.id == patient_id).first()
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    # Check email duplicate if email is being updated
    if patient_update.email and patient_update.email != db_patient.email:
        existing_email = db.query(patient_model.Patient).filter(patient_model.Patient.email == patient_update.email).first()
        if existing_email:
            raise HTTPException(status_code=400, detail="Email already registered")
            
    # Update fields
    update_data = patient_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_patient, key, value)
        
    # Re-evaluate remarks if health metrics changed
    health_metrics_changed = any(key in update_data for key in ['glucose', 'haemoglobin', 'cholesterol'])
    if health_metrics_changed:
        db_patient.remarks = generate_health_remarks(
            glucose=db_patient.glucose,
            haemoglobin=db_patient.haemoglobin,
            cholesterol=db_patient.cholesterol
        )
        
    db.commit()
    db.refresh(db_patient)
    return db_patient

@router.delete("/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_patient(patient_id: int, db: Session = Depends(get_db)):
    db_patient = db.query(patient_model.Patient).filter(patient_model.Patient.id == patient_id).first()
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")
        
    db.delete(db_patient)
    db.commit()
    return None
