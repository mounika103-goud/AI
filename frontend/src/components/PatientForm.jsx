import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, Droplets, Heart, Activity } from 'lucide-react';
import { patientAPI } from '../api';
import PredictionCard from './PredictionCard';
import toast from 'react-hot-toast';

const PatientForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    full_name: '', date_of_birth: '', email: '',
    glucose: '', haemoglobin: '', cholesterol: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [savedPatient, setSavedPatient] = useState(null);

  useEffect(() => {
    if (isEditMode) loadPatient();
  }, [id]);

  const loadPatient = async () => {
    try {
      const res = await patientAPI.getById(id);
      const p = res.data;
      setFormData({
        full_name: p.full_name, date_of_birth: p.date_of_birth, email: p.email,
        glucose: p.glucose, haemoglobin: p.haemoglobin, cholesterol: p.cholesterol
      });
    } catch {
      toast.error('Failed to load patient data');
      navigate('/patients');
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.full_name.trim() || formData.full_name.trim().length < 2)
      errs.full_name = 'Name must be at least 2 characters';
    if (!formData.date_of_birth)
      errs.date_of_birth = 'Date of birth is required';
    else if (formData.date_of_birth > new Date().toISOString().split('T')[0])
      errs.date_of_birth = 'Date of birth cannot be in the future';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))
      errs.email = 'Valid email is required';
    if (!formData.glucose || formData.glucose < 0 || formData.glucose > 1000)
      errs.glucose = 'Glucose must be between 0 and 1000';
    if (!formData.haemoglobin || formData.haemoglobin < 0 || formData.haemoglobin > 30)
      errs.haemoglobin = 'Haemoglobin must be between 0 and 30';
    if (!formData.cholesterol || formData.cholesterol < 0 || formData.cholesterol > 1000)
      errs.cholesterol = 'Cholesterol must be between 0 and 1000';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setPredicting(true);
    setSavedPatient(null);

    try {
      // Simulate AI processing delay
      await new Promise(r => setTimeout(r, 1200));

      const payload = {
        ...formData,
        glucose: parseFloat(formData.glucose),
        haemoglobin: parseFloat(formData.haemoglobin),
        cholesterol: parseFloat(formData.cholesterol)
      };

      let res;
      if (isEditMode) {
        res = await patientAPI.update(id, payload);
        toast.success('Patient record updated!');
      } else {
        res = await patientAPI.create(payload);
        toast.success('Patient created with AI analysis!');
      }

      setSavedPatient(res.data);
      if (!isEditMode) {
        setFormData({
          full_name: '', date_of_birth: '', email: '',
          glucose: '', haemoglobin: '', cholesterol: ''
        });
      }
    } catch (err) {
      const detail = err.response?.data?.detail;
      toast.error(typeof detail === 'string' ? detail : 'Failed to save patient');
    } finally {
      setLoading(false);
      setPredicting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEditMode ? 'Edit Patient' : 'Add New Patient'}</h1>
          <p className="page-subtitle">
            {isEditMode
              ? 'Update patient data. AI analysis will re-run if health metrics change.'
              : 'Fill in patient details. Our AI will analyze the health metrics automatically.'
            }
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: savedPatient ? '1fr 1fr' : '1fr', gap: '28px', maxWidth: savedPatient ? '100%' : '720px' }}>
        {/* Form */}
        <motion.div
          className="glass-card"
          style={{ padding: '32px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <form onSubmit={handleSubmit}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '24px', color: 'var(--text-primary)' }}>
              Personal Information
            </h3>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <User size={16} className="form-input-icon" />
              <input
                className={`form-input ${errors.full_name ? 'error' : ''}`}
                name="full_name" value={formData.full_name}
                onChange={handleChange} placeholder="John Doe"
              />
              {errors.full_name && <p className="form-error">{errors.full_name}</p>}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <Calendar size={16} className="form-input-icon" />
                <input
                  type="date" className={`form-input ${errors.date_of_birth ? 'error' : ''}`}
                  name="date_of_birth" value={formData.date_of_birth}
                  onChange={handleChange}
                />
                {errors.date_of_birth && <p className="form-error">{errors.date_of_birth}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <Mail size={16} className="form-input-icon" />
                <input
                  type="email" className={`form-input ${errors.email ? 'error' : ''}`}
                  name="email" value={formData.email}
                  onChange={handleChange} placeholder="john@email.com"
                />
                {errors.email && <p className="form-error">{errors.email}</p>}
              </div>
            </div>

            <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '28px 0 24px', color: 'var(--text-primary)', borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
              Blood Test Metrics
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Glucose (mg/dL)</label>
                <Droplets size={16} className="form-input-icon" />
                <input
                  type="number" step="0.1" className={`form-input ${errors.glucose ? 'error' : ''}`}
                  name="glucose" value={formData.glucose}
                  onChange={handleChange} placeholder="100"
                />
                {errors.glucose && <p className="form-error">{errors.glucose}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Haemoglobin (g/dL)</label>
                <Heart size={16} className="form-input-icon" />
                <input
                  type="number" step="0.1" className={`form-input ${errors.haemoglobin ? 'error' : ''}`}
                  name="haemoglobin" value={formData.haemoglobin}
                  onChange={handleChange} placeholder="14.0"
                />
                {errors.haemoglobin && <p className="form-error">{errors.haemoglobin}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Cholesterol (mg/dL)</label>
                <Activity size={16} className="form-input-icon" />
                <input
                  type="number" step="0.1" className={`form-input ${errors.cholesterol ? 'error' : ''}`}
                  name="cholesterol" value={formData.cholesterol}
                  onChange={handleChange} placeholder="180"
                />
                {errors.cholesterol && <p className="form-error">{errors.cholesterol}</p>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '28px' }}>
              <button type="button" className="btn-secondary-custom" onClick={() => navigate('/patients')}>
                Cancel
              </button>
              <button type="submit" className="btn-primary-custom" disabled={loading}>
                {loading ? (
                  <>
                    <span style={{
                      width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite',
                      display: 'inline-block'
                    }} />
                    {predicting ? 'Analyzing...' : 'Saving...'}
                  </>
                ) : (
                  isEditMode ? 'Update Patient' : 'Save & Predict'
                )}
              </button>
            </div>
          </form>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </motion.div>

        {/* AI Prediction Result */}
        {savedPatient && (
          <div>
            <PredictionCard patient={savedPatient} />
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <button className="btn-secondary-custom" onClick={() => navigate('/patients')}>
                ← Back to Patients
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientForm;
