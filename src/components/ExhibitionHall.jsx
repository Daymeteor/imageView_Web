import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import ImageCard from './ImageCard';
import PhotoDetail from './PhotoDetail';
import { ZODIAC } from '../data/zodiac';

export default function ExhibitionHall({ images, theme = 'forest', zodiacIdx = 0, onZodiacChange, viewMode = 'star', onViewModeChange }) {
  const isCyber = theme === 'cyber';
  const isConstellation = theme === 'constellation';
  const [activeId, setActiveId] = useState(null);
  const [modalIdx, setModalIdx] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [hasPrevPos, setHasPrevPos] = useState(false);
  const [preloadCount, setPreloadCount] = useState(0);
  const skyRef = useRef(null);
  const scrollStack = useRef([]);       // 滚动位置历史
  const zod = ZODIAC[zodiacIdx % 12];

  // 全量预加载：强制浏览器缓存所有图片，就绪后才开放交互
  const preloaded = preloadCount >= images.length;
  useEffect(() => {
    setPreloadCount(0);
    if (!images.length) return;
    let cancelled = false;
    images.forEach((img) => {
      const preImg = new Image();
      preImg.onload = preImg.onerror = () => {
        if (!cancelled) setPreloadCount(c => c + 1);
      };
      preImg.src = img.url;
    });
    return () => { cancelled = true; };
  }, [images]);

  // 按横竖分组，每组保持文件名序；combined = 横在前竖在后（统一顺序）
  const { landscape, portrait, combined } = useMemo(() => {
    const l = [], p = [];
    images.forEach((img) => {
      const r = (img.width && img.height) ? img.width / img.height : 1;
      (r >= 1 ? l : p).push(img);
    });
    return { landscape: l, portrait: p, combined: [...l, ...p] };
  }, [images]);

  // 点击缩略图 → 保存位置 → 跳转详情
  const toDetail = useCallback((img) => {
    const y = window.scrollY;
    if (y > 100) {
      scrollStack.current.push(y);
      setHasPrevPos(true);
    }
    setActiveId(img.id);
  }, []);

  // 详情/模态框操作，全用 combined 顺序
  const openModal = useCallback((img) => setModalIdx(combined.findIndex(i => i.id === img.id)), [combined]);
  const closeModal = useCallback(() => setModalIdx(null), []);
  const go = useCallback((dir) => {
    setRotation(0);
    setModalIdx(i => {
      let n = i + dir;
      if (n < 0) n = combined.length - 1;
      if (n >= combined.length) n = 0;
      return n;
    });
  }, [combined.length]);

  // 回到上一个位置
  const backToPrev = useCallback(() => {
    const pos = scrollStack.current.pop();
    if (pos != null) window.scrollTo({ top: pos, behavior: 'smooth' });
    setHasPrevPos(scrollStack.current.length > 0);
  }, []);

  const scrollToTop = useCallback(() => {
    const y = window.scrollY;
    if (y > 100) {
      scrollStack.current.push(y);
      setHasPrevPos(true);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // GSAP 滚动入场动画 — 双主题差异化
  const hallRef = useRef(null);
  useGSAP(() => {
    if (!preloaded) return;

    const isAlt = isCyber || isConstellation;
    const fst = isAlt
      ? { dividerD: 0.5, titleD: 0.55, subD: 0.4, titleEase: 'power3.inOut', cardEase: 'power3.inOut', cardY: 60, cardScale: 0.88, stagger: 0.03 }
      : { dividerD: 0.7, titleD: 0.7, subD: 0.5, titleEase: 'power3.out', cardEase: 'back.out(1.4)', cardY: 50, cardScale: 0.93, stagger: 0.06 };

    // 标题序列
    const tl = gsap.timeline({ defaults: { ease: fst.titleEase } });
    tl.fromTo('.hall-divider', { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: fst.dividerD })
      .fromTo('.hall-header h2', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: fst.titleD }, '-=0.3')
      .fromTo('.hall-header p', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: fst.subD }, '-=0.2');

    // 缩略图入场
    ScrollTrigger.batch('.hall-grid .thumb', {
      onEnter: (els) => gsap.fromTo(els,
        { opacity: 0, y: fst.cardY, scale: fst.cardScale },
        { opacity: 1, y: 0, scale: 1, duration: isCyber ? 0.6 : 0.9, stagger: fst.stagger, ease: fst.cardEase, overwrite: true }
      ),
      start: 'top 90%',
      once: true,
    });
    // 详情区入场
    ScrollTrigger.batch('.hall-detail .pd-layout', {
      onEnter: (els) => gsap.fromTo(els,
        { opacity: 0, y: isCyber ? 60 : 40 },
        { opacity: 1, y: 0, duration: 0.7, ease: isCyber ? 'power2.inOut' : 'power2.out', overwrite: true }
      ),
      start: 'top 85%',
      once: true,
    });

    // 页面标签交错入场
    ScrollTrigger.batch('.hall-grid .gl', {
      onEnter: (els) => gsap.fromTo(els,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', overwrite: true }
      ),
      start: 'top 95%',
      once: true,
    });
  }, { scope: hallRef, dependencies: [preloaded, isCyber, isConstellation] });

  // 预加载完成后刷新 ScrollTrigger 位置
  useEffect(() => { if (preloaded) ScrollTrigger.refresh(); }, [preloaded]);

  // 星座星图展开/收起动画
  useGSAP(() => {
    if (!isConstellation || !skyRef.current) return;
    if (viewMode === 'star') {
      gsap.fromTo(skyRef.current,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
      gsap.fromTo('.sky-footer', { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.3 });
      gsap.fromTo('.sky-welcome-hint', { opacity: 0 }, { opacity: 1, duration: 1, ease: 'power2.out', delay: 0.8 });
    } else {
      gsap.to(skyRef.current, { height: 0, opacity: 0, paddingTop: 0, paddingBottom: 0, marginBottom: 0, duration: 0.4, ease: 'power2.in' });
    }
  }, { dependencies: [viewMode] });

  if (!images.length) return null;
  const sel = modalIdx !== null ? combined[modalIdx] : null;

  return (
    <div className="hall" ref={hallRef}>
      <div className="hall-spacer" />

      {/* 预加载遮罩 — 所有图片缓存完毕前阻止交互 */}
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
      <div className="hall-header">
        <div className="hall-divider" />
        <h2
          className={isConstellation ? 'hall-title-btn' : ''}
          onClick={isConstellation ? () => onViewModeChange(viewMode === 'star' ? 'gallery' : 'star') : undefined}
        >{isConstellation ? '星空图谱' : isCyber ? '赛博光影集' : '森林光影集'}</h2>
        <p>{isConstellation ? 'Constellation Atlas' : isCyber ? 'Cyber Light Collection' : 'Forest Light Collection'}</p>
      </div>

      {/* 星座欢迎页 — 留白让背景星座成为焦点 */}
      {isConstellation && (
        <div className="hall-sky-top" ref={skyRef} onClick={() => onViewModeChange('gallery')}>
          <div className="sky-welcome">
            {/* 星图展示区 — 大面积留白 */}
            <div className="sky-space" />
            {/* 底部信息栏 */}
            <div className="sky-footer">
              <div className="sky-footer-info">
                <span className="sky-footer-symbol">{zod.symbol}</span>
                <span className="sky-footer-name">{zod.name} · {zod.en}</span>
              </div>
              <button className="sky-switch-btn" onClick={(e) => { e.stopPropagation(); onZodiacChange?.(zodiacIdx + 1); }}>
                <span className="sky-switch-icon">✦</span>
              </button>
            </div>
            <p className="sky-welcome-hint">点击任意位置进入画廊</p>
          </div>
        </div>
      )}

      {/* 缩略图网格 — 横版 / 竖版分开，各用 flex-wrap 行排 */}
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
          <PhotoDetail
            key={img.id}
            image={img}
            index={i}
            onImageClick={openModal}
            isActive={activeId === img.id}
          />
        ))}
      </div>

      <div className="hall-foot">
        <p>{isConstellation ? '— End of Star Map —' : isCyber ? '— End of Transmission —' : '— End of Exhibition —'}</p>
      </div>

      {/* 模态 */}
      <AnimatePresence>
        {sel && (
          <motion.div
            className="modal-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeModal}
          >
            <motion.div
              className="modal-area"
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-rot">
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setRotation(r => r - 90)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="15 18 9 12 15 6"/></svg>
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="rst" onClick={() => setRotation(0)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21.5 2v6h-6M2.5 22v-6h6M21.34 8a10 0 0 1-4.23 12.14M2.66 16A10 0 0 1 6.9 3.86"/></svg>
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setRotation(r => r + 90)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="9 18 15 12 9 6"/></svg>
                </motion.button>
              </div>
              <motion.div
                className="modal-wrap"
                animate={{ rotate: rotation }}
                transition={{ type: 'spring', stiffness: 200, damping: 22 }}
              >
                <img src={sel.url} alt="" draggable="false" />
              </motion.div>
            </motion.div>
            <motion.div
              className="modal-name"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {sel.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')}
            </motion.div>
            <motion.button className="modal-nav prev" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={e => { e.stopPropagation(); go(-1); }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="15 18 9 12 15 6"/></svg>
            </motion.button>
            <motion.button className="modal-nav next" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={e => { e.stopPropagation(); go(1); }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="9 18 15 12 9 6"/></svg>
            </motion.button>
            <motion.button className="modal-x" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={closeModal}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .hall { position: relative; z-index: 10; min-height: 100vh; padding: 0 var(--space-lg); max-width: 1400px; margin: 0 auto; }
        .hall-spacer { height: 100px; }
        .hall-header { text-align: center; padding: var(--space-2xl) 0 var(--space-lg); }
        .hall-header h2 { font-family: var(--font-display); font-size: 1.8rem; font-weight: 400; color: var(--color-accent-light); letter-spacing: .08em; }
        .hall-header p { font-size: .85rem; color: var(--color-text-muted); letter-spacing: .12em; text-transform: uppercase; margin-top: var(--space-sm); }
        .hall-divider { width: 60px; height: 1px; background: linear-gradient(90deg, transparent, var(--color-accent), transparent); margin: 0 auto var(--space-lg); }
        .hall-loading { font-size: .72rem; color: var(--color-accent); letter-spacing: .06em; margin-top: 8px; opacity: .7; }

        /* 预加载遮罩 */
        .preload-overlay {
          position: fixed; inset: 0; z-index: 400;
          display: flex; align-items: center; justify-content: center;
          background: var(--color-bg-deep);
        }
        .preload-box { text-align: center; }
        .preload-ring {
          width: 48px; height: 48px; margin: 0 auto var(--space-lg);
          border-radius: 50%;
          background: conic-gradient(var(--color-accent) 0deg, transparent 0deg);
          display: flex; align-items: center; justify-content: center;
        }
        .preload-ring-fill {
          width: 40px; height: 40px; border-radius: 50%;
          background: var(--color-bg-deep);
        }
        .preload-text {
          font-family: var(--font-display); font-size: .9rem;
          color: var(--color-accent-pale); letter-spacing: .06em;
        }
        .preload-count {
          margin-top: 6px; font-size: .72rem;
          color: var(--color-text-muted); letter-spacing: .04em;
        }

        /* 缩略图网格 — 横版/竖版分开，各用 flex-wrap 行排 */
        .hall-grid { padding-bottom: var(--space-lg); }
        .gl {
          display: flex; align-items: center; gap: var(--space-sm);
          font-family: var(--font-display); font-size: .72rem; color: var(--color-accent-dim);
          letter-spacing: .06em; padding: var(--space-md) 0 var(--space-sm);
        }
        .gl em { font-style: normal; font-size: .64rem; color: var(--color-text-muted); }
        .gl-p {
          margin-top: var(--space-xl); padding-top: var(--space-lg);
          border-top: 1px solid color-mix(in oklab, var(--color-accent) 8%, transparent);
        }
        .gd { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
        .gd-l { background: var(--color-accent); }
        .gd-p { background: var(--color-moss-light); }

        .masonry {
          display: flex; flex-wrap: wrap;
          gap: var(--space-md); padding: var(--space-sm) 0;
        }
        .masonry .thumb { flex: 1 1 280px; min-width: 200px; max-width: 100%; }
        .masonry-p .thumb { flex: 0 1 200px; min-width: 150px; }
        @media(max-width:680px){ .masonry .thumb { flex: 1 1 100%; min-width: 0; } .masonry-p .thumb { flex: 0 1 160px; } }

        .hall-detail { padding-top: var(--space-2xl); }
        .hall-detail-section { padding-top: var(--space-2xl); }
        .dl { display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md); font-family: var(--font-display); font-size: .78rem; color: var(--color-accent-dim); letter-spacing: .1em; text-transform: uppercase; }

        /* 星座欢迎页 — 留白给背景星图，信息栏沉底 */
        .hall-sky-top { padding-bottom: var(--space-2xl); cursor: pointer; overflow: hidden; }
        .sky-welcome {
          display: flex; flex-direction: column; min-height: 62vh;
        }
        .sky-space { flex: 1; min-height: 40vh; }
        .sky-footer {
          display: flex; align-items: center; justify-content: center; gap: 16px;
          padding: var(--space-md) 0;
        }
        .sky-footer-info { display: flex; align-items: baseline; gap: 10px; }
        .sky-footer-symbol { font-size: 1.6rem; line-height: 1; opacity: .6; }
        .sky-footer-name {
          font-family: var(--font-display); font-size: .85rem;
          color: var(--color-accent-pale); letter-spacing: .08em;
        }
        .sky-welcome-hint {
          text-align: center; margin-top: 0;
          font-size: .62rem; color: var(--color-text-muted);
          letter-spacing: .06em; opacity: .35;
        }

        /* 星座模式下概览区下移，避免与星图重叠 */
        .theme-constellation .hall-grid { padding-top: var(--space-lg); }
        .sky-switch-btn {
          display: flex; align-items: center; justify-content: center;
          width: 44px; height: 44px; border-radius: 50%;
          border: 1px solid var(--color-accent-card-border);
          background: transparent;
          color: var(--color-accent-dim); cursor: pointer; transition: all .25s;
        }
        .sky-switch-btn:hover {
          border-color: var(--color-accent);
          color: var(--color-accent-light); background: rgba(136,153,204,0.08);
        }
        .sky-switch-icon { font-size: 1.3rem; line-height: 1; }

        .hall-title-btn {
          cursor: pointer; user-select: none;
          transition: color .3s, text-shadow .3s;
        }
        .hall-title-btn:hover {
          color: var(--color-accent-pale);
          text-shadow: 0 0 20px rgba(136,153,204,0.3);
        }
        .dd { flex: 1; height: 1px; background: var(--color-accent-card-border); }
        .hall-foot { text-align: center; padding: var(--space-2xl) 0 var(--space-3xl); font-family: var(--font-display); font-size: .85rem; color: var(--color-text-muted); letter-spacing: .1em; }

        /* 模态 */
        .modal-bg { position: fixed; inset: 0; z-index: 300; display: flex; flex-direction: column; align-items: center; justify-content: center; background: color-mix(in oklab, var(--color-bg-deep) 90%, transparent); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); }
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

        /* 右下角浮动按钮 */
        .fab-group {
          position: fixed; right: 20px; bottom: 24px; z-index: 200;
          display: flex; flex-direction: column-reverse; gap: 10px;
        }

        .fab {
          width: 40px; height: 40px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: var(--glass-bg); backdrop-filter: blur(var(--glass-blur));
          -webkit-backdrop-filter: blur(var(--glass-blur));
          border: 1px solid var(--glass-border);
          color: var(--color-accent-dim);
          cursor: pointer;
          box-shadow: var(--glass-shadow);
          transition: color .2s, border-color .2s, box-shadow .2s;
        }
        .fab:hover { color: var(--color-accent); border-color: var(--color-accent-card-border-hover); }

        .fab-prev {
          width: 36px; height: 36px;
          animation: fabIn 0.3s var(--ease-out-expo) both;
        }
        @keyframes fabIn { from { opacity: 0; transform: scale(0.5); } to { opacity: 1; transform: scale(1); } }
      `}</style>

      {/* 右下角浮动按钮 */}
      <div className="fab-group">
        {hasPrevPos && (
          <motion.button
            className="fab fab-prev"
            onClick={backToPrev}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            title="回到上一个位置"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <polyline points="15 18 9 12 15 6"/>
              <line x1="21" y1="6" x2="9" y2="6"/>
            </svg>
          </motion.button>
        )}
        <motion.button
          className="fab fab-top"
          onClick={scrollToTop}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          title="回到顶部"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <polyline points="18 15 12 9 6 15"/>
          </svg>
        </motion.button>
      </div>
      </>)}
    </div>
  );
}
