import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fileNameToTitle } from '../utils/imageHelpers';
import { imgRatio, fitContain } from '../utils/layoutEngine';

/** 手写歌词注 — 都市轻愁短句（≤10 字），按片序循环取用 */
const LYRICS = [
  '夜风把霓虹吹皱',
  '雨停在第三盏路灯',
  '城市替我失眠',
  '把孤独唱得很轻',
  '黄昏慢了一拍',
  '街角咖啡凉半杯',
  '思念没过斑马线',
  '末班车开向明天',
  '晚风掠过旧天台',
  '把心事调成静音',
  '灯火与影子和解',
  '慢一点，天还没亮',
  '城市在耳边低语',
  '把黄昏折进口袋',
  '霓虹在雨里融化',
  '一个人也很热闹',
];

/** 复古蓝红双线（一粗一细，错位排列） */
const DoubleRule = ({ flip = false }) => (
  <div className="w-full" aria-hidden="true">
    <div style={{ height: 2, background: flip ? '#c03a3a' : '#3a5a8a', opacity: 0.7 }} />
    <div style={{ height: 1, background: flip ? '#3a5a8a' : '#c03a3a', opacity: 0.55, marginTop: 3, width: '72%', marginLeft: flip ? 'auto' : 0, marginRight: flip ? 0 : 'auto' }} />
  </div>
);

/** 和纸胶带条 */
const Tape = ({ color, style }) => (
  <span
    aria-hidden="true"
    className="absolute z-10 block"
    style={{
      width: 74,
      height: 22,
      backgroundColor: color,
      opacity: 0.72,
      boxShadow: '0 1px 3px rgba(74,68,56,0.25)',
      ...style,
    }}
  />
);

/**
 * DeantingReader — 丁世光「专辑内页 Booklet」
 * 跨页形式：左页斜贴照片（和纸胶带 + TRACK Nº），右页手写歌词注 + 蓝红双线；
 * ←/→ 翻页时纸张轻掀（rotateY 微翻）；点照片 → 放大细读
 */
