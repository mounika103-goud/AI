# Health Prediction Application

A production-quality CRUD-based patient health management system that stores blood test records, validates data, and utilizes an AI/ML logic layer to predict health conditions and generate intelligent remarks.

## Features
- **Full CRUD Operations**: Create, read, update, and delete patient records.
- **Health Data Tracking**: Logs Glucose, Haemoglobin, and Cholesterol levels.
- **AI/ML Prediction Logic**: Automatically analyzes health data and provides a disease risk prediction or health status in the "Remarks" field.
- **Validation**: Strict frontend and backend validations for data integrity (e.g., proper email format, future DOB prevention, numeric bounds for blood metrics).
- **Responsive Dashboard**: Built with React and Bootstrap for a clean, modern, and mobile-friendly user experience.
- **Search & Filtering**: Search patients by name or email.

## Tech Stack
- **Backend**: Python, FastAPI, SQLAlchemy (SQLite)
- **Frontend**: React.js (Vite), React Router, Axios, Bootstrap 5, Lucide React (Icons)

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

## How the AI Prediction Works
When a patient record is created or updated, the system analyzes the key blood metrics (Glucose, Haemoglobin, Cholesterol) through a lightweight decision logic layer located in `backend/services/prediction.py`. It checks these values against standard medical thresholds and returns meaningful insights. 

In a scaled real-world environment, this module can be instantly swapped to execute an external HTTP request (e.g., using `httpx`) to a dedicated Machine Learning microservice or an external Health API.
