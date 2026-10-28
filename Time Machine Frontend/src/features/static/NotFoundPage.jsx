import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Moon } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-2xl) var(--space-md)',
      textAlign: 'center',
    }}>
      <div className="card" style={{ maxWidth: '500px', padding: 'var(--space-2xl)' }}>
        <Moon size={48} className="text-violet" style={{ margin: '0 auto 16px' }} />
        <h1 style={{ fontSize: '2rem', marginBottom: '12px' }}>Lost Among the Stars</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
          The celestial pathway you seek does not exist in our astronomical charts.
        </p>
        <Link to="/" className="btn-primary">
          <Compass size={18} /> Return to Sanctuary
        </Link>
      </div>
    </div>
  );
}
