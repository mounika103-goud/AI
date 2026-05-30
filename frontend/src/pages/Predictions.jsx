import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { patientAPI } from '../api';
import PredictionCard, { getRiskLevel } from '../components/PredictionCard';
import Loader from '../components/Loader';

const Predictions = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    patientAPI.getAll()
      .then(res => setPatients(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = patients.filter(p => {
    if (filter === 'all') return true;
    return getRiskLevel(p.remarks).level === filter;
  });

  if (loading) return <Loader />;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">AI Predictions</h1>
          <p className="page-subtitle">Health predictions for all patients</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {['all', 'High Risk', 'Moderate', 'Normal'].map(f => (
          <button
            key={f}
            className={filter === f ? 'btn-primary-custom' : 'btn-secondary-custom'}
            style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card empty-state">
          <div className="empty-state-icon"><Shield size={36} /></div>
          <h3 className="empty-state-title">No predictions found</h3>
          <p className="empty-state-text">
            {filter !== 'all' ? 'No patients match this filter.' : 'Add patients to generate AI predictions.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))', gap: '20px' }}>
          {filtered.map((patient, i) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div style={{ marginBottom: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                {patient.full_name} — {patient.email}
              </div>
              <PredictionCard patient={patient} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Predictions;
