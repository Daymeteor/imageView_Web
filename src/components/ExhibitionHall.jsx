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

export default function ExhibitionHall({ images, theme = 'forest', zodiacIdx = 0, onZodiacChange, viewMode = 'star', onViewModeChange }) {
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
      const r = (img.width && img.height) ? img.width / img.height : 1;
      (r >= 1 ? l : p).push(img);
    });
    return { landscape: l, portrait: p, combined: [...l, ...p] };
  }, [images]);

  // 预加载完成 + viewMode 变化时刷新 ScrollTrigger
  useEffect(() => { if (preloaded) ScrollTrigger.refresh(); }, [preloaded, viewMode]);

  // 点击缩略图 → 保存位置 → 跳转详情
  const toDetail = useCallback((img) => {
    const y = window.scrollY;
    if (y > 100) scrollStack.current.push(y);
    setActiveId(img.id);
  }, []);

  // 详情/模态框操作
  const openModal = useCallback((img) => setModalIdx(combined.findIndex(i => i.id === img.id)), [combined]);
  const closeModal = useCallback(() => setModalIdx(null), []);

  if (!images.length) return null;
  const sel = modalIdx !== null ? combined[modalIdx] : null;

  // ==================== GSAP 滚动入场 ====================
  const hallRef = useRef(null);
  useGSAP(() => {
    if (!preloaded) return;

    const isAlt = isCyber || isConstellation;
    const fst = isAlt
      ? { dividerD: 0.5, titleD: 0.55, subD: 0.4, titleEase: 'power3.inOut', cardEase: 'power3.inOut', cardY: 60, cardScale: 0.88, stagger: 0.03 }
      : { dividerD: 0.7, titleD: 0.7, subD: 0.5, titleEase: 'power3.out', cardEase: 'back.out(1.4)', cardY: 50, cardScale: 0.93, stagger: 0.06 };

    const tl = gsap.timeline({ defaults: { ease: fst.titleEase } });
    tl.fromTo('.hall-divider', { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: fst.dividerD })
      .fromTo('.hall-header h2', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: fst.titleD }, '-=0.3')
      .fromTo('.hall-header p', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: fst.subD }, '-=0.2');

    ScrollTrigger.batch('.hall-grid .thumb', {
      onEnter: (els) => gsap.fromTo(els,
        { opacity: 0, y: fst.cardY, scale: fst.cardScale },
        { opacity: 1, y: 0, scale: 1, duration: isCyber ? 0.6 : 0.9, stagger: fst.stagger, ease: fst.cardEase, overwrite: true }
      ),
      start: 'top 90%', once: true,
    });
    ScrollTrigger.batch('.hall-detail .pd-layout', {
      onEnter: (els) => gsap.fromTo(els,
        { opacity: 0, y: isAlt ? 60 : 40 },
        { opacity: 1, y: 0, duration: 0.7, ease: isAlt ? 'power2.inOut' : 'power2.out', overwrite: true }
      ),
      start: 'top 85%', once: true,
    });
    ScrollTrigger.batch('.hall-grid .gl', {
      onEnter: (els) => gsap.fromTo(els,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', overwrite: true }
      ),
      start: 'top 95%', once: true,
    });
  }, { scope: hallRef, dependencies: [preloaded, isCyber, isConstellation] });

  // ==================== 渲染 ====================
  return (
    <div className="hall" ref={hallRef}>
      <div className="hall-spacer" />

      {/* 预加载遮罩 */}
      {!preloaded && (
        <div className="preload-overlay">
          <div className="preload-box">
            <div className="preload-ring"><div className="preload-ring-fill" /></div>
            <p className="preload-text">正在缓存图片…</p>
            <p className="preload-count">{preloadCount} / {images.length}</p>
          </div>
        </div>
      )}

      {preloaded && (<>
        {/* 标题 */}
        <div className="hall-header">
          <div className="hall-divider" />
          <h2
            className={isConstellation ? 'hall-title-btn' : ''}
            onClick={isConstellation ? () => onViewModeChange(viewMode === 'star' ? 'gallery' : 'star') : undefined}
          >{t.headerTitle}</h2>
          <p>{t.headerSub}</p>
        </div>

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
        <div className="hall-grid">
          {landscape.length > 0 && (<>
            <div className="gl"><span className="gd gd-l" />横版 <em>{landscape.length} 张</em></div>
            <div className="masonry">
              {landscape.map((img, i) => <ImageCard key={img.id} image={img} index={i} onClick={toDetail} />)}
            </div>
          </>)}
          {portrait.length > 0 && (<>
            <div className="gl gl-p"><span className="gd gd-p" />竖版 <em>{portrait.length} 张</em></div>
            <div className="masonry masonry-p">
              {portrait.map((img, i) => <ImageCard key={img.id} image={img} index={landscape.length + i} onClick={toDetail} />)}
            </div>
          </>)}
        </div>

        {/* 详情区 */}
        <div className="hall-detail">
          <div className="dl"><div className="dd" /><span>作品详情</span><div className="dd" /></div>
          {combined.map((img, i) => (
            <PhotoDetail key={img.id} image={img} index={i} onImageClick={openModal} isActive={activeId === img.id} />
          ))}
        </div>

        <div className="hall-foot">
          <p>{t.footer}</p>
        </div>

        {/* 模态 */}
        <PhotoModal
          image={sel}
          images={combined}
          onClose={closeModal}
          onPrev={() => setModalIdx(i => { let n = i - 1; if (n < 0) n = combined.length - 1; return n; })}
          onNext={() => setModalIdx(i => { let n = i + 1; if (n >= combined.length) n = 0; return n; })}
        />

        {/* FAB */}
        <FABGroup scrollStackRef={scrollStack} />
      </>)}

      <style>{`
        .hall { position: relative; z-index: 10; min-height: 100vh; padding: 0 var(--space-lg); max-width: 1400px; margin: 0 auto; }
        .hall-spacer { height: 100px; }
        .hall-header { text-align: center; padding: var(--space-2xl) 0 var(--space-lg); }
        .hall-header h2 { font-family: var(--font-display); font-size: 1.8rem; font-weight: 400; color: var(--color-accent-light); letter-spacing: .08em; }
        .hall-header p { font-size: .85rem; color: var(--color-text-muted); letter-spacing: .12em; text-transform: uppercase; margin-top: var(--space-sm); }
        .hall-divider { width: 60px; height: 1px; background: linear-gradient(90deg, transparent, var(--color-accent), transparent); margin: 0 auto var(--space-lg); }
        .hall-grid { padding-bottom: var(--space-lg); }
        .gl { display: flex; align-items: center; gap: var(--space-sm); font-family: var(--font-display); font-size: .72rem; color: var(--color-accent-dim); letter-spacing: .06em; padding: var(--space-md) 0 var(--space-sm); }
        .gl em { font-style: normal; font-size: .64rem; color: var(--color-text-muted); }
        .gl-p { margin-top: var(--space-xl); padding-top: var(--space-lg); border-top: 1px solid color-mix(in oklab, var(--color-accent) 8%, transparent); }
        .gd { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; } .gd-l { background: var(--color-accent); } .gd-p { background: var(--color-moss-light); }
        .masonry { display: flex; flex-wrap: wrap; gap: var(--space-md); padding: var(--space-sm) 0; }
        .masonry .thumb { flex: 1 1 280px; min-width: 200px; max-width: 100%; }
        .masonry-p .thumb { flex: 0 1 200px; min-width: 150px; }
        @media(max-width:680px){ .masonry .thumb { flex: 1 1 100%; min-width: 0; } .masonry-p .thumb { flex: 0 1 160px; } }
        .hall-detail { padding-top: var(--space-2xl); }
        .dl { display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md); font-family: var(--font-display); font-size: .78rem; color: var(--color-accent-dim); letter-spacing: .1em; text-transform: uppercase; }
        .dd { flex: 1; height: 1px; background: var(--color-accent-card-border); }
        .hall-foot { text-align: center; padding: var(--space-2xl) 0 var(--space-3xl); font-family: var(--font-display); font-size: .85rem; color: var(--color-text-muted); letter-spacing: .1em; }

        /* 预加载 */
        .preload-overlay { position: fixed; inset: 0; z-index: 400; display: flex; align-items: center; justify-content: center; background: var(--color-bg-deep); }
        .preload-box { text-align: center; }
        .preload-ring { width: 48px; height: 48px; margin: 0 auto var(--space-lg); border-radius: 50%; background: conic-gradient(var(--color-accent) 0deg, transparent 0deg); display: flex; align-items: center; justify-content: center; }
        .preload-ring-fill { width: 40px; height: 40px; border-radius: 50%; background: var(--color-bg-deep); }
        .preload-text { font-family: var(--font-display); font-size: .9rem; color: var(--color-accent-pale); letter-spacing: .06em; }
        .preload-count { margin-top: 6px; font-size: .72rem; color: var(--color-text-muted); letter-spacing: .04em; }

        /* 模态 (PhotoModal) */
        .modal-bg { position: fixed; inset: 0; z-index: 300; display: flex; flex-direction: column; align-items: center; justify-content: center; background: color-mix(in oklab, var(--color-bg-deep) 90%, transparent); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); outline: none; }
        .modal-area { display: flex; flex-direction: row; align-items: center; gap: 12px; }
        .modal-wrap { border-radius: 8px; box-shadow: 0 20px 60px rgba(0,0,0,.7), 0 0 100px var(--color-accent-shadow); background: var(--color-bg-surface); overflow: hidden; max-width: 75vw; max-height: 88vh; }
        .modal-wrap img { display: block; max-width: 75vw; max-height: 85vh; object-fit: contain; user-select: none; -webkit-user-drag: none; }
        .modal-name { margin-top: 10px; font-family: var(--font-display); font-size: .85rem; color: var(--color-accent-pale); letter-spacing: .05em; opacity: .6; }
        .modal-rot { display: flex; flex-direction: column; gap: 4px; flex-shrink: 0; }
        .modal-rot button { display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 50%; border: 1px solid color-mix(in oklab, var(--color-accent) 18%, transparent); background: var(--color-accent-glass-bg); backdrop-filter: blur(8px); color: var(--color-accent-dim); cursor: pointer; }
        .modal-rot button:hover { border-color: color-mix(in oklab, var(--color-accent) 40%, transparent); color: var(--color-accent-light); }
        .modal-rot button.rst { width: 28px; height: 28px; border-style: dashed; margin: 2px 3px; }
        .modal-nav { position: fixed; top: 50%; transform: translateY(-50%); z-index: 301; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: var(--color-accent-glass-bg); backdrop-filter: blur(10px); border: 1px solid color-mix(in oklab, var(--color-accent) 12%, transparent); color: var(--color-accent-dim); cursor: pointer; }
        .modal-nav:hover { border-color: color-mix(in oklab, var(--color-accent) 35%, transparent); color: var(--color-accent-light); }
        .prev { left: 16px; } .next { right: 16px; }
        .modal-x { position: fixed; top: 16px; right: 16px; z-index: 302; width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: var(--color-accent-glass-bg); backdrop-filter: blur(10px); border: 1px solid color-mix(in oklab, var(--color-accent) 12%, transparent); color: var(--color-accent-dim); cursor: pointer; }
        .modal-x:hover { border-color: color-mix(in oklab, var(--color-accent) 35%, transparent); color: var(--color-accent-light); }
        @media(max-width:700px){ .modal-nav{width:38px;height:38px} .prev{left:6px} .next{right:6px} }

        /* FAB */
        .fab-group { position: fixed; right: 20px; bottom: 24px; z-index: 200; display: flex; flex-direction: column-reverse; gap: 10px; }
        .fab { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--glass-bg); backdrop-filter: blur(var(--glass-blur)); -webkit-backdrop-filter: blur(var(--glass-blur)); border: 1px solid var(--glass-border); color: var(--color-accent-dim); cursor: pointer; box-shadow: var(--glass-shadow); transition: color .2s, border-color .2s, box-shadow .2s; }
        .fab:hover { color: var(--color-accent); border-color: var(--color-accent-card-border-hover); }
        .fab-prev { width: 36px; height: 36px; animation: fabIn 0.3s var(--ease-out-expo) both; }
        @keyframes fabIn { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }

        /* 星座欢迎页 (ConstellationWelcome) */
        .hall-sky-top { padding-bottom: var(--space-2xl); cursor: pointer; overflow: hidden; }
        .sky-welcome { display: flex; flex-direction: column; min-height: 62vh; }
        .sky-space { flex: 1; min-height: 40vh; }
        .sky-footer { display: flex; align-items: center; justify-content: center; gap: 16px; padding: var(--space-md) 0; }
        .sky-footer-info { display: flex; align-items: baseline; gap: 10px; }
        .sky-footer-symbol { font-size: 1.6rem; line-height: 1; opacity: .6; }
        .sky-footer-name { font-family: var(--font-display); font-size: .85rem; color: var(--color-accent-pale); letter-spacing: .08em; }
        .sky-switch-btn { display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--color-accent-card-border); background: transparent; color: var(--color-accent-dim); cursor: pointer; transition: all .25s; }
        .sky-switch-btn:hover { border-color: var(--color-accent); color: var(--color-accent-light); background: rgba(136,153,204,0.08); }
        .sky-switch-icon { font-size: 1.3rem; line-height: 1; }
        .sky-welcome-hint { text-align: center; margin-top: 0; font-size: .62rem; color: var(--color-text-muted); letter-spacing: .06em; opacity: .35; }
        .hall-title-btn { cursor: pointer; user-select: none; transition: color .3s, text-shadow .3s; }
        .hall-title-btn:hover { color: var(--color-accent-pale); text-shadow: 0 0 20px rgba(136,153,204,0.3); }
        .theme-constellation .hall-grid { padding-top: var(--space-lg); }
      `}</style>
    </div>
  );
}
