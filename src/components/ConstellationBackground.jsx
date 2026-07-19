import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ZODIAC } from '../data/zodiac';

export default function ConstellationBackground({ zodiacIdx = 0, prominent = false }) {
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const zodiac = ZODIAC[zodiacIdx % 12];

  // 星野 Canvas — 500 颗背景星
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, stars = [];

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      stars = Array.from({ length: 500 }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 1.8 + 0.5,
        a: Math.random() * 0.8 + 0.2,
        s: Math.random() * 0.015 + 0.003,
      }));
    };
    resize();
    window.addEventListener('resize', resize);

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const t = Date.now() * 0.001;
      stars.forEach((s) => {
        const flicker = 0.6 + 0.4 * Math.sin(t * s.s * 100 + s.x);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(190,200,230,${(s.a * flicker).toFixed(2)})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  // 过渡动画 + 脉动（SVG circle 需显式 transformOrigin）
  useGSAP(() => {
    gsap.fromTo('.cz-stars circle', { opacity: 0, scale: 0, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, transformOrigin: '50% 50%', duration: 1.2, stagger: 0.08, ease: 'back.out(1.5)' });
    gsap.fromTo('.cz-lines line', { opacity: 0 }, { opacity: 0.6, duration: 1.6, ease: 'power2.out', delay: 0.4 });
  }, { scope: overlayRef, dependencies: [zodiacIdx] });

  // 星点脉动
  useGSAP(() => {
    gsap.to('.cz-stars circle', {
      opacity: 0.75, scale: 1.4, transformOrigin: '50% 50%', duration: 3, ease: 'sine.inOut',
      yoyo: true, repeat: -1, stagger: { each: 0.4, from: 'random' },
    });
  }, { scope: overlayRef, dependencies: [] });

  // 跟随前景星图展开/收起
  useGSAP(() => {
    const s = prominent ? 1.6 : 1;
    gsap.to('.cz-overlay', { scale: s, duration: 0.9, ease: 'power3.out' });
    gsap.to('.cz-aura', { scale: s, opacity: prominent ? 1 : 0, duration: 0.9, ease: 'power2.out' });
  }, { dependencies: [prominent] });

  // 缩放适配 + 按星座重心居中
  const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const h = typeof window !== 'undefined' ? window.innerHeight : 800;
  const size = Math.min(w, h) * 0.65;
  const ctrX = w / 2;
  const ctrY = h / 2;
  const sx = zodiac.stars.reduce((s, p) => s + p[0], 0) / zodiac.stars.length;
  const sy = zodiac.stars.reduce((s, p) => s + p[1], 0) / zodiac.stars.length;
  const sc = size / 100;

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      style={{
        background: 'radial-gradient(ellipse at 35% 30%, #101030 0%, #060612 50%, #020208 100%)',
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      <div ref={overlayRef} className="cz-overlay absolute inset-0">
        {/* 星座中心辉光 */}
        <div
          className="cz-aura pointer-events-none absolute left-1/2 top-1/2 max-h-[500px] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: '45vw',
            height: '45vw',
            background: 'radial-gradient(circle, rgba(136,153,204,0.08) 0%, rgba(100,120,180,0.03) 40%, transparent 70%)',
          }}
        />

        <svg viewBox={`0 0 ${w} ${h}`} className="h-full w-full">
          <defs>
            <filter id="czGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {/* 连线 */}
          <g className="cz-lines">
            {zodiac.lines.map(([a, b], i) => {
              const s1 = zodiac.stars[a], s2 = zodiac.stars[b];
              return (
                <line key={`ln-${i}`}
                  x1={ctrX + (s1[0] - sx) * sc} y1={ctrY + (s1[1] - sy) * sc}
                  x2={ctrX + (s2[0] - sx) * sc} y2={ctrY + (s2[1] - sy) * sc}
                  stroke="rgba(170,190,230,0.6)" strokeWidth="1.2"
                  strokeLinecap="round"
                />
              );
            })}
          </g>
          {/* 星点 */}
          <g className="cz-stars">
            {zodiac.stars.map((s, i) => (
              <circle key={`s-${i}`}
                cx={ctrX + (s[0] - sx) * sc}
                cy={ctrY + (s[1] - sy) * sc}
                r={i === 0 ? 6 : 3.5}
                fill="#f0f4ff"
                filter="url(#czGlow)"
              />
            ))}
          </g>
        </svg>

        {/* 标签 */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 opacity-85">
          <span className="text-4xl leading-none">{zodiac.symbol}</span>
          <span className="font-display text-base tracking-[0.12em] text-[#d0d8f0]">
            {zodiac.name} · {zodiac.en}
          </span>
        </div>
      </div>
    </div>
  );
}
