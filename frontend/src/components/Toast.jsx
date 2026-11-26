import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  );
};

const ToastItem = ({ toast, removeToast }) => {
  useEffect(() => {
    const timer = setTimeout(() => removeToast(toast.id), toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast.id]);

  const styles = {
    success: { bg: 'bg-green-50 border-green-200', icon: <CheckCircle size={18} className="text-green-600" />, text: 'text-green-800' },
    error: { bg: 'bg-red-50 border-red-200', icon: <XCircle size={18} className="text-red-600" />, text: 'text-red-800' },
    warning: { bg: 'bg-yellow-50 border-yellow-200', icon: <AlertCircle size={18} className="text-yellow-600" />, text: 'text-yellow-800' },
    info: { bg: 'bg-blue-50 border-blue-200', icon: <Info size={18} className="text-blue-600" />, text: 'text-blue-800' },
  };

  const style = styles[toast.type] || styles.info;

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg ${style.bg} animate-slide-in`}>
      <div className="flex-shrink-0 mt-0.5">{style.icon}</div>
      <div className="flex-1 min-w-0">
        {toast.title && <p className={`font-semibold text-sm ${style.text}`}>{toast.title}</p>}
        <p className={`text-sm ${style.text} ${toast.title ? 'opacity-80' : ''}`}>{toast.message}</p>
      </div>
      <button onClick={() => removeToast(toast.id)} className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;

