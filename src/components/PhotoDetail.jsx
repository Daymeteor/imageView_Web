import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import useExifData from '../hooks/useExifData';

export default function PhotoDetail({ image, index, onImageClick, isActive }) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const exif = useExifData(image);

  useEffect(() => {
    const el = sectionRef.current; if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setIsVisible(true); obs.unobserve(el); } },
      { rootMargin: '150px', threshold: 0.05 }
    );
    obs.observe(el); return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (isActive && sectionRef.current) {
      const top = sectionRef.current.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, [isActive]);

  const name = image.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');

  return (
    <section ref={sectionRef} id={`detail-${image.id}`} className="pd">
      <div className="pd-anchor">
        <span className="pd-num">{String(index + 1).padStart(2, '0')}</span>
        <span className="pd-anchor-name">{name}</span>
      </div>

      <motion.div
        className="pd-layout"
        initial={{ opacity: 0, y: 40 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
      >
        <motion.div
          className="pd-img"
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => onImageClick(image, e)}
        >
          {isVisible && <img src={image.url} alt={name} draggable="false" />}
        </motion.div>

        <div className="pd-info">
          <h3 className="pd-name">{name}</h3>
          {exif?.hasData ? (
            <>
              {exif.camera && <div className="pd-row"><span>相机</span><span>{exif.camera}</span></div>}
              {exif.lens && <div className="pd-row"><span>镜头</span><span>{exif.lens}</span></div>}
              {exif.aperture && <div className="pd-row"><span>光圈</span><span>{exif.aperture}</span></div>}
              {exif.shutter && <div className="pd-row"><span>快门</span><span>{exif.shutter}</span></div>}
              {exif.iso && <div className="pd-row"><span>ISO</span><span>{exif.iso}</span></div>}
              {exif.focalLength && <div className="pd-row"><span>焦距</span><span>{exif.focalLength}</span></div>}
              <div className="pd-sep" />
              {exif.date && <div className="pd-row"><span>拍摄日期</span><span>{exif.date} · {exif.timeOfDay} · {exif.season}季</span></div>}
              {exif.gps && <div className="pd-row"><span>拍摄地点</span><span className="gps">{exif.gps}</span></div>}
            </>
          ) : (
            <p className="pd-none">无 EXIF 信息</p>
          )}
        </div>
      </motion.div>

      <style>{`
        .pd { padding: var(--space-3xl) 0; }
        .pd-anchor {
          display: flex; align-items: center; gap: var(--space-md);
          margin-bottom: var(--space-2xl); padding: var(--space-md) var(--space-lg);
          border: 1px solid var(--color-accent-card-border); border-radius: 8px;
          background: var(--color-accent-glass-bg);
          backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
        }
        .pd-num { font-family: var(--font-display); font-size: .85rem; color: var(--color-accent); letter-spacing: .08em; flex-shrink: 0; }
        .pd-anchor-name { font-family: var(--font-display); font-size: .9rem; color: var(--color-accent-pale); letter-spacing: .05em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .pd-layout { display: grid; grid-template-columns: 1fr 340px; gap: var(--space-2xl); align-items: start; }
        @media(max-width:860px){ .pd-layout { grid-template-columns: 1fr; } }
        .pd-img { border-radius: 8px; overflow: hidden; cursor: pointer; background: var(--color-bg-surface); border: 1px solid var(--color-accent-card-border); transition: border-color .3s, box-shadow .3s; }
        .pd-img:hover { border-color: var(--color-accent-card-border-hover); box-shadow: var(--card-shadow-hover); }
        .pd-img img { display: block; width: 100%; height: auto; user-select: none; -webkit-user-drag: none; }
        .pd-info {
          background: var(--glass-bg); border: 1px solid var(--glass-border);
          backdrop-filter: blur(var(--glass-blur)); -webkit-backdrop-filter: blur(var(--glass-blur));
          border-radius: 10px; padding: var(--space-xl); box-shadow: var(--glass-shadow);
        }
        .pd-name { font-family: var(--font-display); font-size: 1.15rem; font-weight: 400; color: var(--color-accent-pale); letter-spacing: .04em; margin-bottom: var(--space-xl); }
        .pd-row { display: flex; justify-content: space-between; align-items: baseline; padding: 7px 0; border-bottom: 1px solid color-mix(in oklab, var(--color-accent) 8%, transparent); }
        .pd-row span:first-child { font-size: .74rem; color: var(--color-text-muted); letter-spacing: .04em; flex-shrink: 0; margin-right: var(--space-md); }
        .pd-row span:last-child { font-size: .8rem; color: var(--color-text-primary); text-align: right; font-family: var(--font-display); }
        .pd-row span.gps { font-size: .72rem; }
        .pd-sep { height: var(--space-md); }
        .pd-none { font-size: .8rem; color: var(--color-text-muted); padding: var(--space-lg) 0; }
      `}</style>
    </section>
  );
}
