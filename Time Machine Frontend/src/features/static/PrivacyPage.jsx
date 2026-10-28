import React from 'react';
import { Shield, Lock, Trash2, EyeOff, UserCheck } from 'lucide-react';

export function PrivacyPage() {
  return (
    <div style={{ padding: 'var(--space-2xl) 0 var(--space-3xl)' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
          <div className="badge badge-gold" style={{ marginBottom: '8px' }}>
            ✦ Data Protection & Respect
          </div>
          <h1>Privacy Policy & Data Notice</h1>
          <p style={{ maxWidth: '600px', margin: '0 auto' }}>
            We honor your privacy as a sacred trust. Learn how your data and optional photographs are handled.
          </p>
        </div>

        <div className="card" style={{ padding: 'var(--space-2xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--color-primary)', marginBottom: '12px' }}>
              1. Principles of Data Minimization
            </h2>
            <p style={{ lineHeight: '1.7' }}>
              We only request information directly relevant to composing your imaginative past-life chronicle. 
              You are never required to register an account, enter payment cards, or disclose government identification.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--color-primary)', marginBottom: '12px' }}>
              2. Optional Personal Photographs & Facial Resemblance
            </h2>
            <p style={{ lineHeight: '1.7', marginBottom: '12px' }}>
              Uploading a photograph is entirely optional. When you choose to upload an image and provide explicit consent:
            </p>
            <ul style={{ paddingLeft: '24px', color: 'var(--color-text-muted)', lineHeight: '1.7' }}>
              <li>Your photo is transmitted securely to our backend server and stored in private directories inaccessible by the public web.</li>
              <li>Your photograph is used solely as a visual identity reference to preserve recognizable facial geometry in the generated artistic portrait.</li>
              <li>We never use your photograph to infer personality, zodiac sign, ethnicity, physical health, psychological condition, or actual past-life identity.</li>
              <li>Your original photo is never displayed publicly or included in downloaded reports unless you explicitly download it yourself.</li>
            </ul>
          </div>

          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--color-primary)', marginBottom: '12px' }}>
              3. AI Provider Processing (OpenAI)
            </h2>
            <p style={{ lineHeight: '1.7' }}>
              When live AI generation is active, character narrative prompts and consented reference photos are processed via the official OpenAI API. 
              Under standard OpenAI API enterprise terms, data submitted through the API is not used to train future OpenAI foundation models.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--color-primary)', marginBottom: '12px' }}>
              4. Immediate Deletion Rights
            </h2>
            <p style={{ lineHeight: '1.7' }}>
              You maintain total dominion over your reading. On your results page, clicking the trash icon immediately and permanently removes your reading record, generated portrait, and any uploaded reference photograph from our database and disk storage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
