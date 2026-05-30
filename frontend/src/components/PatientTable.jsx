import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit2, Trash2, ChevronUp, ChevronDown, Eye, Search, Users } from 'lucide-react';
import { getRiskLevel } from './PredictionCard';
import ConfirmModal from './ConfirmModal';

const ITEMS_PER_PAGE = 8;

const PatientTable = ({ patients, onDelete, loading }) => {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Filter
  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return patients.filter(p =>
      p.full_name.toLowerCase().includes(term) ||
      p.email.toLowerCase().includes(term)
    );
  }, [patients, search]);

  // Sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortField, sortDir]);

  // Paginate
  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginated = sorted.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      onDelete(deleteTarget);
      setDeleteTarget(null);
    }
  };

  if (!loading && patients.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon"><Users size={36} /></div>
        <h3 className="empty-state-title">No patients yet</h3>
        <p className="empty-state-text">Get started by adding your first patient record.</p>
        <Link to="/add-patient" className="btn-primary-custom">Add Patient</Link>
      </div>
    );
  }

  return (
    <>
      {/* Search bar */}
      <div style={{ position: 'relative', marginBottom: '20px', maxWidth: '380px' }}>
        <Search size={16} style={{
          position: 'absolute', left: '14px', top: '50%',
          transform: 'translateY(-50%)', color: 'var(--text-muted)'
        }} />
        <input
          type="text"
          placeholder="Filter by name or email..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          className="form-input"
          style={{ paddingLeft: '42px' }}
        />
      </div>

      {/* Table */}
      <div className="modern-table-wrapper glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="modern-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('full_name')} className={sortField === 'full_name' ? 'sorted' : ''}>
                Name <SortIcon field="full_name" />
              </th>
              <th onClick={() => handleSort('email')} className={sortField === 'email' ? 'sorted' : ''}>
                Email <SortIcon field="email" />
              </th>
              <th onClick={() => handleSort('glucose')} className={sortField === 'glucose' ? 'sorted' : ''}>
                Glucose <SortIcon field="glucose" />
              </th>
              <th onClick={() => handleSort('haemoglobin')} className={sortField === 'haemoglobin' ? 'sorted' : ''}>
                Hb <SortIcon field="haemoglobin" />
              </th>
              <th onClick={() => handleSort('cholesterol')} className={sortField === 'cholesterol' ? 'sorted' : ''}>
                Chol <SortIcon field="cholesterol" />
              </th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {paginated.map((patient, i) => {
                const risk = getRiskLevel(patient.remarks);
                return (
                  <motion.tr
                    key={patient.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <td style={{ fontWeight: 600 }}>{patient.full_name}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      {patient.email}
                    </td>
                    <td>{patient.glucose}</td>
                    <td>{patient.haemoglobin}</td>
                    <td>{patient.cholesterol}</td>
                    <td>
                      <span className="risk-badge" style={{
                        background: risk.bg || 'rgba(148,163,184,0.1)',
                        color: risk.color
                      }}>
                        {risk.level}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <Link to={`/edit-patient/${patient.id}`} className="btn-icon edit" title="Edit">
                          <Edit2 size={15} />
                        </Link>
                        <button
                          className="btn-icon danger"
                          title="Delete"
                          onClick={() => setDeleteTarget(patient.id)}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <span className="pagination-info">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, sorted.length)} of {sorted.length}
          </span>
          <div className="pagination-buttons">
            <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              Prev
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`pagination-btn ${currentPage === i + 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="pagination-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Patient"
        message="This will permanently remove this patient record. Are you sure?"
      />
    </>
  );
};

export default PatientTable;
