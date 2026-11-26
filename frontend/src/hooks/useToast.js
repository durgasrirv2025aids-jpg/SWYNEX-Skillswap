import { useState, useCallback, useMemo } from 'react';

let toastId = 0;

const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', title = '', duration = 4000) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type, title, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useMemo(() => ({
    success: (message, title = '') => addToast(message, 'success', title),
    error: (message, title = '') => addToast(message, 'error', title),
    warning: (message, title = '') => addToast(message, 'warning', title),
    info: (message, title = '') => addToast(message, 'info', title),
  }), [addToast]);

  return { toasts, removeToast, toast };
};

export default useToast;

