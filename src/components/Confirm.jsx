import Modal from './Modal.jsx';

/**
 * Generic confirmation modal.
 * @param {Object} props
 * @param {boolean} props.open - Whether the modal is open.
 * @param {string} [props.title='Confirm'] - Title of the modal.
 * @param {string} props.message - Confirmation message.
 * @param {Function} props.onConfirm - Callback when user confirms.
 * @param {Function} props.onCancel - Callback when user cancels.
 */
export default function Confirm({ open, title = 'Confirm', message, onConfirm, onCancel }) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <p>{message}</p>
      <div className="actions">
        <button onClick={onConfirm}>Yes</button>
        <button onClick={onCancel} className="close-btn">No</button>
      </div>
    </Modal>
  );
}

