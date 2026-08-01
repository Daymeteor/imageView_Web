import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fileNameToTitle } from '../utils/imageHelpers';
import { imgRatio, fitContain } from '../utils/layoutEngine';

/** 由你的评分 + 伪随机基数算出"社会平均"（seed 用数字下标，避免字符串 id 产生 NaN） */
function socialAverage(seed, mine) {
  const base = 2.4 + (Math.abs(Math.sin(seed * 9973)) * 2.2); // 2.4–4.6
  if (!mine) return base.toFixed(1);
  return (base * 0.7 + mine * 0.3).toFixed(1);
}

function Stars({ value, onRate, small = false }) {
  return (
    <div className={`flex ${small ? 'gap-0.5' : 'gap-1.5'}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onClick={(e) => { e.stopPropagation(); onRate?.(n); }}
          className="cursor-pointer transition-transform hover:scale-125"
          aria-label={`评 ${n} 星`}
        >
          <svg width={small ? 12 : 18} height={small ? 12 : 18} viewBox="0 0 24 24"
            fill={n <= value ? 'var(--color-accent-light)' : 'none'}
            stroke={n <= value ? 'var(--color-accent-light)' : 'rgba(255,255,255,0.35)'}
            strokeWidth="1.6">
            <path d="M12 2.5l2.9 6.2 6.6.7-4.9 4.5 1.4 6.6-6-3.6-6 3.6 1.4-6.6L2.5 9.4l6.6-.7z" />
          </svg>
        </button>
      ))}
    </div>
  );
}

/**
 * BlackmirrorReader — 评分社会（Nosedive）
 * 照片装成手机屏幕卡，先给照片打分，再看它的"社会平均"；点击进记忆回放
 */
export default function BlackmirrorReader({ images }) {
  const [sel, setSel] = useState(null);
  const [ratings, setRatings] = useState({}); // imgId -> 我的评分
  const total = images.length;

  const rate = useCallback((imgId, n) => {
    setRatings((r) => ({ ...r, [imgId]: n }));
  }, []);

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

  return (
    <div className="relative z-10 flex min-h-screen flex-col px-4 pb-16 pt-24">
      <header className="text-center">
        <p className="text-[10px] tracking-[0.42em] text-[var(--color-text-muted)]">NOSEDIVE · MEMORY RATING</p>
        <h2 className="mt-2 font-display text-2xl tracking-[0.1em] text-[var(--color-text-primary)]">记忆评分</h2>
        <p className="mt-2 text-[11px] tracking-[0.18em] text-[var(--color-text-muted)]">
          先给每段记忆打个分 · 再看看社会的答案 · 共 {total} 段
        </p>
      </header>

      <div className="mx-auto mt-8 flex w-full max-w-[1100px] flex-1 flex-wrap items-start justify-center gap-8">
        {images.map((img, i) => {
          const mine = ratings[img.id] || 0;
          const avg = socialAverage(i + 1, mine);
          const r = imgRatio(img);
          const w = Math.min(200, 180 + (i % 2) * 20);
          return (
            <motion.div
              key={img.id}
              className="relative cursor-pointer rounded-[18px] border border-white/[0.1] bg-[#0c0c0c] p-2 shadow-[0_10px_36px_rgba(0,0,0,0.6)]"
              style={{ width: w }}
              onClick={() => setSel(i)}
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 + i * 0.1, type: 'spring', stiffness: 180, damping: 17 }}
              role="button"
              aria-label={`回放记忆 ${img.name}`}
            >
              {/* 刘海 */}
              <div className="mx-auto mb-1.5 h-1 w-10 rounded-full bg-white/15" />
              <div className="overflow-hidden rounded-[12px]" style={{ aspectRatio: String(r) }}>
                <img src={img.url} alt={img.name} draggable="false" loading="lazy"
                  className="h-full w-full object-cover" />
              </div>
              <div className="mt-2 flex items-center justify-between px-1 pb-1">
                <Stars value={mine} onRate={(n) => rate(img.id, n)} small />
                <span className="font-display text-[12px] text-[var(--color-accent-light)]">{avg}</span>              </div>
              <p className="truncate px-1 pb-1 text-[10px] tracking-[0.1em] text-[var(--color-text-muted)]">
                {mine ? `你评了 ${mine} 星 · 社会 ${avg}` : '请评分'}
              </p>
            </motion.div>
          );
        })}
      </div>

      <p className="mt-10 text-center font-display text-[12px] tracking-[0.3em] text-[var(--color-text-muted)]">— 4.8/5 · baigao —</p>

      {/* 记忆回放 */}
      <AnimatePresence>
        {sel !== null && (
          <motion.div
            className="fixed inset-0 z-[300] flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSel(null)}
          >
            <div className="absolute inset-0 bg-black/88 backdrop-blur-md" />
            <motion.div
              key={sel}
              className="relative z-10 w-[min(88vw,880px)]"
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 220, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* HUD */}
              <div className="mb-3 flex items-center justify-between text-[11px] tracking-[0.18em] text-white/60">
                <span>MEMORY PLAYBACK · {String(sel + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}</span>
                <span className="flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-[#D32F2F]" style={{ animation: 'bm-led 1s steps(2) infinite' }} />
                  REC
                </span>
              </div>
              <div className="border border-white/10 bg-[#0a0a0a] p-2 shadow-[0_30px_80px_rgba(0,0,0,0.7)]">
                <img
                  src={images[sel].url}
                  alt={images[sel].name}
                  draggable="false"
                  className="mx-auto block object-contain"
                  style={(() => {
                    const s = fitContain(window.innerWidth * 0.74, window.innerHeight * 0.6, imgRatio(images[sel]));
                    return { width: s.width, height: s.height, maxWidth: '100%', maxHeight: '60vh' };
                  })()}
                />
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Stars value={ratings[images[sel].id] || 0} onRate={(n) => rate(images[sel].id, n)} />
                  <span className="text-[11px] tracking-[0.14em] text-white/50">
                    {ratings[images[sel].id] ? `你评了 ${ratings[images[sel].id]} 星` : '滑动星标为它评分'}
                  </span>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg text-[var(--color-accent-light)]">
                    {socialAverage(sel + 1, ratings[images[sel].id])}
                  </p>
                  <p className="text-[10px] tracking-[0.16em] text-white/45">
                    超越 {Math.min(97, Math.round(parseFloat(socialAverage(sel + 1, ratings[images[sel].id])) / 5 * 100))}% 用户
                  </p>
                </div>
              </div>
              <p className="mt-2 truncate text-[11px] tracking-[0.14em] text-white/40">{fileNameToTitle(images[sel].name)}</p>
            </motion.div>
            <p className="relative z-10 mt-5 text-[11px] tracking-[0.3em] text-white/50">←/→ 切换记忆 · ESC 退出回放</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
