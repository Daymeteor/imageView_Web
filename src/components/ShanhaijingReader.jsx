import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fileNameToTitle } from '../utils/imageHelpers';
import { imgRatio } from '../utils/layoutEngine';

/** 册页照片区高度（vh），页宽由照片宽高比驱动 */
const LEAF_H = 58;

/** 朱砂印章 */
const Seal = ({ children, className = '' }) => (
  <span
    className={`flex items-center justify-center rounded-[2px] font-display ${className}`}
    style={{
      background: 'var(--color-gold)',
      color: 'var(--color-bg-primary)',
      writingMode: 'vertical-rl',
      letterSpacing: '0.08em',
      boxShadow: 'inset 0 0 4px rgba(110, 21, 21, 0.6)',
    }}
  >
    {children}
  </span>
);

/**
 * ShanhaijingReader — 山海经主题的手卷阅读器
 * 进入时画轴从右向左徐徐展开（clip 揭示）；照片装裱为横向排列的册页
 * （宣纸托底 + 细边框 + 右下朱砂印章），卷首题跋、卷尾落款
 * 点击册页 = 展开大图（fitContain）；←/→ 翻页 = 手卷平滑滚动到下一帧，ESC 退出
 */
export default function ShanhaijingReader({ images, theme = 'shanhaijing', folderName }) {
  const total = images.length;
  // 帧序列：0 = 卷首题跋，1..total = 册页，total+1 = 卷尾
  const last = total + 1;
  const [cur, setCur] = useState(0);
  const [openIdx, setOpenIdx] = useState(null); // 大图查看中的照片索引
  const trackRef = useRef(null);
  const leafRefs = useRef([]);

  const scrollToLeaf = useCallback(
    (i) => {
      const target = Math.min(Math.max(i, 0), last);
      setCur(target);
      const el = leafRefs.current[target];
      if (el) el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    },
    [last]
  );

  const step = useCallback(
    (d) => {
      setCur((c) => {
        const t = Math.min(Math.max(c + d, 0), last);
        const el = leafRefs.current[t];
        if (el) el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        return t;
      });
    },
    [last]
  );

  const closeView = useCallback(() => setOpenIdx(null), []);
  const stepView = useCallback(
    (d) => setOpenIdx((i) => (i === null ? null : (i + d + total) % total)),
    [total]
  );

  // ---- 键盘：←/→ 翻页（查看中切图），ESC 退出查看 ----
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeView();
      if (e.key === 'ArrowRight') (openIdx !== null ? stepView(1) : step(1));
      if (e.key === 'ArrowLeft') (openIdx !== null ? stepView(-1) : step(-1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, stepView, closeView, openIdx]);

  // ---- 手动滑动时同步当前帧（取轨道中心最近的册页）----
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const mid = track.scrollLeft + track.clientWidth / 2;
        let best = 0;
        let bestDist = Infinity;
        leafRefs.current.forEach((el, i) => {
          if (!el) return;
          const c = el.offsetLeft + el.offsetWidth / 2;
          const dist = Math.abs(c - mid);
          if (dist < bestDist) {
            bestDist = dist;
            best = i;
          }
        });
        setCur(best);
      });
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      track.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const dateStr = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const openImg = openIdx !== null ? images[openIdx] : null;

  // ==================== 册页 ====================
  const Leaf = ({ img, idx }) => {
    const r = imgRatio(img);
    return (
      <button
        ref={(el) => {
          leafRefs.current[idx + 1] = el;
        }}
        className="flex flex-none cursor-pointer flex-col items-center justify-center px-[clamp(20px,4vw,56px)]"
        style={{ height: '100%' }}
        onClick={() => setOpenIdx(idx)}
        aria-label={`展开大图 ${img.name}`}
      >
        {/* 宣纸托底 + 细边框 */}
        <div
          className="shj-paper relative p-[14px] transition-transform duration-300 hover:-translate-y-1.5"
          style={{
            border: '1px solid var(--color-accent-card-border)',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          <img
            src={img.url}
            alt={img.name}
            draggable="false"
            loading="lazy"
            className="block"
            style={{
              height: `${LEAF_H}vh`,
              width: `min(calc(${LEAF_H}vh * ${r}), 78vw)`,
              aspectRatio: r,
              objectFit: 'contain',
              background: 'var(--color-bg-deep)',
            }}
          />
          {/* 右下朱砂印章 */}
          <Seal className="absolute bottom-[22px] right-[22px] px-[3px] py-[5px] text-[10px]">
            baigao
          </Seal>
        </div>
        <p
          className="mt-3 max-w-[70vw] truncate font-display text-[13px] tracking-[0.2em]"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {fileNameToTitle(img.name)}
        </p>
      </button>
    );
  };

  // ==================== 卷首题跋 / 卷尾 ====================
  const TitleLeaf = (
    <div
      ref={(el) => {
        leafRefs.current[0] = el;
      }}
      className="flex flex-none items-center justify-center px-[clamp(24px,5vw,72px)]"
      style={{ height: '100%' }}
    >
      <div
        className="shj-paper relative flex h-[64vh] w-[clamp(240px,32vw,360px)] flex-col items-center justify-between py-10"
        style={{
          border: '1px solid var(--color-accent-card-border)',
          boxShadow: 'var(--card-shadow)',
        }}
      >
        <div className="flex flex-col items-center gap-6" style={{ writingMode: 'vertical-rl' }}>
          <span
            className="text-[10px] tracking-[0.5em]"
            style={{ color: 'var(--color-text-muted)' }}
          >
            山海图志 · 影之卷
          </span>
          <h1
            className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-semibold tracking-[0.35em]"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {folderName || '山海经'}
          </h1>
        </div>
        <div className="flex flex-col items-center gap-3 text-center">
          <Seal className="px-[4px] py-[8px] text-[12px]">baigao</Seal>
          <p className="font-display text-[11px] tracking-[0.24em]" style={{ color: 'var(--color-text-secondary)' }}>
            {dateStr} · 凡 {total} 帧
          </p>
          <p className="text-[10px] tracking-[0.3em]" style={{ color: 'var(--color-text-muted)' }}>
            → 展卷
          </p>
        </div>
      </div>
    </div>
  );

  const EndLeaf = (
    <div
      ref={(el) => {
        leafRefs.current[last] = el;
      }}
      className="flex flex-none items-center justify-center px-[clamp(24px,5vw,72px)]"
      style={{ height: '100%' }}
    >
      <div
        className="shj-paper relative flex h-[64vh] w-[clamp(200px,26vw,300px)] flex-col items-center justify-center gap-8"
        style={{
          border: '1px solid var(--color-accent-card-border)',
          boxShadow: 'var(--card-shadow)',
        }}
      >
        <p
          className="font-display text-[clamp(1.4rem,3vw,2rem)] tracking-[0.4em]"
          style={{ color: 'var(--color-text-primary)', writingMode: 'vertical-rl' }}
        >
          卷终 · baigao
        </p>
        <button
          className="border px-6 py-2 font-display text-[12px] tracking-[0.3em] transition-colors"
          style={{
            borderColor: 'var(--color-accent-card-border-hover)',
            color: 'var(--color-accent)',
          }}
          onClick={() => scrollToLeaf(0)}
        >
          再展一卷
        </button>
      </div>
    </div>
  );

  // ==================== 渲染 ====================
  return (
    <div className="relative z-10 flex min-h-screen select-none flex-col pb-8 pt-24">
      {/* 页眉：卷次小标 */}
      <header className="px-4 text-center">
        <p className="text-[10px] tracking-[0.42em]" style={{ color: 'var(--color-text-muted)' }}>
          CLASSIC OF MOUNTAINS · HANDSCROLL
        </p>
        <div className="mx-auto mt-2 flex items-center justify-center gap-3">
          <span className="h-px w-14" style={{ background: 'var(--color-accent-card-border)' }} />
          <span className="font-display text-[12px] tracking-[0.3em]" style={{ color: 'var(--color-accent-dim)' }}>
            {cur === 0 ? '卷首' : cur === last ? '卷尾' : `第 ${cur} 帧 / 共 ${total} 帧`}
          </span>
          <span className="h-px w-14" style={{ background: 'var(--color-accent-card-border)' }} />
        </div>
      </header>

      {/* 手卷：进入时从右向左徐徐展开（clip 揭示） */}
      <div className="relative mt-4 flex-1">
        <motion.div
          className="h-full"
          initial={{ clipPath: 'inset(0 0 0 96%)' }}
          animate={{ clipPath: 'inset(0 0 0 0%)' }}
          transition={{ duration: 1.1, ease: [0.32, 0.72, 0, 1] }}
        >
          <div
            ref={trackRef}
            className="shj-scroll flex h-full items-center overflow-x-auto scroll-smooth"
          >
            {TitleLeaf}
            {images.map((img, i) => (
              <Leaf key={img.id ?? i} img={img} idx={i} />
            ))}
            {EndLeaf}
          </div>
        </motion.div>

        {/* 左右翻页（沿卷滑动） */}
        {cur > 0 && (
          <button
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full font-display text-lg transition-transform hover:scale-110"
            style={{
              border: '1px solid var(--color-accent-card-border-hover)',
              color: 'var(--color-accent)',
              background: 'var(--color-accent-glass-bg)',
            }}
            onClick={() => step(-1)}
            aria-label="上一帧"
          >
            ←
          </button>
        )}
        {cur < last && (
          <button
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full font-display text-lg transition-transform hover:scale-110"
            style={{
              border: '1px solid var(--color-accent-card-border-hover)',
              color: 'var(--color-accent)',
              background: 'var(--color-accent-glass-bg)',
            }}
            onClick={() => step(1)}
            aria-label="下一帧"
          >
            →
          </button>
        )}
      </div>

      {/* 页脚：墨迹进度线 */}
      <footer className="mt-4 px-6">
        <div
          className="relative mx-auto h-[2px] max-w-md overflow-hidden rounded-full"
          style={{ background: 'var(--color-accent-card-border)' }}
        >
          <motion.div
            className="absolute inset-y-0 left-0"
            style={{ background: 'var(--color-moss)' }}
            animate={{ width: `${(cur / last) * 100}%` }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        </div>
        <p className="mt-3 text-center text-[10px] tracking-[0.3em]" style={{ color: 'var(--color-text-muted)' }}>
          点击册页展图 · ←/→ 翻页 · ESC 收起
        </p>
      </footer>

      {/* ==================== 大图展开浮层 ==================== */}
      <AnimatePresence>
        {openImg && (
          <motion.div
            className="fixed inset-0 z-[300] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={closeView}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            {/* 宣纸装裱大图（fitContain） */}
            <motion.div
              key={openImg.id ?? openIdx}
              className="relative"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.12, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="relative p-[16px]"
                style={{
                  background: 'var(--color-bg-surface)',
                  border: '1px solid rgba(250, 246, 234, 0.35)',
                  boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
                }}
              >
                <img
                  src={openImg.url}
                  alt={openImg.name}
                  draggable="false"
                  className="max-h-[74vh] max-w-[88vw] object-contain"
                  style={{ background: 'var(--color-bg-deep)' }}
                />
                <Seal className="absolute bottom-[26px] right-[26px] px-[3px] py-[6px] text-[11px]">
                  baigao
                </Seal>
              </div>
              <p
                className="mt-4 text-center font-display text-base tracking-[0.2em]"
                style={{ color: 'var(--color-accent-pale)' }}
              >
                {fileNameToTitle(openImg.name)}
                <span className="ml-4 text-[11px] tracking-[0.3em] text-white/60">
                  第 {openIdx + 1} 帧 / 共 {total} 帧
                </span>
              </p>
            </motion.div>

            {/* 浮层内 ←/→ */}
            {total > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 z-[2] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 font-display text-xl text-white/80 transition-colors hover:bg-white/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    stepView(-1);
                  }}
                  aria-label="上一张"
                >
                  ←
                </button>
                <button
                  className="absolute right-4 top-1/2 z-[2] flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 font-display text-xl text-white/80 transition-colors hover:bg-white/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    stepView(1);
                  }}
                  aria-label="下一张"
                >
                  →
                </button>
              </>
            )}

            <div className="pointer-events-none absolute right-5 top-4 z-[3] font-display text-[10px] tracking-[0.3em] text-white/70">
              ESC / 点击 收起
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
