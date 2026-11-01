// Toast notification system
import { useEffect } from "react";

export default function Toast({ message, type = "success", onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className={`toast toast--${type}`}>
      <span className="toast-icon">
        {type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}
      </span>
      {message}
    </div>
  );
}

// Hook — usage: const { toasts, notify } = useToast()
import { useState, useCallback } from "react";
export function useToast() {
  const [toasts, setToasts] = useState([]);
  const notify = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    return id;
  }, []);
  const remove = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);
  return { toasts, notify, remove };
}

