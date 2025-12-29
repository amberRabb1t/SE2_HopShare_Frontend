import { createContext, useContext, useCallback, useState } from 'react';

/*
  ToastContext provides a way to show toast notifications across the app.
  It exposes two main functions:
  - push(type, message, ttl): to add a new toast notification.
  - remove(id): to remove a specific toast notification by its id.

  The context also maintains a list of current toasts.
*/

const ToastContext = createContext({
  push: () => {},
  remove: () => {}
});

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((type, message, ttl = 4000) => {
    const id = ++idCounter;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, ttl);
  }, []);

  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ push, remove, toasts }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

