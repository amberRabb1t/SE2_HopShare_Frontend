import PropTypes from 'prop-types';
import Modal from './Modal.jsx';

/**
 * Modal listing candidate users for disambiguation.
 * Each candidate should have UserID, Name, Email.
 */
export default function UserSelectModal({ open, onClose, candidates, onSelect }) {
  return (
    <Modal open={open} onClose={onClose} title="Select User">
      <p>
        Multiple users match that username. Please select the intended account.
      </p>
      <div style={{ display: 'grid', gap: '.5rem' }}>
        {candidates.map(c => (
          <div
            key={c.UserID}
            className="card"
            style={{ padding: '.5rem', cursor: 'pointer' }}
            onClick={() => onSelect(c)}
            role="button"
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter') onSelect(c); }}
            aria-label={`Select user ${c.Name}`}
          >
            <strong>{c.Name}</strong>
            <div style={{ fontSize: '.75rem', opacity: 0.8 }}>
              ID: {c.UserID} • {c.Email}
            </div>
          </div>
        ))}
      </div>
      <div className="actions" style={{ marginTop: '1rem' }}>
        <button className="close-btn" onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
}

UserSelectModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  candidates: PropTypes.arrayOf(PropTypes.shape({
    UserID: PropTypes.number.isRequired,
    Name: PropTypes.string,
    Email: PropTypes.string
  })).isRequired,
  onSelect: PropTypes.func.isRequired
};

