from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime, date
from typing import Optional

class PatientBase(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    date_of_birth: str
    email: EmailStr
    glucose: float = Field(..., ge=0, le=1000)
    haemoglobin: float = Field(..., ge=0, le=30)
    cholesterol: float = Field(..., ge=0, le=1000)

    @validator('date_of_birth')
    def validate_dob(cls, v):
        try:
            dob = datetime.strptime(v, "%Y-%m-%d").date()
        except ValueError:
            raise ValueError("Incorrect data format, should be YYYY-MM-DD")
        
        if dob > date.today():
            raise ValueError("Date of birth cannot be in the future")
        return v

class PatientCreate(PatientBase):
    pass

class PatientUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    date_of_birth: Optional[str] = None
    email: Optional[EmailStr] = None
    glucose: Optional[float] = Field(None, ge=0, le=1000)
    haemoglobin: Optional[float] = Field(None, ge=0, le=30)
    cholesterol: Optional[float] = Field(None, ge=0, le=1000)
    
    @validator('date_of_birth')
    def validate_dob(cls, v):
        if v is None:
            return v
        try:
            dob = datetime.strptime(v, "%Y-%m-%d").date()
        except ValueError:
            raise ValueError("Incorrect data format, should be YYYY-MM-DD")
        
        if dob > date.today():
            raise ValueError("Date of birth cannot be in the future")
        return v

class PatientResponse(PatientBase):
    id: int
    remarks: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
