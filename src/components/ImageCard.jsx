import { useEffect, useRef, useState } from 'react';

export default function ImageCard({ image, index, onClick }) {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const el = cardRef.current; if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(el); } },
      { rootMargin: '200px' }
    );
    observer.observe(el); return () => observer.disconnect();
  }, []);

  return (
    <div ref={cardRef} className="thumb" style={{ animationDelay: `${index * 0.04}s` }} onClick={() => onClick(image)}>
      <div className="thumb-inner">
        {isVisible && <img src={image.url} alt="" className={`thumb-img${isLoaded ? ' loaded' : ''}`} onLoad={() => setIsLoaded(true)} loading="lazy" draggable="false" />}
      </div>
      <style>{`
        .thumb { break-inside: avoid; margin-bottom: var(--space-md); cursor: pointer; animation: cardEnter .7s var(--ease-out-quint) both; transition: transform .35s var(--ease-out-quint), filter .35s ease; border-radius: var(--card-radius); overflow: hidden; }
        .thumb:hover { transform: translateY(-3px); filter: brightness(1.1); box-shadow: var(--card-shadow-hover); }
        .thumb-inner { position: relative; background: var(--color-bg-surface); }
        .thumb-img { display: block; width: 100%; height: auto; opacity: 0; transition: opacity .4s ease; user-select: none; -webkit-user-drag: none; }
        .thumb-img.loaded { opacity: 1; }
      `}</style>
    </div>
  );
}
