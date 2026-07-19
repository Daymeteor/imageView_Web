import { useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

export default function ImageCard({ image, index, onClick }) {
  const cardRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const { contextSafe } = useGSAP({ scope: cardRef });

  const to = contextSafe((vars) => {
    gsap.to(cardRef.current, { ...vars, overwrite: 'auto' });
  });

  const onEnter = useCallback(() => {
    to({ y: -5, scale: 1.02, duration: 0.35, ease: 'power2.out' });
  }, [to]);
  const onLeave = useCallback(() => {
    to({ y: 0, scale: 1, duration: 0.4, ease: 'power2.out' });
  }, [to]);
  const onDown = useCallback(() => {
    to({ scale: 0.97, duration: 0.1, ease: 'power2.in' });
  }, [to]);
  const onUp = useCallback(() => {
    to({ scale: 1.02, duration: 0.2, ease: 'back.out(1.7)' });
  }, [to]);

  return (
    <div
      ref={cardRef}
      className="thumb cursor-pointer overflow-hidden rounded-md will-change-transform"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseDown={onDown}
      onMouseUp={onUp}
      onClick={() => onClick(image)}
      aria-label={`查看图片 ${image.name}`}
    >
      <div className="group relative overflow-hidden rounded-md border border-[var(--color-accent-card-border)] bg-[var(--color-bg-surface)] shadow-[var(--card-shadow)] transition-all duration-300 hover:border-[var(--color-accent-card-border-hover)] hover:shadow-[var(--card-shadow-hover)]">
        <img
          src={image.url}
          alt=""
          draggable="false"
          className={`thumb-img block h-auto w-full select-none opacity-0 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : ''}`}
          onLoad={() => setIsLoaded(true)}
          loading="lazy"
        />
        {/* Magic UI 流光 */}
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div
            className="h-full w-full animate-shimmer"
            style={{
              background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 45%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 55%, transparent 60%)',
            }}
          />
        </div>

        {/* 悬停时底部渐变条 */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: 'linear-gradient(90deg, transparent, var(--color-accent), transparent)' }}
        />
      </div>
    </div>
  );
}
