import { useEffect, useRef, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import useExifData from '../hooks/useExifData';
import useInView from '../hooks/useInView';
import { fileNameToTitle } from '../utils/imageHelpers';

export default function PhotoDetail({ image, index, onImageClick, isActive }) {
  const sectionRef = useRef(null);
  const imgRef = useRef(null);
  const [imgViewRef, imgInView] = useInView(0.2, false);
  // 显影：入视口后延迟一拍再加 develop-in，保证红色负片态先渲染
  const [imgDeveloped, setImgDeveloped] = useState(false);
  const exif = useExifData(image);

  useEffect(() => {
    if (!imgInView) { setImgDeveloped(false); return; }
    const t = setTimeout(() => setImgDeveloped(true), 350);
    return () => clearTimeout(t);
  }, [imgInView]);

  const { contextSafe } = useGSAP({ scope: sectionRef });

  const to = contextSafe((vars) => {
    gsap.to(imgRef.current, { ...vars, overwrite: 'auto' });
  });

  const onImgEnter = useCallback(() => {
    to({ scale: 1.015, duration: 0.35, ease: 'power2.out' });
  }, [to]);
  const onImgLeave = useCallback(() => {
    to({ scale: 1, duration: 0.4, ease: 'power2.out' });
  }, [to]);

  useEffect(() => {
    if (isActive && sectionRef.current) {
      const top = sectionRef.current.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, [isActive]);

  const name = fileNameToTitle(image.name);

  return (
    <section ref={sectionRef} id={`detail-${image.id}`} className="py-[var(--space-3xl)]">
      {/* 锚点 */}
      <div className="mb-8 flex items-center gap-4 rounded-lg border border-[var(--color-accent-card-border)] bg-[var(--color-accent-glass-bg)] px-5 py-4 backdrop-blur-md transition-colors duration-300 hover:border-[var(--color-accent-card-border-hover)]">
        <span className="flex-shrink-0 font-display text-xl leading-none tracking-[0.04em] text-[var(--color-accent)]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="h-4 w-px flex-shrink-0 bg-[color-mix(in_oklab,var(--color-accent)_20%,transparent)]" />
        <span className="truncate font-display text-sm tracking-[0.08em] text-[var(--color-accent-pale)]">
          {name}
        </span>
      </div>

      <div className="pd-layout grid items-start gap-8 lg:grid-cols-[1fr_340px]">
        {/* 图片 */}
        <div
          ref={(el) => { imgRef.current = el; imgViewRef.current = el; }}
          className={`pd-img group cursor-pointer overflow-hidden rounded-lg border border-[var(--color-accent-card-border)] bg-[var(--color-bg-surface)] transition-all duration-300 hover:border-[var(--color-accent-card-border-hover)] hover:shadow-[var(--card-shadow-hover)] ${imgDeveloped ? 'develop-in' : ''}`}
          onMouseEnter={onImgEnter}
          onMouseLeave={onImgLeave}
          onClick={(e) => onImageClick(image, e)}
        >
          <img src={image.url} alt={name} draggable="false" className="block h-auto w-full select-none" />
        </div>

        {/* 信息面板 */}
        <div className="pd-info glass rounded-xl p-6 lg:p-7">
          <h3 className="mb-6 border-b border-[color-mix(in_oklab,var(--color-accent)_10%,transparent)] pb-4 font-display text-lg font-normal tracking-[0.04em] text-[var(--color-accent-pale)]">
            {name}
          </h3>

          {exif?.hasData ? (
            <div className="space-y-0">
              <ExifRow label="相机" value={exif.camera} />
              <ExifRow label="镜头" value={exif.lens} />
              <ExifRow label="光圈" value={exif.aperture} />
              <ExifRow label="快门" value={exif.shutter} />
              <ExifRow label="ISO" value={exif.iso} />
              <ExifRow label="焦距" value={exif.focalLength} />

              <div className="h-4" />

              <ExifRow
                label="拍摄日期"
                value={exif.date ? `${exif.date} · ${exif.timeOfDay} · ${exif.season}季` : null}
              />
              <ExifRow label="拍摄地点" value={exif.gps} valueClass="text-[11px]" />
            </div>
          ) : (
            <p className="py-6 text-center text-[13px] tracking-[0.1em] text-[var(--color-text-muted)]">
              — 无 EXIF 信息 —
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function ExifRow({ label, value, valueClass = '' }) {
  if (!value) return null;
  return (
    <div className="flex items-baseline gap-3 border-b border-[color-mix(in_oklab,var(--color-accent)_6%,transparent)] py-3">
      <span className="w-14 flex-shrink-0 text-[11px] tracking-[0.08em] text-[var(--color-text-muted)]">
        {label}
      </span>
      <span className="flex-1 -translate-y-[3px] border-b border-dotted border-[color-mix(in_oklab,var(--color-accent)_18%,transparent)]" />
      <span className={`text-right font-display text-[13px] tracking-[0.02em] text-[var(--color-text-primary)] ${valueClass}`}>
        {value}
      </span>
    </div>
  );
}
