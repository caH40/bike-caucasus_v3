'use client';

import { toast } from 'sonner';

export default function Client() {
  const handlePopup = () => {
    toast.info('info');
    toast.warning('warning');
    toast.error('error');
    toast.success('success');
  };

  return (
    <button
      style={{ padding: '0.5rem 1rem', backgroundColor: 'orange', borderRadius: '0.5rem' }}
      onClick={handlePopup}
    >
      Show popup
    </button>
  );
}
