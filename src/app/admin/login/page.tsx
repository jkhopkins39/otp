'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

function AdminLoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const setup = searchParams.get('setup');

  useEffect(() => {
    const delay = error || setup ? 2500 : 0;
    const timer = setTimeout(() => {
      window.location.href = 'https://hoppytech.com/portal';
    }, delay);
    return () => clearTimeout(timer);
  }, [error, setup]);

  if (!error && !setup) return null;

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif',
        background: '#0f0f0f',
        color: '#f87171',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
          Session error — redirecting to portal…
        </p>
        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{error || 'setup'}</p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginContent />
    </Suspense>
  );
}
