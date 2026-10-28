import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Download,
  Share2,
  RefreshCw,
  Trash2,
  Sparkles,
  Shield,
  Compass,
  BookOpen,
  ArrowRight,
  FileImage,
  Check,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { api } from '../../services/api';
import { StoryReport } from '../../components/report/StoryReport';
import { TiltCard3D } from '../../components/3d/TiltCard3D';

export function ResultsPage() {
  const { readingId } = useParams();
  const navigate = useNavigate();

  const [reading, setReading] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [shareFeedback, setShareFeedback] = useState(null);

  useEffect(() => {
    let isMounted = true;

    api.getReading(readingId)
      .then((res) => {
        if (!isMounted) return;
        setReading(res?.data);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || 'Celestial record could not be retrieved.');
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [readingId]);

  const handleDownloadPortrait = () => {
    if (!reading?.portraitUrl) return;
    const link = document.createElement('a');
    link.href = reading.portraitUrl;
    link.download = `${reading.characterProfile?.characterName || 'Celestial_Portrait'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    const title = reading?.characterProfile?.characterName
      ? `My Imagined Past-Life: ${reading.characterProfile.characterName}`
      : 'My Mystical Past-Life Reading';
    const text = `Explore this astrology-inspired past-life chronicle and portrait: "${reading?.characterProfile?.characterName || 'Past-Life Chronicle'}"`;
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        setShareFeedback('Shared successfully!');
        setTimeout(() => setShareFeedback(null), 3000);
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyToClipboard(url);
        }
      }
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setShareFeedback('Link copied to clipboard!');
    setTimeout(() => setShareFeedback(null), 3000);
  };

  const handleRegenerate = async () => {
    if (reading?.retryCount >= 3) {
      alert('Maximum portrait regenerations reached for this reading.');
      return;
    }

    setIsRegenerating(true);
    try {
      await api.retryReading(readingId);
      navigate(`/reading/${readingId}/reveal`);
    } catch (err) {
      alert(err.message || 'Regeneration attempt failed.');
      setIsRegenerating(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to permanently delete this reading and its associated portrait? This action cannot be undone.'
    );
    if (!confirmDelete) return;

    setIsDeleting(true);
    try {
      await api.deleteReading(readingId);
      alert('Your celestial reading and associated images have been permanently deleted.');
      navigate('/');
    } catch (err) {
      alert(err.message || 'Failed to delete reading.');
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Sparkles size={48} className="pulse text-gold" style={{ margin: '0 auto 16px' }} />
          <h2>Consulting Celestial Archives...</h2>
        </div>
      </div>
    );
  }

  if (error || !reading) {
    return (
      <div className="container" style={{ padding: 'var(--space-3xl) 0', textAlign: 'center' }}>
        <AlertTriangle size={54} style={{ color: 'var(--color-danger)', margin: '0 auto 18px' }} />
        <h2>Celestial Record Unavailable</h2>
        <p style={{ maxWidth: '520px', margin: '0 auto 24px' }}>
          {error || 'This reading could not be found or has exceeded its retention period.'}
        </p>
        <Link to="/reading/new" className="btn-primary">
          Begin a New Reading
        </Link>
      </div>
    );
  }

  const character = reading.characterProfile || {};
  const signature = reading.celestialSignature || {};
  const stories = reading.storySections || {};
  const themes = reading.symbolicKarmicThemes || [];

  return (
    <div style={{ padding: 'var(--space-2xl) 0 var(--space-3xl)', position: 'relative' }}>
      <div className="container">
        {/* Top Header & Actions */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-md)',
          marginBottom: 'var(--space-2xl)',
        }}>
          <div>
            <div className="badge badge-gold" style={{ marginBottom: '8px' }}>
              ✦ Fictional Soul Chronicle
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', margin: 0 }}>
              {character.characterName || 'Chronicle of the Stars'}
            </h1>
            <div style={{ color: 'var(--color-primary-light)', fontSize: '1.15rem', marginTop: '6px', fontWeight: 600 }}>
              {character.occupation} • {reading.archetype?.name}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setShowReportModal(true)}
              className="btn-primary"
            >
              <FileImage size={18} /> High-Res Story Report (PNG / PDF)
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="btn-secondary"
            >
              <Share2 size={16} /> Share
            </button>

            <button
              type="button"
              onClick={handleRegenerate}
              disabled={isRegenerating || reading.retryCount >= 3}
              className="btn-secondary"
              title="Regenerate portrait (up to 3 times)"
            >
              <RefreshCw size={16} />
              {isRegenerating ? 'Regenerating...' : 'Regenerate'}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="btn-secondary"
              style={{ color: 'var(--color-danger)', borderColor: 'rgba(244, 63, 94, 0.4)' }}
              title="Permanently delete this reading"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {shareFeedback && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.18)',
            border: '1px solid var(--color-success)',
            color: 'var(--color-success)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 18px',
            marginBottom: 'var(--space-lg)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 0 16px rgba(16, 185, 129, 0.3)',
          }}>
            <Check size={18} />
            {shareFeedback}
          </div>
        )}

        {/* Hero Grid: 3D Tilt Portrait + Character Holographic Card */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-2xl)',
          marginBottom: 'var(--space-3xl)',
        }}>
          {/* Left Column: 3D Interactive Portrait */}
          <TiltCard3D
            intensity={14}
            glowColor="rgba(255, 215, 0, 0.4)"
            className="card"
            style={{
              padding: 'var(--space-md)',
              background: 'rgba(14, 20, 52, 0.8)',
              border: '2px solid var(--color-primary)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div style={{
              width: '100%',
              aspectRatio: '4 / 5',
              maxHeight: '480px',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              background: '#050716',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.8)',
            }}>
              {reading.portraitUrl ? (
                <img
                  src={reading.portraitUrl}
                  alt={character.characterName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{ textAlign: 'center', padding: '24px' }}>
                  <Sparkles size={40} className="text-gold" style={{ margin: '0 auto 12px' }} />
                  <div>Generating Portrait...</div>
                </div>
              )}
            </div>

            <div style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '16px',
              padding: '0 4px',
            }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--color-primary-light)', fontWeight: 600 }}>
                {character.visualStyle?.replace(/_/g, ' ').toUpperCase() || 'CINEMATIC 3D REALISM'}
              </span>

              <button
                type="button"
                onClick={handleDownloadPortrait}
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                <Download size={15} /> Download Portrait
              </button>
            </div>
          </TiltCard3D>

          {/* Right Column: Character Lore Card */}
          <TiltCard3D
            intensity={10}
            glowColor="rgba(139, 92, 246, 0.35)"
            className="card-holographic"
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '18px',
                flexWrap: 'wrap',
              }}>
                <span className="badge badge-gold">
                  {signature.selectedSign} ({signature.element || 'Celestial'})
                </span>
                <span className="badge badge-violet">
                  Archetype: {reading.archetype?.name}
                </span>
                <span className="badge badge-cyan">
                  Era: {character.eraName || 'Ancient Era'}
                </span>
              </div>

              <h2 style={{ fontSize: '1.75rem', marginBottom: '16px', color: '#FFFFFF' }}>
                Soul Archetype & Imagined Realm
              </h2>

              <p style={{ lineHeight: '1.75', fontSize: '1.08rem', marginBottom: '22px' }}>
                {reading.archetype?.description ||
                  `In the celestial wheel, this soul manifests the archetype of ${character.archetypeName}, carrying ancient vows of stewardship, insight, and honor.`}
              </p>

              {/* Character Details Grid */}
              <div style={{
                background: 'rgba(24, 32, 78, 0.75)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                padding: '18px',
                marginBottom: '20px',
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-primary)', textTransform: 'uppercase', fontWeight: 700 }}>Fictional Setting</div>
                    <div style={{ fontSize: '0.96rem', color: '#FFFFFF' }}>{character.setting}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-primary)', textTransform: 'uppercase', fontWeight: 700 }}>Key Traits</div>
                    <div style={{ fontSize: '0.96rem', color: '#FFFFFF' }}>{character.characterTraits?.join(', ')}</div>
                  </div>
                </div>
              </div>

              {/* Conflict Quote */}
              <div style={{
                borderLeft: '4px solid var(--color-primary)',
                background: 'rgba(255, 215, 0, 0.1)',
                padding: '16px 20px',
                borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                fontStyle: 'italic',
                color: '#FFFFFF',
                fontSize: '1rem',
                lineHeight: '1.6',
              }}>
                "{character.coreConflict}"
              </div>
            </div>

            <div style={{
              paddingTop: '20px',
              borderTop: '1px solid var(--color-border)',
              marginTop: '20px',
            }}>
              <button
                type="button"
                onClick={() => setShowReportModal(true)}
                className="btn-primary"
                style={{ width: '100%', padding: '14px 24px' }}
              >
                <FileImage size={18} /> Open Full High-Res Story Report
              </button>
            </div>
          </TiltCard3D>
        </div>

        {/* Multi-Section Life Story Chapters */}
        <div className="card-holographic" style={{ marginBottom: 'var(--space-3xl)', padding: 'var(--space-2xl)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <div className="badge badge-gold" style={{ marginBottom: '10px' }}>
              ✦ The Ancient Chronicle
            </div>
            <h2>Chapters of the Imagined Life</h2>
            <p style={{ maxWidth: '620px', margin: '0 auto' }}>
              A multi-part narrative inspired by the cosmic geometry of your chosen celestial signature.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }}>
            {/* Chapter 1: Origins */}
            <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-xl)' }}>
              <div className="badge badge-gold" style={{ marginBottom: '10px' }}>Chapter I</div>
              <h3 style={{ color: 'var(--color-primary-light)', marginBottom: '14px', fontSize: '1.45rem' }}>
                Origins & Celestial Awakening
              </h3>
              <p style={{ lineHeight: '1.85', fontSize: '1.05rem', whiteSpace: 'pre-line' }}>{stories.origins}</p>
            </div>

            {/* Chapter 2: Daily Life */}
            <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-xl)' }}>
              <div className="badge badge-cyan" style={{ marginBottom: '10px' }}>Chapter II</div>
              <h3 style={{ color: 'var(--color-cyan-light)', marginBottom: '14px', fontSize: '1.45rem' }}>
                Daily Stewardship & Sacred Craft
              </h3>
              <p style={{ lineHeight: '1.85', fontSize: '1.05rem', whiteSpace: 'pre-line' }}>{stories.dailyLife}</p>
            </div>

            {/* Chapter 3: Turning Point */}
            <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-xl)' }}>
              <div className="badge badge-violet" style={{ marginBottom: '10px' }}>Chapter III</div>
              <h3 style={{ color: 'var(--color-accent-light)', marginBottom: '14px', fontSize: '1.45rem' }}>
                The Turning Point & The Crucible
              </h3>
              <p style={{ lineHeight: '1.85', fontSize: '1.05rem', whiteSpace: 'pre-line' }}>{stories.turningPoint}</p>
            </div>

            {/* Chapter 4: Relationships */}
            <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-xl)' }}>
              <div className="badge badge-gold" style={{ marginBottom: '10px' }}>Chapter IV</div>
              <h3 style={{ color: 'var(--color-primary-light)', marginBottom: '14px', fontSize: '1.45rem' }}>
                Kinship & Kindred Bonds
              </h3>
              <p style={{ lineHeight: '1.85', fontSize: '1.05rem', whiteSpace: 'pre-line' }}>{stories.relationships}</p>
            </div>

            {/* Chapter 5: Conclusion */}
            <div>
              <div className="badge badge-sage" style={{ marginBottom: '10px' }}>Chapter V</div>
              <h3 style={{ color: 'var(--color-success)', marginBottom: '14px', fontSize: '1.45rem' }}>
                Peaceful Legacy & The Quiet Horizon
              </h3>
              <p style={{ lineHeight: '1.85', fontSize: '1.05rem', whiteSpace: 'pre-line' }}>{stories.conclusion}</p>
            </div>
          </div>
        </div>

        {/* Symbolic Karmic Themes & Reflection */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--space-2xl)',
          marginBottom: 'var(--space-3xl)',
        }}>
          {/* Themes Card */}
          <TiltCard3D
            intensity={10}
            glowColor="rgba(139, 92, 246, 0.35)"
            className="card"
            style={{ padding: 'var(--space-xl)' }}
          >
            <h3 style={{ color: '#FFFFFF', marginBottom: '18px' }}>
              ✦ Symbolic Karmic Themes
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {themes.map((theme, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(24, 32, 78, 0.7)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '16px',
                  }}
                >
                  <div style={{ fontWeight: 700, color: 'var(--color-primary)', marginBottom: '6px', fontSize: '1.02rem' }}>
                    ✦ {theme.theme}
                  </div>
                  <div style={{ fontSize: '0.94rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                    {theme.interpretation}
                  </div>
                </div>
              ))}
            </div>
          </TiltCard3D>

          {/* Present-Day Soul Reflection Card */}
          <TiltCard3D
            intensity={12}
            glowColor="rgba(255, 215, 0, 0.45)"
            className="card-holographic"
            style={{
              padding: 'var(--space-xl)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              textAlign: 'center',
            }}
          >
            <Sparkles size={44} className="text-gold" style={{ margin: '0 auto 16px' }} />
            <div className="badge badge-gold" style={{ alignSelf: 'center', marginBottom: '14px' }}>
              Present-Day Soul Reflection
            </div>
            <h3 style={{ fontSize: '1.45rem', marginBottom: '18px', color: '#FFFFFF' }}>
              A Question for Your Current Path
            </h3>
            <div style={{
              fontSize: '1.25rem',
              fontStyle: 'italic',
              color: 'var(--color-primary-light)',
              lineHeight: '1.65',
              marginBottom: '22px',
            }}>
              "{reading.presentDayReflection}"
            </div>
            <p style={{ fontSize: '0.92rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Carry this inquiry into your day as an invitation to mindfulness, kindness, and personal agency.
            </p>
          </TiltCard3D>
        </div>

        {/* Disclaimer Notice */}
        <div style={{
          background: 'rgba(10, 15, 45, 0.75)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '18px 24px',
          textAlign: 'center',
          fontSize: '0.88rem',
          color: 'var(--color-text-muted)',
          lineHeight: '1.6',
          marginBottom: 'var(--space-2xl)',
        }}>
          <strong>Disclaimer: </strong>
          {reading.disclaimer}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link to="/reading/new" className="btn-primary" style={{ padding: '16px 40px', fontSize: '1.1rem' }}>
            <Compass size={20} /> Begin Another Reading
          </Link>
        </div>
      </div>

      {/* High-Resolution Story Report Preview Modal */}
      {showReportModal && (
        <StoryReport
          reading={reading}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}