export default function DeantingReader({ images, folderName }) {
  const total = images.length;
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);
  const [viewerIdx, setViewerIdx] = useState(null);
  const flipping = useRef(false);

  const flip = useCallback(
    (d) => {
      if (flipping.current || total < 2) return;
      flipping.current = true;
      setDir(d);
      setPage((p) => (p + d + total) % total);
      setTimeout(() => { flipping.current = false; }, 480);
    },
    [total]
  );

  const navViewer = useCallback(
    (d) => setViewerIdx((v) => (v === null ? null : (v + d + total) % total)),
    [total]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (viewerIdx !== null) {
        if (e.key === 'Escape') setViewerIdx(null);
        if (e.key === 'ArrowRight') navViewer(1);
        if (e.key === 'ArrowLeft') navViewer(-1);
      } else {
        if (e.key === 'ArrowRight') flip(1);
        if (e.key === 'ArrowLeft') flip(-1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [viewerIdx, flip, navViewer]);

  if (!total) return null;

  const img = images[page];
  const r = imgRatio(img);
  // 左页照片区：比例驱动，完整放入页内（不裁切）
  const boxW = Math.min(window.innerWidth * 0.36, 400);
  const boxH = Math.min(window.innerHeight * 0.46, 460);
  const photoSize = fitContain(boxW, boxH, r);
  const lyric = LYRICS[page % LYRICS.length];

  const pageBg = 'linear-gradient(180deg, #fdf8ec 0%, #f7efdd 100%)';
  const pageShadow = '0 24px 50px rgba(74,68,56,0.28), 0 2px 8px rgba(74,68,56,0.16)';

  return (
    <div className="relative z-10 flex min-h-screen select-none flex-col items-center px-4 pb-16 pt-24">
      {/* 页眉 */}
      <header className="text-center">
        <p className="text-[10px] tracking-[0.42em] text-[var(--color-text-muted)]">ALBUM BOOKLET · INNER PAGES</p>
        <h2 className="mt-2 font-display text-3xl tracking-[0.14em] text-[var(--color-accent-dim)]">
          {folderName || '神经志'}
        </h2>
        <p className="mt-2 text-[11px] tracking-[0.22em] text-[var(--color-text-muted)]">
          一张一页 · 共 {total} 首 · ←/→ 翻页
        </p>
      </header>

      {/* 跨页 — 纸张轻掀 */}
      <div className="mt-8 w-full max-w-[1020px]" style={{ perspective: 1800 }}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={page}
            className="flex flex-col md:flex-row"
            style={{
              transformOrigin: dir > 0 ? 'left center' : 'right center',
              transformPerspective: 1800,
              boxShadow: pageShadow,
              borderRadius: 4,
            }}
            initial={{ rotateY: dir > 0 ? -14 : 14, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: dir > 0 ? 10 : -10, opacity: 0 }}
            transition={{ duration: 0.46, ease: 'easeOut' }}
          >
            {/* ===== 左页：斜贴照片 ===== */}
            <div
              className="relative flex flex-1 flex-col items-center justify-center px-8 py-10"
              style={{ background: pageBg, borderRadius: '4px 0 0 4px' }}
            >
              <motion.button
                className="group relative cursor-pointer"
                style={{ rotate: -2.2 }}
                whileHover={{ rotate: -0.8, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                onClick={() => setViewerIdx(page)}
                aria-label={`放大 ${img.name}`}
              >
                {/* 和纸胶带 */}
                <Tape color="rgba(58,90,138,0.5)" style={{ top: -10, left: -22, transform: 'rotate(-38deg)' }} />
                <Tape color="rgba(192,58,58,0.45)" style={{ top: -10, right: -22, transform: 'rotate(38deg)' }} />
                {/* 白卡相框 */}
                <div className="bg-[#fffdf6] p-2.5 pb-8" style={{ boxShadow: '0 10px 26px rgba(74,68,56,0.26)' }}>
                  <img
                    src={img.url}
                    alt={img.name}
                    draggable="false"
                    className="block object-contain"
                    style={{ width: photoSize.width, height: photoSize.height }}
                  />
                  <p className="mt-2 text-center text-[11px] tracking-[0.2em] text-[var(--color-text-secondary)]">
                    {fileNameToTitle(img.name)}
                  </p>
                </div>
              </motion.button>
              <p className="mt-6 font-display text-[12px] tracking-[0.34em] text-[var(--color-accent)]">
                TRACK Nº {String(page + 1).padStart(2, '0')}
              </p>
            </div>

            {/* 书脊 */}
            <div
              className="hidden w-[14px] md:block"
              style={{ background: 'linear-gradient(90deg, rgba(74,68,56,0.22), rgba(74,68,56,0.05) 55%, rgba(74,68,56,0.2))' }}
              aria-hidden="true"
            />

            {/* ===== 右页：手写歌词注 ===== */}
            <div
              className="relative flex flex-1 flex-col justify-between overflow-hidden px-8 py-10"
              style={{ background: pageBg, borderRadius: '0 4px 4px 0' }}
            >
              {/* 淡色拼贴块 */}
              <div className="pointer-events-none absolute -right-8 top-16 h-40 w-40 rotate-6" style={{ background: 'rgba(58,90,138,0.07)' }} aria-hidden="true" />
              <div className="pointer-events-none absolute -left-6 bottom-14 h-24 w-24 -rotate-3" style={{ background: 'rgba(192,58,58,0.06)' }} aria-hidden="true" />

              <div>
                <DoubleRule />
                <p className="mt-3 text-[10px] tracking-[0.4em] text-[var(--color-text-muted)]">LYRIC NOTE · 歌词注</p>
              </div>

              <div className="relative py-8 text-center">
                <p
                  className="text-[26px] leading-relaxed tracking-[0.2em] text-[var(--color-text-primary)]"
                  style={{ fontFamily: "'Noto Serif SC', serif", fontStyle: 'italic' }}
                >
                  「{lyric}」
                </p>
                <span className="mx-auto mt-5 block h-1.5 w-1.5 rounded-full" style={{ background: '#c03a3a', opacity: 0.75 }} />
                <p className="mt-4 text-[11px] tracking-[0.26em] text-[var(--color-text-muted)]">
                  — 写给 {fileNameToTitle(img.name)}
                </p>
              </div>

              <div>
                <DoubleRule flip />
                <p className="mt-3 text-right text-[10px] tracking-[0.3em] text-[var(--color-text-muted)]">
                  P.{String(page + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 翻页按钮 */}
      <div className="mt-6 flex items-center gap-6">
        <button
          className="cursor-pointer font-display text-sm tracking-[0.3em] text-[var(--color-accent)] transition-opacity hover:opacity-60"
          onClick={() => flip(-1)}
          aria-label="上一页"
        >
          ← 前页
        </button>
        <span className="text-[11px] tracking-[0.3em] text-[var(--color-text-muted)]">
          {String(page + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <button
          className="cursor-pointer font-display text-sm tracking-[0.3em] text-[var(--color-accent)] transition-opacity hover:opacity-60"
          onClick={() => flip(1)}
          aria-label="下一页"
        >
          次页 →
        </button>
      </div>

      {/* 页脚 */}
      <p className="mt-10 text-center font-display text-sm tracking-[0.3em] text-[var(--color-text-muted)]">
        — 神经志 · baigao —
      </p>

      {/* ==================== 放大细读浮层 ==================== */}
      <AnimatePresence>
        {viewerIdx !== null && (
          <motion.div
            className="fixed inset-0 z-[300] flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={() => setViewerIdx(null)}
          >
            <div className="absolute inset-0 bg-[#2b2b26]/55 backdrop-blur-md" />

            <motion.div
              key={viewerIdx}
              className="relative z-10"
              initial={{ scale: 0.82, rotateY: -16, opacity: 0 }}
              animate={{ scale: 1, rotateY: 0, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 240, damping: 21 }}
              style={{ transformPerspective: 1600 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-[#fffdf6] p-3 pb-4" style={{ boxShadow: '0 30px 70px rgba(30,28,22,0.5)' }}>
                <Tape color="rgba(58,90,138,0.5)" style={{ top: -10, left: '12%', transform: 'rotate(-6deg)' }} />
                <Tape color="rgba(192,58,58,0.45)" style={{ top: -10, right: '12%', transform: 'rotate(6deg)' }} />
                <img
                  src={images[viewerIdx].url}
                  alt={images[viewerIdx].name}
                  draggable="false"
                  className="block object-contain"
                  style={(() => {
                    const s = fitContain(window.innerWidth * 0.74, window.innerHeight * 0.64, imgRatio(images[viewerIdx]));
                    return { width: s.width, height: s.height, maxWidth: '74vw', maxHeight: '64vh' };
                  })()}
                />
                <p className="mt-3 text-center font-display text-sm tracking-[0.18em] text-[var(--color-text-secondary)]">
                  TRACK Nº {String(viewerIdx + 1).padStart(2, '0')} · {fileNameToTitle(images[viewerIdx].name)}
                </p>
                <p
                  className="mt-1 text-center text-[15px] tracking-[0.18em] text-[var(--color-text-primary)]"
                  style={{ fontFamily: "'Noto Serif SC', serif", fontStyle: 'italic' }}
                >
                  「{LYRICS[viewerIdx % LYRICS.length]}」
                </p>
              </div>
            </motion.div>

            <p className="relative z-10 mt-5 text-[11px] tracking-[0.3em] text-white/75">
              ←/→ 换一首 · ESC 合上内页
            </p>

            {/* 左右切换热区 */}
            <button
              className="absolute inset-y-0 left-0 z-20 w-[14vw] cursor-w-resize"
              onClick={(e) => { e.stopPropagation(); navViewer(-1); }}
              aria-label="上一张"
            />
            <button
              className="absolute inset-y-0 right-0 z-20 w-[14vw] cursor-e-resize"
              onClick={(e) => { e.stopPropagation(); navViewer(1); }}
              aria-label="下一张"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
