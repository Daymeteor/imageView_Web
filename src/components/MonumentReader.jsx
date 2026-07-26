import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fileNameToTitle } from '../utils/imageHelpers';
import { imgRatio } from '../utils/layoutEngine';

const pad = (n) => String(n).padStart(2, '0');

/** 图腾柱分段配色（全部走主题 token） */
const TOTEM_COLORS = [
  'var(--color-accent)',
  'var(--color-moss)',
  'var(--color-mist)',
  'var(--color-gold-light)',
];

/** 关卡门进出：侧向滑入 + 轻微旋转 */
const doorV = {
  enter: (d) => ({ opacity: 0, x: d * 120, rotate: d * 4, scale: 0.9 }),
  center: { opacity: 1, x: 0, rotate: 0, scale: 1 },
  exit: (d) => ({ opacity: 0, x: d * -120, rotate: d * -4, scale: 0.9 }),
};
const doorT = { duration: 0.5, ease: [0.32, 0.72, 0, 1] };

/** 查看面板：等轴测 rotateY 翻转（custom = { d: 方向, delay: 首开延迟 }） */
const panelV = {
  enter: ({ d }) => ({ opacity: 0, rotateY: d >= 0 ? -70 : 70, scale: 0.92 }),
  center: ({ delay = 0 }) => ({
    opacity: 1,
    rotateY: 0,
    scale: 1,
    transition: { delay, duration: 0.5, ease: [0.32, 0.72, 0, 1] },
  }),
  exit: ({ d }) => ({
    opacity: 0,
    rotateY: d >= 0 ? 70 : -70,
    scale: 0.92,
    transition: { duration: 0.3 },
  }),
};

/**
 * MonumentReader — 纪念碑谷主题的图腾柱关卡门阅读器
 * 一屏一关：照片装进圆顶几何关卡门（浮雕边框），悬浮于视错觉空间
 * 点击门 = 解锁：门框旋转 45° 后等轴测翻转打开，照片大图展开（fitContain）
 * 查看中 ←/→ = 等轴测 flip + 色块错位；底部图腾柱每过一关升高一格
 */
