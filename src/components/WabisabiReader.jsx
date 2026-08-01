import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fileNameToTitle } from '../utils/imageHelpers';
import { imgRatio, fitContain } from '../utils/layoutEngine';

const FADE = 2.0; // 长溶解时长（秒）——墨迹干透般耐心

/**
 * WabisabiReader — 阴翳礼赞
 * 一屏一照，极大留白，照片不对称放置；切换 = 2s 长溶解
 * 点击 = 粗陶框查看
 */
export default function WabisabiReader({ images }) {
  const [cur, setCur] = useState(0);
  const [view, setView] = useState(false);
  const total = images.length;

  const step = useCallback(
    (d) => {
      setView(false);
      setCur((c) => (c + d + total) % total);
    },
    [total]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setView(false);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step]);

  if (!total) return null;
  const img = images[cur];
  const r = imgRatio(img);
  const h = Math.min(window.innerHeight * 0.52, 460);
  const w = Math.min(h * r, window.innerWidth * 0.52);

  return (
    <div
      className="relative z-10 flex min-h-screen flex-col overflow-hidden pt-24"
      onWheel={(e) => {
        if (Math.abs(e.deltaY) > 30) step(e.deltaY > 0 ? 1 : -1);
      }}
    >
      <header className="text-center">
        <p className="text-[10px] tracking-[0.5em] text-[var(--color-text-muted)]">枯山水帖 · KARESANSUI</p>
        <h2 className="mt-3 font-display text-2xl italic tracking-[0.2em] text-[var(--color-text-secondary)]">
          一期一会
        </h2>
      </header>

      {/* 一屏一照：不对称放置（左下象限），粗陶细框 */}
      <div className="relative flex-1">
        <AnimatePresence mode="wait">
          <motion.button
            key={cur}
            className="absolute cursor-pointer"
            style={{ left: '14%', top: '16%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: FADE, ease: 'easeInOut' }}
            onClick={() => setView(true)}
            aria-label={`细看 ${img.name}`}
          >
            <div
              className="bg-[#fbf8ee] p-2.5"
              style={{
                width: w,
                height: h,
                border: '1px solid rgba(55,71,79,0.14)',
                boxShadow: '0 3px 20px rgba(55,71,79,0.12)',
              }}
            >
              <img
                src={img.url}
                alt={img.name}
                draggable="false"
                className="h-full w-full object-cover"
                style={{ filter: 'saturate(0.88) contrast(0.97)' }}
              />
            </div>
            <span className="mt-3 block font-display text-[13px] italic tracking-[0.16em] text-[var(--color-text-muted)]">
              {String(cur + 1).padStart(2, '0')} · {fileNameToTitle(img.name)}
            </span>
          </motion.button>
        </AnimatePresence>

        {/* 右侧竖排留白注 */}
        <p
          className="absolute right-[10%] top-[30%] font-display text-sm tracking-[0.5em] text-[var(--color-text-muted)]"
          style={{ writingMode: 'vertical-rl' }}
        >
          留白处 皆有声
        </p>
      </div>

      <footer className="pb-8 text-center text-[11px] tracking-[0.3em] text-[var(--color-text-muted)]">
        滚轮或 ←/→ 缓缓翻页 · 点击近观 · 共 {total} 帧
      </footer>

      {/* 粗陶框查看 */}
      <AnimatePresence>
        {view && (
          <motion.div
            className="fixed inset-0 z-[300] flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            onClick={() => setView(false)}
          >
            <div className="absolute inset-0 bg-[#37474F]/40 backdrop-blur-[6px]" />
            <motion.div
              className="relative z-10 bg-[#fbf8ee] p-3"
              style={{
                border: '1px solid rgba(55,71,79,0.2)',
                boxShadow: '0 24px 60px rgba(20,28,20,0.35), inset 0 0 0 6px rgba(181,170,144,0.25)',
              }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 0.1, 0.13, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={img.url}
                alt={img.name}
                draggable="false"
                className="block object-contain"
                style={(() => {
                  const s = fitContain(window.innerWidth * 0.72, window.innerHeight * 0.66, r);
                  return { width: s.width, height: s.height, maxWidth: '72vw', maxHeight: '66vh' };
                })()}
              />
              <p className="mt-3 text-center font-display text-sm italic tracking-[0.2em] text-[var(--color-text-secondary)]">
                {fileNameToTitle(img.name)}
              </p>
            </motion.div>
            <p className="relative z-10 mt-6 text-[11px] tracking-[0.34em] text-white/60">ESC 合上 · 阴翳礼赞</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
