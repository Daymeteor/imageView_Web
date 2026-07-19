import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import useImagePreloader from '../hooks/useImagePreloader';
import ImageCard from './ImageCard';
import PhotoDetail from './PhotoDetail';
import PhotoModal from './PhotoModal';
import ConstellationWelcome from './ConstellationWelcome';
import FABGroup from './FABGroup';
import { getTheme } from '../data/themeConfig';

export default function ExhibitionHall({
  images,
  theme = 'forest',
  zodiacIdx = 0,
  onZodiacChange,
  viewMode = 'star',
  onViewModeChange,
}) {
  const t = getTheme(theme);
  const isCyber = theme === 'cyber';
  const isConstellation = theme === 'constellation';
  const [activeId, setActiveId] = useState(null);
  const [modalIdx, setModalIdx] = useState(null);
  const scrollStack = useRef([]);

  // 分块预加载
  const { preloaded, preloadCount } = useImagePreloader(images);

  // 按横竖分组，每组保持文件名序
  const { landscape, portrait, combined } = useMemo(() => {
    const l = [], p = [];
    images.forEach((img) => {
      const r = img.width && img.height ? img.width / img.height : 1;
      (r >= 1 ? l : p).push(img);
    });
    return { landscape: l, portrait: p, combined: [...l, ...p] };
  }, [images]);

  // 预加载完成 + viewMode 变化时刷新 ScrollTrigger
  useEffect(() => {
    if (preloaded) ScrollTrigger.refresh();
  }, [preloaded, viewMode]);

  // 点击缩略图 → 保存位置 → 跳转详情
  const toDetail = useCallback((img) => {
    const y = window.scrollY;
    if (y > 100) scrollStack.current.push(y);
    setActiveId(img.id);
  }, []);

  // 详情/模态框操作
  const openModal = useCallback((img) => setModalIdx(combined.findIndex((i) => i.id === img.id)), [combined]);
  const closeModal = useCallback(() => setModalIdx(null), []);

  if (!images.length) return null;
  const sel = modalIdx !== null ? combined[modalIdx] : null;

  // ==================== GSAP 滚动入场 ====================
  const hallRef = useRef(null);
  useGSAP(() => {
    if (!preloaded) return;

    const isAlt = isCyber || isConstellation;
    const fst = isAlt
      ? {
          dividerD: 0.5,
          titleD: 0.55,
          subD: 0.4,
          titleEase: 'power3.inOut',
          cardEase: 'power3.inOut',
          cardY: 60,
          cardScale: 0.88,
          stagger: 0.03,
        }
      : {
          dividerD: 0.7,
          titleD: 0.7,
          subD: 0.5,
          titleEase: 'power3.out',
          cardEase: 'back.out(1.4)',
          cardY: 50,
          cardScale: 0.93,
          stagger: 0.06,
        };

    const tl = gsap.timeline({ defaults: { ease: fst.titleEase } });
    tl.fromTo('.hall-divider', { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: fst.dividerD })
      .fromTo('.hall-header h2', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: fst.titleD }, '-=0.3')
      .fromTo('.hall-header p', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: fst.subD }, '-=0.2');

    ScrollTrigger.batch('.hall-grid .thumb', {
      onEnter: (els) =>
        gsap.fromTo(
          els,
          { opacity: 0, y: fst.cardY, scale: fst.cardScale },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: isCyber ? 0.6 : 0.9,
            stagger: fst.stagger,
            ease: fst.cardEase,
            overwrite: true,
          }
        ),
      start: 'top 90%',
      once: true,
    });
    ScrollTrigger.batch('.hall-detail .pd-layout', {
      onEnter: (els) =>
        gsap.fromTo(
          els,
          { opacity: 0, y: isAlt ? 60 : 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: isAlt ? 'power2.inOut' : 'power2.out',
            overwrite: true,
          }
        ),
      start: 'top 85%',
      once: true,
    });
    ScrollTrigger.batch('.hall-grid .gl', {
      onEnter: (els) =>
        gsap.fromTo(
          els,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', overwrite: true }
        ),
      start: 'top 95%',
      once: true,
    });
  }, { scope: hallRef, dependencies: [preloaded, isCyber, isConstellation] });

  // ==================== 渲染 ====================
  return (
    <div className="relative z-10 mx-auto min-h-screen max-w-[1400px] px-4 pb-20 md:px-6 lg:px-8" ref={hallRef}>
      <div className="h-24" />

      {/* 预加载遮罩 */}
      {!preloaded && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-[var(--color-bg-deep)]">
          <div className="text-center">
            <div
              className="relative mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(var(--color-accent) ${(preloadCount / images.length) * 360}deg, transparent 0deg)`,
              }}
            >
              <div className="h-10 w-10 rounded-full bg-[var(--color-bg-deep)]" />
            </div>
            <p className="font-display text-sm tracking-[0.06em] text-[var(--color-accent-pale)]">正在缓存图片…</p>
            <p className="mt-1.5 text-[11px] tracking-[0.04em] text-[var(--color-text-muted)]">
              {preloadCount} / {images.length}
            </p>
          </div>
        </div>
      )}

      {preloaded && (
        <>
          {/* 标题 */}
          <header className="hall-header py-10 text-center md:py-14">
            <div className="hall-divider mx-auto mb-6 h-px w-16 origin-center bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent" />
            <h2
              className={`font-display text-2xl font-normal tracking-[0.08em] text-[var(--color-accent-light)] md:text-3xl ${isConstellation ? 'cursor-pointer select-none transition-all duration-300 hover:text-[var(--color-accent-pale)]' : ''}`}
              style={isConstellation ? { textShadow: '0 0 24px rgba(136,153,204,0.2)' } : {}}
              onClick={isConstellation ? () => onViewModeChange(viewMode === 'star' ? 'gallery' : 'star') : undefined}
              title={isConstellation ? '切换星图/画廊' : undefined}
            >
              {t.headerTitle}
            </h2>
            <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-[var(--color-text-muted)]">
              {t.headerSub}
            </p>
          </header>

          {/* 星座欢迎页 */}
          {isConstellation && (
            <ConstellationWelcome
              zodiacIdx={zodiacIdx}
              onZodiacChange={onZodiacChange}
              onEnter={() => onViewModeChange('gallery')}
              viewMode={viewMode}
            />
          )}

          {/* 缩略图网格 */}
          <div className="hall-grid pb-8">
            {landscape.length > 0 && (
              <>
                <div className="gl mb-3 flex items-center gap-2 py-4 font-display text-[11px] uppercase tracking-[0.06em] text-[var(--color-accent-dim)]">
                  <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-accent)]" />
                  横版
                  <span className="text-[10px] text-[var(--color-text-muted)]">{landscape.length} 张</span>
                </div>
                <div className="masonry flex flex-wrap gap-4">
                  {landscape.map((img, i) => (
                    <ImageCard key={img.id} image={img} index={i} onClick={toDetail} />
                  ))}
                </div>
              </>
            )}

            {portrait.length > 0 && (
              <>
                <div className="gl gl-p mb-3 mt-10 flex items-center gap-2 border-t border-[color-mix(in_oklab,var(--color-accent)_8%,transparent)] pt-6 font-display text-[11px] uppercase tracking-[0.06em] text-[var(--color-accent-dim)]">
                  <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--color-moss-light)]" />
                  竖版
                  <span className="text-[10px] text-[var(--color-text-muted)]">{portrait.length} 张</span>
                </div>
                <div className="masonry-p masonry flex flex-wrap gap-4">
                  {portrait.map((img, i) => (
                    <ImageCard key={img.id} image={img} index={landscape.length + i} onClick={toDetail} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* 详情区 */}
          <div className="hall-detail pt-[var(--space-2xl)]">
            <div className="mb-8 flex items-center gap-4 font-display text-[11px] uppercase tracking-[0.1em] text-[var(--color-accent-dim)]">
              <div className="h-px flex-1 bg-[var(--color-accent-card-border)]" />
              <span>作品详情</span>
              <div className="h-px flex-1 bg-[var(--color-accent-card-border)]" />
            </div>
            {combined.map((img, i) => (
              <PhotoDetail key={img.id} image={img} index={i} onImageClick={openModal} isActive={activeId === img.id} />
            ))}
          </div>

          <footer className="py-14 text-center font-display text-sm tracking-[0.1em] text-[var(--color-text-muted)] md:py-20">
            <p>{t.footer}</p>
          </footer>

          {/* 模态 */}
          <PhotoModal
            image={sel}
            images={combined}
            onClose={closeModal}
            onPrev={() => setModalIdx((i) => { let n = i - 1; if (n < 0) n = combined.length - 1; return n; })}
            onNext={() => setModalIdx((i) => { let n = i + 1; if (n >= combined.length) n = 0; return n; })}
          />

          {/* FAB */}
          <FABGroup scrollStackRef={scrollStack} />
        </>
      )}
    </div>
  );
}
