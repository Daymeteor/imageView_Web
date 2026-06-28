import { useState, useEffect, useRef } from 'react';
import useExifData from '../hooks/useExifData';

export default function PhotoDetail({ image, index, onImageClick, isActive }) {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const exif = useExifData(image);

  useEffect(() => {
    const el = sectionRef.current; if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(el); } },
      { rootMargin: '150px', threshold: 0.05 }
    );
    observer.observe(el); return () => observer.disconnect();
  }, []);

  // 缩略图点击 → 滚动到此详情
  useEffect(() => {
    if (isActive && sectionRef.current) {
      const top = sectionRef.current.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, [isActive]);

  const name = image.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');

  return (
    <section ref={sectionRef} className={`pd${isVisible ? ' on' : ''}`} id={`detail-${image.id}`}>
      <div className="pd-anchor">
        <span className="pd-num">{String(index+1).padStart(2,'0')}</span>
        <span className="pd-anchor-name">{name}</span>
      </div>
      <div className="pd-layout">
        <div className="pd-img" onClick={(e) => onImageClick(image, e)}>
          {isVisible && <img src={image.url} alt={name} draggable="false" />}
        </div>
        <div className="pd-info">
          <h3 className="pd-name">{name}</h3>
          {exif?.hasData ? (<>
            {exif.camera && <div className="pd-row"><span className="pd-k">相机</span><span className="pd-v">{exif.camera}</span></div>}
            {exif.lens && <div className="pd-row"><span className="pd-k">镜头</span><span className="pd-v">{exif.lens}</span></div>}
            {exif.aperture && <div className="pd-row"><span className="pd-k">光圈</span><span className="pd-v">{exif.aperture}</span></div>}
            {exif.shutter && <div className="pd-row"><span className="pd-k">快门</span><span className="pd-v">{exif.shutter}</span></div>}
            {exif.iso && <div className="pd-row"><span className="pd-k">ISO</span><span className="pd-v">{exif.iso}</span></div>}
            {exif.focalLength && <div className="pd-row"><span className="pd-k">焦距</span><span className="pd-v">{exif.focalLength}</span></div>}
            <div className="pd-sep" />
            {exif.date && <div className="pd-row"><span className="pd-k">拍摄日期</span><span className="pd-v">{exif.date} {exif.timeOfDay} · {exif.season}季</span></div>}
            {exif.gps && <div className="pd-row"><span className="pd-k">拍摄地点</span><span className="pd-v gps">{exif.gps}</span></div>}
          </>) : (
            <p className="pd-none">无 EXIF 信息</p>
          )}
        </div>
      </div>
      <style>{`
        .pd { padding: var(--space-3xl) 0; opacity: 0; transform: translateY(30px); transition: opacity .7s var(--ease-out-expo), transform .7s var(--ease-out-expo); }
        .pd.on { opacity: 1; transform: translateY(0); }
        .pd-anchor { display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-2xl); padding: var(--space-md) var(--space-lg); border: 1px solid rgba(191,155,94,.2); border-radius: var(--card-radius); background: rgba(14,22,15,.4); }
        .pd-num { font-family: var(--font-display); font-size: .85rem; color: var(--color-gold); letter-spacing: .08em; flex-shrink: 0; }
        .pd-anchor-name { font-family: var(--font-display); font-size: .9rem; color: var(--color-gold-pale); letter-spacing: .05em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .pd-layout { display: grid; grid-template-columns: 1fr 360px; gap: var(--space-2xl); align-items: start; }
        @media(max-width:860px){ .pd-layout { grid-template-columns: 1fr; gap: var(--space-lg); } }
        .pd-img { border-radius: var(--card-radius); border: var(--card-border); overflow: hidden; cursor: pointer; background: var(--color-bg-surface); box-shadow: var(--card-shadow); transition: box-shadow .35s, border-color .35s; }
        .pd-img:hover { box-shadow: var(--card-shadow-hover); border-color: rgba(191,155,94,.4); }
        .pd-img img { display: block; width: 100%; height: auto; user-select: none; -webkit-user-drag: none; }
        .pd-info { padding-top: var(--space-sm); }
        .pd-name { font-family: var(--font-display); font-size: 1.2rem; font-weight: 400; color: var(--color-gold-pale); letter-spacing: .04em; margin-bottom: var(--space-xl); }
        .pd-row { display: flex; justify-content: space-between; align-items: baseline; padding: 8px 0; border-bottom: 1px solid rgba(191,155,94,.06); }
        .pd-k { font-size: .76rem; color: var(--color-text-muted); letter-spacing: .04em; flex-shrink: 0; margin-right: var(--space-md); }
        .pd-v { font-size: .82rem; color: var(--color-text-primary); text-align: right; font-family: var(--font-display); }
        .pd-v.gps { font-size: .74rem; }
        .pd-sep { height: var(--space-md); }
        .pd-none { font-size: .82rem; color: var(--color-text-muted); padding: var(--space-lg) 0; }
      `}</style>
    </section>
  );
}
