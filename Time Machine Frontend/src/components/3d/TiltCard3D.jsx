import React, { useRef, useState } from 'react';

/**
 * High-craft 3D Tilt Card with dynamic cursor glare reflection and spring-like physics
 */
export function TiltCard3D({
  children,
  className = '',
  style = {},
  intensity = 15,
  glowColor = 'rgba(255, 215, 0, 0.25)',
  onClick,
}) {
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -intensity;
    const rotateY = ((x - centerX) / centerX) * intensity;

    setRotation({ x: rotateX, y: rotateY });
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.65,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        ref={cardRef}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={className}
        style={{
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) ${isHovered ? 'scale3d(1.025, 1.025, 1.025) translateZ(12px)' : 'scale3d(1, 1, 1) translateZ(0)'}`,
          transition: isHovered
            ? 'transform 0.1s ease-out, box-shadow 0.25s ease'
            : 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.55s ease',
          boxShadow: isHovered
            ? `0 24px 50px -10px rgba(0, 0, 0, 0.8), 0 0 35px ${glowColor}`
            : '0 12px 30px -10px rgba(0, 0, 0, 0.6)',
          cursor: onClick ? 'pointer' : 'default',
          overflow: 'hidden',
          ...style,
        }}
      >
        {/* Dynamic Holographic Specular Glare */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `radial-gradient(circle 320px at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.22) 0%, rgba(255, 215, 0, 0.12) 40%, transparent 80%)`,
            opacity: glare.opacity,
            transition: 'opacity 0.3s ease',
            zIndex: 10,
          }}
        />

        {/* Content with Depth Preservation */}
        <div style={{ transform: 'translateZ(15px)', position: 'relative', zIndex: 2 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
