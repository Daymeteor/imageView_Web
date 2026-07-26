import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fileNameToTitle } from '../utils/imageHelpers';
import { imgRatio, packRows, fitRowPx } from '../utils/layoutEngine';

const pad = (n) => String(n).padStart(3, '0');

/** 真理部口号 — 电幕底部滚动条内容 */
const SLOGANS = ['战争即和平', 'WAR IS PEACE', '自由即奴役', 'FREEDOM IS SLAVERY', '无知即力量', 'IGNORANCE IS STRENGTH'];

/** 网格入场：档案卡逐份归档 */
const gridV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.045, delayChildren: 0.08 } },
};
const cardV = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } },
};

/** 老大哥眼睛小标 */
function BigBrotherEye({ size = 44 }) {
  return (
    <svg width={size} height={size * 0.62} viewBox="0 0 44 28" fill="none" aria-hidden="true">
      <path
        d="M2 14 C10 3, 34 3, 42 14 C34 25, 10 25, 2 14 Z"
        stroke="var(--color-accent-light)"
        strokeWidth="1.6"
        fill="rgba(183,28,28,0.12)"
      />
      <circle cx="22" cy="14" r="6.5" fill="var(--color-accent)" />
      <circle cx="22" cy="14" r="2.6" fill="#0d0d0d" />
      <path d="M22 1 v4 M22 23 v4" stroke="var(--color-accent-light)" strokeWidth="1.4" />
    </svg>
  );
}

/**
 * Nineteen84Reader — 一九八四主题的真理部档案墙阅读器
 * 档案卡网格（打字机字体 + 粗边框 + 斜盖红章"已审查"）→ 点击电幕全屏检视
 * （红色扫描线周期扫过 + CRT 闪烁 + 老大哥眼睛 + 底部口号滚动条）
 */
