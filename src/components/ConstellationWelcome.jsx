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
      gsap.fromTo(
        skyRef.current,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
      gsap.fromTo('.sky-footer', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.3 });
      gsap.fromTo('.sky-welcome-hint', { opacity: 0 }, { opacity: 1, duration: 1, ease: 'power2.out', delay: 0.8 });
    } else {
      gsap.to(skyRef.current, {
        height: 0,
        opacity: 0,
        paddingTop: 0,
        paddingBottom: 0,
        marginBottom: 0,
        duration: 0.4,
        ease: 'power2.in',
      });
    }
  }, { dependencies: [viewMode] });

  return (
    <div
      ref={skyRef}
      className="hall-sky-top cursor-pointer overflow-hidden pb-[var(--space-2xl)]"
      onClick={onEnter}
    >
      <div className="flex min-h-[62vh] flex-col">
        <div className="min-h-[40vh] flex-1" />

        <div className="sky-footer flex items-center justify-center gap-4 py-4">
          <div className="flex items-baseline gap-2.5">
            <span className="text-2xl leading-none opacity-60">{zod.symbol}</span>
            <span className="font-display text-sm tracking-[0.08em] text-[var(--color-accent-pale)]">
              {zod.name} · {zod.en}
            </span>
          </div>
          <button
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-accent-card-border)] bg-transparent text-[var(--color-accent-dim)] transition-all duration-300 hover:border-[var(--color-accent)] hover:bg-[color-mix(in_oklab,var(--color-accent)_8%,transparent)] hover:text-[var(--color-accent-light)]"
            aria-label="切换星座"
            onClick={(e) => { e.stopPropagation(); onZodiacChange?.(zodiacIdx + 1); }}
          >
            <span className="text-xl leading-none">✦</span>
          </button>
        </div>

        <p className="sky-welcome-hint mt-0 text-center text-[10px] tracking-[0.06em] text-[var(--color-text-muted)] opacity-35">
          点击任意位置进入画廊
        </p>
      </div>
    </div>
  );
}
