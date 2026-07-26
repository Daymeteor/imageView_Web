import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fileNameToTitle } from '../utils/imageHelpers';
import { imgRatio } from '../utils/layoutEngine';

const pad = (n) => String(n).padStart(2, '0');

/**
 * EvaReader — EVA 主题的 NERV 机密档案墙
 * 照片装进六边形边框档案卡（WARNING 警告条纹 + CLASSIFIED 红章 + 档案编号），
 * 卡宽一律由照片真实宽高比驱动（固定行高 × ratio），禁止裁切。
 * 点击档案 = 插入栓注入：中央光柱落下 → AT 力场六边形光盾从中心展开 →
 * 照片在力场中显示（fitContain），警报红心跳脉冲边框；←/→ 切换下一份档案，ESC 弹出。
 */
export default function EvaReader({ images, theme = 'eva' }) {
  const total = images.length;
  const [cur, setCur] = useState(0);
  const [dir, setDir] = useState(1);
  const [open, setOpen] = useState(false); // 插入栓查看器

  const step = useCallback(
    (d) => {
      setDir(d);
      setCur((c) => (c + d + total) % total);
    },
    [total]
  );

  const closeViewer = useCallback(() => setOpen(false), []);

  // ---- 键盘：←/→ 切换档案，ESC 弹出插入栓 ----
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeViewer();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, closeViewer]);

  const curImg = images[cur];

  /** 机密档案卡：警告条纹顶栏 + 六边形边框照片 + CLASSIFIED 红章 */
  const FileCard = ({ img, i }) => {
    const r = imgRatio(img);
    const active = i === cur;
    return (
      <motion.button
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.6), ease: [0.16, 1, 0.3, 1] }}
        className="group relative block cursor-pointer"
        style={{ width: `calc(clamp(130px, 21vh, 205px) * ${r})` }}
        onClick={() => {
          setCur(i);
          setDir(1);
          setOpen(true);
        }}
        aria-label={`注入插入栓查看档案 ${img.name}`}
      >
        {/* WARNING 黄黑警告条纹 */}
        <div className="eva-reader-stripes h-2.5 w-full" />
        {/* 档案头：编号 */}
        <div
          className="flex items-center justify-between px-1 py-1.5"
          style={{ background: 'var(--color-bg-surface)' }}
        >
          <span
            className="font-display text-[9px] tracking-[0.22em]"
            style={{ color: 'var(--color-accent)' }}
          >
            NERV
          </span>
          <span
            className="font-display text-[9px] tracking-[0.22em]"
            style={{ color: 'var(--color-text-muted)' }}
          >
            FILE-{pad(i + 1)}
          </span>
        </div>

        {/* 六边形边框照片 */}
        <div
          className="eva-reader-hexframe p-[3px] transition-all duration-300"
          style={{
            background: active
              ? 'var(--color-accent)'
              : 'var(--color-accent-card-border)',
            boxShadow: active ? '0 0 22px var(--color-accent-shadow-hover)' : 'none',
          }}
        >
          <div
            className="eva-reader-hexframe overflow-hidden transition-transform duration-300 group-hover:scale-[0.985]"
            style={{ background: 'var(--color-bg-deep)' }}
          >
            <img
              src={img.url}
              alt={img.name}
              draggable="false"
              loading="lazy"
              className="block w-full"
              style={{ aspectRatio: r, height: 'clamp(130px, 21vh, 205px)' }}
            />
          </div>
        </div>

        {/* 档案脚：文件名 */}
        <div
          className="flex items-center justify-between gap-2 px-1 py-1.5"
          style={{ background: 'var(--color-bg-surface)' }}
        >
          <span
            className="truncate text-[10px] tracking-[0.08em]"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            {fileNameToTitle(img.name)}
          </span>
          <span
            className="flex-none font-display text-[8px] tracking-[0.2em]"
            style={{ color: 'var(--color-moss-light)' }}
          >
            MAGI
          </span>
        </div>

        {/* CLASSIFIED 红章 */}
        <div
          className="pointer-events-none absolute right-1 top-9 z-[2] -rotate-12 border-2 px-1.5 py-0.5 font-display text-[9px] tracking-[0.18em] opacity-85"
          style={{
            color: 'var(--eva-alert)',
            borderColor: 'var(--eva-alert)',
            background: 'rgba(13, 13, 13, 0.55)',
          }}
        >
          CLASSIFIED
        </div>
      </motion.button>
    );
  };

  return (
    <div className="relative z-10 flex min-h-screen select-none flex-col px-4 pb-10 pt-24 sm:px-8">
      {/* 背景心跳明灭（红光） */}
      <div
        className="eva-reader-heartbeat pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 62%, var(--eva-alert-glow) 0%, transparent 60%)',
        }}
      />

      {/* 页眉：NERV 终端风 */}
      <header className="relative text-center">
        <p className="text-[10px] tracking-[0.5em]" style={{ color: 'var(--color-text-muted)' }}>
          NERV HEADQUARTERS · CENTRAL DOGMA
        </p>
        <h2
          className="mt-2 font-display text-2xl tracking-[0.12em] sm:text-3xl"
          style={{ color: 'var(--color-accent)' }}
        >
          机密档案库
        </h2>
        <div className="mx-auto mt-3 flex items-center justify-center gap-3">
          <span className="eva-reader-stripes h-1.5 w-14" />
          <span
            className="font-display text-[11px] tracking-[0.3em]"
            style={{ color: 'var(--color-accent-dim)' }}
          >
            FILE-{pad(cur + 1)} / {pad(total)}
          </span>
          <span className="eva-reader-stripes h-1.5 w-14" />
        </div>
      </header>

      {/* 档案墙：行高固定、卡宽 = 行高 × 照片宽高比 */}
      <main className="relative mt-10 flex flex-1 flex-wrap content-start items-start justify-center gap-x-7 gap-y-9">
        {images.map((img, i) => (
          <FileCard key={img.id ?? i} img={img} i={i} />
        ))}
      </main>

      {/* 页脚 */}
      <footer className="relative mt-10 text-center">
        <p
          className="font-display text-sm tracking-[0.24em]"
          style={{ color: 'var(--color-text-primary)' }}
        >
          GOD'S IN HIS HEAVEN · ALL'S RIGHT WITH THE WORLD
        </p>
        <p className="mt-2 text-[10px] tracking-[0.3em]" style={{ color: 'var(--color-text-muted)' }}>
          点击档案注入插入栓 · ←/→ 切换 · ESC 弹出
        </p>
      </footer>

      {/* ==================== 插入栓查看器 ==================== */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[300] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeViewer}
          >
            <div className="absolute inset-0 bg-black/88 backdrop-blur-md" />

            {/* 中央光柱落下（插入栓注入） */}
            <motion.div
              className="pointer-events-none absolute inset-y-0 left-1/2 z-[1] w-[clamp(46px,7vw,110px)] -translate-x-1/2"
              style={{
                background:
                  'linear-gradient(to bottom, transparent 0%, var(--color-accent-pale) 18%, var(--color-accent) 55%, transparent 100%)',
                opacity: 0.32,
                filter: 'blur(6px)',
              }}
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.4, ease: [0.7, 0, 0.3, 1] }}
            />

            {/* AT 力场：六边形光盾从中心展开（双层） */}
            <motion.div
              className="eva-reader-hex pointer-events-none absolute z-[1]"
              style={{
                width: 'min(86vmin, 760px)',
                height: 'min(86vmin, 760px)',
                background: 'rgba(0, 230, 118, 0.07)',
                border: '2px solid var(--color-accent)',
                filter: 'drop-shadow(0 0 26px rgba(0, 230, 118, 0.45))',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ delay: 0.32, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            />
            <motion.div
              className="eva-reader-hex pointer-events-none absolute z-[1]"
              style={{
                width: 'min(98vmin, 880px)',
                height: 'min(98vmin, 880px)',
                border: '1px solid var(--color-moss)',
                filter: 'drop-shadow(0 0 18px rgba(123, 31, 162, 0.5))',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.8 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ delay: 0.42, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* 照片：力场中显示（fitContain）+ 警报红心跳脉冲边框 */}
            <motion.div
              key={cur}
              className="relative z-[2]"
              initial={{ opacity: 0, scale: 0.92, x: dir * 46, filter: 'brightness(2.2)' }}
              animate={{ opacity: 1, scale: 1, x: 0, filter: 'brightness(1)' }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="eva-reader-alarm">
                <img
                  src={curImg.url}
                  alt={curImg.name}
                  draggable="false"
                  className="max-h-[70vh] max-w-[88vw] object-contain"
                  style={{ background: 'var(--color-bg-deep)' }}
                />
              </div>
              {/* 底部档案标注 */}
              <div className="mt-3 flex items-center justify-between gap-4">
                <span
                  className="max-w-[60vw] truncate font-display text-xs tracking-[0.14em]"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {fileNameToTitle(curImg.name)}
                </span>
                <span
                  className="flex-none font-display text-[10px] tracking-[0.24em]"
                  style={{ color: 'var(--color-accent)' }}
                >
                  FILE-{pad(cur + 1)} · RATIO {imgRatio(curImg).toFixed(2)}
                </span>
              </div>
            </motion.div>

            {/* HUD 角标 */}
            <div
              className="pointer-events-none absolute left-5 top-4 z-[3] font-display text-[10px] tracking-[0.3em]"
              style={{ color: 'var(--color-accent)' }}
            >
              ENTRY PLUG INSERTED · LCL 充满
            </div>
            <div
              className="eva-reader-heartbeat pointer-events-none absolute right-5 top-4 z-[3] font-display text-[10px] tracking-[0.3em]"
              style={{ color: 'var(--eva-alert)' }}
            >
              ⚠ PATTERN BLUE · 使徒反应
            </div>
            <div
              className="pointer-events-none absolute bottom-4 left-1/2 z-[3] -translate-x-1/2 text-[10px] tracking-[0.3em]"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              ←/→ 切换档案 · ESC / 点击 弹出插入栓
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
