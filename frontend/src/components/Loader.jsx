const Loader = ({ type = 'spinner' }) => {
  if (type === 'skeleton-table') {
    return (
      <div style={{ padding: '20px' }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div className="skeleton skeleton-text" style={{ width: '20%' }} />
            <div className="skeleton skeleton-text" style={{ width: '25%' }} />
            <div className="skeleton skeleton-text" style={{ width: '15%' }} />
            <div className="skeleton skeleton-text" style={{ width: '20%' }} />
            <div className="skeleton skeleton-text" style={{ width: '20%' }} />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'skeleton-cards') {
    return (
      <div className="stat-cards-grid">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="skeleton skeleton-card" />
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
      <div style={{
        width: '40px', height: '40px',
        border: '3px solid var(--border-color)',
        borderTopColor: 'var(--color-primary)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Loader;
