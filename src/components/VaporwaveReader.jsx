import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fileNameToTitle } from '../utils/imageHelpers';
import { imgRatio } from '../utils/layoutEngine';

const pad = (n) => String(n).padStart(2, '0');

/** 确定性伪随机错落：同一索引每次渲染一致（旋转 / 纵向偏移 / 窗口体高度） */
const wobble = (i) => ({
  rotate: (((i * 53) % 9) - 4) * 0.9,
  y: ((i * 29) % 5) * 8 - 16,
  h: 19 + ((i * 17) % 9), // 19–27vh，窗口体高度由照片宽高比驱动宽度
});

/** 桌面窗口群入场：逐窗弹出 */
const deskV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};
const winV = {
  hidden: { opacity: 0, scale: 0.85, y: 26 },
  show: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

/** Win95 标题栏渐变（蒸汽波配色） */
const titleBarBg =
  'linear-gradient(90deg, var(--color-mist) 0%, var(--color-gold-dim) 55%, var(--color-leaf) 100%)';

/** 标题栏右侧小按钮（— ▢ ✕） */
function TitleButton({ label, onClick, danger }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-[13px] w-[15px] flex-none items-center justify-center text-[9px] leading-none transition-transform hover:scale-110 active:scale-95"
      style={{
        background: 'var(--color-bg-elevated)',
        color: danger ? 'var(--color-gold)' : 'var(--color-text-primary)',
        boxShadow:
          'inset 1px 1px 0 rgba(255,255,255,0.5), inset -1px -1px 0 rgba(0,0,0,0.55)',
      }}
    >
      {label === '关闭' ? '✕' : label === '最大化' ? '▢' : '▁'}
    </button>
  );
}

/**
 * VaporwaveReader — 蒸汽波主题的 Win95 桌面阅读器
 * 照片装成 CRT 窗口（标题栏 + 三钮 + VHS 扫描线窗体），错落悬浮在桌面上
 * 点标题栏「▢ 最大化」= 窗口弹簧放大至全屏；底部遥控器（◀ ⏹ ▶ + LED 时钟）
 */
