import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fileNameToTitle } from '../utils/imageHelpers';
import { imgRatio, fitContain } from '../utils/layoutEngine';

/**
 * DuneReader — 拂沙揭示
 * 照片半埋沙中（下半被沙色遮盖），hover/拖动拂开沙子；
 * 点击完全出土（沙粒飞散 + 弹簧升出）→ 大图查看
 */
export default function DuneReader({ images }) {
  const [sel, setSel] = useState(null);
  const [unearthed, setUnearthed] = useState({});
  const total = images.length;

  const step = useCallback(
    (d) => setSel((v) => (v === null ? null : (v + d + total) % total)),
    [total]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setSel(null);
      if (sel !== null && e.key === 'ArrowRight') step(1);
      if (sel !== null && e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sel, step]);

  if (!total) return null;
  const rowH = 230;
  const ratios = images.map(imgRatio);

  return (
    <div className="relative z-10 flex min-h-screen flex-col px-4 pb-16 pt-24">
      <header className="text-center">
        <p className="text-[10px] tracking-[0.4em] text-[var(--color-text-muted)]">ARRAKIS · SPICE ARCHIVE</p>
        <h2 className="mt-2 font-display text-2xl tracking-[0.14em] text-[var(--color-accent-light)]">香料档案</h2>
        <p className="mt-2 text-[11px] tracking-[0.2em] text-[var(--color-text-muted)]">
          hover 拂开沙子 · 点击让它完全出土 · 共 {total} 件
        </p>
      </header>

      <div className="mx-auto mt-8 flex w-full max-w-[1100px] flex-1 flex-wrap items-center justify-center gap-7">
        {images.map((img, i) => (
          <SandCard
            key={img.id}
            img={img}
            idx={i}
            rowH={rowH}
            ratio={ratios[i]}
            revealed={!!unearthed[img.id]}
            onOpen={() => {
              setUnearthed((u) => ({ ...u, [img.id]: true }));
              setSel(i);
            }}
          />
        ))}
      </div>

      <p className="mt-10 text-center font-display text-[12px] tracking-[0.26em] text-[var(--color-text-muted)]">
        — 恐惧是心灵杀手 · baigao —
      </p>

      {/* 大图查看 */}
      <AnimatePresence>
        {sel !== null && (
          <motion.div
            className="fixed inset-0 z-[300] flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSel(null)}
          >
            <div className="absolute inset-0 bg-[#0D1B2A]/80 backdrop-blur-md" />
            <motion.div
              key={sel}
              className="relative z-10"
              initial={{ opacity: 0, y: 90, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: 'spring', stiffness: 220, damping: 19 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 出土飞散的沙粒 */}
              {Array.from({ length: 8 }, (_, k) => (
                <motion.span
                  key={k}
                  className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-[#D4A373]"
                  initial={{ x: 0, y: 0, opacity: 0.9 }}
                  animate={{
                    x: (k % 2 ? 1 : -1) * (40 + (k % 4) * 26),
                    y: -(30 + (k % 5) * 22),
                    opacity: 0,
                  }}
                  transition={{ duration: 0.7, delay: k * 0.03 }}
                />
              ))}
              <div
                className="border border-[var(--color-accent-card-border)] bg-[var(--color-bg-surface)] p-2.5"
                style={{ boxShadow: '0 30px 70px rgba(0,0,0,0.6), 0 0 60px var(--color-accent-shadow-hover)' }}
              >
                <img
                  src={images[sel].url}
                  alt={images[sel].name}
                  draggable="false"
                  className="block object-contain"
                  style={(() => {
                    const s = fitContain(window.innerWidth * 0.72, window.innerHeight * 0.64, imgRatio(images[sel]));
                    return { width: s.width, height: s.height, maxWidth: '72vw', maxHeight: '64vh' };
                  })()}
                />
                <p className="mt-2.5 text-center font-display text-[13px] tracking-[0.16em] text-[var(--color-text-secondary)]">
                  {fileNameToTitle(images[sel].name)} · {sel + 1} / {total}
                </p>
              </div>
            </motion.div>
            <p className="relative z-10 mt-5 text-[11px] tracking-[0.3em] text-white/60">←/→ 切换 · ESC 埋回沙海</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** 半埋沙中的照片卡：hover/拖动时沙层沿指针被拂开 */
function SandCard({ img, idx, rowH, ratio, revealed, onOpen }) {
  const ref = useRef(null);
  const [pt, setPt] = useState(null); // {x%, y%}
  const w = Math.min(rowH * ratio, 340);

  const sweep = (e) => {
    const rect = ref.current.getBoundingClientRect();
    setPt({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const mask = pt
    ? `radial-gradient(circle at ${pt.x}% ${pt.y}%, transparent 0 70px, rgba(0,0,0,0.85) 150px)`
    : 'linear-gradient(180deg, transparent 42%, black 68%)';

  return (
    <motion.button
      ref={ref}
      className="group relative cursor-pointer overflow-hidden border border-[var(--color-accent-card-border)]"
      style={{ width: w, height: rowH, background: 'var(--color-bg-surface)' }}
      onPointerMove={sweep}
      onPointerLeave={() => setPt(null)}
      onClick={onOpen}
      initial={{ opacity: 0, y: 36 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 + idx * 0.1, type: 'spring', stiffness: 170, damping: 17 }}
      aria-label={`让 ${img.name} 出土`}
    >
      <img src={img.url} alt={img.name} draggable="false" loading="lazy"
        className="h-full w-full object-cover" />

      {/* 沙层（被拂开的部分随指针透明） */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          background:
            'linear-gradient(180deg, rgba(212,163,115,0.0) 0%, rgba(212,163,115,0.35) 42%, rgba(141,110,99,0.85) 72%, rgba(90,64,40,0.97) 100%)',
          WebkitMaskImage: mask,
          maskImage: mask,
          opacity: revealed ? 0 : 1,
        }}
      />
      {/* 沙粒噪点 */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 opacity-60"
        style={{
          backgroundImage: 'radial-gradient(rgba(212,163,115,0.5) 1px, transparent 1.6px)',
          backgroundSize: '9px 9px',
          opacity: revealed ? 0 : 0.6,
          transition: 'opacity 0.5s',
        }}
      />
      <span className="absolute bottom-1.5 left-2 font-display text-[11px] tracking-[0.14em] text-[#f2dfc4] opacity-80">
        {String(idx + 1).padStart(2, '0')} · {fileNameToTitle(img.name)}
      </span>
      <span className="absolute right-2 top-1.5 font-display text-[10px] tracking-[0.2em] text-[#f2dfc4]/70 opacity-0 transition-opacity group-hover:opacity-100">
        拂沙中…
      </span>
    </motion.button>
  );
}
