# Health Prediction App

This is a patient health tracking app that logs basic blood test records and tries to predict potential health risks using a simple decision logic layer.

## Features
- Add, view, edit, and delete patient records.
- Track Glucose, Haemoglobin, and Cholesterol levels.
- Basic prediction logic to flag potential health risks based on the blood metrics.
- Validates data to ensure we don't have future dates of birth or negative blood metrics.
- Built with React, FastAPI, and SQLite.

## Tech Stack
- **Backend**: Python, FastAPI, SQLAlchemy (SQLite)
- **Frontend**: React.js (Vite), React Router, Axios, Lucide React

## Screenshots
*(Add screenshots here)*
- Dashboard View: `[placeholder-dashboard.png]`
- Patient Form: `[placeholder-form.png]`

## Installation & Setup

### 1. Clone the repository
```bash
git clone <repository_url>
cd health_prediction_app
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate

pip install -r requirements.txt

# Start the server
uvicorn app:app --reload --port 8000
```
The API will run at `http://localhost:8000`. You can view the interactive Swagger documentation at `http://localhost:8000/docs`.

### 3. Frontend Setup
Open a new terminal window.
```bash
cd frontend
npm install

# Start the development server
npm run dev
```
The React app will be available at `http://localhost:5173`.

## API Endpoints

| Method | Endpoint          | Description |
|--------|-------------------|-------------|
| GET    | `/patients/`      | Retrieve a list of all patients |
| GET    | `/patients/{id}`  | Retrieve a specific patient by ID |
| POST   | `/patients/`      | Create a new patient record (auto-generates ML remarks) |
| PUT    | `/patients/{id}`  | Update an existing patient record |
| DELETE | `/patients/{id}`  | Delete a patient record |

## How the Prediction Works
When you add or edit a patient, the system checks their blood metrics (Glucose, Haemoglobin, Cholesterol) in `backend/services/prediction.py`. It uses some basic threshold checks to see if the patient is at risk and returns a warning string.

Later on, we could hook this up to a real ML model via API if needed.