export default function VaporwaveReader({ images, theme = 'vaporwave', folderName }) {
  const total = images.length;
  const [viewerIdx, setViewerIdx] = useState(null);
  const [now, setNow] = useState(() => new Date());

  // ---- LED 时钟走秒 ----
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const openViewer = useCallback((i) => setViewerIdx(i), []);
  const closeViewer = useCallback(() => setViewerIdx(null), []);
  const stepViewer = useCallback(
    (d) => setViewerIdx((i) => (i === null ? i : (i + d + total) % total)),
    [total]
  );

  // ---- 键盘：←/→ 切换频道，ESC 关闭窗口 ----
  useEffect(() => {
    const onKey = (e) => {
      if (viewerIdx === null) return;
      if (e.key === 'Escape') closeViewer();
      if (e.key === 'ArrowRight') stepViewer(1);
      if (e.key === 'ArrowLeft') stepViewer(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [viewerIdx, closeViewer, stepViewer]);

  const viewerImg = viewerIdx !== null ? images[viewerIdx] : null;

  /** 桌面 CRT 窗口：高度定档、宽度由真实宽高比自然推出（不裁切） */
  const DeskWindow = ({ img, i }) => {
    const r = imgRatio(img);
    const w = wobble(i);
    return (
      <motion.div variants={winV} style={{ rotate: w.rotate, y: w.y }}>
        <div
          className="transition-transform duration-300 hover:-translate-y-1.5 hover:rotate-0"
          style={{
            border: '2px solid var(--color-accent-card-border)',
            boxShadow: 'var(--card-shadow)',
            background: 'var(--color-bg-surface)',
          }}
        >
          {/* 标题栏：点击 = 最大化 */}
          <button
            type="button"
            onClick={() => openViewer(i)}
            className="flex w-full cursor-pointer items-center gap-1.5 px-1.5 py-[3px]"
            style={{ background: titleBarBg }}
            aria-label={`最大化 ${img.name}`}
          >
            <span
              className="h-[9px] w-[9px] flex-none"
              style={{ background: 'var(--color-gold-pale)', boxShadow: '0 0 6px var(--color-gold)' }}
            />
            <span className="min-w-0 flex-1 truncate text-left font-display text-[10px] tracking-[0.06em] text-white">
              {fileNameToTitle(img.name)}
            </span>
            <TitleButton label="最小化" onClick={(e) => e.stopPropagation()} />
            <TitleButton label="最大化" onClick={(e) => { e.stopPropagation(); openViewer(i); }} />
            <TitleButton label="关闭" danger onClick={(e) => e.stopPropagation()} />
          </button>
          {/* 窗口体：照片 + VHS 扫描线 */}
          <div className="vw-crt vw-flicker p-[3px]" style={{ background: 'var(--color-bg-deep)' }}>
            <img
              src={img.url}
              alt={img.name}
              draggable="false"
              loading="lazy"
              className="block max-w-[74vw]"
              style={{ height: `${w.h}vh`, width: 'auto', aspectRatio: r }}
            />
          </div>
        </div>
      </motion.div>
    );
  };

  /** 遥控器按钮 */
  const RemoteButton = ({ children, label, onClick, disabled }) => (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="flex h-9 w-9 items-center justify-center rounded-md text-sm transition-transform hover:scale-110 active:scale-90 disabled:opacity-35"
      style={{
        background: 'var(--color-bg-elevated)',
        color: 'var(--color-moss-light)',
        boxShadow:
          'inset 1px 1px 0 rgba(255,255,255,0.35), inset -1px -1px 0 rgba(0,0,0,0.6), 0 0 10px rgba(0,212,255,0.25)',
      }}
    >
      {children}
    </button>
  );

  return (
    <div className="relative z-10 flex min-h-screen select-none flex-col px-4 pb-28 pt-24">
      {/* 页眉：系统路径 */}
      <header className="text-center">
        <p className="font-mono text-[10px] tracking-[0.32em]" style={{ color: 'var(--color-text-muted)' }}>
          VAPORWAVE_OS 95 // C:\PHOTOS\{(folderName || 'GALLERY').toUpperCase()}
        </p>
        <h2
          className="mt-2 font-display text-2xl tracking-[0.22em]"
          style={{
            background: 'linear-gradient(90deg, var(--color-gold-light), var(--color-moss-light))',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          デスクトップ · DESKTOP
        </h2>
        <p className="mt-2 font-mono text-[10px] tracking-[0.28em]" style={{ color: 'var(--color-text-secondary)' }}>
          {pad(total)} OBJECTS LOADED · DOUBLE-CLICK REALITY
        </p>
      </header>

      {/* 桌面：CRT 窗口错落摆放 */}
      <motion.div
        variants={deskV}
        initial="hidden"
        animate="show"
        className="flex flex-1 flex-wrap content-center items-center justify-center gap-x-9 gap-y-11 py-10"
      >
        {images.map((img, i) => (
          <DeskWindow key={img.id ?? i} img={img} i={i} />
        ))}
      </motion.div>

      {/* 页脚：操作提示 */}
      <footer className="text-center">
        <p className="font-mono text-[10px] tracking-[0.3em]" style={{ color: 'var(--color-text-muted)' }}>
          点标题栏「▢」最大化 · ←/→ 换台 · ⏹ / ESC 关闭 · baigao
        </p>
      </footer>

      {/* ==================== 全屏最大化窗口 ==================== */}
      <AnimatePresence>
        {viewerImg && (
          <motion.div
            className="fixed inset-0 z-[300] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeViewer}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            {/* 窗口弹簧放大至全屏 */}
            <motion.div
              initial={{ scale: 0.5, y: 90, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.55, y: 60, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 210, damping: 24 }}
              className="relative flex max-w-[94vw] flex-col"
              style={{
                border: '2px solid var(--color-accent-card-border-hover)',
                background: 'var(--color-bg-surface)',
                boxShadow: 'var(--card-shadow-hover)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 全屏标题栏 */}
              <div
                className="flex items-center gap-2 px-2 py-[5px]"
                style={{ background: titleBarBg }}
              >
                <span
                  className="h-[10px] w-[10px] flex-none"
                  style={{ background: 'var(--color-gold-pale)', boxShadow: '0 0 8px var(--color-gold)' }}
                />
                <span className="min-w-0 flex-1 truncate font-display text-xs tracking-[0.08em] text-white">
                  {fileNameToTitle(viewerImg.name)} — MAXIMIZED
                </span>
                <TitleButton label="关闭" danger onClick={closeViewer} />
              </div>

              {/* 全屏画面（fitContain）+ 扫描线，换台交叉淡入 */}
              <div
                className="vw-crt flex items-center justify-center p-1"
                style={{ background: 'var(--color-bg-deep)' }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.img
                    key={viewerImg.id ?? viewerIdx}
                    src={viewerImg.url}
                    alt={viewerImg.name}
                    draggable="false"
                    className="max-h-[70vh] max-w-[90vw] object-contain"
                    initial={{ opacity: 0, scale: 0.985 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.28 }}
                  />
                </AnimatePresence>
              </div>

              {/* 状态栏 */}
              <div
                className="flex items-center justify-between px-2.5 py-1 font-mono text-[10px] tracking-[0.2em]"
                style={{
                  color: 'var(--color-text-secondary)',
                  borderTop: '1px solid var(--color-accent-card-border)',
                }}
              >
                <span>READY · TRACKING OK</span>
                <span style={{ color: 'var(--color-moss-light)' }}>
                  CH {pad(viewerIdx + 1)} / {pad(total)}
                </span>
              </div>
            </motion.div>

            {/* 角标 */}
            <div className="pointer-events-none absolute left-5 top-4 z-[3] font-mono text-[10px] tracking-[0.3em] text-white/60">
              ▶ PLAY · SP MODE
            </div>
            <div className="pointer-events-none absolute right-5 top-4 z-[3] font-mono text-[10px] tracking-[0.3em] text-white/60">
              ESC / ⏹ 退出
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== 底部遥控器 ==================== */}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[310] flex justify-center">
        <div
          className="pointer-events-auto flex items-center gap-3 rounded-xl px-4 py-2.5"
          style={{
            background: 'var(--color-accent-glass-bg)',
            border: '1px solid var(--color-accent-glass-border)',
            boxShadow: '0 10px 36px rgba(0,0,0,0.55), 0 0 24px rgba(0,212,255,0.12)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <RemoteButton label="上一张" onClick={() => stepViewer(-1)} disabled={viewerIdx === null}>
            ◀
          </RemoteButton>
          <RemoteButton label="停止" onClick={closeViewer} disabled={viewerIdx === null}>
            ⏹
          </RemoteButton>
          <RemoteButton label="下一张" onClick={() => stepViewer(1)} disabled={viewerIdx === null}>
            ▶
          </RemoteButton>

          {/* LED 时钟 */}
          <div
            className="ml-1 rounded px-2.5 py-1 font-mono text-sm tracking-[0.14em]"
            style={{
              background: 'var(--color-bg-deep)',
              color: 'var(--color-moss-light)',
              textShadow: '0 0 8px var(--color-moss), 0 0 18px rgba(0,212,255,0.45)',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.7)',
            }}
            aria-label="当前时间"
          >
            {pad(now.getHours())}
            <span className="vw-led-colon">:</span>
            {pad(now.getMinutes())}
            <span className="vw-led-colon">:</span>
            {pad(now.getSeconds())}
          </div>
        </div>
      </div>
    </div>
  );
}
