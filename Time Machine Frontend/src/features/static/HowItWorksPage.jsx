import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, Shield, Eye, RefreshCw, Lock, BookOpen } from 'lucide-react';
import { TiltCard3D } from '../../components/3d/TiltCard3D';

export function HowItWorksPage() {
  return (
    <div style={{ padding: 'var(--space-2xl) 0 var(--space-3xl)', position: 'relative' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
          <div className="badge badge-gold" style={{ marginBottom: '10px' }}>
            ✦ The Experience Explained
          </div>
          <h1>How Mystical Past-Life Astrology Works</h1>
          <p style={{ maxWidth: '620px', margin: '0 auto' }}>
            An imaginative ritual blending ancient astrology archetypes, symbolic narrative craft, and respectful generative technology.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)', marginBottom: 'var(--space-2xl)' }}>
          <TiltCard3D
            intensity={10}
            glowColor="rgba(255, 215, 0, 0.3)"
            className="card"
            style={{ padding: 'var(--space-2xl)' }}
          >
            <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--color-primary-light)' }}>
              1. The Mystical Zodiac Philosophy
            </h2>
            <p style={{ lineHeight: '1.75', marginBottom: '16px' }}>
              Our application is rooted in a creative product framework called <em>Mystical Zodiac</em>. We do not claim to scientifically predict the future, calculate complex astronomical ephemerides without proper natal charts, or establish factual reincarnation histories.
            </p>
            <p style={{ lineHeight: '1.75', marginBottom: 0 }}>
              Instead, we treat the twelve classical signs—from the daring initiative of Aries to the oceanic intuition of Pisces—as sacred metaphorical mirrors. Your input serves as the creative seed for an evocative story of who a soul carrying those qualities might have been in an ancient or timeless setting.
            </p>
          </TiltCard3D>

          <TiltCard3D
            intensity={10}
            glowColor="rgba(139, 92, 246, 0.3)"
            className="card-holographic"
            style={{ padding: 'var(--space-2xl)' }}
          >
            <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--color-accent-light)' }}>
              2. Facial Identity Resemblance (Optional)
            </h2>
            <p style={{ lineHeight: '1.75', marginBottom: '16px' }}>
              If you optionally choose to upload a personal photograph, our system utilizes OpenAI’s image editing and reference styling workflows with strict instructions:
            </p>
            <div style={{
              background: 'rgba(10, 15, 45, 0.8)',
              borderLeft: '4px solid var(--color-primary)',
              padding: '16px 20px',
              borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
              fontStyle: 'italic',
              fontSize: '0.94rem',
              color: '#FFFFFF',
              marginBottom: '16px',
              lineHeight: '1.6',
            }}>
              “Use the supplied photograph as the identity reference for the same adult person. Preserve their recognizable facial identity, face shape, proportions, skin tone, eyes, nose, lips, and distinctive facial features as closely as possible... Transform the surrounding scene into a cinematic, historically inspired mystical setting.”
            </div>
            <p style={{ lineHeight: '1.75', marginBottom: 0 }}>
              <strong>Important Technical Note:</strong> Generative AI models can vary between runs and cannot guarantee 100% photographic accuracy. We offer previews, regeneration options, and permanent deletion to ensure you remain in complete control.
            </p>
          </TiltCard3D>

          <TiltCard3D
            intensity={10}
            glowColor="rgba(6, 182, 212, 0.3)"
            className="card"
            style={{ padding: 'var(--space-2xl)' }}
          >
            <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--color-cyan-light)' }}>
              3. Pristine Document & Image Generation
            </h2>
            <p style={{ lineHeight: '1.75', marginBottom: '16px' }}>
              Unlike generic tools that ask AI models to draw paragraphs of text directly onto images (often causing garbled letters or spelling errors), we compose your entire reading report using high-fidelity HTML and CSS typography in our 3D design system.
            </p>
            <p style={{ lineHeight: '1.75', marginBottom: 0 }}>
              When you download your story report as a PNG or PDF, it is rendered sharply in high resolution from the exact validated story data.
            </p>
          </TiltCard3D>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link to="/reading/new" className="btn-primary" style={{ padding: '16px 40px', fontSize: '1.1rem' }}>
            <Compass size={20} /> Begin Your Reading Now
          </Link>
        </div>
      </div>
    </div>
  );
}
