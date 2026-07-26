import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fileNameToTitle } from '../utils/imageHelpers';
import { imgRatio } from '../utils/layoutEngine';

const pad = (n) => String(n).padStart(2, '0');

/** 三连屏换位：侧卡滑入、中卡对称展开 */
const cardV = {
  enter: (d) => ({ opacity: 0, x: d * 140, scale: 0.82 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (d) => ({ opacity: 0, x: d * -140, scale: 0.82 }),
};
const cardT = { duration: 0.55, ease: [0.32, 0.72, 0, 1] };

/**
 * GrandbudapestReader — 布达佩斯大饭店主题的三连屏明信片架
 * 严格对称：中轴一张大明信片 + 两侧各一张小明信片，框高由照片宽高比驱动
 * 点击中卡 = 宽银幕电影定格（letterbox 黑条压入 + 斜体 caption），ESC/点击关闭
 */
export default function GrandbudapestReader({ images, theme = 'grandbudapest' }) {
  const total = images.length;
  const [cur, setCur] = useState(0);
  const [dir, setDir] = useState(1);
  const [frame, setFrame] = useState(false); // 宽银幕定格浮层

  const step = useCallback(
    (d) => {
      setDir(d);
      setCur((c) => (c + d + total) % total);
    },
    [total]
  );

  const closeFrame = useCallback(() => setFrame(false), []);

  // ---- 键盘：←/→ 轮换队列，ESC 退出定格 ----
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeFrame();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, closeFrame]);

  const leftIdx = (cur - 1 + total) % total;
  const rightIdx = (cur + 1) % total;
  const centerImg = images[cur];

  /** 明信片卡：白色卡纸垫 + 照片，尺寸由宽高比驱动 */
  const Postcard = ({ img, big, onClick, label }) => {
    const r = imgRatio(img);
    return (
      <motion.button
        custom={dir}
        variants={cardV}
        initial="enter"
        animate="center"
        exit="exit"
        transition={cardT}
        className="block cursor-pointer"
        style={{
          width: big ? `min(100%, calc(52vh * ${r}))` : `min(100%, calc(26vh * ${r}))`,
          opacity: big ? 1 : 0.82,
        }}
        onClick={onClick}
        aria-label={label}
      >
        <div
          className="p-[9px] transition-transform duration-300 hover:-translate-y-1"
          style={{
            background: 'var(--color-bg-elevated)',
            border: 'var(--card-border)',
            boxShadow: big ? 'var(--card-shadow-hover)' : 'var(--card-shadow)',
          }}
        >
          <img
            src={img.url}
            alt={img.name}
            draggable="false"
            loading={big ? 'eager' : 'lazy'}
            className="block w-full"
            style={{ aspectRatio: r }}
          />
          <p
            className="mt-2 truncate text-center font-display italic"
            style={{
              fontSize: big ? 13 : 10,
              color: 'var(--color-text-secondary)',
              letterSpacing: '0.06em',
            }}
          >
            {fileNameToTitle(img.name)}
          </p>
        </div>
      </motion.button>
    );
  };

  const Arrow = ({ d }) => (
    <button
      className="flex h-11 w-11 flex-none items-center justify-center rounded-full font-display text-lg transition-transform hover:scale-110"
      style={{
        border: '1px solid var(--color-accent-card-border-hover)',
        color: 'var(--color-accent)',
        background: 'var(--color-accent-glass-bg)',
      }}
      onClick={() => step(d)}
      aria-label={d > 0 ? '下一张' : '上一张'}
    >
      {d > 0 ? '→' : '←'}
    </button>
  );

  return (
    <div className="relative z-10 flex min-h-screen select-none flex-col px-4 pb-8 pt-24">
      {/* 页眉：酒店信笺式小标 */}
      <header className="text-center">
        <p className="text-[10px] tracking-[0.42em]" style={{ color: 'var(--color-text-muted)' }}>
          MENDL'S ARCHIVE · CONCIERGE DESK
        </p>
        <h2 className="mt-2 font-display text-2xl tracking-[0.14em]" style={{ color: 'var(--color-accent-dim)' }}>
          明信片陈列架
        </h2>
        <div className="mx-auto mt-3 flex items-center justify-center gap-3">
          <span className="h-px w-16" style={{ background: 'var(--color-accent-card-border)' }} />
          <span className="font-display text-[11px] tracking-[0.3em]" style={{ color: 'var(--color-accent)' }}>
            Nº {pad(cur + 1)} / {pad(total)}
          </span>
          <span className="h-px w-16" style={{ background: 'var(--color-accent-card-border)' }} />
        </div>
      </header>

      {/* 三连屏明信片架：严格对称 */}
      <div className="flex flex-1 items-center justify-center gap-5 lg:gap-9">
        <Arrow d={-1} />
        {/* 左侧卡槽 */}
        <div className="flex w-[clamp(110px,20vw,250px)] flex-none justify-center">
          {total > 1 && (
            <AnimatePresence mode="popLayout" custom={dir} initial={false}>
              <Postcard
                key={images[leftIdx].id ?? leftIdx}
                img={images[leftIdx]}
                onClick={() => step(-1)}
                label={`轮换到 ${images[leftIdx].name}`}
              />
            </AnimatePresence>
          )}
        </div>
        {/* 中轴大卡槽 */}
        <div className="flex w-[clamp(240px,42vw,620px)] flex-none justify-center">
          <AnimatePresence mode="popLayout" custom={dir} initial={false}>
            <Postcard
              key={centerImg.id ?? cur}
              img={centerImg}
              big
              onClick={() => setFrame(true)}
              label={`定格 ${centerImg.name}`}
            />
          </AnimatePresence>
        </div>
        {/* 右侧卡槽 */}
        <div className="flex w-[clamp(110px,20vw,250px)] flex-none justify-center">
          {total > 1 && (
            <AnimatePresence mode="popLayout" custom={dir} initial={false}>
              <Postcard
                key={images[rightIdx].id ?? rightIdx}
                img={images[rightIdx]}
                onClick={() => step(1)}
                label={`轮换到 ${images[rightIdx].name}`}
              />
            </AnimatePresence>
          )}
        </div>
        <Arrow d={1} />
      </div>

      {/* 页脚：酒店登记册签名行 */}
      <footer className="mt-8 text-center">
        <div className="mx-auto flex items-center justify-center gap-3">
          <span className="h-px w-24" style={{ background: 'var(--color-accent-card-border)' }} />
          <span className="font-display text-[13px]" style={{ color: 'var(--color-moss)' }}>✦</span>
          <span className="h-px w-24" style={{ background: 'var(--color-accent-card-border)' }} />
        </div>
        <p
          className="mt-3 font-display text-lg italic tracking-[0.1em]"
          style={{ color: 'var(--color-text-primary)' }}
        >
          The Grand Budapest Hotel · baigao
        </p>
        <p className="mt-1 text-[10px] tracking-[0.3em]" style={{ color: 'var(--color-text-muted)' }}>
          点击中卡进入宽银幕定格 · ←/→ 轮换 · ESC 退出
        </p>
      </footer>

      {/* ==================== 宽银幕电影定格 ==================== */}
      <AnimatePresence>
        {frame && (
          <motion.div
            className="fixed inset-0 z-[300] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={closeFrame}
          >
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

            {/* letterbox 黑条压入 */}
            <motion.div
              className="absolute inset-x-0 top-0 z-[2] bg-black"
              initial={{ height: 0 }}
              animate={{ height: '11vh' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.5, ease: [0.7, 0, 0.3, 1] }}
            />
            <motion.div
              className="absolute inset-x-0 bottom-0 z-[2] flex items-center justify-center bg-black"
              initial={{ height: 0 }}
              animate={{ height: '11vh' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.5, ease: [0.7, 0, 0.3, 1] }}
            >
              <motion.p
                className="max-w-[80vw] truncate font-display text-base italic tracking-[0.08em] sm:text-lg"
                style={{ color: 'var(--color-moss-pale)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.3 }}
              >
                “{fileNameToTitle(centerImg.name)}”
              </motion.p>
            </motion.div>

            {/* 定格画面（fitContain） */}
            <motion.div
              key={cur}
              className="relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.18, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={centerImg.url}
                alt={centerImg.name}
                draggable="false"
                className="max-h-[72vh] max-w-[92vw] object-contain"
                style={{
                  border: '6px solid var(--color-bg-elevated)',
                  boxShadow: '0 24px 80px rgba(0,0,0,0.65)',
                }}
              />
            </motion.div>

            {/* 角标 */}
            <div className="pointer-events-none absolute left-5 top-4 z-[3] font-display text-[10px] tracking-[0.3em] text-white/70">
              CINEMA SCOPE · Nº {pad(cur + 1)}
            </div>
            <div className="pointer-events-none absolute right-5 top-4 z-[3] font-display text-[10px] tracking-[0.3em] text-white/70">
              ESC / 点击 退出定格
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
