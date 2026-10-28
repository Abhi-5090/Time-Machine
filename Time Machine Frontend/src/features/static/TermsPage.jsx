import React from 'react';

export function TermsPage() {
  return (
    <div style={{ padding: 'var(--space-2xl) 0 var(--space-3xl)' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
          <div className="badge badge-gold" style={{ marginBottom: '8px' }}>
            ✦ Legal Terms & Disclaimer
          </div>
          <h1>Terms of Service & Entertainment Agreement</h1>
          <p style={{ maxWidth: '600px', margin: '0 auto' }}>
            Please read these terms carefully before engaging with our celestial experience.
          </p>
        </div>

        <div className="card" style={{ padding: 'var(--space-2xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--color-primary)', marginBottom: '12px' }}>
              1. Entertainment & Imaginative Storytelling Purpose
            </h2>
            <p style={{ lineHeight: '1.7' }}>
              Mystical Past-Life Astrology is designed exclusively as an entertaining, reflective, and artistic digital experience. 
              All past-life narratives, characters, eras, occupations, historical encounters, and symbolic themes are generated works of creative fiction.
            </p>
            <p style={{ lineHeight: '1.7' }}>
              This application does not make any scientific, medical, religious, or historical truth claims. 
              It does not prove reincarnation, discover verifiable past-life facts, or establish personal destiny.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--color-primary)', marginBottom: '12px' }}>
              2. Karmic Disclaimer & Non-Punitive Philosophy
            </h2>
            <p style={{ lineHeight: '1.7' }}>
              Our philosophy strictly forbids attributing real-world human suffering—including medical illnesses, chronic disabilities, financial crises, bereavement, or psychological struggles—to "past-life karma" or cosmic punishment. 
              Any symbolic themes presented are gentle, secular philosophical prompts meant solely for mindful present-day introspection.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--color-primary)', marginBottom: '12px' }}>
              3. Resemblance of Generated Imagery
            </h2>
            <p style={{ lineHeight: '1.7' }}>
              While our system issues strict preservation instructions to maintain facial identity when an optional photo is provided, 
              generative AI models naturally produce artistic variations. Resemblance cannot be guaranteed with 100% precision. 
              Users are invited to preview and discard or regenerate any result that does not meet their satisfaction.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--color-primary)', marginBottom: '12px' }}>
              4. Permitted Use & Sharing
            </h2>
            <p style={{ lineHeight: '1.7' }}>
              You are welcome to download, print, and share your personalized story reports and portraits for personal, non-commercial use on social channels and with friends and family.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
