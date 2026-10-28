import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sparkles, AlertCircle, RefreshCw, ArrowLeft, Layers } from 'lucide-react';
import { api } from '../../services/api';
import { Astrolabe3D } from '../../components/3d/Astrolabe3D';

const STAGES = [
  { id: 'preparing_profile', label: 'Aligning your celestial coordinates...', percent: 25 },
  { id: 'shaping_character', label: 'Shaping your fictional soul archetype...', percent: 50 },
  { id: 'writing_story', label: 'Inscribing your ancient chronicle chapters...', percent: 75 },
  { id: 'creating_portrait', label: 'Manifesting your cinematic character portrait...', percent: 90 },
  { id: 'completed', label: 'Celestial chronicle complete! Unveiling...', percent: 100 },
];

export function RevealScreen() {
  const { readingId } = useParams();
  const navigate = useNavigate();

  const [reading, setReading] = useState(null);
  const [currentStageId, setCurrentStageId] = useState('preparing_profile');
  const [progressPercent, setProgressPercent] = useState(20);
  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let pollInterval = null;

    const checkStatus = async () => {
      try {
        const res = await api.getReading(readingId);
        const data = res?.data;

        if (!isMounted) return;
        setReading(data);

        if (data.status === 'completed') {
          setCurrentStageId('completed');
          setProgressPercent(100);
          clearInterval(pollInterval);
          setTimeout(() => {
            navigate(`/reading/${readingId}`);
          }, 1200);
        } else if (data.status === 'failed') {
          setError(data.errorMessage || 'The celestial alignment was disrupted during manifestation.');
          clearInterval(pollInterval);
        } else {
          if (data.currentStage) {
            setCurrentStageId(data.currentStage);
            const stageObj = STAGES.find((s) => s.id === data.currentStage);
            if (stageObj) {
              setProgressPercent(stageObj.percent);
            }
          }
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Polling error:', err);
        setError(err.message || 'Unable to connect to the celestial archive.');
        clearInterval(pollInterval);
      }
    };

    checkStatus();
    pollInterval = setInterval(checkStatus, 2200);

    return () => {
      isMounted = false;
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [readingId, navigate]);

  const handleRetry = async () => {
    setIsRetrying(true);
    setError(null);
    try {
      await api.retryReading(readingId);
      setCurrentStageId('creating_portrait');
      setProgressPercent(80);
      window.location.reload();
    } catch (err) {
      setError(err.message || 'Retry attempt failed.');
      setIsRetrying(false);
    }
  };

  const activeStage = STAGES.find((s) => s.id === currentStageId) || STAGES[0];

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-2xl) var(--space-md)',
      position: 'relative',
    }}>
      <div
        className="card-holographic"
        style={{
          maxWidth: '620px',
          width: '100%',
          textAlign: 'center',
          padding: 'var(--space-2xl) var(--space-xl)',
          position: 'relative',
        }}
      >
        {error ? (
          <div>
            <AlertCircle size={52} style={{ color: 'var(--color-danger)', margin: '0 auto 16px' }} />
            <h2 style={{ marginBottom: '12px', color: '#FFFFFF' }}>Manifestation Interrupted</h2>
            <p style={{ color: '#fecdd3', marginBottom: '24px', fontSize: '1rem' }}>
              {error}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <button
                type="button"
                onClick={handleRetry}
                className="btn-primary"
                disabled={isRetrying}
              >
                <RefreshCw size={16} />
                {isRetrying ? 'Retrying...' : 'Retry Manifestation'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/reading/new')}
                className="btn-secondary"
              >
                <ArrowLeft size={16} /> New Reading
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* 3D Gyroscopic Astrolabe */}
            <div style={{ marginBottom: 'var(--space-2xl)' }}>
              <Astrolabe3D size={280} />
            </div>

            <div className="badge badge-gold" style={{ marginBottom: '14px' }}>
              ✦ 3D Celestial Manifestation Active
            </div>

            <h2 style={{ marginBottom: '14px', fontSize: '1.9rem', color: '#FFFFFF' }}>
              {activeStage.label}
            </h2>

            <p style={{ maxWidth: '440px', margin: '0 auto var(--space-xl)', fontSize: '1rem', color: 'var(--color-text-secondary)' }}>
              Please remain in this contemplative space while your multi-chapter story and cinematic portrait are rendered.
            </p>

            {/* Glowing 3D Progress Bar */}
            <div style={{
              width: '100%',
              height: '10px',
              background: 'rgba(24, 32, 78, 0.8)',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
              marginBottom: '16px',
              boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.6)',
            }}>
              <div style={{
                width: `${progressPercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #8B5CF6 0%, #06B6D4 50%, #FFD700 100%)',
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.9)',
                transition: 'width 0.75s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }} />
            </div>

            {/* Step Milestones */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.82rem',
              color: 'var(--color-text-muted)',
              marginBottom: 'var(--space-xl)',
            }}>
              <span>Coordinates</span>
              <span>Soul Archetype</span>
              <span>Chronicle Lore</span>
              <span>3D Portrait</span>
            </div>

            <button
              type="button"
              onClick={() => navigate('/')}
              style={{
                fontSize: '0.9rem',
                color: 'var(--color-text-muted)',
                textDecoration: 'underline',
              }}
            >
              Cancel and return to home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
