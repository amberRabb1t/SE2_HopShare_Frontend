import React from 'react';
import { useToast } from '../context/ToastContext.jsx';

export default function ToastStack() {
  const { toasts, remove } = useToast();
  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`} role="alert">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '.75rem' }}>
            <span>{t.message}</span>
            <button
              className="inline-link"
              onClick={() => remove(t.id)}
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}