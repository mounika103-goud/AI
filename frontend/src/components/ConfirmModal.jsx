import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-icon danger">
              <AlertTriangle size={26} />
            </div>
            <h3 className="modal-title">{title || 'Confirm Action'}</h3>
            <p className="modal-message">
              {message || 'Are you sure you want to proceed? This action cannot be undone.'}
            </p>
            <div className="modal-actions">
              <button className="btn-secondary-custom" onClick={onClose}>
                Cancel
              </button>
              <button
                className="btn-primary-custom"
                style={{ background: 'linear-gradient(135deg, #ef4444, #f43f5e)' }}
                onClick={onConfirm}
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
