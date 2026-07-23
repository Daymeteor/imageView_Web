import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * CyberBackground — 夜之城美术馆（GSAP 驱动）
 * 运镜语言向《疾速追杀》学习：缓慢、有重量、偶发的精确。
 * - 三束博物馆射灯（铜琥珀，长周期呼吸）
 * - 右侧品红窗光（夜之城的霓虹只闻其声）
 * - 全息青微尘缓缓上浮
 * - 每 14s 一次车灯光扫过（窗外街道）
 * - 扫描线放慢到 12s，近乎静默
 */
export default function CyberBackground() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // 射灯呼吸 — 错相位，缓慢到近乎察觉不到
    gsap.to('.cbg-spot--1', {
      opacity: 0.16, duration: 7, ease: 'sine.inOut', yoyo: true, repeat: -1,
    });
    gsap.to('.cbg-spot--2', {
      opacity: 0.12, duration: 9, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 2.5,
    });
    gsap.to('.cbg-spot--3', {
      opacity: 0.1, duration: 11, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 5,
    });

    // 品红窗光 — 夜之城在窗外呼吸
    gsap.to('.cbg-neon', {
      opacity: 0.09, duration: 8, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1,
    });

    // 车灯扫过 — 每 14s 一次，一道宽软的暖光从左到右
    const sweepTl = gsap.timeline({ repeat: -1, repeatDelay: 11 });
    sweepTl
      .set('.cbg-sweep', { xPercent: -120, opacity: 0 })
      .to('.cbg-sweep', { opacity: 0.5, duration: 0.8, ease: 'power2.in' })
      .to('.cbg-sweep', { xPercent: 120, duration: 2.2, ease: 'power1.inOut' }, '<')
      .to('.cbg-sweep', { opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.8');

    // 扫描线 — 近乎静默的档案检索
    const scanTl = gsap.timeline({ repeat: -1, repeatDelay: 7 });
    scanTl
      .fromTo('.cbg-scan', { yPercent: -100, opacity: 0 }, { yPercent: 100, opacity: 0.35, duration: 5, ease: 'power2.inOut' })
      .to('.cbg-scan', { opacity: 0, duration: 0.6, ease: 'power2.in' })
      .set('.cbg-scan', { yPercent: -100 });

    // 全息微尘 — 缓缓上浮
    const dust = gsap.utils.toArray('.cbg-dust');
    dust.forEach((p) => {
      gsap.to(p, {
        y: gsap.utils.random(-46, -20),
        opacity: gsap.utils.random(0.15, 0.55),
        duration: gsap.utils.random(4, 8),
        ease: 'sine.inOut',
        yoyo: true, repeat: -1,
        delay: gsap.utils.random(0, 4),
      });
    });
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[var(--color-bg-deep)]"
    >
      {/* 博物馆射灯 — 三束窄光锥从顶部落下 */}
      {[
        { left: '12%', width: '20vw', cls: 'cbg-spot--1' },
        { left: '42%', width: '16vw', cls: 'cbg-spot--2' },
        { left: '70%', width: '22vw', cls: 'cbg-spot--3' },
      ].map((s) => (
        <div
          key={s.cls}
          className={`cbg-spot ${s.cls} absolute top-0 h-[70vh] opacity-[0.1]`}
          style={{
            left: s.left,
            width: s.width,
            background:
              'linear-gradient(180deg, rgba(232,163,61,0.10) 0%, rgba(232,163,61,0.03) 55%, transparent 100%)',
            clipPath: 'polygon(38% 0, 62% 0, 100% 100%, 0% 100%)',
          }}
        />
      ))}

      {/* 品红窗光 — 右侧远处夜之城的霓虹 */}
      <div
        className="cbg-neon absolute right-[-8%] top-[15%] h-[70vh] w-[30vw] opacity-[0.06]"
        style={{
          background:
            'radial-gradient(ellipse, rgba(255,42,109,0.35) 0%, transparent 60%)',
          filter: 'blur(60px)',
        }}
      />

      {/* 窗玻璃雨痕 — 夜之城在下雨，雨只在"窗"的这一侧 */}
      <div className="absolute inset-y-0 right-0 w-[26vw] overflow-hidden">
        {[
          { left: '8%', h: 70, d: '1.9s', delay: '0s', c: '89,194,216' },
          { left: '18%', h: 100, d: '1.4s', delay: '0.5s', c: '255,42,109' },
          { left: '27%', h: 60, d: '2.3s', delay: '1.1s', c: '89,194,216' },
          { left: '36%', h: 90, d: '1.6s', delay: '0.2s', c: '89,194,216' },
          { left: '46%', h: 75, d: '2.0s', delay: '0.8s', c: '255,42,109' },
          { left: '55%', h: 110, d: '1.3s', delay: '1.5s', c: '89,194,216' },
          { left: '64%', h: 65, d: '2.2s', delay: '0.4s', c: '89,194,216' },
          { left: '73%', h: 95, d: '1.5s', delay: '1.9s', c: '255,42,109' },
          { left: '82%', h: 80, d: '1.8s', delay: '0.9s', c: '89,194,216' },
          { left: '91%', h: 105, d: '1.4s', delay: '0.1s', c: '89,194,216' },
        ].map((r, i) => (
          <span
            key={i}
            className="absolute top-0 w-px"
            style={{
              left: r.left,
              height: r.h,
              background: `linear-gradient(180deg, transparent, rgba(${r.c},0.5))`,
              animation: `cyber-rain ${r.d} linear ${r.delay} infinite`,
            }}
          />
        ))}
      </div>

      {/* 车灯扫过 */}
      <div
        className="cbg-sweep absolute top-[30%] h-[40vh] w-[35vw] opacity-0"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(232,163,61,0.06) 40%, rgba(232,163,61,0.10) 55%, transparent)',
          filter: 'blur(30px)',
        }}
      />

      {/* 扫描线 — 细而克制 */}
      <div
        className="cbg-scan absolute left-0 right-0 top-0 h-px opacity-0"
        style={{
          background:
            'linear-gradient(90deg, transparent 10%, rgba(89,194,216,0.35) 50%, transparent 90%)',
        }}
      />

      {/* 全息微尘 */}
      {Array.from({ length: 10 }, (_, i) => (
        <span
          key={`d-${i}`}
          className="cbg-dust absolute rounded-full"
          style={{
            left: `${8 + (i * 9.1) % 86}%`,
            top: `${20 + (i * 13.7) % 70}%`,
            width: `${1 + (i % 3) * 0.8}px`,
            height: `${1 + (i % 3) * 0.8}px`,
            background: `rgba(89,194,216,${0.35 + (i % 4) * 0.1})`,
            boxShadow: '0 0 6px rgba(89,194,216,0.5)',
            opacity: 0.25,
          }}
        />
      ))}

      {/* 暗角 — 把视线收进展厅中心 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 42%, transparent 55%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </div>
  );
}
