import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fileNameToTitle } from '../utils/imageHelpers';
import { imgRatio, fitRowPx, packRows, fitContain } from '../utils/layoutEngine';
import { POEMS } from '../data/poems';

/**
 * HaiziReader — 诗与麦浪
 * 顶部诗歌带：从 src/data/poems.js 读 POEMS，每 10 秒淡入淡出轮转一句（含出处）；
 * 照片装裱成诗画帧（细木色边 + 底部手写题名），按片比分行错落挂起；
 * 点击照片 → 当前诗句 + 照片的诗签视图（fitContain + 完整诗句 + 出处 + 白告落款）。
 */

/** 确定性伪随机，避免每次渲染抖动 */
function seeded(i, salt = 0) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** 照片区统一高度（px）：帧宽 = 照片高 × 片比 + 装裱留白 */
const PHOTO_H = 150;
/** 帧比照片区多出的固定横宽：木边 padding(7×2) + 纸卡 padding(10×2) */
const FRAME_EXTRA_X = 34;
/** 行内帧间距（px） */
const GAP_X = 28;
/** 诗句轮转间隔（ms） */
const POEM_INTERVAL = 10000;

/** 测量陈列区可用宽度（响应式重排行） */
function useFieldWidth() {
  const ref = useRef(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setW(el.clientWidth);
    const ro = new ResizeObserver((es) => setW(es[0].contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

export default function HaiziReader({ images, folderName }) {
  const total = images.length;

  /** 诗歌带：每 10 秒轮转一句 */
  const [poemIdx, setPoemIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setPoemIdx((i) => (i + 1) % POEMS.length), POEM_INTERVAL);
    return () => clearInterval(t);
  }, []);

  /** 诗签视图：{ img, poem } —— 打开时捕获当下那句诗 */
  const [viewing, setViewing] = useState(null);

  const closeViewer = useCallback(() => setViewing(null), []);
  const step = useCallback(
    (dir) =>
      setViewing((v) => (v === null ? v : { ...v, img: (v.img + dir + total) % total })),
    [total]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeViewer();
      if (viewing === null) return;
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [viewing, closeViewer, step]);

  // 比例分行：片比驱动帧宽，行容量按陈列区宽/照片高估算
  const [fieldRef, fieldW] = useFieldWidth();
  const ratios = images.map(imgRatio);
  const maxPerRow = fieldW < 560 ? 2 : fieldW < 900 ? 3 : 4;
  const rows = fieldW > 0 ? packRows(ratios, fieldW / PHOTO_H, maxPerRow) : [];

  if (!total) return null;

  const poem = POEMS[poemIdx];

  return (
    <div className="relative z-10 flex min-h-screen select-none flex-col px-4 pb-16 pt-24">
      {/* ============ 诗歌带 — 10 秒淡入淡出轮转 ============ */}
      <header className="mx-auto w-full max-w-3xl text-center">
        <p className="text-[10px] tracking-[0.42em] text-[var(--color-text-muted)]">
          HAIZI · 诗与麦浪
        </p>
        <div className="mt-4 flex items-center justify-center gap-4">
          <span className="h-px w-14 bg-[var(--color-moss)] opacity-60" />
          <span className="font-display text-sm italic tracking-[0.2em] text-[var(--color-accent-dim)]">
            ✦
          </span>
          <span className="h-px w-14 bg-[var(--color-moss)] opacity-60" />
        </div>
        <div className="mt-3 flex min-h-[92px] items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={poemIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            >
              <p className="whitespace-pre-line font-body text-lg leading-relaxed tracking-[0.12em] text-[var(--color-text-primary)] sm:text-xl">
                {poem.text}
              </p>
              <footer className="mt-2 font-display text-xs italic tracking-[0.22em] text-[var(--color-text-secondary)]">
                —— 海子 {poem.from}
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>
        <p className="mt-2 text-[10px] tracking-[0.3em] text-[var(--color-text-muted)]">
          {folderName || '麦地'} · {total} 帧 · 点一帧读它的诗签
        </p>
      </header>

      {/* ============ 诗画帧陈列 — 按片比分行 ============ */}
      <div ref={fieldRef} className="mx-auto mt-10 w-[min(1100px,94vw)] flex-1">
        <div className="space-y-10">
          {rows.map((idxs, r) => {
            const inner = fieldW - idxs.length * FRAME_EXTRA_X;
            const { widths, height } = fitRowPx(
              idxs.map((i) => ratios[i]),
              inner,
              PHOTO_H,
              GAP_X
            );
            return (
              <div key={images[idxs[0]].id} className="flex justify-center" style={{ gap: `${GAP_X}px` }}>
                {idxs.map((i, k) => {
                  const rot = (seeded(i) - 0.5) * 3.2; // ±1.6°
                  const lift = seeded(i, 1) * 12; // 纵向错落
                  return (
                    // 外层承载静态错落 transform，内层交给 framer 做入场/hover，互不覆盖
                    <div key={images[i].id} style={{ transform: `translateY(${lift}px) rotate(${rot}deg)` }}>
                      <motion.div
                        className="hz-frame cursor-pointer"
                        style={{
                          background:
                            'linear-gradient(160deg, #a9805a 0%, #8a6644 45%, #7a5636 100%)',
                          padding: 7,
                          boxShadow: '0 10px 26px rgba(46,58,42,0.22)',
                        }}
                        initial={{ opacity: 0, y: 26 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12 + i * 0.07, type: 'spring', stiffness: 170, damping: 17 }}
                        whileHover={{ scale: 1.04 }}
                        onClick={() => setViewing({ img: i, poem: poemIdx })}
                      >
                      <div
                        style={{
                          background: '#fbf6e9',
                          padding: '10px 10px 7px',
                          boxShadow: 'inset 0 0 12px rgba(120,96,60,0.18)',
                        }}
                      >
                        <img
                          src={images[i].url}
                          alt={images[i].name}
                          draggable="false"
                          loading="lazy"
                          className="block object-cover"
                          style={{ width: Math.round(widths[k]), height: Math.round(height) }}
                        />
                        <p
                          className="mt-1.5 truncate text-center font-body text-[11px] italic tracking-[0.1em]"
                          style={{ color: '#5a4a32', maxWidth: Math.round(widths[k]) }}
                        >
                          {fileNameToTitle(images[i].name)}
                        </p>
                      </div>
                      </motion.div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-12 text-center font-display text-sm tracking-[0.3em] text-[var(--color-text-muted)]">
        — 面朝大海，春暖花开 · baigao —
      </p>

      {/* ============ 诗签视图 ============ */}
      <AnimatePresence>
        {viewing !== null && (
          <motion.div
            className="fixed inset-0 z-[300] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeViewer}
          >
            <div
              className="absolute inset-0 backdrop-blur-[5px]"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(58,50,30,0.5) 0%, rgba(26,24,14,0.92) 100%)',
              }}
            />
            <motion.div
              className="relative z-10 flex max-h-full flex-col items-center"
              initial={{ scale: 0.92, y: 36, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 230, damping: 21 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 诗签 — 木边 + 纸卡 */}
              <div
                style={{
                  background: 'linear-gradient(160deg, #a9805a 0%, #8a6644 45%, #7a5636 100%)',
                  padding: 9,
                  boxShadow: '0 40px 80px rgba(0,0,0,0.55), 0 0 60px rgba(232,131,74,0.16)',
                }}
              >
                <div
                  className="px-5 py-4 sm:px-7"
                  style={{
                    background: '#fbf6e9',
                    boxShadow: 'inset 0 0 16px rgba(120,96,60,0.2)',
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={viewing.img}
                      src={images[viewing.img].url}
                      alt={images[viewing.img].name}
                      draggable="false"
                      className="mx-auto block select-none"
                      style={(() => {
                        const s = fitContain(
                          Math.min(window.innerWidth * 0.78, 720),
                          window.innerHeight * 0.44,
                          imgRatio(images[viewing.img])
                        );
                        return {
                          width: s.width,
                          height: s.height,
                          maxWidth: '78vw',
                          maxHeight: '44vh',
                        };
                      })()}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.22 }}
                    />
                  </AnimatePresence>

                  {/* 当下那句诗 · 完整展示 */}
                  <div className="mt-4 text-center">
                    <p className="whitespace-pre-line font-body text-base leading-relaxed tracking-[0.12em] text-[#2e3a2a] sm:text-lg">
                      {POEMS[viewing.poem].text}
                    </p>
                    <p className="mt-2 font-display text-[11px] italic tracking-[0.22em] text-[#7a6a4a]">
                      —— 海子 {POEMS[viewing.poem].from}
                    </p>
                    <p className="mt-3 text-right font-body text-xs tracking-[0.3em] text-[#8a4520]">
                      白告
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-center font-display text-sm italic tracking-[0.2em] text-[var(--color-gold-pale,#f8cdb0)]">
                {fileNameToTitle(images[viewing.img].name)}
              </p>
              <p className="mt-1.5 text-center text-[10px] tracking-[0.28em] text-white/60">
                第 {String(viewing.img + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} 帧 · ←/→ 换一帧 · ESC 合上诗签
              </p>
            </motion.div>

            {/* 左右切换热区 */}
            <button
              className="absolute inset-y-0 left-0 z-20 w-[14vw] cursor-w-resize"
              onClick={(e) => { e.stopPropagation(); step(-1); }}
              aria-label="上一帧"
            />
            <button
              className="absolute inset-y-0 right-0 z-20 w-[14vw] cursor-e-resize"
              onClick={(e) => { e.stopPropagation(); step(1); }}
              aria-label="下一帧"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
