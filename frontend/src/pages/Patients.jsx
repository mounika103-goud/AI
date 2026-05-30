import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { patientAPI } from '../api';
import PatientTable from '../components/PatientTable';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const res = await patientAPI.getAll();
      setPatients(res.data);
    } catch {
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await patientAPI.delete(id);
      setPatients(prev => prev.filter(p => p.id !== id));
      toast.success('Patient deleted');
    } catch {
      toast.error('Failed to delete patient');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Patients</h1>
          <p className="page-subtitle">Manage all patient records</p>
        </div>
        <Link to="/add-patient" className="btn-primary-custom">
          <UserPlus size={18} /> Add Patient
        </Link>
      </div>

      {loading ? (
        <Loader type="skeleton-table" />
      ) : (
        <PatientTable patients={patients} onDelete={handleDelete} loading={loading} />
      )}
    </div>
  );
};

export default Patients;
