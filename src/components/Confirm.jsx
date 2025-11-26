import React from 'react';
import Modal from './Modal.jsx';

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