import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * CyberBackground — 赛博博物馆背景（GSAP 驱动）
 * - 琥珀光晕呼吸（sine 缓动，交错相位）
 * - 扫描线变速脉冲
 * - Dither 纹理微闪烁
 * - 数字粒子光点
 */
export default function CyberBackground() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // 光晕呼吸 — 各层不同相位
    gsap.to('.cbg-glow--tl', {
      opacity: 0.28, scale: 1.08, duration: 6, ease: 'sine.inOut',
      yoyo: true, repeat: -1, repeatDelay: 0,
    });
    gsap.to('.cbg-glow--br', {
      opacity: 0.22, scale: 1.05, duration: 8, ease: 'sine.inOut',
      yoyo: true, repeat: -1, delay: 2,
    });
    gsap.to('.cbg-glow--ctr', {
      opacity: 0.12, scale: 1.12, duration: 10, ease: 'sine.inOut',
      yoyo: true, repeat: -1, delay: 5,
    });

    // 扫描线 — 变速 + 透明度脉冲
    const scanTl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });
    scanTl.fromTo('.cbg-scan', { yPercent: -100, opacity: 0.2 }, { yPercent: 100, opacity: 0.7, duration: 4, ease: 'power2.inOut' })
      .to('.cbg-scan', { opacity: 0, duration: 0.4, ease: 'power2.in' })
      .to('.cbg-scan', { yPercent: -100, duration: 0, ease: 'none' });

    // Dither 纹理微闪
    gsap.to('.cbg-dither', {
      opacity: 0.04, duration: 3, ease: 'steps(5)',
      yoyo: true, repeat: -1,
    });

    // 数字粒子光点
    const particles = gsap.utils.toArray('.cbg-particle');
    particles.forEach((p, i) => {
      gsap.to(p, {
        opacity: gsap.utils.random(0.1, 0.5),
        y: gsap.utils.random(-30, 30),
        x: gsap.utils.random(-20, 20),
        duration: gsap.utils.random(2, 5),
        ease: 'sine.inOut',
        yoyo: true, repeat: -1,
        delay: gsap.utils.random(0, 3),
      });
    });
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 overflow-hidden bg-[var(--color-bg-deep)] pointer-events-none"
    >
      {/* 环境光晕 */}
      <div
        className="cbg-glow cbg-glow--tl absolute rounded-full opacity-[0.18] blur-[120px]"
        style={{
          top: '-10%',
          left: '-5%',
          width: '60vw',
          height: '60vw',
          background: 'radial-gradient(circle, rgba(255, 172, 2, 0.25) 0%, transparent 60%)',
        }}
      />
      <div
        className="cbg-glow cbg-glow--br absolute rounded-full opacity-[0.18] blur-[120px]"
        style={{
          bottom: '-15%',
          right: '-10%',
          width: '50vw',
          height: '50vw',
          background: 'radial-gradient(circle, rgba(255, 172, 2, 0.12) 0%, transparent 55%)',
        }}
      />
      <div
        className="cbg-glow cbg-glow--ctr absolute rounded-full opacity-[0.06] blur-[120px]"
        style={{
          top: '40%',
          left: '30%',
          width: '40vw',
          height: '40vw',
          background: 'radial-gradient(circle, rgba(0, 229, 255, 0.05) 0%, transparent 50%)',
        }}
      />

      {/* Dither 纹理 */}
      <div
        className="cbg-dither absolute inset-0 opacity-[0.025] mix-blend-overlay"
        style={{
          background: 'repeating-conic-gradient(var(--color-text-primary, #fff) 0% 25%, transparent 0% 50%) 0 0 / 2px 2px',
        }}
      />

      {/* 扫描线 */}
      <div
        className="cbg-scan absolute left-0 right-0 top-0 h-0.5"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255, 172, 2, 0.2) 30%, rgba(255, 172, 2, 0.45) 50%, rgba(255, 172, 2, 0.2) 70%, transparent 100%)',
        }}
      />

      {/* 数字粒子 — 散布的琥珀光点 */}
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={`p-${i}`}
          className="cbg-particle absolute rounded-full pointer-events-none"
          style={{
            left: `${10 + (i * 7.3) % 85}%`,
            top: `${5 + (i * 11.7) % 90}%`,
            width: `${1.5 + (i % 3) * 1.5}px`,
            height: `${1.5 + (i % 3) * 1.5}px`,
            background: `rgba(255,172,2,${0.3 + (i % 4) * 0.1})`,
            boxShadow: `0 0 ${3 + (i % 3) * 2}px rgba(255,172,2,0.5)`,
          }}
        />
      ))}
    </div>
  );
}
