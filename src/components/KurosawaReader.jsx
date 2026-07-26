import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fileNameToTitle } from '../utils/imageHelpers';
import { imgRatio } from '../utils/layoutEngine';

const pad = (n) => String(n).padStart(2, '0');

/** 刀光划过总时长 / 换景时机（白线遮住画面中心时换照片重新墨染） */
const SLASH_MS = 400;
const SWAP_MS = 180;

/** 墨染显现：中心墨点扩散 + 收焦 */
const inkV = {
  hidden: {
    clipPath: 'circle(0% at 50% 52%)',
    filter: 'blur(10px) saturate(0.6)',
  },
  show: {
    clipPath: 'circle(78% at 50% 52%)',
    filter: 'blur(0px) saturate(1)',
    transition: { duration: 0.9, ease: [0.22, 0.8, 0.3, 1] },
  },
};

/** 墨点：先胀后散，给晕开一个"墨核" */
const dotV = {
  hidden: { scale: 0, opacity: 0.9 },
  show: {
    scale: [0, 1, 2.6],
    opacity: [0.9, 0.55, 0],
    transition: { duration: 0.9, times: [0, 0.4, 1], ease: 'easeOut' },
  },
};

/**
 * KurosawaReader — 黑泽明主题的能剧黑幕阅读器
 * 全屏黑场，一张一景：照片以"墨染晕开"显现（中心墨点径向扩散揭示）；
 * ←/→ 切换 = 一道刀光白线斜向划过（0.4s）后换景重新墨染；右下竖排题字落款；ESC 落幕回黑场
 */
