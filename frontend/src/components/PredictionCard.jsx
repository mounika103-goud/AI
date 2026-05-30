import { motion } from 'framer-motion';
import { Shield, Activity, Droplets, Heart } from 'lucide-react';

// Determine risk level from remarks text
function getRiskLevel(remarks) {
  if (!remarks) return { level: 'unknown', color: '#94a3b8' };
  const lower = remarks.toLowerCase();
  if (lower.includes('high') || lower.includes('risk') || lower.includes('elevated')) {
    return { level: 'High Risk', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' };
  }
  if (lower.includes('low') || lower.includes('possible') || lower.includes('mild')) {
    return { level: 'Moderate', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' };
  }
  return { level: 'Normal', color: '#10b981', bg: 'rgba(16,185,129,0.1)' };
}

// Check individual metric status
function getMetricStatus(name, value) {
  if (name === 'glucose') {
    if (value > 140) return { status: 'High', color: '#ef4444' };
    if (value < 70) return { status: 'Low', color: '#f59e0b' };
    return { status: 'Normal', color: '#10b981' };
  }
  if (name === 'haemoglobin') {
    if (value < 12) return { status: 'Low', color: '#f59e0b' };
    if (value > 17.5) return { status: 'High', color: '#ef4444' };
    return { status: 'Normal', color: '#10b981' };
  }
  if (name === 'cholesterol') {
    if (value > 200) return { status: 'High', color: '#ef4444' };
    return { status: 'Normal', color: '#10b981' };
  }
  return { status: 'Unknown', color: '#94a3b8' };
}

const PredictionCard = ({ patient }) => {
  if (!patient) return null;

  const risk = getRiskLevel(patient.remarks);
  const glucoseStatus = getMetricStatus('glucose', patient.glucose);
  const hbStatus = getMetricStatus('haemoglobin', patient.haemoglobin);
  const cholStatus = getMetricStatus('cholesterol', patient.cholesterol);

  // Calculate a simple "confidence score" based on how far values are from normal
  const confidence = Math.min(95, Math.max(40,
    100 - (Math.abs(patient.glucose - 100) / 5 + Math.abs(patient.haemoglobin - 14) * 3 + Math.abs(patient.cholesterol - 180) / 4)
  ));

  return (
    <motion.div
      className="prediction-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="prediction-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Shield size={22} style={{ color: risk.color }} />
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>AI Health Analysis</h3>
        </div>
        <span
          className="prediction-risk-badge"
          style={{ background: risk.bg, color: risk.color }}
        >
          {risk.level}
        </span>
      </div>

      {/* Remarks summary */}
      <div style={{
        padding: '16px', borderRadius: 'var(--radius-md)',
        background: risk.bg, marginBottom: '20px',
        borderLeft: `3px solid ${risk.color}`
      }}>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.7 }}>
          {patient.remarks}
        </p>
      </div>

      {/* Health indicators */}
      <div style={{ marginBottom: '20px' }}>
        <div className="prediction-indicator">
          <div className="prediction-indicator-dot" style={{ background: glucoseStatus.color }} />
          <span className="prediction-indicator-label">Glucose</span>
          <span className="prediction-indicator-value">{patient.glucose} mg/dL</span>
          <span className="risk-badge" style={{
            background: glucoseStatus.color + '18',
            color: glucoseStatus.color, marginLeft: 'auto'
          }}>
            {glucoseStatus.status}
          </span>
        </div>

        <div className="prediction-indicator">
          <div className="prediction-indicator-dot" style={{ background: hbStatus.color }} />
          <span className="prediction-indicator-label">Haemoglobin</span>
          <span className="prediction-indicator-value">{patient.haemoglobin} g/dL</span>
          <span className="risk-badge" style={{
            background: hbStatus.color + '18',
            color: hbStatus.color, marginLeft: 'auto'
          }}>
            {hbStatus.status}
          </span>
        </div>

        <div className="prediction-indicator">
          <div className="prediction-indicator-dot" style={{ background: cholStatus.color }} />
          <span className="prediction-indicator-label">Cholesterol</span>
          <span className="prediction-indicator-value">{patient.cholesterol} mg/dL</span>
          <span className="risk-badge" style={{
            background: cholStatus.color + '18',
            color: cholStatus.color, marginLeft: 'auto'
          }}>
            {cholStatus.status}
          </span>
        </div>
      </div>

      {/* Confidence bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            Prediction Confidence
          </span>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {Math.round(confidence)}%
          </span>
        </div>
        <div className="confidence-bar-track">
          <motion.div
            className="confidence-bar-fill"
            style={{ background: `linear-gradient(90deg, ${risk.color}, var(--color-accent))` }}
            initial={{ width: 0 }}
            animate={{ width: `${confidence}%` }}
            transition={{ duration: 1, delay: 0.3 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// Export helper for use in tables
export { getRiskLevel };
export default PredictionCard;
