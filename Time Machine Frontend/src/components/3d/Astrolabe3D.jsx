import React from 'react';

/**
 * 3D Gyroscopic Astrolabe with concentric rotating astronomical rings
 */
export function Astrolabe3D({ size = 320 }) {
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        position: 'relative',
        perspective: '1200px',
        transformStyle: 'preserve-3d',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
      }}
    >
      {/* Outer Ecliptic Zodiac Ring (Clockwise 3D Rotation) */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          border: '2px solid rgba(255, 215, 0, 0.7)',
          boxShadow: '0 0 25px rgba(255, 215, 0, 0.4), inset 0 0 20px rgba(255, 215, 0, 0.25)',
          transformStyle: 'preserve-3d',
          animation: 'rotateOuterRing 30s linear infinite',
        }}
      >
        {/* Orbital Marker Nodes on Outer Ring */}
        <div style={{ position: 'absolute', top: '-6px', left: '50%', width: '12px', height: '12px', borderRadius: '50%', background: '#FFD700', boxShadow: '0 0 15px #FFD700' }} />
        <div style={{ position: 'absolute', bottom: '-6px', left: '50%', width: '12px', height: '12px', borderRadius: '50%', background: '#06B6D4', boxShadow: '0 0 15px #06B6D4' }} />
        <div style={{ position: 'absolute', top: '50%', left: '-6px', width: '10px', height: '10px', borderRadius: '50%', background: '#8B5CF6', boxShadow: '0 0 15px #8B5CF6' }} />
        <div style={{ position: 'absolute', top: '50%', right: '-6px', width: '10px', height: '10px', borderRadius: '50%', background: '#FF5733', boxShadow: '0 0 15px #FF5733' }} />
      </div>

      {/* Middle Meridian Ring (Tilted 3D Counter-Clockwise Gyro) */}
      <div
        style={{
          position: 'absolute',
          width: '82%',
          height: '82%',
          borderRadius: '50%',
          border: '2px dashed rgba(139, 92, 246, 0.8)',
          boxShadow: '0 0 25px rgba(139, 92, 246, 0.45)',
          transformStyle: 'preserve-3d',
          animation: 'rotateMiddleRing 18s linear infinite',
        }}
      >
        <div style={{ position: 'absolute', top: '-5px', left: '50%', width: '10px', height: '10px', borderRadius: '50%', background: '#A78BFA', boxShadow: '0 0 12px #A78BFA' }} />
      </div>

      {/* Inner Armillary Celestial Ring (Fast 3D Pitch/Yaw Rotation) */}
      <div
        style={{
          position: 'absolute',
          width: '64%',
          height: '64%',
          borderRadius: '50%',
          border: '2px solid rgba(6, 182, 212, 0.75)',
          boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)',
          transformStyle: 'preserve-3d',
          animation: 'rotateInnerRing 12s linear infinite',
        }}
      />

      {/* Central Pulsing Solar Core */}
      <div
        style={{
          width: `${size * 0.28}px`,
          height: `${size * 0.28}px`,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #FFFFFF 0%, #FFD700 45%, #F59E0B 80%, rgba(139, 92, 246, 0.2) 100%)',
          boxShadow: '0 0 45px rgba(255, 215, 0, 0.8), 0 0 90px rgba(245, 158, 11, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#070914',
          fontSize: `${size * 0.12}px`,
          fontWeight: 900,
          animation: 'corePulse 3s ease-in-out infinite',
          zIndex: 5,
        }}
      >
        ✦
      </div>

      <style>{`
        @keyframes rotateOuterRing {
          0% { transform: rotateX(65deg) rotateZ(0deg); }
          100% { transform: rotateX(65deg) rotateZ(360deg); }
        }
        @keyframes rotateMiddleRing {
          0% { transform: rotateY(65deg) rotateZ(360deg); }
          100% { transform: rotateY(65deg) rotateZ(0deg); }
        }
        @keyframes rotateInnerRing {
          0% { transform: rotateX(35deg) rotateY(45deg) rotateZ(0deg); }
          100% { transform: rotateX(35deg) rotateY(45deg) rotateZ(360deg); }
        }
        @keyframes corePulse {
          0%, 100% { transform: scale(0.95); filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.6)); }
          50% { transform: scale(1.08); filter: drop-shadow(0 0 40px rgba(255, 215, 0, 0.95)); }
        }
      `}</style>
    </div>
  );
}