export default function Nineteen84Reader({ images, theme = 'nineteen84' }) {
  const total = images.length;
  const [viewerIdx, setViewerIdx] = useState(null);
  const gridRef = useRef(null);
  const [gridW, setGridW] = useState(0);

  const openViewer = useCallback((idx) => setViewerIdx(idx), []);
  const closeViewer = useCallback(() => setViewerIdx(null), []);
  const stepViewer = useCallback(
    (dir) => setViewerIdx((i) => (i === null ? i : (i + dir + total) % total)),
    [total]
  );

  // ---- 键盘：←/→ 切换，ESC 关闭电幕 ----
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

  // ---- 电幕开启时锁定背景滚动 ----
  useEffect(() => {
    if (viewerIdx === null) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [viewerIdx]);

  // ---- 档案墙容器宽度测量（比例布局依赖） ----
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setGridW(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ---- justified 档案墙：packRows 分行 + fitRowPx 定宽，卡槽比 = 照片比，零裁切 ----
  const rows = useMemo(() => {
    if (!gridW) return [];
    const rowH = gridW < 560 ? 150 : 210;
    const gap = 18;
    const ratios = images.map(imgRatio);
    return packRows(ratios, gridW / rowH, gridW < 560 ? 3 : 5).map((idxs) => {
      const { widths, height } = fitRowPx(idxs.map((i) => ratios[i]), gridW, rowH, gap);
      return { idxs, widths, height };
    });
  }, [images, gridW]);

  const current = viewerIdx !== null ? images[viewerIdx] : null;

  return (
    <div className="relative z-10 min-h-screen select-none px-4 pb-16 pt-24 lg:px-8">
      {/* ==================== 真理部档案墙 ==================== */}
      <div className="mx-auto max-w-7xl">
        <div
          className="mb-6 border-b-2 pb-4"
          style={{ borderColor: 'var(--color-accent-card-border)' }}
        >
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p
                className="mb-1 text-[11px] tracking-[0.3em]"
                style={{ color: 'var(--color-accent-light)' }}
              >
                MINISTRY OF TRUTH · RECORDS DEPARTMENT
              </p>
              <h2 className="font-display text-xl tracking-[0.1em] text-[var(--color-text-primary)] lg:text-2xl">
                真理部档案墙
              </h2>
            </div>
            <p className="text-[11px] tracking-[0.2em]" style={{ color: 'var(--color-text-muted)' }}>
              存档 {pad(total)} 份 · 全部已通过审查
            </p>
          </div>
        </div>

        <div ref={gridRef}>
          <motion.div className="flex flex-col gap-[18px]" variants={gridV} initial="hidden" animate="show">
            {rows.map((row, ri) => (
              <div key={ri} className="flex gap-[18px]">
                {row.idxs.map((imgIdx, ci) => {
                  const img = images[imgIdx];
                  return (
                    <motion.button
                      key={img.id ?? imgIdx}
                      variants={cardV}
                      className="group relative block flex-none cursor-pointer text-left transition-transform duration-200 hover:-translate-y-1"
                      style={{
                        width: row.widths[ci],
                        border: 'var(--card-border)',
                        background: 'var(--color-bg-surface)',
                        boxShadow: 'var(--card-shadow)',
                      }}
                      onClick={() => openViewer(imgIdx)}
                      aria-label={`检视档案 ${img.name}`}
                    >
                      {/* 卡头：档案编号 */}
                      <div
                        className="flex items-center justify-between border-b px-2.5 py-1.5 text-[10px] tracking-[0.16em]"
                        style={{
                          borderColor: 'var(--color-accent-card-border)',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        <span>档案 No.{pad(imgIdx + 1)}</span>
                        <span style={{ color: 'var(--color-accent-light)' }}>MINITRUE</span>
                      </div>
                      {/* 照片：比例卡槽，object-contain 不裁切 */}
                      <div
                        className="relative flex items-center justify-center overflow-hidden"
                        style={{ height: row.height, background: 'var(--color-bg-deep)' }}
                      >
                        <img
                          src={img.url}
                          alt={img.name}
                          draggable="false"
                          loading="lazy"
                          className="max-h-full max-w-full object-contain transition-[filter] duration-200 group-hover:brightness-110"
                        />
                        {/* 斜盖红章：已审查 */}
                        <span
                          className="pointer-events-none absolute right-2 top-2 z-[2] -rotate-12 border-2 px-1.5 py-0.5 text-[9px] font-bold tracking-[0.14em]"
                          style={{
                            borderColor: 'var(--color-accent)',
                            color: 'var(--color-accent-light)',
                            background: 'rgba(26,26,26,0.55)',
                            textShadow: '0 0 6px rgba(183,28,28,0.5)',
                          }}
                        >
                          已审查 APPROVED
                        </span>
                        {/* 电幕扫描：hover 红线扫过 */}
                        <span
                          className="pointer-events-none absolute inset-x-0 -top-[6%] z-[2] h-[8%] opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-hover:animate-[n84-scan_0.7s_linear_infinite]"
                          style={{
                            background:
                              'linear-gradient(180deg, transparent, rgba(183,28,28,0.55), transparent)',
                          }}
                        />
                      </div>
                      {/* 卡脚：文件名 */}
                      <div
                        className="truncate border-t px-2.5 py-1.5 text-[10px] tracking-[0.1em]"
                        style={{
                          borderColor: 'var(--color-accent-card-border)',
                          color: 'var(--color-text-muted)',
                        }}
                      >
                        {fileNameToTitle(img.name)}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ==================== 电幕全屏检视 ==================== */}
      <AnimatePresence>
        {current && (
          <motion.div
            className="fixed inset-0 z-[300] flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeViewer}
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" />

            {/* 顶栏：老大哥在看着你 */}
            <div className="pointer-events-none relative z-[3] flex items-start justify-between px-5 pt-5">
              <div className="text-[11px] leading-5 tracking-[0.18em]" style={{ color: 'var(--color-text-secondary)' }}>
                <p style={{ color: 'var(--color-accent-light)' }}>▸ TELESCREEN 电幕检视</p>
                <p>档案 No.{pad(viewerIdx + 1)} / {pad(total)}</p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <BigBrotherEye />
                <span className="text-[9px] tracking-[0.28em]" style={{ color: 'var(--color-accent-light)' }}>
                  BIG BROTHER IS WATCHING YOU
                </span>
              </div>
            </div>

            {/* 主屏：照片 + 扫描线 + CRT 闪烁 */}
            <div className="relative z-[2] flex min-h-0 flex-1 items-center justify-center px-6">
              <motion.div
                key={viewerIdx}
                className="relative"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="n84-crt relative overflow-hidden"
                  style={{
                    border: '3px solid var(--color-accent-card-border)',
                    boxShadow: '0 0 60px rgba(183,28,28,0.18), inset 0 0 40px rgba(0,0,0,0.6)',
                  }}
                >
                  <img
                    src={current.url}
                    alt={current.name}
                    draggable="false"
                    className="max-h-[66vh] max-w-[86vw] object-contain"
                  />
                  {/* CRT 扫描线纹理 */}
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        'repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0.22) 1px, transparent 1px, transparent 3px)',
                    }}
                  />
                  {/* 红色扫描线周期扫过 */}
                  <div
                    className="n84-scanline pointer-events-none absolute inset-x-0 -top-[4%] h-[4%]"
                    style={{
                      background:
                        'linear-gradient(180deg, transparent, rgba(212,58,58,0.7), transparent)',
                      boxShadow: '0 0 18px 4px rgba(183,28,28,0.35)',
                    }}
                  />
                  {/* CRT 闪烁层 */}
                  <div className="n84-flicker pointer-events-none absolute inset-0 bg-white/[0.03]" />
                  {/* 暗角 */}
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{ boxShadow: 'inset 0 0 90px rgba(0,0,0,0.55)' }}
                  />
                </div>
                {/* 屏下标注 */}
                <div
                  className="flex items-center justify-between border-2 border-t-0 px-3 py-1.5 text-[10px] tracking-[0.14em]"
                  style={{
                    borderColor: 'var(--color-accent-card-border)',
                    background: 'var(--color-bg-deep)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  <span className="truncate">{current.name}</span>
                  <span style={{ color: 'var(--color-accent-light)' }}>已审查 APPROVED</span>
                </div>
              </motion.div>
            </div>

            {/* 底部：口号滚动条 + 操作提示 */}
            <div className="relative z-[3] pb-4">
              <div
                className="overflow-hidden border-y-2 py-1.5"
                style={{
                  borderColor: 'var(--color-accent-card-border)',
                  background: 'var(--color-bg-deep)',
                }}
              >
                <div className="n84-marquee flex w-max whitespace-nowrap">
                  {[0, 1].map((copy) => (
                    <span
                      key={copy}
                      className="text-[12px] font-bold tracking-[0.3em]"
                      style={{ color: 'var(--color-accent-light)' }}
                    >
                      {SLOGANS.map((s) => (
                        <span key={`${copy}-${s}`} className="mx-6">
                          {s} ✦
                        </span>
                      ))}
                    </span>
                  ))}
                </div>
              </div>
              <p
                className="pointer-events-none mt-2 text-center text-[10px] tracking-[0.22em]"
                style={{ color: 'var(--color-text-muted)' }}
              >
                ←/→ 切换档案 · ESC 关闭电幕
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
