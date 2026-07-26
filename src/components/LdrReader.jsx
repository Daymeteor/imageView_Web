import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fileNameToTitle } from '../utils/imageHelpers';
import { imgRatio } from '../utils/layoutEngine';

const pad = (n) => String(n).padStart(2, '0');

/** 每集随机(按序号轮换)红/蓝/银三色描边之一 */
const FRAME_COLORS = [
  'var(--color-gold)', // 红
  'var(--color-moss)', // 蓝
  'var(--color-mist-light)', // 银
];

/** 片头快闪：黑屏闪两下（0.6s） */
const flashV = { opacity: [1, 0, 1, 0], transition: { duration: 0.6, times: [0, 0.3, 0.65, 1], ease: 'linear' } };

/**
 * LdrReader — 爱死机主题：Netflix 选集行 + IMAX 放映
 * 选集行：大尺寸海报卡横排（宽度由照片真实宽高比驱动），红/蓝/银描边轮换，hover 上浮放大
 * 点击 = IMAX 放映：letterbox 上下黑边 + 0.6s 片头剪影快闪 + 超宽 fitContain 大图
 * ←/→ 切集（重放快闪），ESC/点击关闭
 */
export default function LdrReader({ images, theme = 'ldr' }) {
  const total = images.length;
  const [ep, setEp] = useState(null); // 放映中的集数下标，null = 选集行
  const [seq, setSeq] = useState(0); // 快闪重放计数

  const play = useCallback((i) => {
    setEp(i);
    setSeq((s) => s + 1);
  }, []);

  const closeScreen = useCallback(() => setEp(null), []);

  const stepEp = useCallback(
    (d) => {
      setEp((e) => (e === null ? e : (e + d + total) % total));
      setSeq((s) => s + 1);
    },
    [total]
  );

  // ---- 键盘：←/→ 切集，ESC 退出放映 ----
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeScreen();
      if (ep === null) return;
      if (e.key === 'ArrowRight') stepEp(1);
      if (e.key === 'ArrowLeft') stepEp(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [ep, stepEp, closeScreen]);

  const screening = ep !== null;
  const cur = screening ? images[ep] : null;

  return (
    <div className="relative z-10 flex min-h-screen select-none flex-col px-4 pb-8 pt-24">
      {/* 页眉：流媒体频道标 */}
      <header className="text-center">
        <p className="text-[10px] tracking-[0.42em]" style={{ color: 'var(--color-text-muted)' }}>
          LOVE DEATH + ROBOTS · ORIGINAL ANTHOLOGY
        </p>
        <h2
          className="mt-2 font-display text-2xl uppercase tracking-[0.12em]"
          style={{ color: 'var(--color-text-primary)' }}
        >
          第 1 季 · 全 {total} 集
        </h2>
        <div className="mx-auto mt-3 flex items-center justify-center gap-3">
          <span className="h-px w-16" style={{ background: 'var(--color-accent-card-border)' }} />
          <span className="font-display text-[11px] tracking-[0.3em]" style={{ color: 'var(--color-accent)' }}>
            VOLUME 1
          </span>
          <span className="h-px w-16" style={{ background: 'var(--color-accent-card-border)' }} />
        </div>
      </header>

      {/* Netflix 选集行：海报卡横排，卡宽 = 行高 × 照片宽高比 */}
      <div className="mt-10 flex flex-1 items-center overflow-x-auto pb-6 [scrollbar-width:thin]">
        <div className="mx-auto flex items-end gap-5 px-2 lg:gap-7">
          {images.map((img, i) => {
            const r = imgRatio(img);
            const frame = FRAME_COLORS[i % FRAME_COLORS.length];
            return (
              <motion.button
                key={img.id ?? i}
                className="group block flex-none cursor-pointer text-left"
                style={{ width: `clamp(120px, calc(36vh * ${r}), 42vw)` }}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.5), duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -12, scale: 1.05 }}
                onClick={() => play(i)}
                aria-label={`放映 S1 E${pad(i + 1)} ${img.name}`}
              >
                <div
                  className="relative p-[6px] transition-shadow duration-300 group-hover:shadow-[0_16px_50px_rgba(0,0,0,0.75)]"
                  style={{
                    background: 'var(--color-bg-elevated)',
                    border: `2px solid ${frame}`,
                    boxShadow: 'var(--card-shadow)',
                  }}
                >
                  <img
                    src={img.url}
                    alt={img.name}
                    draggable="false"
                    loading="lazy"
                    className="block w-full"
                    style={{ aspectRatio: r }}
                  />
                  {/* 预览描边：hover 内发光 */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ boxShadow: `inset 0 0 0 1px ${frame}, inset 0 0 34px rgba(0,0,0,0.45)` }}
                  />
                  {/* 集数角标 */}
                  <span
                    className="absolute left-2 top-2 px-1.5 py-0.5 font-display text-[10px] tracking-[0.18em]"
                    style={{ background: 'rgba(0,0,0,0.72)', color: frame }}
                  >
                    E{pad(i + 1)}
                  </span>
                </div>
                <p
                  className="mt-2 truncate font-display text-[12px] uppercase tracking-[0.08em]"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {fileNameToTitle(img.name)}
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 页脚 */}
      <footer className="mt-4 text-center">
        <p
          className="font-display text-[13px] uppercase tracking-[0.2em]"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Love Death + Robots · baigao
        </p>
        <p className="mt-1 text-[10px] tracking-[0.3em]" style={{ color: 'var(--color-text-muted)' }}>
          点击海报进入 IMAX 放映 · ←/→ 切集 · ESC 退出
        </p>
      </footer>

      {/* ==================== IMAX 放映 ==================== */}
      <AnimatePresence>
        {screening && (
          <motion.div
            className="fixed inset-0 z-[300] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={closeScreen}
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

            {/* letterbox 上黑边 */}
            <motion.div
              className="absolute inset-x-0 top-0 z-[2] flex items-end justify-between bg-black px-5 pb-3"
              initial={{ height: 0 }}
              animate={{ height: '12vh' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.5, ease: [0.7, 0, 0.3, 1] }}
            >
              <span className="pointer-events-none font-display text-[10px] tracking-[0.3em] text-white/60">
                IMAX · S1 E{pad(ep + 1)}
              </span>
              <span className="pointer-events-none font-display text-[10px] tracking-[0.3em] text-white/60">
                ESC / 点击 退出放映
              </span>
            </motion.div>

            {/* letterbox 下黑边：S1 EN / 共M集 */}
            <motion.div
              className="absolute inset-x-0 bottom-0 z-[2] flex items-center justify-center bg-black"
              initial={{ height: 0 }}
              animate={{ height: '12vh' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.5, ease: [0.7, 0, 0.3, 1] }}
            >
              <motion.p
                className="font-display text-sm tracking-[0.24em] text-white/85 sm:text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                S1 E{pad(ep + 1)} <span style={{ color: 'var(--color-gold)' }}>·</span> 共 {total} 集
              </motion.p>
            </motion.div>

            {/* 放映画面（fitContain 超宽显示） */}
            <motion.div
              key={ep}
              className="relative"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={cur.url}
                alt={cur.name}
                draggable="false"
                className="max-h-[74vh] max-w-[96vw] object-contain"
                style={{ boxShadow: '0 0 90px rgba(0,0,0,0.9)' }}
              />
            </motion.div>

            {/* 片头剪影快闪：黑屏闪两下 + 标题卡（0.6s） */}
            <motion.div
              key={`flash-${ep}-${seq}`}
              className="pointer-events-none absolute inset-0 z-[3] flex items-center justify-center"
              initial={{ opacity: 1 }}
              animate={flashV}
            >
              <div className="absolute inset-0 bg-black" />
              <motion.p
                className="relative max-w-[80vw] truncate px-6 font-display text-3xl uppercase tracking-[0.1em] text-white sm:text-5xl"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: [0, 1, 1, 0], scale: [0.94, 1, 1, 1] }}
                transition={{ duration: 0.6, times: [0, 0.25, 0.75, 1], ease: 'easeOut' }}
              >
                {fileNameToTitle(cur.name)}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
