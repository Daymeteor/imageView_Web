import { useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

export default function ImageCard({ image, index, onClick }) {
  const cardRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const { contextSafe } = useGSAP({ scope: cardRef });

  const onEnter = useCallback(() => {
    gsap.to(cardRef.current, { y: -5, scale: 1.02, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
  }, []);
  const onLeave = useCallback(() => {
    gsap.to(cardRef.current, { y: 0, scale: 1, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
  }, []);
  const onDown = useCallback(() => {
    gsap.to(cardRef.current, { scale: 0.97, duration: 0.1, ease: 'power2.in', overwrite: 'auto' });
  }, []);
  const onUp = contextSafe(() => {
    gsap.to(cardRef.current, { scale: 1.02, duration: 0.2, ease: 'back.out(1.7)', overwrite: 'auto' });
  });

  return (
    <div
      ref={cardRef}
      className="thumb"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onMouseDown={onDown}
      onMouseUp={onUp}
      onClick={() => onClick(image)}
    >
      <div className="thumb-inner">
        <img
          src={image.url} alt="" draggable="false"
          className={`thumb-img${isLoaded ? ' loaded' : ''}`}
          onLoad={() => setIsLoaded(true)} loading="lazy"
        />
      </div>
      <style>{`
        .thumb { cursor: pointer; border-radius: 6px; overflow: hidden; will-change: transform; }
        .thumb-inner { position: relative; background: var(--color-bg-surface); border-radius: 6px; border: var(--card-border, 1px solid var(--color-accent-card-border)); transition: border-color .3s, box-shadow .3s; }
        .thumb:hover .thumb-inner { border-color: var(--color-accent-card-border-hover); box-shadow: var(--card-shadow-hover); }
        .thumb-img { display: block; width: 100%; height: auto; opacity: 0; transition: opacity .5s; user-select: none; -webkit-user-drag: none; }
        .thumb-img.loaded { opacity: 1; }
      `}</style>
    </div>
  );
}