export default function MonumentReader({ images, theme = 'monument', folderName }) {
  const total = images.length;
  const [cur, setCur] = useState(0);
  const [dir, setDir] = useState(1);
  const [open, setOpen] = useState(false);
  const [booting, setBooting] = useState(false); // 解锁开门表演进行中

  const step = useCallback(
    (d) => {
      setDir(d);
      setCur((c) => (c + d + total) % total);
    },
    [total]
  );

  const unlock = useCallback(() => {
    setBooting(true);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  // ---- 键盘：←/→ 换关，ESC 关门 ----
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, close]);

  // ---- 开门表演 1.05s 后结束（门框 0.85s + 面板 0.55s 延迟起步） ----
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => setBooting(false), 1100);
    return () => clearTimeout(t);
  }, [open]);

  if (!total) return null;

  const img = images[cur];
  const r = imgRatio(img);
  const panelDelay = booting ? 0.55 : 0;
  /** 图腾柱分段高：关卡多时每格变矮，整体不超 ~150px */
  const segH = total <= 12 ? 12 : Math.max(6, Math.floor(150 / total));

  const Arrow = ({ d }) => (
    <button
      className="flex h-11 w-11 flex-none items-center justify-center font-display text-lg transition-transform hover:scale-110"
      style={{
        border: '1px solid var(--color-accent-card-border-hover)',
        color: 'var(--color-accent)',
        background: 'var(--color-accent-glass-bg)',
        borderRadius: '12px',
        boxShadow: '0 4px 0 rgba(106, 90, 138, 0.12)',
      }}
      onClick={() => step(d)}
      aria-label={d > 0 ? '下一关' : '上一关'}
    >
      {d > 0 ? '→' : '←'}
    </button>
  );

  return (
    <div className="relative z-10 flex min-h-screen select-none flex-col px-4 pb-8 pt-24">
      {/* 页眉：关卡编号 */}
      <header className="text-center">
        <p className="text-[10px] tracking-[0.42em]" style={{ color: 'var(--color-text-muted)' }}>
          MONUMENT ARCHIVE · IMPOSSIBLE GEOMETRY
        </p>
        <h2
          className="mt-2 font-display text-2xl tracking-[0.14em]"
          style={{ color: 'var(--color-accent-dim)' }}
        >
          {folderName || '纪念碑回廊'}
        </h2>
        <div className="mx-auto mt-3 flex items-center justify-center gap-3">
          <span className="h-px w-16" style={{ background: 'var(--color-accent-card-border)' }} />
          <span
            className="font-display text-[11px] tracking-[0.3em]"
            style={{ color: 'var(--color-accent)' }}
          >
            LEVEL {pad(cur + 1)} / 共 {pad(total)} 关
          </span>
          <span className="h-px w-16" style={{ background: 'var(--color-accent-card-border)' }} />
        </div>
      </header>

      {/* 关卡门：一屏一关，悬浮于视错觉空间 */}
      <div className="flex flex-1 items-center justify-center gap-5 lg:gap-10">
        <Arrow d={-1} />
        <div className="flex min-w-0 justify-center">
          <AnimatePresence mode="popLayout" custom={dir} initial={false}>
            <motion.button
              key={img.id ?? cur}
              custom={dir}
              variants={doorV}
              initial="enter"
              animate="center"
              exit="exit"
              transition={doorT}
              whileHover={{ scale: 1.02 }}
              className="block cursor-pointer"
              onClick={unlock}
              aria-label={`解锁关卡门：${img.name}`}
            >
              {/* 悬浮动画放内层，避免与 framer 变换冲突 */}
              <div style={{ animation: 'mv-float 6s ease-in-out infinite' }}>
                {/* 圆顶门形卡槽 + 浮雕边框，尺寸由照片宽高比驱动 */}
                <div
                  className="relative p-[12px]"
                  style={{
                    width: `min(76vw, calc(46vh * ${r}))`,
                    background:
                      'linear-gradient(180deg, var(--color-bg-elevated), var(--color-bg-surface))',
                    border: '1px solid var(--color-accent-card-border)',
                    borderRadius: '999px 999px 16px 16px',
                    boxShadow:
                      'inset 0 2px 0 rgba(255,255,255,0.9), inset 0 -4px 0 rgba(106,90,138,0.12), var(--card-shadow)',
                  }}
                >
                  {/* 浮雕内框线 */}
                  <div
                    className="pointer-events-none absolute inset-[6px]"
                    style={{
                      borderRadius: '999px 999px 12px 12px',
                      border: '1px dashed var(--color-accent-glass-border)',
                    }}
                  />
                  {/* 门楣菱形饰钉 */}
                  <div
                    className="absolute left-1/2 top-[6px] z-[2] h-3 w-3 -translate-x-1/2 rotate-45"
                    style={{ background: 'var(--color-moss)' }}
                  />
                  <img
                    src={img.url}
                    alt={img.name}
                    draggable="false"
                    loading="eager"
                    className="block w-full"
                    style={{
                      aspectRatio: r,
                      borderRadius: '999px 999px 10px 10px',
                      boxShadow: 'inset 0 0 0 1px rgba(106,90,138,0.15)',
                    }}
                  />
                </div>
                {/* 门阶 */}
                <div
                  className="mx-auto mt-[10px] h-[6px] w-3/5 rounded-full"
                  style={{ background: 'var(--color-accent-card-border)' }}
                />
                <div
                  className="mx-auto mt-[6px] h-[6px] w-2/5 rounded-full"
                  style={{ background: 'var(--color-accent-card-border)' }}
                />
                <p
                  className="mt-3 truncate text-center font-display text-[12px] tracking-[0.08em]"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {fileNameToTitle(img.name)}
                </p>
              </div>
            </motion.button>
          </AnimatePresence>
        </div>
        <Arrow d={1} />
      </div>

      {/* 页脚：图腾柱进度（每过一关升高一格，点击格跳关） */}
      <footer className="mt-6 flex flex-col items-center">
        <div className="flex flex-col-reverse items-center gap-[3px]">
          {images.slice(0, cur + 1).map((im, i) => (
            <motion.button
              key={im.id ?? i}
              initial={{ scaleY: 0, opacity: 0 }}
              animate={{ scaleY: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              onClick={() => {
                setDir(i >= cur ? 1 : -1);
                setCur(i);
              }}
              className="block cursor-pointer"
              style={{
                width: i === cur ? 30 : 20,
                height: segH,
                transformOrigin: 'center',
                background: TOTEM_COLORS[i % TOTEM_COLORS.length],
                borderRadius: 3,
                opacity: i === cur ? 1 : 0.5,
                boxShadow: i === cur ? '0 2px 8px var(--color-accent-shadow-hover)' : 'none',
              }}
              aria-label={`跳到第 ${i + 1} 关`}
            />
          ))}
          {/* 柱顶图腾眼 */}
          <motion.div
            key={`crown-${cur}`}
            initial={{ scale: 0, rotate: 45 }}
            animate={{ scale: 1, rotate: 45 }}
            transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
            className="mb-1 h-3 w-3"
            style={{ background: 'var(--color-moss)' }}
          />
        </div>
        <div
          className="mt-2 h-[6px] w-16 rounded-full"
          style={{ background: 'var(--color-accent-card-border)' }}
        />
        <p
          className="mt-3 text-[10px] tracking-[0.3em]"
          style={{ color: 'var(--color-text-muted)' }}
        >
          点击门解锁关卡 · ←/→ 换关 · ESC 关门
        </p>
      </footer>

      {/* ==================== 解锁查看浮层 ==================== */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[300] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={close}
          >
            <div
              className="absolute inset-0 backdrop-blur-md"
              style={{ background: 'rgba(74, 66, 96, 0.55)' }}
            />

            {/* 解锁表演：门框旋转 45° → 等轴测翻转消散（0.85s） */}
            {booting && (
              <motion.div
                className="absolute z-[3]"
                style={{
                  width: 92,
                  height: 140,
                  borderRadius: '999px 999px 10px 10px',
                  background:
                    'linear-gradient(160deg, var(--color-accent-light), var(--color-accent))',
                  boxShadow: '0 18px 50px rgba(40, 32, 64, 0.45)',
                }}
                initial={{ rotate: 0, rotateY: 0, opacity: 0, scale: 0.6 }}
                animate={{
                  rotate: [0, 45, 45, 45],
                  rotateY: [0, 0, 96, 96],
                  opacity: [0, 1, 1, 0],
                  scale: [0.6, 1, 1.05, 1.15],
                }}
                transition={{ duration: 0.85, times: [0, 0.3, 0.6, 1], ease: 'easeInOut' }}
              />
            )}

            {/* 照片面板：等轴测翻转 + 色块错位 */}
            <div style={{ perspective: 1400 }}>
              <AnimatePresence
                mode="wait"
                custom={{ d: dir, delay: panelDelay }}
                initial={false}
              >
                <motion.div
                  key={cur}
                  custom={{ d: dir, delay: panelDelay }}
                  variants={panelV}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* 错位色块（蓝/粉偏移） */}
                  <motion.div
                    aria-hidden
                    className="absolute -inset-[6px]"
                    style={{ background: 'var(--color-moss)', borderRadius: 6, opacity: 0.85 }}
                    initial={{ x: 0, y: 0 }}
                    animate={{ x: 16, y: -16 }}
                    transition={{ delay: panelDelay + 0.15, duration: 0.4 }}
                  />
                  <motion.div
                    aria-hidden
                    className="absolute -inset-[6px]"
                    style={{ background: 'var(--color-accent)', borderRadius: 6, opacity: 0.85 }}
                    initial={{ x: 0, y: 0 }}
                    animate={{ x: -16, y: 16 }}
                    transition={{ delay: panelDelay + 0.15, duration: 0.4 }}
                  />
                  <img
                    src={img.url}
                    alt={img.name}
                    draggable="false"
                    className="relative z-[1] max-h-[70vh] max-w-[88vw] object-contain"
                    style={{
                      border: '8px solid var(--color-bg-elevated)',
                      borderRadius: 4,
                      boxShadow: '0 28px 90px rgba(40, 32, 64, 0.5)',
                    }}
                  />
                  {/* 署名铭牌 */}
                  <motion.p
                    className="relative z-[1] mt-4 truncate text-center font-display text-base tracking-[0.1em]"
                    style={{ color: 'var(--color-bg-elevated)' }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: panelDelay + 0.25, duration: 0.35 }}
                  >
                    “{fileNameToTitle(img.name)}”
                  </motion.p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* 角标 */}
            <div className="pointer-events-none absolute left-5 top-4 z-[3] font-display text-[10px] tracking-[0.3em] text-white/80">
              LEVEL {pad(cur + 1)} · UNLOCKED
            </div>
            <div className="pointer-events-none absolute right-5 top-4 z-[3] font-display text-[10px] tracking-[0.3em] text-white/80">
              ←/→ 翻转 · ESC 关门
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
