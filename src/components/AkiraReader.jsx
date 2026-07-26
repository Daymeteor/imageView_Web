import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fileNameToTitle } from '../utils/imageHelpers';
import { imgRatio } from '../utils/layoutEngine';

const pad = (n) => String(n).padStart(2, '0');

/** 胶囊高宽比：由照片真实宽高比驱动（竖片胶囊更长），不设固定格子 */
const capsuleRatio = (img) => {
  const r = imgRatio(img);
  return Math.min(2.6, Math.max(1.6, 1 + 1.05 / r));
};

/**
 * AkiraReader — 阿基拉主题的胶囊陈列柜
 * 照片封在竖胶囊壳内（上半红色实壳、下半半透明可见照片缩影），横排陈列；
 * 点击胶囊 = 裂开释放：胶囊两半飞散 + 能量爆发光环 + 速度线，照片弹出大图（fitContain）
 * ←/→ 移动选中胶囊 / 查看中切换，Enter 释放，ESC 关闭
 */
export default function AkiraReader({ images, theme = 'akira' }) {
  const total = images.length;
  const [sel, setSel] = useState(0); // 陈列柜中高亮的胶囊
  const [open, setOpen] = useState(false); // 裂开释放查看浮层
  const cur = sel; // 查看对象 = 选中胶囊
  const curImg = images[cur];

  const step = useCallback(
    (d) => setSel((s) => (s + d + total) % total),
    [total]
  );
  const release = useCallback((i) => {
    setSel(i);
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  // ---- 键盘：←/→ 选中/切换，Enter 释放，ESC 关闭 ----
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
      if ((e.key === 'Enter' || e.key === ' ') && !open) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, close, open]);

  return (
    <div className="relative z-10 flex min-h-screen select-none flex-col px-4 pb-8 pt-24">
      {/* 页眉：新东京胶囊档案 */}
      <header className="text-center">
        <p className="text-[10px] tracking-[0.42em]" style={{ color: 'var(--color-text-muted)' }}>
          NEO-TOKYO · CAPSULE ARCHIVE
        </p>
        <h2 className="mt-2 font-display text-2xl tracking-[0.14em]" style={{ color: 'var(--color-accent-light)' }}>
          胶囊陈列柜
        </h2>
        <div className="mx-auto mt-3 flex items-center justify-center gap-3">
          <span className="h-px w-16" style={{ background: 'var(--color-accent-card-border)' }} />
          <span className="font-display text-[11px] tracking-[0.3em]" style={{ color: 'var(--color-accent)' }}>
            {pad(total)} CAPSULES · C-{pad(sel + 1)}
          </span>
          <span className="h-px w-16" style={{ background: 'var(--color-accent-card-border)' }} />
        </div>
      </header>

      {/* 胶囊陈列架：横排，胶囊高度由照片宽高比驱动 */}
      <div className="flex flex-1 flex-wrap items-center justify-center gap-x-6 gap-y-8 py-10">
        {images.map((img, i) => (
          <div key={img.id ?? i} className="flex flex-col items-center gap-2">
            <button
              className={`akr-capsule${i === sel ? ' akr-active' : ''}`}
              style={{
                width: 'clamp(84px, 10vw, 128px)',
                aspectRatio: `1 / ${capsuleRatio(img)}`,
                animationDelay: `${(i % 7) * 0.45}s`,
              }}
              onClick={() => release(i)}
              onMouseEnter={() => setSel(i)}
              aria-label={`释放胶囊 C-${pad(i + 1)}：${img.name}`}
            >
              {/* 上半：红色实壳 */}
              <div className="akr-capsule-cap" />
              {/* 下半：半透明壳窗，可见照片缩影（contain，不裁切） */}
              <div className="akr-capsule-window">
                <img src={img.url} alt={img.name} draggable="false" loading="lazy" />
              </div>
            </button>
            <span
              className="font-display text-[10px] tracking-[0.24em]"
              style={{ color: i === sel ? 'var(--color-accent-light)' : 'var(--color-text-muted)' }}
            >
              C-{pad(i + 1)}
            </span>
          </div>
        ))}
      </div>

      {/* 页脚 */}
      <footer className="mt-2 text-center">
        <div className="mx-auto flex items-center justify-center gap-3">
          <span className="h-px w-24" style={{ background: 'var(--color-accent-card-border)' }} />
          <span className="font-display text-[13px]" style={{ color: 'var(--color-accent)' }}>✦</span>
          <span className="h-px w-24" style={{ background: 'var(--color-accent-card-border)' }} />
        </div>
        <p className="mt-3 font-display text-lg tracking-[0.1em]" style={{ color: 'var(--color-text-primary)' }}>
          AKIRA · baigao
        </p>
        <p className="mt-1 text-[10px] tracking-[0.3em]" style={{ color: 'var(--color-text-muted)' }}>
          点击胶囊裂开释放 · ←/→ 选中 · Enter 释放 · ESC 关闭
        </p>
      </footer>

      {/* ==================== 裂开释放查看浮层 ==================== */}
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
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

            {/* 裂开表演层：仅在浮层打开时挂载表演一次（不随 ←/→ 重播） */}
            <div className="pointer-events-none absolute inset-0 z-[4] flex items-center justify-center">
              <div className="relative" style={{ width: 132, height: 264 }}>
                {/* 上半壳：向左上飞散 */}
                <motion.div
                  className="absolute left-0 top-0 h-1/2 w-full"
                  style={{
                    borderRadius: '999px 999px 6px 6px',
                    background:
                      'linear-gradient(180deg, var(--color-gold-light) 0%, var(--color-gold) 55%, var(--color-gold-dim) 100%)',
                    border: '2px solid var(--color-accent-card-border-hover)',
                  }}
                  initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                  animate={{ x: -280, y: -200, rotate: -36, opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.5, 0, 0.8, 0.4], delay: 0.06 }}
                />
                {/* 下半壳：向右下飞散 */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1/2 w-full"
                  style={{
                    borderRadius: '6px 6px 999px 999px',
                    background:
                      'linear-gradient(180deg, rgba(211,47,47,0.3) 0%, rgba(19,19,19,0.65) 100%)',
                    border: '2px solid var(--color-accent-card-border-hover)',
                  }}
                  initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                  animate={{ x: 280, y: 200, rotate: 32, opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.5, 0, 0.8, 0.4], delay: 0.06 }}
                />
                {/* 能量爆发光环 */}
                <motion.div
                  className="absolute rounded-full"
                  style={{
                    inset: -38,
                    border: '3px solid var(--color-gold-light)',
                    boxShadow: '0 0 46px var(--color-gold), inset 0 0 30px var(--color-accent-shadow-hover)',
                  }}
                  initial={{ scale: 0.2, opacity: 0.95 }}
                  animate={{ scale: 3.4, opacity: 0 }}
                  transition={{ duration: 0.65, ease: 'easeOut', delay: 0.1 }}
                />
                {/* 速度线：十向放射 */}
                {Array.from({ length: 10 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute left-1/2 top-1/2 h-[2px] w-44 origin-left"
                    style={{
                      rotate: i * 36,
                      background: 'linear-gradient(90deg, var(--color-gold-pale), transparent)',
                    }}
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: [0, 1, 0], scaleX: [0, 1, 1.9] }}
                    transition={{ duration: 0.5, ease: 'easeOut', delay: 0.12 }}
                  />
                ))}
              </div>
            </div>

            {/* 弹出大图（fitContain），←/→ 切换时快闪重演 */}
            <motion.div
              key={cur}
              className="relative z-[3]"
              initial={{ opacity: 0, scale: 0.68, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: open ? 0.34 : 0, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={curImg.url}
                alt={curImg.name}
                draggable="false"
                className="max-h-[72vh] max-w-[92vw] object-contain"
                style={{
                  border: '4px solid var(--color-bg-elevated)',
                  boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 60px var(--color-accent-shadow-hover)',
                }}
              />
              {/* 查看中左右切换钮 */}
              {total > 1 && (
                <>
                  <button
                    className="absolute -left-14 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full font-display text-lg transition-transform hover:scale-110"
                    style={{
                      border: '1px solid var(--color-accent-card-border-hover)',
                      color: 'var(--color-accent)',
                      background: 'var(--color-accent-glass-bg)',
                    }}
                    onClick={() => step(-1)}
                    aria-label="上一枚胶囊"
                  >
                    ←
                  </button>
                  <button
                    className="absolute -right-14 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full font-display text-lg transition-transform hover:scale-110"
                    style={{
                      border: '1px solid var(--color-accent-card-border-hover)',
                      color: 'var(--color-accent)',
                      background: 'var(--color-accent-glass-bg)',
                    }}
                    onClick={() => step(1)}
                    aria-label="下一枚胶囊"
                  >
                    →
                  </button>
                </>
              )}
            </motion.div>

            {/* 底部题名 */}
            <motion.p
              key={`cap-${cur}`}
              className="absolute bottom-8 z-[3] max-w-[80vw] truncate font-display text-base tracking-[0.12em] sm:text-lg"
              style={{ color: 'var(--color-gold-pale)' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.3 }}
            >
              “{fileNameToTitle(curImg.name)}” · CAPSULE RELEASED
            </motion.p>

            {/* 角标 */}
            <div className="pointer-events-none absolute left-5 top-4 z-[3] font-display text-[10px] tracking-[0.3em] text-white/70">
              CAPSULE Nº C-{pad(cur + 1)} / {pad(total)}
            </div>
            <div className="pointer-events-none absolute right-5 top-4 z-[3] font-display text-[10px] tracking-[0.3em] text-white/70">
              ESC / 点击 关闭 · ←/→ 切换
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
