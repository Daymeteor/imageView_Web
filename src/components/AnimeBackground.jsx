import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * AnimeBackground — 漫影剧场背景
 * - 渐变夜空 + 巨大月亮
 * - 樱花花瓣飘落（Canvas）
 * - 霓虹光晕呼吸
 * - 漫画网点纸/速度线纹理
 * - 漂浮光点
 */
export default function AnimeBackground() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // 樱花飘落 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, petals = [];

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      petals = Array.from({ length: 60 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 6 + 3,
        speedY: Math.random() * 0.8 + 0.3,
        speedX: Math.random() * 0.6 - 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
        opacity: Math.random() * 0.5 + 0.3,
        color: Math.random() > 0.7 ? '255, 200, 220' : '255, 180, 200',
      }));
    };
    resize();
    window.addEventListener('resize', resize);

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      petals.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(p.y * 0.01) * 0.2;
        p.rotation += p.rotationSpeed;

        if (p.y > h + 20) {
          p.y = -20;
          p.x = Math.random() * w;
        }
        if (p.x > w + 20) p.x = -20;
        if (p.x < -20) p.x = w + 20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = `rgb(${p.color})`;
        // 樱花花瓣形状
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.6, p.size, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  // 光晕呼吸 + 光点漂浮
  useGSAP(() => {
    gsap.to('.abg-glow--moon', {
      opacity: 0.9, scale: 1.05, duration: 5, ease: 'sine.inOut',
      yoyo: true, repeat: -1,
    });
    gsap.to('.abg-glow--pink', {
      opacity: 0.7, scale: 1.1, duration: 7, ease: 'sine.inOut',
      yoyo: true, repeat: -1, delay: 1,
    });
    gsap.to('.abg-glow--cyan', {
      opacity: 0.5, scale: 1.08, duration: 6, ease: 'sine.inOut',
      yoyo: true, repeat: -1, delay: 2,
    });

    const particles = gsap.utils.toArray('.abg-particle');
    particles.forEach((p, i) => {
      gsap.to(p, {
        opacity: gsap.utils.random(0.2, 0.7),
        y: gsap.utils.random(-20, 20),
        x: gsap.utils.random(-15, 15),
        duration: gsap.utils.random(2, 4),
        ease: 'sine.inOut',
        yoyo: true, repeat: -1,
        delay: gsap.utils.random(0, 2),
      });
    });
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 overflow-hidden bg-[#0a0912] pointer-events-none"
      style={{
        background: 'radial-gradient(ellipse at 20% 10%, #1a0a2e 0%, #0d0a1a 40%, #06040c 100%)',
      }}
    >
      {/* 巨大月亮 */}
      <div
        className="abg-glow--moon absolute rounded-full"
        style={{
          top: '8%',
          right: '12%',
          width: 'min(28vw, 320px)',
          height: 'min(28vw, 320px)',
          background: 'radial-gradient(circle at 35% 35%, #fff8e7 0%, #ffe4c4 25%, #ffb6c1 60%, transparent 70%)',
          boxShadow: '0 0 80px rgba(255, 200, 220, 0.25), 0 0 160px rgba(255, 180, 200, 0.12), inset -20px -20px 40px rgba(255, 150, 180, 0.15)',
          opacity: 0.75,
        }}
      />

      {/* 粉色霓虹光晕 */}
      <div
        className="abg-glow--pink absolute rounded-full blur-[120px]"
        style={{
          bottom: '-10%',
          left: '-5%',
          width: '55vw',
          height: '55vw',
          background: 'radial-gradient(circle, rgba(255, 107, 157, 0.22) 0%, transparent 60%)',
          opacity: 0.5,
        }}
      />

      {/* 青色霓虹光晕 */}
      <div
        className="abg-glow--cyan absolute rounded-full blur-[120px]"
        style={{
          top: '30%',
          right: '-10%',
          width: '45vw',
          height: '45vw',
          background: 'radial-gradient(circle, rgba(0, 212, 255, 0.14) 0%, transparent 60%)',
          opacity: 0.4,
        }}
      />

      {/* 网点纸纹理 */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '8px 8px',
        }}
      />

      {/* 速度线纹理（底部） */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[40vh] opacity-[0.04]"
        style={{
          background: 'repeating-conic-gradient(from 0deg at 50% 100%, transparent 0deg 2deg, rgba(255,255,255,0.5) 2deg 3deg)',
        }}
      />

      {/* 樱花 Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* 漂浮光点 */}
      {Array.from({ length: 16 }, (_, i) => (
        <div
          key={`p-${i}`}
          className="abg-particle absolute rounded-full pointer-events-none"
          style={{
            left: `${8 + (i * 11) % 84}%`,
            top: `${10 + (i * 17) % 80}%`,
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
            background: i % 2 === 0 ? 'rgba(255, 107, 157, 0.7)' : 'rgba(0, 212, 255, 0.7)',
            boxShadow: `0 0 ${4 + (i % 4)}px ${i % 2 === 0 ? 'rgba(255, 107, 157, 0.8)' : 'rgba(0, 212, 255, 0.8)'}`,
          }}
        />
      ))}

      {/* 城市剪影 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[18vh] opacity-40"
        style={{
          background: `linear-gradient(to top, rgba(10, 9, 18, 0.9), transparent),
                       repeating-linear-gradient(90deg, transparent 0px, transparent 40px, rgba(255, 107, 157, 0.08) 40px, rgba(255, 107, 157, 0.08) 42px, transparent 42px, transparent 80px)`,
          maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
        }}
      />
    </div>
  );
}
