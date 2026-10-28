import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, Moon } from 'lucide-react';

export function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--color-border)',
      background: 'rgba(8, 12, 34, 0.85)',
      backdropFilter: 'blur(20px)',
      marginTop: 'auto',
      padding: 'var(--space-2xl) 0 var(--space-xl)',
      position: 'relative',
      zIndex: 2,
    }}>
      <div className="container">
        {/* Entertainment Disclaimer Banner */}
        <div style={{
          background: 'rgba(14, 20, 52, 0.75)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-md) var(--space-lg)',
          marginBottom: 'var(--space-xl)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '16px',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <ShieldCheck size={24} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
            <strong style={{ color: '#FFFFFF' }}>Entertainment & Artistic Expression Notice: </strong>
            Mystical Past-Life Astrology is an imaginative, astrology-inspired storytelling experience created for entertainment and personal reflection. 
            All character names, historical settings, soul narratives, and portraits are generated works of creative fiction. 
            This experience does not claim to prove reincarnation, diagnose real-world health or psychological conditions, or attribute mortal hardship to past karmic punishment.
          </div>
        </div>

        {/* Links and Copyright */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-md)',
          fontSize: '0.92rem',
          color: 'var(--color-text-muted)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--color-primary)', fontSize: '18px' }}>✦</span>
            <span>© {new Date().getFullYear()} Mystical Past-Life Astrology 3D. All rights reserved.</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', fontWeight: 600 }}>
            <Link to="/how-it-works" style={{ color: 'var(--color-text-secondary)' }}>How It Works</Link>
            <Link to="/privacy" style={{ color: 'var(--color-text-secondary)' }}>Privacy Notice</Link>
            <Link to="/terms" style={{ color: 'var(--color-text-secondary)' }}>Terms & Disclaimer</Link>
            <Link to="/reading/new" style={{ color: 'var(--color-primary)' }}>Begin Reading</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
