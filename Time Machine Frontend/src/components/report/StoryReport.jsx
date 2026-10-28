import React, { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { Download, FileText, Sparkles, Check, AlertCircle, X } from 'lucide-react';

export function StoryReport({ reading, onClose }) {
  const reportRef = useRef(null);
  const [isExportingPng, setIsExportingPng] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  if (!reading) return null;

  const character = reading.characterProfile || {};
  const signature = reading.celestialSignature || {};
  const stories = reading.storySections || {};
  const themes = reading.symbolicKarmicThemes || [];

  const handleDownloadPng = async () => {
    if (!reportRef.current) return;
    setIsExportingPng(true);
    setStatusMessage('Rendering high-resolution 2x DPI celestial artifact (PNG)...');

    try {
      const dataUrl = await toPng(reportRef.current, {
        quality: 0.98,
        pixelRatio: 2,
        backgroundColor: '#050716',
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = `${character.characterName || 'Celestial_Chronicle'}_Report.png`;
      link.href = dataUrl;
      link.click();
      setStatusMessage('High-resolution PNG downloaded successfully!');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      console.error('PNG export failed:', err);
      setStatusMessage('Failed to render PNG artifact. Please try again.');
    } finally {
      setIsExportingPng(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!reportRef.current) return;
    setIsExportingPdf(true);
    setStatusMessage('Generating paginated celestial PDF report...');

    try {
      const dataUrl = await toPng(reportRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#050716',
        cacheBust: true,
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [820, 1180],
      });

      pdf.addImage(dataUrl, 'PNG', 0, 0, 820, 1180, undefined, 'FAST');
      pdf.save(`${character.characterName || 'Celestial_Chronicle'}_Report.pdf`);

      setStatusMessage('PDF report downloaded successfully!');
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err) {
      console.error('PDF export failed:', err);
      setStatusMessage('Failed to generate PDF. Please try again.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 7, 22, 0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-md)',
      overflowY: 'auto',
    }}>
      {/* Top Modal Controls */}
      <div style={{
        width: '100%',
        maxWidth: '860px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 24px',
        background: 'rgba(14, 20, 52, 0.95)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={20} style={{ color: 'var(--color-primary)' }} />
          <span style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '1.05rem', fontFamily: 'var(--font-display)' }}>
            Celestial Story Report Artifact Preview
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={isExportingPng || isExportingPdf}
            className="btn-primary"
            style={{ padding: '9px 20px', fontSize: '0.88rem' }}
          >
            <Download size={16} />
            {isExportingPng ? 'Rendering PNG...' : 'Download PNG'}
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isExportingPng || isExportingPdf}
            className="btn-secondary"
            style={{ padding: '9px 20px', fontSize: '0.88rem' }}
          >
            <FileText size={16} />
            {isExportingPdf ? 'Exporting PDF...' : 'Export PDF'}
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(24, 32, 78, 0.8)',
                border: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-muted)',
                transition: 'all 0.2s ease',
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {statusMessage && (
        <div style={{
          width: '100%',
          maxWidth: '860px',
          background: 'rgba(255, 215, 0, 0.16)',
          borderLeft: '4px solid var(--color-primary)',
          borderRight: '1px solid var(--color-border)',
          padding: '10px 18px',
          fontSize: '0.9rem',
          color: 'var(--color-primary-light)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <Sparkles size={16} />
          {statusMessage}
        </div>
      )}

      {/* Report Canvas Container */}
      <div style={{
        width: '100%',
        maxWidth: '860px',
        maxHeight: '82vh',
        overflowY: 'auto',
        background: '#050716',
        border: '1px solid var(--color-border)',
        borderRadius: '0 0 var(--radius-md) var(--radius-md)',
        boxShadow: 'var(--shadow-elevated)',
      }}>
        {/* Printable & Exportable Report Canvas */}
        <div
          ref={reportRef}
          style={{
            width: '820px',
            margin: '0 auto',
            padding: '44px',
            background: '#050716',
            color: '#F8FAFC',
            fontFamily: "'Plus Jakarta Sans', Inter, sans-serif",
            border: '2px solid #FFD700',
            boxSizing: 'border-box',
            position: 'relative',
          }}
        >
          {/* Inner Decorative Celestial Frame */}
          <div style={{
            border: '1px solid rgba(255, 215, 0, 0.35)',
            padding: '36px',
            position: 'relative',
            background: 'linear-gradient(180deg, rgba(20, 28, 72, 0.45) 0%, rgba(5, 7, 22, 0.85) 100%)',
          }}>
            {/* Header / Brand Title */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '11px',
                letterSpacing: '6px',
                color: '#FFD700',
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}>
                ✦ CELESTIAL PAST-LIFE CHRONICLE ✦
              </div>
              <h1 style={{
                fontFamily: "'Cinzel', Georgia, serif",
                fontSize: '30px',
                fontWeight: 700,
                color: '#FFFFFF',
                letterSpacing: '2px',
                margin: '0 0 8px',
              }}>
                {character.characterName?.toUpperCase() || 'THE IMMORTAL TRAVELER'}
              </h1>
              <div style={{
                fontSize: '14px',
                color: '#94A3B8',
                letterSpacing: '1px',
              }}>
                {character.occupation} • {reading.archetype?.name} • {signature.selectedSign} Alignment
              </div>
            </div>

            {/* Hero Image & Metadata Row */}
            <div style={{
              display: 'flex',
              gap: '24px',
              alignItems: 'center',
              marginBottom: '32px',
              background: 'rgba(20, 28, 72, 0.65)',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              padding: '18px',
              borderRadius: '8px',
            }}>
              {reading.portraitUrl && (
                <img
                  src={reading.portraitUrl}
                  alt={character.characterName}
                  crossOrigin="anonymous"
                  style={{
                    width: '180px',
                    height: '240px',
                    objectFit: 'cover',
                    borderRadius: '6px',
                    border: '1px solid #FFD700',
                    flexShrink: 0,
                  }}
                />
              )}
              <div style={{ flex: 1 }}>
                <div style={{
                  display: 'inline-block',
                  background: 'rgba(139, 92, 246, 0.25)',
                  border: '1px solid #8B5CF6',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#C084FC',
                  marginBottom: '10px',
                }}>
                  ARCHETYPE: {reading.archetype?.name?.toUpperCase()}
                </div>
                <div style={{ fontSize: '12.5px', color: '#CBD5E1', lineHeight: '1.65', marginBottom: '12px' }}>
                  <strong style={{ color: '#FFFFFF' }}>Fictional Era:</strong> {character.eraName || 'Ancient Era'}
                  <br />
                  <strong style={{ color: '#FFFFFF' }}>Setting:</strong> {character.setting}
                  <br />
                  <strong style={{ color: '#FFFFFF' }}>Key Traits:</strong> {character.characterTraits?.join(', ')}
                </div>
                <div style={{
                  background: 'rgba(5, 7, 22, 0.7)',
                  borderLeft: '3px solid #FFD700',
                  padding: '10px 14px',
                  fontSize: '12px',
                  fontStyle: 'italic',
                  color: '#FFD700',
                  lineHeight: '1.5',
                }}>
                  "{character.coreConflict}"
                </div>
              </div>
            </div>

            {/* Story Chapters */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '14px',
                color: '#FFD700',
                borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
                paddingBottom: '5px',
                marginBottom: '14px',
                letterSpacing: '1px',
              }}>
                CHRONICLE CHAPTERS
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
                  I. Origins & Awakening
                </div>
                <p style={{ fontSize: '11.5px', color: '#CBD5E1', lineHeight: '1.6', margin: 0 }}>
                  {stories.origins}
                </p>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
                  II. Daily Stewardship & Craft
                </div>
                <p style={{ fontSize: '11.5px', color: '#CBD5E1', lineHeight: '1.6', margin: 0 }}>
                  {stories.dailyLife}
                </p>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
                  III. The Defining Crucible
                </div>
                <p style={{ fontSize: '11.5px', color: '#CBD5E1', lineHeight: '1.6', margin: 0 }}>
                  {stories.turningPoint}
                </p>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
                  IV. Legacy & Fellowship
                </div>
                <p style={{ fontSize: '11.5px', color: '#CBD5E1', lineHeight: '1.6', margin: 0 }}>
                  {stories.conclusion}
                </p>
              </div>
            </div>

            {/* Symbolic Karmic Themes */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '14px',
                color: '#FFD700',
                borderBottom: '1px solid rgba(255, 215, 0, 0.3)',
                paddingBottom: '5px',
                marginBottom: '12px',
                letterSpacing: '1px',
              }}>
                SYMBOLIC KARMIC THEMES
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {themes.map((t, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(20, 28, 72, 0.65)',
                      border: '1px solid rgba(255, 215, 0, 0.25)',
                      padding: '12px 14px',
                      borderRadius: '6px',
                    }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#FFD700', marginBottom: '4px' }}>
                      ✦ {t.theme}
                    </div>
                    <div style={{ fontSize: '11px', color: '#CBD5E1', lineHeight: '1.45' }}>
                      {t.interpretation}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Present-Day Contemplation */}
            {reading.presentDayReflection && (
              <div style={{
                background: 'rgba(255, 215, 0, 0.1)',
                border: '1px solid #FFD700',
                borderRadius: '6px',
                padding: '14px',
                textAlign: 'center',
                marginBottom: '20px',
              }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#FFD700', marginBottom: '4px' }}>
                  PRESENT-DAY SOUL REFLECTION
                </div>
                <div style={{ fontSize: '12.5px', fontStyle: 'italic', color: '#FFFFFF' }}>
                  "{reading.presentDayReflection}"
                </div>
              </div>
            )}

            {/* Entertainment Disclaimer */}
            <div style={{
              borderTop: '1px solid rgba(255, 215, 0, 0.25)',
              paddingTop: '12px',
              textAlign: 'center',
              fontSize: '9.5px',
              color: '#94A3B8',
              lineHeight: '1.4',
            }}>
              <strong>Entertainment Notice: </strong>
              This chronicle is an imaginative, astrology-inspired narrative created purely for entertainment and personal reflection. 
              It does not claim to prove reincarnation, diagnose personal conditions, or provide verified historical accounts.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
