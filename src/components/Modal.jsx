import PropTypes from 'prop-types';

/**
 * Generic Modal component. Displays children content when open is true.
 * @param {Object} props
 * @param {boolean} props.open - Whether the modal is open.
 * @param {Function} props.onClose - Callback to close the modal.
 * @param {string} props.title - Title of the modal.
 * @param {React.ReactNode} props.children - Content to display inside the modal.
 */
export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="flex space" style={{ marginBottom: '0.75rem' }}>
          <h3 style={{ margin: 0 }}>{title}</h3>
          <button onClick={onClose} className="close-btn">Close</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.node
};

