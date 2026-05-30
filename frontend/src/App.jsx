import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Predictions from './pages/Predictions';
import PatientForm from './components/PatientForm';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="main-content">
          <Navbar
            onMenuClick={() => setSidebarOpen(prev => !prev)}
          />
          <div className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/add-patient" element={<PatientForm />} />
              <Route path="/edit-patient/:id" element={<PatientForm />} />
              <Route path="/predictions" element={<Predictions />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
