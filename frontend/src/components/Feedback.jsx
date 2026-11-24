import { useEffect } from 'react';

export default function Feedback({ notice, onDismiss }) {
  useEffect(() => {
    if (notice?.type !== 'success') return;
    const timeout = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timeout);
  }, [notice, onDismiss]);

  if (!notice) return null;
  return (
    <div className={`notice ${notice.type === 'error' ? 'notice-error' : 'notice-success'}`}
      role={notice.type === 'error' ? 'alert' : 'status'}>
      <span>{notice.message}</span>
      <button type="button" onClick={onDismiss} aria-label="Cerrar mensaje">×</button>
    </div>
  );
}
