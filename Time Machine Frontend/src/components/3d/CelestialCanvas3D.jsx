import React, { useEffect, useRef } from 'react';

export function CelestialCanvas3D() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse interactive target & dampening
    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    const handleMouseMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);

    // Generate 3D Star Sphere / Depth Particles
    const STAR_COUNT = 320;
    const stars = [];
    const colors = ['#FFFFFF', '#FFE873', '#A78BFA', '#38BDF8', '#FFD700'];

    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * 1000 + 1, // Depth
        size: Math.random() * 1.8 + 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
        twinkleSpeed: Math.random() * 0.04 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }

    // Shooting Stars
    const shootingStars = [];
    const createShootingStar = () => {
      if (shootingStars.length < 2 && Math.random() < 0.015) {
        shootingStars.push({
          x: Math.random() * width * 1.2,
          y: Math.random() * height * 0.4,
          length: Math.random() * 80 + 50,
          speed: Math.random() * 14 + 10,
          angle: (Math.PI / 4) + (Math.random() - 0.5) * 0.2, // ~45 deg
          opacity: 1,
          color: Math.random() > 0.5 ? '#FFD700' : '#38BDF8',
        });
      }
    };

    // Render loop
    const render = () => {
      // Ease mouse
      mouse.x += (mouse.targetX - mouse.x) * 0.035;
      mouse.y += (mouse.targetY - mouse.y) * 0.035;

      const offsetX = (mouse.x - width / 2) * 0.12;
      const offsetY = (mouse.y - height / 2) * 0.12;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Subtle Multi-Color Cosmic Nebulae
      const grad1 = ctx.createRadialGradient(
        width * 0.25 + offsetX * 0.3,
        height * 0.3 + offsetY * 0.3,
        50,
        width * 0.25,
        height * 0.3,
        width * 0.55
      );
      grad1.addColorStop(0, 'rgba(139, 92, 246, 0.12)');
      grad1.addColorStop(0.6, 'rgba(99, 102, 241, 0.04)');
      grad1.addColorStop(1, 'transparent');
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, width, height);

      const grad2 = ctx.createRadialGradient(
        width * 0.8 - offsetX * 0.4,
        height * 0.65 - offsetY * 0.4,
        40,
        width * 0.8,
        height * 0.65,
        width * 0.5
      );
      grad2.addColorStop(0, 'rgba(6, 182, 212, 0.1)');
      grad2.addColorStop(0.5, 'rgba(255, 215, 0, 0.03)');
      grad2.addColorStop(1, 'transparent');
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, width, height);

      // 2. Draw 3D Stars with Perspective Projection
      const fov = 450;
      const cx = width / 2;
      const cy = height / 2;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Move star forward slowly along Z
        star.z -= 0.65;
        if (star.z <= 0) {
          star.z = 1000;
          star.x = (Math.random() - 0.5) * width * 2;
          star.y = (Math.random() - 0.5) * height * 2;
        }

        // Project 3D (x, y, z) into 2D screen coordinates
        const scale = fov / star.z;
        const px = cx + (star.x + offsetX * 0.7) * scale;
        const py = cy + (star.y + offsetY * 0.7) * scale;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          star.twinklePhase += star.twinkleSpeed;
          const alpha = Math.min(1, Math.max(0.15, (1 - star.z / 1000) * (0.6 + 0.4 * Math.sin(star.twinklePhase))));

          ctx.beginPath();
          ctx.arc(px, py, star.size * scale * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.globalAlpha = alpha;
          ctx.fill();

          // Soft stellar halo on larger close stars
          if (scale > 1.2 && star.size > 1.4) {
            ctx.beginPath();
            ctx.arc(px, py, star.size * scale * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = star.color;
            ctx.globalAlpha = alpha * 0.25;
            ctx.fill();
          }
        }
      }
      ctx.globalAlpha = 1;

      // 3. Draw Shooting Stars
      createShootingStar();
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.opacity -= 0.018;

        if (s.opacity <= 0 || s.x > width || s.y > height) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = s.x - Math.cos(s.angle) * s.length;
        const tailY = s.y - Math.sin(s.angle) * s.length;

        const lineGrad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
        lineGrad.addColorStop(0, s.color);
        lineGrad.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = 2;
        ctx.globalAlpha = s.opacity;
        ctx.stroke();

        // Glowing star head
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
