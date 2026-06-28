import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ImageCard({ image, index, onClick }) {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const el = cardRef.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setIsVisible(true); obs.unobserve(el); } },
      { rootMargin: '200px' }
    );
    obs.observe(el); return () => obs.disconnect();
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className="thumb"
      initial={{ opacity: 0, y: 40, scale: 0.94 }}
      animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.7, delay: index * 0.04, ease: [0.19, 1, 0.22, 1] }}
      whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.3 } }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(image)}
    >
      <div className="thumb-inner">
        {isVisible && (
          <img
            src={image.url} alt="" draggable="false"
            className={`thumb-img${isLoaded ? ' loaded' : ''}`}
            onLoad={() => setIsLoaded(true)} loading="lazy"
          />
        )}
      </div>
      <style>{`
        .thumb { cursor: pointer; border-radius: 6px; overflow: hidden; }
        .thumb-inner { position: relative; background: var(--color-bg-surface); border-radius: 6px; border: var(--card-border, 1px solid var(--color-accent-card-border)); transition: border-color .3s, box-shadow .3s; }
        .thumb:hover .thumb-inner { border-color: var(--color-accent-card-border-hover); box-shadow: var(--card-shadow-hover); }
        .thumb-img { display: block; width: 100%; height: auto; opacity: 0; transition: opacity .5s; user-select: none; -webkit-user-drag: none; }
        .thumb-img.loaded { opacity: 1; }
      `}</style>
    </motion.div>
  );
}
