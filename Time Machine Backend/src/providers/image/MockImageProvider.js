import { ImageProvider } from './ImageProvider.js';
import { StorageService } from '../../services/storage.service.js';
import { getZodiacSignByName } from '../../constants/zodiac.js';

export class MockImageProvider extends ImageProvider {
  async generatePortrait(characterProfile, preferences, referenceAssetId = null) {
    console.log(`[MockImageProvider] Generating celestial portrait for: ${characterProfile.characterName} (Archetype: ${characterProfile.archetypeName})`);

    const name = characterProfile.characterName || 'Soul of the Stars';
    const archetype = characterProfile.archetypeName || 'The Sage';
    const era = characterProfile.eraName || 'Ancient Realm';
    const hasPhoto = Boolean(referenceAssetId);

    // Build SVG artwork using Celestial Royalty design tokens
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
  <defs>
    <!-- Background Gradient -->
    <radialGradient id="spaceGrad" cx="50%" cy="40%" r="70%" fx="50%" fy="30%">
      <stop offset="0%" stop-color="#222945" />
      <stop offset="45%" stop-color="#191F3A" />
      <stop offset="85%" stop-color="#0B1026" />
      <stop offset="100%" stop-color="#070A18" />
    </radialGradient>

    <!-- Mystical Violet Glow -->
    <radialGradient id="mysticGlow" cx="50%" cy="45%" r="50%">
      <stop offset="0%" stop-color="#7662B8" stop-opacity="0.38" />
      <stop offset="60%" stop-color="#7662B8" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#7662B8" stop-opacity="0" />
    </radialGradient>

    <!-- Gold Accent Gradients -->
    <linearGradient id="goldFiligree" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F4EFE4" />
      <stop offset="35%" stop-color="#D4AF65" />
      <stop offset="70%" stop-color="#B38D40" />
      <stop offset="100%" stop-color="#E5B86A" />
    </linearGradient>

    <linearGradient id="armorSheen" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#343B5A" />
      <stop offset="50%" stop-color="#191F3A" />
      <stop offset="100%" stop-color="#0B1026" />
    </linearGradient>

    <!-- Filter for soft celestial glow -->
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="800" height="1000" fill="url(#spaceGrad)" />

  <!-- Mystic Violet Core Atmosphere -->
  <circle cx="400" cy="450" r="380" fill="url(#mysticGlow)" />

  <!-- Outer Celestial Border -->
  <rect x="25" y="25" width="750" height="950" rx="16" fill="none" stroke="url(#goldFiligree)" stroke-width="2" opacity="0.6" />
  <rect x="35" y="35" width="730" height="930" rx="12" fill="none" stroke="#343B5A" stroke-width="1" />

  <!-- Corner Celestial Flourishes -->
  <g stroke="url(#goldFiligree)" stroke-width="1.5" fill="none" opacity="0.8">
    <path d="M 25 75 C 55 75 75 55 75 25" />
    <circle cx="75" cy="75" r="3" fill="#D4AF65" />
    <path d="M 775 75 C 745 75 725 55 725 25" />
    <circle cx="725" cy="75" r="3" fill="#D4AF65" />
    <path d="M 25 925 C 55 925 75 945 75 975" />
    <circle cx="75" cy="925" r="3" fill="#D4AF65" />
    <path d="M 775 925 C 745 925 725 945 725 975" />
    <circle cx="725" cy="925" r="3" fill="#D4AF65" />
  </g>

  <!-- Constellation Field (Stars) -->
  <g fill="#F4EFE4">
    <circle cx="120" cy="180" r="1.5" opacity="0.8" />
    <circle cx="160" cy="220" r="2.2" opacity="0.9" />
    <circle cx="210" cy="150" r="1.2" opacity="0.6" />
    <circle cx="680" cy="190" r="1.8" opacity="0.85" />
    <circle cx="620" cy="250" r="2.5" opacity="0.9" />
    <circle cx="650" cy="310" r="1.5" opacity="0.7" />
    <circle cx="140" cy="780" r="1.8" opacity="0.75" />
    <circle cx="220" cy="840" r="2.2" opacity="0.8" />
    <circle cx="680" cy="790" r="1.5" opacity="0.7" />
    <circle cx="600" cy="850" r="2.0" opacity="0.85" />
    <circle cx="400" cy="110" r="2.8" opacity="0.95" />
  </g>

  <!-- Astrological / Sacred Geometry Rings -->
  <g stroke="url(#goldFiligree)" fill="none" opacity="0.35">
    <circle cx="400" cy="450" r="280" stroke-width="1.5" stroke-dasharray="6,4" />
    <circle cx="400" cy="450" r="260" stroke-width="1" />
    <circle cx="400" cy="450" r="220" stroke-width="0.75" />
  </g>

  <!-- Central Celestial Crest / Character Aura -->
  <g id="characterAura" filter="url(#softGlow)">
    <!-- Halo -->
    <circle cx="400" cy="430" r="170" fill="none" stroke="url(#goldFiligree)" stroke-width="3" opacity="0.75" />
    <!-- Ray Starburst -->
    <g stroke="url(#goldFiligree)" stroke-width="1.5" opacity="0.6">
      <line x1="400" y1="240" x2="400" y2="220" />
      <line x1="400" y1="620" x2="400" y2="640" />
      <line x1="210" y1="430" x2="190" y2="430" />
      <line x1="590" y1="430" x2="610" y2="430" />
      <line x1="266" y1="296" x2="252" y2="282" />
      <line x1="534" y1="564" x2="548" y2="578" />
      <line x1="266" y1="564" x2="252" y2="578" />
      <line x1="534" y1="296" x2="548" y2="282" />
    </g>
  </g>

  <!-- Stylized Mystical Character Silhouette & Robes -->
  <g id="characterPortrait">
    <!-- Cloak / Mantle -->
    <path d="M 230 750 C 250 560, 310 470, 400 470 C 490 470, 550 560, 570 750 C 580 810, 220 810, 230 750 Z" 
          fill="url(#armorSheen)" stroke="#343B5A" stroke-width="2" />
    
    <!-- Robe Embroidered Trim -->
    <path d="M 360 520 L 400 680 L 440 520" fill="none" stroke="url(#goldFiligree)" stroke-width="3" />
    <path d="M 310 750 C 350 690, 450 690, 490 750" fill="none" stroke="url(#goldFiligree)" stroke-width="2" opacity="0.8" />

    <!-- Head / Facial Contour Placeholder -->
    <ellipse cx="400" cy="410" rx="68" ry="85" fill="#222945" stroke="url(#goldFiligree)" stroke-width="2" />
    
    <!-- Serene Eyes & Brow lines (Stylized Classical Art) -->
    <path d="M 370 405 Q 380 400 390 405" stroke="#D4AF65" stroke-width="2" fill="none" stroke-linecap="round" />
    <path d="M 410 405 Q 420 400 430 405" stroke="#D4AF65" stroke-width="2" fill="none" stroke-linecap="round" />
    <circle cx="380" cy="412" r="3" fill="#D4AF65" />
    <circle cx="420" cy="412" r="3" fill="#D4AF65" />
    <path d="M 400 414 L 398 428 L 402 428" stroke="#D4AF65" stroke-width="1.5" fill="none" stroke-linecap="round" />
    <path d="M 390 445 Q 400 450 410 445" stroke="#D4AF65" stroke-width="2" fill="none" stroke-linecap="round" />

    <!-- Circlet of Stars -->
    <path d="M 335 375 Q 400 350 465 375" fill="none" stroke="url(#goldFiligree)" stroke-width="3.5" />
    <circle cx="400" cy="358" r="6" fill="#D4AF65" />
    <polygon points="400,346 403,354 411,354 405,359 407,367 400,362 393,367 395,359 389,354 397,354" fill="#F4EFE4" />
  </g>

  <!-- Lower Title Banner Ribbon -->
  <g id="titleBanner">
    <path d="M 120 830 L 680 830 L 660 885 L 140 885 Z" fill="#191F3A" stroke="url(#goldFiligree)" stroke-width="2" />
    <text x="400" y="865" text-anchor="middle" font-family="Georgia, serif" font-size="22" font-weight="bold" fill="#F4EFE4" letter-spacing="3">
      ${name.toUpperCase()}
    </text>

    <!-- Subtitle / Archetype & Era -->
    <text x="400" y="915" text-anchor="middle" font-family="system-ui, sans-serif" font-size="14" fill="#B8BBD0" letter-spacing="2">
      ${archetype.toUpperCase()} • ${era.toUpperCase()}
    </text>

    ${
      hasPhoto
        ? `<text x="400" y="945" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" fill="#78B89A" letter-spacing="1">
            ✦ FACIAL REFERENCE SYNTHESIZED ✦
          </text>`
        : ''
    }
  </g>
</svg>`;

    const saved = await StorageService.saveGeneratedPortrait(svg, '.svg', 'image/svg+xml');
    return saved;
  }
}
