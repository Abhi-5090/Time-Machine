import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Compass, Shield, BookOpen, Layers } from 'lucide-react';
import { api } from '../../services/api';

export function Navbar() {
  const location = useLocation();
  const [providerMode, setProviderMode] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    api.getHealth()
      .then((res) => {
        if (res?.data?.providerMode) {
          setProviderMode(res.data.providerMode);
        }
      })
      .catch(() => {});

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      style={{
        position: 'sticky',
        top: '12px',
        zIndex: 100,
        padding: '0 var(--space-md)',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '68px',
          background: scrolled
            ? 'rgba(10, 15, 42, 0.88)'
            : 'rgba(14, 20, 52, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-full)',
          boxShadow: scrolled
            ? '0 16px 40px -10px rgba(0, 0, 0, 0.7), 0 0 20px rgba(139, 92, 246, 0.2)'
            : '0 8px 30px rgba(0, 0, 0, 0.45)',
          padding: '0 24px',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Brand with 3D Glowing Star Crest */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #FFD700 0%, #D4A017 60%, #0A0F2D 100%)',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.55)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#050716',
              fontWeight: 900,
              fontSize: '18px',
              transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.15) rotate(20deg)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1) rotate(0deg)')}
          >
            ✦
          </div>
          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.2rem',
                letterSpacing: '0.06em',
                background: 'var(--grad-gold)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              MYSTICAL ASTROLOGY
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-cyan-light)', letterSpacing: '0.12em', fontWeight: 600 }}>
              PAST-LIFE CHRONICLES 3D
            </div>
          </div>
        </Link>

        {/* Navigation links & CTA */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
          <Link
            to="/how-it-works"
            style={{
              fontSize: '0.94rem',
              color: location.pathname === '/how-it-works' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              fontWeight: 600,
              transition: 'all 0.2s ease',
            }}
          >
            How It Works
          </Link>

          <Link
            to="/privacy"
            style={{
              fontSize: '0.94rem',
              color: location.pathname === '/privacy' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              fontWeight: 600,
              transition: 'all 0.2s ease',
            }}
          >
            Privacy
          </Link>

          {providerMode && (
            <span
              className={`badge ${providerMode === 'openai' ? 'badge-gold' : 'badge-violet'}`}
              title={providerMode === 'openai' ? 'Live OpenAI Model active' : 'Offline Deterministic Mock Mode active'}
            >
              {providerMode === 'openai' ? '✦ Live AI' : '✧ Mock Engine'}
            </span>
          )}

          <Link to="/reading/new" className="btn-primary" style={{ padding: '9px 22px', fontSize: '0.92rem' }}>
            <Compass size={17} />
            Begin Reading
          </Link>
        </nav>
      </div>
    </header>
  );
}
