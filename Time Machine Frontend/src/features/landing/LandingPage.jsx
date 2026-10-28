import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Compass,
  Shield,
  BookOpen,
  Star,
  UserCheck,
  Eye,
  ArrowRight,
  Flame,
  Globe,
  Wind,
  Droplets,
  Layers,
  Camera,
} from 'lucide-react';
import { Astrolabe3D } from '../../components/3d/Astrolabe3D';
import { TiltCard3D } from '../../components/3d/TiltCard3D';
import { ZODIAC_SIGNS } from '../../constants/options';

export function LandingPage() {
  const [activeElement, setActiveElement] = useState('all');

  const filteredSigns = activeElement === 'all'
    ? ZODIAC_SIGNS
    : ZODIAC_SIGNS.filter((s) => s.element.toLowerCase() === activeElement);

  const getElementColor = (element) => {
    switch (element.toLowerCase()) {
      case 'fire': return '#FF5733';
      case 'earth': return '#10B981';
      case 'air': return '#06B6D4';
      case 'water': return '#8B5CF6';
      default: return '#FFD700';
    }
  };

  return (
    <div style={{ paddingBottom: 'var(--space-3xl)', position: 'relative' }}>
      {/* 3D Cinematic Hero Section */}
      <section style={{
        position: 'relative',
        padding: 'var(--space-3xl) 0 var(--space-2xl)',
        overflow: 'hidden',
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            alignItems: 'center',
            gap: 'var(--space-2xl)',
          }}>
            {/* Left Hero Narrative */}
            <div>
              <div className="badge badge-gold" style={{ marginBottom: '18px' }}>
                ✦ 3D Imaginative Celestial Portal
              </div>

              <h1 style={{ marginBottom: '20px', lineHeight: 1.15 }}>
                Unveil Your Soul’s <br />
                <span className="text-gold">Ancient Echo</span> in the Stars
              </h1>

              <p style={{
                fontSize: '1.2rem',
                color: 'var(--color-text-secondary)',
                lineHeight: '1.7',
                marginBottom: 'var(--space-xl)',
                maxWidth: '560px',
              }}>
                Step into a 3D animated celestial sanctum. Journey through your astrological coordinates to receive a personalized fictional past-life chronicle, soul archetype, and a cinematic historical portrait preserving your facial likeness.
              </p>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: 'var(--space-2xl)' }}>
                <Link to="/reading/new" className="btn-primary" style={{ padding: '16px 38px', fontSize: '1.1rem' }}>
                  <Compass size={22} />
                  Begin Your Reading
                </Link>

                <Link to="/how-it-works" className="btn-secondary" style={{ padding: '16px 30px', fontSize: '1.05rem' }}>
                  <BookOpen size={20} />
                  Explore The Lore
                </Link>
              </div>

              {/* Floating 3D Pill Metrics */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '12px',
              }}>
                <div style={{
                  background: 'rgba(24, 32, 78, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  <Camera size={20} style={{ color: 'var(--color-primary)' }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-text)' }}>Facial Identity</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>Consented reference styling</div>
                  </div>
                </div>

                <div style={{
                  background: 'rgba(24, 32, 78, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  <Layers size={20} style={{ color: 'var(--color-cyan-light)' }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-text)' }}>High-Res PNG & PDF</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>Prismatic vector typography</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero: Interactive 3D Astrolabe Sphere */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                width: '380px',
                height: '380px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255, 215, 0, 0.18) 0%, rgba(139, 92, 246, 0.15) 50%, transparent 75%)',
                filter: 'blur(30px)',
                pointerEvents: 'none',
              }} />
              <Astrolabe3D size={360} />
            </div>
          </div>
        </div>
      </section>

      {/* 3D Zodiac Elemental Constellation Wheel Section */}
      <section style={{ padding: 'var(--space-3xl) 0', position: 'relative' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <div className="badge badge-cyan" style={{ marginBottom: '8px' }}>
              ✦ Interactive Zodiac Constellations
            </div>
            <h2>The Twelve Celestial Archetype Gates</h2>
            <p style={{ maxWidth: '600px', margin: '0 auto var(--space-lg)' }}>
              Filter by the primordial elements to discover your sign’s cosmic frequency and symbolic realm.
            </p>

            {/* Element Filter Pills */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {[
                { id: 'all', label: 'All Signs', icon: Sparkles, color: '#FFD700' },
                { id: 'fire', label: 'Fire Signs', icon: Flame, color: '#FF5733' },
                { id: 'earth', label: 'Earth Signs', icon: Globe, color: '#10B981' },
                { id: 'air', label: 'Air Signs', icon: Wind, color: '#06B6D4' },
                { id: 'water', label: 'Water Signs', icon: Droplets, color: '#8B5CF6' },
              ].map((filter) => {
                const Icon = filter.icon;
                const isActive = activeElement === filter.id;
                return (
                  <button
                    type="button"
                    key={filter.id}
                    onClick={() => setActiveElement(filter.id)}
                    style={{
                      background: isActive ? 'rgba(255, 215, 0, 0.2)' : 'rgba(24, 32, 78, 0.6)',
                      border: isActive ? `2px solid ${filter.color}` : '1px solid var(--color-border)',
                      color: isActive ? '#FFFFFF' : 'var(--color-text-secondary)',
                      borderRadius: 'var(--radius-full)',
                      padding: '8px 18px',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: isActive ? `0 0 16px ${filter.color}55` : 'none',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    <Icon size={16} style={{ color: filter.color }} />
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3D Zodiac Cards Grid */}
          <div className="grid-4">
            {filteredSigns.map((sign) => {
              const elColor = getElementColor(sign.element);
              return (
                <TiltCard3D
                  key={sign.name}
                  intensity={18}
                  glowColor={`${elColor}44`}
                  className="card"
                  style={{
                    background: 'rgba(16, 24, 62, 0.7)',
                    border: `1px solid ${elColor}44`,
                    padding: '20px 16px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{
                    fontSize: '2.4rem',
                    marginBottom: '8px',
                    color: elColor,
                    filter: `drop-shadow(0 0 12px ${elColor}77)`,
                  }}>
                    {sign.symbol}
                  </div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '4px', color: 'var(--color-text)' }}>
                    {sign.name}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                    {sign.dates}
                  </div>
                  <span
                    className="badge"
                    style={{
                      fontSize: '0.72rem',
                      padding: '3px 10px',
                      background: `${elColor}18`,
                      borderColor: `${elColor}55`,
                      color: elColor,
                    }}
                  >
                    {sign.element} Element
                  </span>
                </TiltCard3D>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3D Holographic Sample Reading Preview Card */}
      <section style={{
        padding: 'var(--space-3xl) 0',
        background: 'linear-gradient(180deg, transparent 0%, rgba(14, 20, 52, 0.6) 50%, transparent 100%)',
        position: 'relative',
      }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <div className="badge badge-gold" style={{ marginBottom: '8px' }}>
              ✦ Holographic Sample Reading
            </div>
            <h2>Glimpse of a Past-Life Artifact</h2>
            <p style={{ maxWidth: '620px', margin: '0 auto' }}>
              Experience how your structured narrative, archetype badge, and portrait unite into a shareable digital artifact.
            </p>
          </div>

          <TiltCard3D
            intensity={12}
            glowColor="rgba(255, 215, 0, 0.35)"
            className="card-holographic"
            style={{ padding: 'var(--space-2xl)' }}
          >
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--space-2xl)',
              alignItems: 'center',
            }}>
              {/* Left Portrait Hologram */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}>
                <div style={{
                  width: '260px',
                  height: '350px',
                  borderRadius: 'var(--radius-md)',
                  background: 'radial-gradient(circle at 50% 35%, #243070 0%, #0A0F2D 75%, #050716 100%)',
                  border: '2px solid var(--color-primary)',
                  boxShadow: '0 0 35px rgba(255, 215, 0, 0.4), inset 0 0 25px rgba(139, 92, 246, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 'var(--space-md)',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    fontSize: '4.5rem',
                    color: 'var(--color-primary)',
                    filter: 'drop-shadow(0 0 20px rgba(255, 215, 0, 0.8))',
                    marginBottom: '8px',
                  }}>
                    ♏
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: '#FFFFFF',
                  }}>
                    VALERIUS
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-primary-light)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Sentinel of the Solstice Gate
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-muted)',
                    marginTop: '16px',
                    borderTop: '1px solid rgba(255, 215, 0, 0.3)',
                    paddingTop: '8px',
                  }}>
                    Ancient Citadel • High Solstice
                  </div>
                </div>

                <span className="badge badge-sage" style={{ marginTop: '16px' }}>
                  ✦ 3D Fictional Portrait Hologram
                </span>
              </div>

              {/* Right Narrative Excerpt */}
              <div>
                <div className="badge badge-violet" style={{ marginBottom: '12px' }}>
                  Soul Archetype: The Guardian
                </div>
                <h3 style={{ fontSize: '1.6rem', marginBottom: '14px', color: 'var(--color-text)' }}>
                  The Oath Above the Clouds
                </h3>
                <p style={{ lineHeight: '1.7', fontSize: '1.02rem', marginBottom: '18px' }}>
                  “Before mortal kings divided the valleys, Valerius walked the granite ramparts beneath an unclouded sky of Scorpio stars. Entrusted with the ancient sanctuary’s keys, they chose wisdom and restorative peace over the clamor of war...”
                </p>

                <div style={{
                  background: 'rgba(255, 215, 0, 0.08)',
                  borderLeft: '3px solid var(--color-primary)',
                  padding: '14px 18px',
                  borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                  marginBottom: '24px',
                }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Present-Day Reflection
                  </div>
                  <div style={{ fontSize: '0.96rem', fontStyle: 'italic', color: 'var(--color-text)', marginTop: '4px' }}>
                    “Where in your journey today is steady patience calling you to be an unshakeable guardian of what matters?”
                  </div>
                </div>

                <Link to="/reading/new" className="btn-primary" style={{ padding: '14px 32px' }}>
                  Begin Your Own Manifestation <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </TiltCard3D>
        </div>
      </section>

      {/* 3D Interactive Feature Trio */}
      <section style={{ padding: 'var(--space-3xl) 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <div className="badge badge-violet" style={{ marginBottom: '8px' }}>
              ✦ Design Engineering Excellence
            </div>
            <h2>Built With Reverence & Precision</h2>
            <p style={{ maxWidth: '560px', margin: '0 auto' }}>
              Harmonizing private data handling, responsive 3D micro-interactions, and high-fidelity output.
            </p>
          </div>

          <div className="grid-3">
            <TiltCard3D
              intensity={16}
              glowColor="rgba(255, 215, 0, 0.3)"
              className="card"
              style={{ textAlign: 'center', padding: 'var(--space-2xl) var(--space-xl)' }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(255, 215, 0, 0.15)',
                border: '1px solid var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-md)',
                color: 'var(--color-primary)',
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.4)',
              }}>
                <Shield size={32} />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>Zero-Knowledge Privacy</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
                Photographs and birth coordinates are never used to infer real-world medical health, ethnicity, or factual history. Immediate deletion is guaranteed.
              </p>
            </TiltCard3D>

            <TiltCard3D
              intensity={16}
              glowColor="rgba(139, 92, 246, 0.35)"
              className="card"
              style={{ textAlign: 'center', padding: 'var(--space-2xl) var(--space-xl)' }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(139, 92, 246, 0.18)',
                border: '1px solid var(--color-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-md)',
                color: 'var(--color-accent-light)',
                boxShadow: '0 0 20px rgba(139, 92, 246, 0.45)',
              }}>
                <Sparkles size={32} />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>Facial Identity Styling</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
                When a photo is provided, our system applies strict identity preservation directives to place your recognizable face in the fantasy setting.
              </p>
            </TiltCard3D>

            <TiltCard3D
              intensity={16}
              glowColor="rgba(6, 182, 212, 0.3)"
              className="card"
              style={{ textAlign: 'center', padding: 'var(--space-2xl) var(--space-xl)' }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(6, 182, 212, 0.16)',
                border: '1px solid var(--color-cyan)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-md)',
                color: 'var(--color-cyan-light)',
                boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)',
              }}>
                <Layers size={32} />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>Pristine 2x DPI Reports</h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>
                Download your chronicle as a high-resolution PNG image or paginated PDF artifact with perfectly rendered, legible typography.
              </p>
            </TiltCard3D>
          </div>
        </div>
      </section>
    </div>
  );
}