export default function KurosawaReader({ images, theme = 'kurosawa', folderName }) {
  const total = images.length;
  const [cur, setCur] = useState(-1); // -1 = 黑幕开/终场
  const [slashTick, setSlashTick] = useState(0);
  const [slashDir, setSlashDir] = useState(1);
  const swapTimer = useRef(null);

  const navigate = useCallback(
    (dir) => {
      setCur((v) => {
        const target = dir > 0 ? v + 1 : v - 1;
        if (target < -1 || target >= total) return v;
        setSlashDir(dir);
        setSlashTick((t) => t + 1);
        clearTimeout(swapTimer.current);
        swapTimer.current = setTimeout(() => setCur(target), SWAP_MS);
        return v;
      });
    },
    [total]
  );

  const toCurtain = useCallback(() => {
    if (cur === -1) return;
    setSlashDir(-1);
    setSlashTick((t) => t + 1);
    clearTimeout(swapTimer.current);
    swapTimer.current = setTimeout(() => setCur(-1), SWAP_MS);
  }, [cur]);

  // ---- 键盘：←/→ 换景，ESC 落幕 ----
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') toCurtain();
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'ArrowLeft') navigate(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate, toCurtain]);

  useEffect(() => () => clearTimeout(swapTimer.current), []);

  const onStageClick = (e) => {
    if (e.target.closest('button')) return;
    const x = e.clientX / window.innerWidth;
    if (cur === -1) { navigate(1); return; }
    navigate(x > 0.5 ? 1 : -1);
  };

  const img = cur >= 0 ? images[cur] : null;
  const r = img ? imgRatio(img) : 1;

  return (
    <div
      className="relative z-10 flex min-h-screen select-none flex-col items-center justify-center overflow-hidden px-4 pb-10 pt-24"
      onClick={onStageClick}
    >
      {/* 能剧黑幕压边：四周沉入纯黑 */}
      <div
        className="pointer-events-none fixed inset-0 z-[5]"
        style={{ boxShadow: 'inset 0 0 26vmax 8vmax rgba(0,0,0,0.92)' }}
      />

      {/* 场记：顶部小字 */}
      <header className="pointer-events-none absolute left-1/2 top-24 z-[6] -translate-x-1/2 text-center">
        <p className="text-[10px] tracking-[0.5em]" style={{ color: 'var(--color-text-muted)' }}>
          {cur === -1 ? '能 剧 · 黑 幕' : `第 ${pad(cur + 1)} 景 / 全 ${pad(total)} 景`}
        </p>
      </header>

      {/* ==================== 黑幕开/终场 ==================== */}
      <AnimatePresence>
        {cur === -1 && (
          <motion.div
            key="curtain"
            className="relative z-[6] flex flex-col items-center text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1
              className="font-display text-[clamp(2.6rem,7vw,5rem)] font-bold leading-tight tracking-[0.3em]"
              style={{ color: 'var(--color-text-primary)', textShadow: '0 0 60px rgba(183,28,28,0.35)' }}
              initial={{ opacity: 0, letterSpacing: '0.6em' }}
              animate={{ opacity: 1, letterSpacing: '0.3em' }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              黒澤
            </motion.h1>
            <motion.p
              className="mt-4 text-[11px] tracking-[0.4em]"
              style={{ color: 'var(--color-text-secondary)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {folderName || 'INK & BLADE'} · {total} 景
            </motion.p>
            <motion.button
              className="mt-10 border px-9 py-2.5 text-[11px] tracking-[0.5em] transition-colors"
              style={{
                borderColor: 'var(--color-accent-card-border-hover)',
                color: 'var(--color-text-primary)',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.4 }}
              onClick={(e) => { e.stopPropagation(); navigate(1); }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-accent)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              开 幕 ▸
            </motion.button>
            <p className="mt-6 text-[10px] tracking-[0.3em]" style={{ color: 'var(--color-text-muted)' }}>
              ←/→ 换景 · ESC 落幕
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== 一景：墨染显现 ==================== */}
      <AnimatePresence mode="wait">
        {img && (
          <motion.div
            key={`scene-${cur}`}
            className="relative z-[6]"
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          >
            {/* 墨核 */}
            <motion.div
              variants={dotV}
              className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: 'radial-gradient(circle, #000 0%, rgba(0,0,0,0.85) 45%, transparent 72%)' }}
            />
            <motion.div variants={inkV} style={{ width: `min(88vw, calc(66vh * ${r}))` }}>
              <img
                src={img.url}
                alt={img.name}
                draggable="false"
                className="block w-full"
                style={{ aspectRatio: r }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 右下竖排题字落款 */}
      <AnimatePresence>
        {img && (
          <motion.div
            key={`insc-${cur}`}
            className="krs-inscription"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.55, duration: 0.45 }}
          >
            <span className="krs-inscription-text">{fileNameToTitle(img.name)}</span>
            <span className="krs-seal">baigao</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 底部墨线进度 */}
      {cur >= 0 && (
        <div className="absolute bottom-8 left-1/2 z-[6] h-px w-[min(60vw,420px)] -translate-x-1/2" style={{ background: 'var(--color-accent-card-border)' }}>
          <motion.div
            className="h-full"
            style={{ background: 'var(--color-accent)' }}
            initial={false}
            animate={{ width: `${((cur + 1) / total) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      )}

      {/* ==================== 刀光：斜向白线划过 ==================== */}
      {slashTick > 0 && (
        <motion.div
          key={`slash-${slashTick}`}
          className="pointer-events-none fixed inset-0 z-[200]"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="absolute top-1/2 h-[2px] w-[150vw]"
            style={{
              left: '-25vw',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.95) 50%, transparent)',
              boxShadow: '0 0 18px rgba(255,255,255,0.8), 0 0 60px rgba(255,255,255,0.4)',
            }}
            initial={{ x: slashDir > 0 ? '-160vw' : '160vw', rotate: -14, opacity: 0 }}
            animate={{ x: slashDir > 0 ? '160vw' : '-160vw', rotate: -14, opacity: [0, 1, 1, 0] }}
            transition={{ duration: SLASH_MS / 1000, times: [0, 0.25, 0.75, 1], ease: [0.6, 0, 0.2, 1] }}
          />
          {/* 刀光余晖：极短白闪 */}
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.22, 0] }}
            transition={{ duration: SLASH_MS / 1000, times: [0, 0.5, 1] }}
          />
        </motion.div>
      )}
    </div>
  );
}
