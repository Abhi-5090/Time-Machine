import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  User,
  Calendar,
  Clock,
  MapPin,
  Camera,
  Upload,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  X,
  Info,
  Shield,
  Layers,
} from 'lucide-react';
import { ZODIAC_SIGNS, ARCHETYPES, SOUL_THEMES, STORY_GENRES, HISTORICAL_SETTINGS, PORTRAIT_STYLES, PORTRAIT_FRAMINGS } from '../../constants/options';
import { api } from '../../services/api';
import { TiltCard3D } from '../../components/3d/TiltCard3D';

export function OnboardingWizard() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const [formData, setFormData] = useState({
    preferredName: '',
    dateOfBirth: '',
    selectedZodiacSign: 'Scorpio',
    zodiacInputMode: 'manual_symbolic_choice',
    derivedSign: null,
    mismatchWarning: null,

    birthTimeKnown: false,
    birthTime: '',
    birthplace: '',

    archetypeId: 'auto',
    mainTheme: 'wisdom',
    storyGenre: 'reflective',
    historicalSetting: 'system_select',
    readingDepth: 'full',

    usePhoto: false,
    photoFile: null,
    photoPreviewUrl: null,
    photoAssetId: null,
    photoConsent: false,
    characterPresentation: 'system_select',
    portraitStyle: 'cinematic_mystical_realism',
    portraitFraming: 'close_up',

    consentEntertainment: false,
    consentProcessing: false,
  });

  useEffect(() => {
    if (formData.dateOfBirth) {
      api.validateZodiac({
        dateOfBirth: formData.dateOfBirth,
        selectedZodiacSign: formData.selectedZodiacSign,
        inputMode: formData.zodiacInputMode,
      })
        .then((res) => {
          if (res?.data) {
            setFormData((prev) => ({
              ...prev,
              derivedSign: res.data.derivedSign,
              mismatchWarning: res.data.isConsistent ? null : res.data.message,
            }));
          }
        })
        .catch(() => {});
    } else {
      setFormData((prev) => ({
        ...prev,
        derivedSign: null,
        mismatchWarning: null,
      }));
    }
  }, [formData.dateOfBirth, formData.selectedZodiacSign, formData.zodiacInputMode]);

  const updateForm = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormError(null);
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFormError('The selected photograph exceeds 5 MB. Please select a smaller image.');
      return;
    }

    const preview = URL.createObjectURL(file);
    updateForm('photoFile', file);
    updateForm('photoPreviewUrl', preview);
    setFormError(null);
  };

  const handleRemovePhoto = async () => {
    if (formData.photoAssetId) {
      try {
        await api.deleteReferencePhoto(formData.photoAssetId);
      } catch {}
    }
    if (formData.photoPreviewUrl) {
      URL.revokeObjectURL(formData.photoPreviewUrl);
    }
    setFormData((prev) => ({
      ...prev,
      photoFile: null,
      photoPreviewUrl: null,
      photoAssetId: null,
      photoConsent: false,
    }));
  };

  const handleNextStep = () => {
    setFormError(null);
    if (currentStep === 1 && !formData.selectedZodiacSign && !formData.dateOfBirth) {
      setFormError('Please select a zodiac sign or enter your date of birth.');
      return;
    }
    if (currentStep === 4 && formData.usePhoto && formData.photoFile && !formData.photoConsent) {
      setFormError('Please check the explicit photo consent box to proceed with reference photo styling.');
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 5));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setFormError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!formData.consentEntertainment || !formData.consentProcessing) {
      setFormError('You must acknowledge the fictional entertainment disclaimer and consent to proceed.');
      return;
    }

    setIsSubmitting(true);
    setFormError(null);

    try {
      let finalPhotoAssetId = formData.photoAssetId;

      if (formData.usePhoto && formData.photoFile && !finalPhotoAssetId) {
        const uploadRes = await api.uploadReferencePhoto(formData.photoFile, formData.photoConsent);
        finalPhotoAssetId = uploadRes.data.assetId;
      }

      const payload = {
        profile: {
          preferredName: formData.preferredName.trim(),
          dateOfBirth: formData.dateOfBirth || null,
          selectedZodiacSign: formData.selectedZodiacSign,
          zodiacInputMode: formData.zodiacInputMode,
          birthTime: formData.birthTimeKnown ? formData.birthTime : '',
          birthplace: formData.birthplace.trim(),
          astrologyMode: 'mystical_zodiac',
          preferredLanguage: 'en',
          photoAssetId: finalPhotoAssetId || null,
        },
        preferences: {
          archetypeId: formData.archetypeId,
          mainTheme: formData.mainTheme,
          storyGenre: formData.storyGenre,
          historicalSetting: formData.historicalSetting,
          readingDepth: formData.readingDepth,
          portraitStyle: formData.portraitStyle,
          portraitFraming: formData.portraitFraming,
          characterPresentation: formData.characterPresentation,
        },
        consent: {
          readingProcessing: formData.consentProcessing,
          fictionalReadingAcknowledged: formData.consentEntertainment,
          photoProcessing: Boolean(formData.usePhoto && formData.photoConsent),
        },
      };

      const res = await api.createReading(payload);
      const readingId = res.data.readingId;
      navigate(`/reading/${readingId}/reveal`);
    } catch (err) {
      setFormError(err.message || 'The celestial energies encountered an obstacle. Please try again.');
      setIsSubmitting(false);
    }
  };

  const getElementColor = (element) => {
    switch (element?.toLowerCase()) {
      case 'fire': return '#FF5733';
      case 'earth': return '#10B981';
      case 'air': return '#06B6D4';
      case 'water': return '#8B5CF6';
      default: return '#FFD700';
    }
  };

  const stepTitles = [
    'Celestial Identity',
    'Birth Details',
    'Soul Archetype',
    'Portrait Styling',
    'Review & Manifest',
  ];

  return (
    <div style={{ padding: 'var(--space-2xl) 0 var(--space-3xl)', position: 'relative' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        {/* Luminous Animated Step Progress Header */}
        <div style={{ marginBottom: 'var(--space-2xl)' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '14px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '1rem',
              color: 'var(--color-primary)',
              letterSpacing: '0.08em',
            }}>
              <span>STEP {currentStep} OF 5:</span>
              <span style={{ color: '#FFFFFF' }}>{stepTitles[currentStep - 1].toUpperCase()}</span>
            </div>
            <div className="badge badge-gold">
              {Math.round((currentStep / 5) * 100)}% Aligned
            </div>
          </div>

          <div style={{
            width: '100%',
            height: '8px',
            background: 'rgba(24, 32, 78, 0.7)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.5)',
            position: 'relative',
          }}>
            <div style={{
              width: `${(currentStep / 5) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #8B5CF6 0%, #06B6D4 50%, #FFD700 100%)',
              boxShadow: '0 0 16px rgba(255, 215, 0, 0.8)',
              transition: 'width 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }} />
          </div>
        </div>

        {/* 3D Glassmorphic Wizard Container */}
        <div className="card-holographic" style={{ padding: 'var(--space-2xl) var(--space-xl)' }}>
          {/* STEP 1: Celestial Identity */}
          {currentStep === 1 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
                <div className="badge badge-gold" style={{ marginBottom: '10px' }}>
                  ✦ Step 1: Celestial Identity
                </div>
                <h2>Connect With Your Star Sign</h2>
                <p>Choose your zodiac sign directly, or enter your date of birth to derive your Western Sun sign.</p>
              </div>

              {/* Preferred Name */}
              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <label htmlFor="preferredName">Preferred Name or Nickname (Optional)</label>
                <input
                  id="preferredName"
                  type="text"
                  placeholder="e.g. Rowan, Morgan, or leave blank"
                  value={formData.preferredName}
                  onChange={(e) => updateForm('preferredName', e.target.value)}
                  maxLength={50}
                />
              </div>

              {/* Date of Birth */}
              <div style={{ marginBottom: 'var(--space-xl)' }}>
                <label htmlFor="dateOfBirth">Date of Birth (Optional)</label>
                <input
                  id="dateOfBirth"
                  type="date"
                  max={new Date().toISOString().split('T')[0]}
                  value={formData.dateOfBirth}
                  onChange={(e) => updateForm('dateOfBirth', e.target.value)}
                />
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                  Used solely to derive your Western Sun sign. You can skip this to choose manually.
                </div>
              </div>

              {/* 3D Zodiac Sign Selection Grid */}
              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <label style={{ marginBottom: '12px' }}>Choose Your Astrological Sign</label>
                <div className="grid-3">
                  {ZODIAC_SIGNS.map((sign) => {
                    const isSelected = formData.selectedZodiacSign === sign.name;
                    const elColor = getElementColor(sign.element);
                    return (
                      <div
                        key={sign.name}
                        onClick={() => updateForm('selectedZodiacSign', sign.name)}
                        style={{
                          background: isSelected ? 'rgba(255, 215, 0, 0.18)' : 'rgba(24, 32, 78, 0.7)',
                          border: isSelected ? `2px solid var(--color-primary)` : `1px solid ${elColor}33`,
                          borderRadius: 'var(--radius-sm)',
                          padding: '14px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          cursor: 'pointer',
                          boxShadow: isSelected ? '0 0 24px rgba(255, 215, 0, 0.4), inset 0 0 14px rgba(255, 215, 0, 0.2)' : 'none',
                          transform: isSelected ? 'translateY(-3px) scale(1.02)' : 'translateY(0)',
                          transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        }}
                      >
                        <span style={{
                          fontSize: '2rem',
                          color: isSelected ? 'var(--color-primary)' : elColor,
                          filter: isSelected ? 'drop-shadow(0 0 10px #FFD700)' : 'none',
                        }}>
                          {sign.symbol}
                        </span>
                        <div>
                          <div style={{ fontWeight: 700, color: isSelected ? '#FFFFFF' : 'var(--color-text)', fontSize: '1.05rem' }}>
                            {sign.name}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: isSelected ? 'var(--color-primary-light)' : 'var(--color-text-muted)' }}>
                            {sign.dates}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sign Mismatch Notification */}
              {formData.mismatchWarning && (
                <div style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid var(--color-warning)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '18px',
                  marginBottom: 'var(--space-lg)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <AlertTriangle size={22} style={{ color: 'var(--color-warning)', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--color-warning)', marginBottom: '4px' }}>
                        Zodiac Alignment Notice
                      </div>
                      <div style={{ fontSize: '0.92rem', color: 'var(--color-text)', marginBottom: '12px' }}>
                        {formData.mismatchWarning}
                      </div>

                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ padding: '8px 16px', fontSize: '0.88rem' }}
                          onClick={() => updateForm('zodiacInputMode', 'manual_symbolic_choice')}
                        >
                          Keep {formData.selectedZodiacSign} (Symbolic Choice)
                        </button>
                        {formData.derivedSign && (
                          <button
                            type="button"
                            className="btn-primary"
                            style={{ padding: '8px 18px', fontSize: '0.88rem' }}
                            onClick={() => {
                              updateForm('selectedZodiacSign', formData.derivedSign);
                              updateForm('zodiacInputMode', 'derived_from_date');
                            }}
                          >
                            Switch to {formData.derivedSign} (Date-Derived)
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Birth Details (Optional) */}
          {currentStep === 2 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
                <div className="badge badge-cyan" style={{ marginBottom: '10px' }}>
                  ✦ Step 2: Birth Details
                </div>
                <h2>Optional Celestial Coordinates</h2>
                <p>These optional nuances enrich your story's setting. You may skip this entire step.</p>
              </div>

              {/* Time Known Toggle */}
              <div style={{
                background: 'rgba(24, 32, 78, 0.7)',
                padding: '18px 20px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                marginBottom: 'var(--space-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '1.02rem' }}>
                    Do you know your approximate birth time?
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                    Optional for deeper atmospheric diurnal lore.
                  </div>
                </div>
                <input
                  type="checkbox"
                  id="birthTimeKnown"
                  checked={formData.birthTimeKnown}
                  onChange={(e) => updateForm('birthTimeKnown', e.target.checked)}
                  style={{ width: '24px', height: '24px', accentColor: 'var(--color-primary)' }}
                />
              </div>

              {formData.birthTimeKnown && (
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <label htmlFor="birthTime">Approximate Birth Time</label>
                  <input
                    id="birthTime"
                    type="time"
                    value={formData.birthTime}
                    onChange={(e) => updateForm('birthTime', e.target.value)}
                  />
                </div>
              )}

              {/* Birthplace */}
              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <label htmlFor="birthplace">Birthplace City or Region (Optional)</label>
                <input
                  id="birthplace"
                  type="text"
                  placeholder="e.g. Alexandria, Kyoto, Florence, or Tatipaka"
                  value={formData.birthplace}
                  onChange={(e) => updateForm('birthplace', e.target.value)}
                  maxLength={100}
                />
                <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                  We do not store high-precision coordinates; this purely enriches your imagined setting.
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Soul Archetype & Lore Themes */}
          {currentStep === 3 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
                <div className="badge badge-violet" style={{ marginBottom: '10px' }}>
                  ✦ Step 3: Soul Archetype & Lore
                </div>
                <h2>Select Your Soul Archetype</h2>
                <p>Choose the guiding spirit and historical atmosphere of your past-life chronicle.</p>
              </div>

              {/* 3D Archetype Cards */}
              <div style={{ marginBottom: 'var(--space-xl)' }}>
                <label style={{ marginBottom: '12px' }}>Soul Archetype Preference</label>
                <div className="grid-2">
                  {ARCHETYPES.map((arch) => {
                    const isSelected = formData.archetypeId === arch.id;
                    return (
                      <div
                        key={arch.id}
                        onClick={() => updateForm('archetypeId', arch.id)}
                        style={{
                          background: isSelected ? 'rgba(139, 92, 246, 0.22)' : 'rgba(24, 32, 78, 0.7)',
                          border: isSelected ? '2px solid var(--color-accent-light)' : '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '16px',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          boxShadow: isSelected ? '0 0 24px rgba(139, 92, 246, 0.45)' : 'none',
                          transform: isSelected ? 'translateY(-2px)' : 'none',
                          transition: 'all 0.25s ease',
                        }}
                      >
                        <div style={{
                          fontWeight: 700,
                          fontSize: '1.1rem',
                          color: isSelected ? '#FFFFFF' : 'var(--color-text)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                          <span>{arch.name}</span>
                          {isSelected && <span style={{ color: 'var(--color-primary)' }}>✦</span>}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: isSelected ? 'var(--color-text)' : 'var(--color-text-muted)', lineHeight: '1.45' }}>
                          {arch.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Main Theme & Genre */}
              <div className="grid-2" style={{ marginBottom: 'var(--space-lg)' }}>
                <div>
                  <label htmlFor="mainTheme">Primary Soul Theme</label>
                  <select
                    id="mainTheme"
                    value={formData.mainTheme}
                    onChange={(e) => updateForm('mainTheme', e.target.value)}
                  >
                    {SOUL_THEMES.map((t) => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="storyGenre">Story Genre & Atmosphere</label>
                  <select
                    id="storyGenre"
                    value={formData.storyGenre}
                    onChange={(e) => updateForm('storyGenre', e.target.value)}
                  >
                    {STORY_GENRES.map((g) => (
                      <option key={g.id} value={g.id}>{g.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Historical Setting */}
              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <label htmlFor="historicalSetting">Historical Era Setting</label>
                <select
                  id="historicalSetting"
                  value={formData.historicalSetting}
                  onChange={(e) => updateForm('historicalSetting', e.target.value)}
                >
                  {HISTORICAL_SETTINGS.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* STEP 4: Portrait Preferences & Optional Photo */}
          {currentStep === 4 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
                <div className="badge badge-gold" style={{ marginBottom: '10px' }}>
                  ✦ Step 4: Portrait Styling
                </div>
                <h2>Cinematic 3D Character Portrait</h2>
                <p>Customize your portrait style. Optionally provide a reference photo to preserve your facial identity.</p>
              </div>

              {/* Reference Photo Toggle */}
              <div style={{
                background: 'rgba(24, 32, 78, 0.7)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '20px',
                marginBottom: 'var(--space-xl)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '1.05rem' }}>
                      Use personal photo as facial identity reference?
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      Preserves your recognizable facial structure, eyes, and skin tone in the historical setting.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    id="usePhoto"
                    checked={formData.usePhoto}
                    onChange={(e) => updateForm('usePhoto', e.target.checked)}
                    style={{ width: '24px', height: '24px', accentColor: 'var(--color-primary)' }}
                  />
                </div>

                {formData.usePhoto && (
                  <div style={{ marginTop: '16px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                    {!formData.photoPreviewUrl ? (
                      <div style={{
                        border: '2px dashed var(--color-border-glow)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '28px',
                        textAlign: 'center',
                        background: 'rgba(10, 15, 45, 0.6)',
                      }}>
                        <Upload size={36} style={{ color: 'var(--color-primary)', margin: '0 auto 10px' }} />
                        <div style={{ fontWeight: 600, color: '#FFFFFF', marginBottom: '4px' }}>
                          Upload a clear personal photograph
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                          JPEG, PNG, or WebP up to 5 MB. Front-facing with good lighting gives best resemblance.
                        </div>
                        <label className="btn-primary" style={{ padding: '10px 24px', cursor: 'pointer', display: 'inline-flex' }}>
                          Choose Photo
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handlePhotoSelect}
                            style={{ display: 'none' }}
                          />
                        </label>
                      </div>
                    ) : (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '18px',
                        background: 'rgba(10, 15, 45, 0.8)',
                        padding: '14px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid var(--color-primary)',
                      }}>
                        <img
                          src={formData.photoPreviewUrl}
                          alt="Reference preview"
                          style={{
                            width: '85px',
                            height: '85px',
                            objectFit: 'cover',
                            borderRadius: 'var(--radius-sm)',
                            border: '2px solid var(--color-primary)',
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.95rem' }}>
                            {formData.photoFile?.name || 'Reference Photo Attached'}
                          </div>
                          <div style={{ fontSize: '0.82rem', color: 'var(--color-success)', marginTop: '4px' }}>
                            ✦ Primed for facial identity preservation styling
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.82rem', color: 'var(--color-danger)' }}
                        >
                          <X size={15} /> Remove
                        </button>
                      </div>
                    )}

                    {/* Explicit Photo Consent Checkbox */}
                    <div style={{
                      marginTop: '18px',
                      background: 'rgba(139, 92, 246, 0.12)',
                      border: '1px solid var(--color-accent)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '16px',
                    }}>
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={formData.photoConsent}
                          onChange={(e) => updateForm('photoConsent', e.target.checked)}
                          style={{ width: '20px', height: '20px', marginTop: '3px', accentColor: 'var(--color-accent)' }}
                        />
                        <span style={{ fontSize: '0.88rem', color: '#FFFFFF', lineHeight: '1.5' }}>
                          <strong>Explicit Identity Preservation Consent: </strong>
                          I consent to the secure transmission of my photograph solely as a visual identity reference to preserve my recognizable face shape, skin tone, and features in the generated portrait. 
                          I understand that generative AI resemblance can vary between runs. My photo remains private and can be deleted at any time.
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Portrait Style & Framing */}
              <div className="grid-2" style={{ marginBottom: 'var(--space-lg)' }}>
                <div>
                  <label htmlFor="portraitStyle">Visual Art Style</label>
                  <select
                    id="portraitStyle"
                    value={formData.portraitStyle}
                    onChange={(e) => updateForm('portraitStyle', e.target.value)}
                  >
                    {PORTRAIT_STYLES.map((st) => (
                      <option key={st.id} value={st.id}>{st.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="portraitFraming">Composition Framing</label>
                  <select
                    id="portraitFraming"
                    value={formData.portraitFraming}
                    onChange={(e) => updateForm('portraitFraming', e.target.value)}
                  >
                    {PORTRAIT_FRAMINGS.map((fr) => (
                      <option key={fr.id} value={fr.id}>{fr.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Review & Manifest */}
          {currentStep === 5 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
                <div className="badge badge-gold" style={{ marginBottom: '10px' }}>
                  ✦ Step 5: Review & Manifest
                </div>
                <h2>Review Your Celestial Profile</h2>
                <p>Verify your details before the celestial reading is woven.</p>
              </div>

              {/* Summary Cards */}
              <div style={{
                background: 'rgba(24, 32, 78, 0.75)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '24px',
                marginBottom: 'var(--space-xl)',
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px' }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-primary)', textTransform: 'uppercase', fontWeight: 700 }}>Sign & Moniker</div>
                    <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '1.1rem' }}>
                      {formData.selectedZodiacSign}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      {formData.preferredName ? `Name: ${formData.preferredName}` : 'Anonymous Soul'}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-primary)', textTransform: 'uppercase', fontWeight: 700 }}>Soul Archetype</div>
                    <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '1.1rem' }}>
                      {ARCHETYPES.find((a) => a.id === formData.archetypeId)?.name || 'Auto-Select by Stars'}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      Theme: {formData.mainTheme}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-primary)', textTransform: 'uppercase', fontWeight: 700 }}>Setting & Era</div>
                    <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '1.1rem' }}>
                      {HISTORICAL_SETTINGS.find((s) => s.id === formData.historicalSetting)?.label || 'System Chosen'}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      Genre: {formData.storyGenre}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--color-primary)', textTransform: 'uppercase', fontWeight: 700 }}>Reference Photo</div>
                    <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '1.1rem' }}>
                      {formData.usePhoto && formData.photoFile ? '✦ Reference Attached' : 'None (Symbolic Art)'}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                      Framing: {formData.portraitFraming}
                    </div>
                  </div>
                </div>
              </div>

              {/* Consents */}
              <div style={{
                background: 'rgba(10, 15, 45, 0.8)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                padding: '22px',
                marginBottom: 'var(--space-xl)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.consentEntertainment}
                    onChange={(e) => updateForm('consentEntertainment', e.target.checked)}
                    style={{ width: '22px', height: '22px', marginTop: '2px', accentColor: 'var(--color-primary)' }}
                  />
                  <span style={{ fontSize: '0.92rem', color: '#FFFFFF', lineHeight: '1.5' }}>
                    <strong>Fictional Entertainment Acknowledgment: </strong>
                    I acknowledge that this reading, character narrative, and portrait are works of creative fiction inspired by zodiac symbolism. 
                    I understand this does not claim to prove reincarnation, diagnose real-world health, or represent factual history.
                  </span>
                </label>

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.consentProcessing}
                    onChange={(e) => updateForm('consentProcessing', e.target.checked)}
                    style={{ width: '22px', height: '22px', marginTop: '2px', accentColor: 'var(--color-primary)' }}
                  />
                  <span style={{ fontSize: '0.92rem', color: '#FFFFFF', lineHeight: '1.5' }}>
                    <strong>Data Processing Consent: </strong>
                    I consent to processing my submitted profile and preferences to generate my personalized story and portrait artifact.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {formError && (
            <div style={{
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid var(--color-danger)',
              borderRadius: 'var(--radius-sm)',
              padding: '14px 18px',
              marginBottom: 'var(--space-lg)',
              color: '#fecdd3',
              fontSize: '0.92rem',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <AlertTriangle size={20} style={{ color: 'var(--color-danger)', flexShrink: 0 }} />
              <div>{formError}</div>
            </div>
          )}

          {/* Controls */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 'var(--space-xl)',
            borderTop: '1px solid var(--color-border)',
            paddingTop: 'var(--space-lg)',
          }}>
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="btn-secondary"
                disabled={isSubmitting}
              >
                <ArrowLeft size={16} /> Back
              </button>
            ) : <div />}

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="btn-primary"
              >
                Continue <ArrowRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="btn-primary"
                disabled={isSubmitting || !formData.consentEntertainment || !formData.consentProcessing}
                style={{ padding: '16px 40px', fontSize: '1.1rem' }}
              >
                {isSubmitting ? 'Weaving Your Story...' : (
                  <>
                    <Sparkles size={20} />
                    Manifest My Reading
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
