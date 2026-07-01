import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ZODIAC } from '../data/zodiac';

export default function ConstellationWelcome({ zodiacIdx, onZodiacChange, onEnter, viewMode = 'star' }) {
  const skyRef = useRef(null);
  const zod = ZODIAC[zodiacIdx % 12];

  useGSAP(() => {
    if (!skyRef.current) return;
    if (viewMode === 'star') {
      gsap.fromTo(skyRef.current,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
      gsap.fromTo('.sky-footer', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.3 });
      gsap.fromTo('.sky-welcome-hint', { opacity: 0 }, { opacity: 1, duration: 1, ease: 'power2.out', delay: 0.8 });
    } else {
      gsap.to(skyRef.current, { height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0, marginBottom: 0, duration: 0.4, ease: 'power2.in' });
    }
  }, { dependencies: [viewMode] });

  return (
    <div className="hall-sky-top" ref={skyRef} onClick={onEnter}>
      <div className="sky-welcome">
        <div className="sky-space" />
        <div className="sky-footer">
          <div className="sky-footer-info">
            <span className="sky-footer-symbol">{zod.symbol}</span>
            <span className="sky-footer-name">{zod.name} · {zod.en}</span>
          </div>
          <button className="sky-switch-btn" aria-label="切换星座" onClick={(e) => { e.stopPropagation(); onZodiacChange?.(zodiacIdx + 1); }}>
            <span className="sky-switch-icon">✦</span>
          </button>
        </div>
        <p className="sky-welcome-hint">点击任意位置进入画廊</p>
      </div>
    </div>
  );
}
