import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageCard from './ImageCard';
import PhotoDetail from './PhotoDetail';

export default function ExhibitionHall({ images, theme = 'forest' }) {
  const isCyber = theme === 'cyber';
  const [activeId, setActiveId] = useState(null);
  const [modalIdx, setModalIdx] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [showFab, setShowFab] = useState(false);
  const prevScrollRef = useRef(null);       // 上一个浏览位置
  const historyStack = useRef([]);           // 位置历史栈
  const [hasPrevPos, setHasPrevPos] = useState(false);

  // 按横竖版分成两组，每组内保持文件名排序；combined = 横版在前，竖版在后
  const { landscape, portrait, combined } = useMemo(() => {
    const l = [], p = [];
    images.forEach((img, i) => {
      const r = (img.width && img.height) ? img.width / img.height : 1;
      (r >= 1 ? l : p).push({ ...img, idx: i });
    });
    return { landscape: l, portrait: p, combined: [...l, ...p] };
  }, [images]);

  // 监听滚动：控制 FAB 可见性
  useEffect(() => {
    const onScroll = () => setShowFab(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 所有定位操作统一使用 combined 列表
  const toDetail = useCallback((img) => {
    // 自动跳转前保存当前位置
    const y = window.scrollY;
    prevScrollRef.current = y;
    if (y > 100) {
      historyStack.current.push(y);
      if (historyStack.current.length > 20) historyStack.current.shift();
      setHasPrevPos(true);
    }
    setActiveId(img.id);
  }, []);
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

  // 返回上一个位置
  const backToPrev = useCallback(() => {
    const pos = historyStack.current.pop();
    if (pos != null) {
      window.scrollTo({ top: pos, behavior: 'smooth' });
    } else if (prevScrollRef.current != null && prevScrollRef.current > 100) {
      window.scrollTo({ top: prevScrollRef.current, behavior: 'smooth' });
      prevScrollRef.current = null;
    }
    setHasPrevPos(historyStack.current.length > 0);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!images.length) return null;
  const sel = modalIdx !== null ? combined[modalIdx] : null;

  return (
    <div className="hall">
      <div className="hall-spacer" />
      <motion.div
        className="hall-header"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
      >
        <div className="hall-divider" />
        <h2>{isCyber ? '赛博光影集' : '森林光影集'}</h2>
        <p>{isCyber ? 'Cyber Light Collection' : 'Forest Light Collection'}</p>
      </motion.div>

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

      {/* 详情区 — combined = 横版在前 竖版在后，与缩略图完全同序 */}
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
        <p>{isCyber ? '— End of Transmission —' : '— End of Exhibition —'}</p>
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
        .dl { display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md); font-family: var(--font-display); font-size: .78rem; color: var(--color-accent-dim); letter-spacing: .1em; text-transform: uppercase; }
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
          opacity: 0; transform: translateY(20px);
          pointer-events: none;
          transition: opacity .35s, transform .35s var(--ease-out-expo);
        }
        .fab-group.fab-visible { opacity: 1; transform: translateY(0); pointer-events: auto; }

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
      <div className={`fab-group${showFab ? ' fab-visible' : ''}`}>
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
    </div>
  );
}
