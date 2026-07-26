import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fileNameToTitle } from '../utils/imageHelpers';
import { imgRatio } from '../utils/layoutEngine';

const pad = (n) => String(n).padStart(2, '0');

/** 确定性伪随机（同一张照片每次钉在同一处） */
const rand = (seed) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** 龙焰烧焦时长（单次表演 ≤1.2s） */
const BURN_MS = 780;

/**
 * GotReader — 冰与火主题的维斯特洛地图册
 * 大幅羊皮纸桌面上，照片被蜡封钉在地图各处（倾斜错落 + 位置伪随机）
 * 点击蜡封 = 龙焰解锁：照片一角烧焦卷曲（橙光 + 暗角）后蜡封碎裂，
 * 进入羊皮纸边框的大图查看（地名式标注）；←/→ 切换，ESC 收起
 */
export default function GotReader({ images, theme = 'got', folderName }) {
  const total = images.length;
  const [cur, setCur] = useState(0);
  const [burnId, setBurnId] = useState(null); // 正在龙焰解锁的照片 id
  const [viewer, setViewer] = useState(false); // 大图查看浮层
  const burnTimer = useRef(null);

  const step = useCallback(
    (d) => setCur((c) => (c + d + total) % total),
    [total]
  );

  const closeViewer = useCallback(() => setViewer(false), []);

  /** 龙焰解锁：烧焦表演结束后开大图 */
  const unlock = useCallback((idx, id) => {
    if (burnTimer.current) return; // 一场火只烧一次
    setCur(idx);
    setBurnId(id);
    burnTimer.current = setTimeout(() => {
      burnTimer.current = null;
      setBurnId(null);
      setViewer(true);
    }, BURN_MS);
  }, []);

  useEffect(() => () => clearTimeout(burnTimer.current), []);

  // ---- 键盘：←/→ 切换，ESC 收起查看浮层 ----
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

  /** 钉位：网格槽 + 抖动，照片错落散布于羊皮纸 */
  const cols = Math.max(2, Math.ceil(Math.sqrt(total * 1.7)));
  const rows = Math.max(1, Math.ceil(total / cols));
  const spot = (i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    return {
      left: `${((col + 0.5) / cols) * 100 + (rand(i + 1) - 0.5) * (62 / cols)}%`,
      top: `${((row + 0.5) / rows) * 100 + (rand(i + 41) - 0.5) * (46 / rows)}%`,
      rotate: (rand(i + 77) - 0.5) * 13,
    };
  };

  return (
    <div className="relative z-10 flex min-h-screen select-none flex-col px-4 pb-8 pt-24">
      {/* 页眉：学城卷宗题签 */}
      <header className="text-center">
        <p className="text-[10px] tracking-[0.42em]" style={{ color: 'var(--color-text-muted)' }}>
          CITADEL ARCHIVE · MAP OF THE KNOWN WORLD
        </p>
        <h2
          className="mt-2 font-display text-2xl tracking-[0.16em]"
          style={{ color: 'var(--color-accent-pale)' }}
        >
          维斯特洛舆图 · 蜡封卷宗
        </h2>
        <div className="mx-auto mt-3 flex items-center justify-center gap-3">
          <span className="h-px w-16" style={{ background: 'var(--color-accent-card-border)' }} />
          <span
            className="font-display text-[11px] tracking-[0.3em]"
            style={{ color: 'var(--color-accent-light)' }}
          >
            {pad(total)} 处领地{folderName ? ` · ${folderName}` : ''}
          </span>
          <span className="h-px w-16" style={{ background: 'var(--color-accent-card-border)' }} />
        </div>
      </header>

      {/* ==================== 羊皮纸地图桌 ==================== */}
      <div className="mx-auto mt-6 w-full max-w-6xl flex-1">
        <div className="got-parchment relative h-[68vh] min-h-[430px] overflow-hidden rounded-[3px]">
          {/* 地图装饰：罗盘玫瑰 + 虚线航迹 + 海怪注记 */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M4,78 C18,70 22,84 36,76 S58,60 72,68 S92,58 97,64"
              fill="none"
              stroke="rgba(96,64,30,0.4)"
              strokeWidth="0.28"
              strokeDasharray="1.6 1.2"
            />
            <path
              d="M10,24 C26,32 40,18 56,26 S84,36 94,26"
              fill="none"
              stroke="rgba(96,64,30,0.32)"
              strokeWidth="0.24"
              strokeDasharray="1.4 1.4"
            />
          </svg>
          <svg
            className="pointer-events-none absolute bottom-[5%] right-[4%] h-24 w-24 opacity-50"
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            <circle cx="50" cy="50" r="40" fill="none" stroke="#5e401e" strokeWidth="1.4" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="#5e401e" strokeWidth="0.7" />
            <path d="M50 8 L56 50 L50 92 L44 50 Z" fill="#5e401e" />
            <path d="M8 50 L50 44 L92 50 L50 56 Z" fill="#7a5527" />
            <text x="50" y="4" textAnchor="middle" fontSize="9" fill="#4a3012" fontFamily="serif">
              N
            </text>
          </svg>
          <p
            className="pointer-events-none absolute left-[3%] top-[4%] font-display text-[11px] italic tracking-[0.24em]"
            style={{ color: 'rgba(74,48,18,0.55)' }}
          >
            ~ here be dragons ~
          </p>

          {/* 钉在地图各处的照片（尺寸由真实宽高比驱动） */}
          {images.map((img, i) => {
            const r = imgRatio(img);
            const s = spot(i);
            const burning = burnId === img.id;
            return (
              <motion.button
                key={img.id ?? i}
                className="absolute cursor-pointer"
                style={{
                  left: s.left,
                  top: s.top,
                  width: 'clamp(104px, 13vw, 180px)',
                  x: '-50%',
                  y: '-50%',
                }}
                initial={{ opacity: 0, scale: 0.7, rotate: s.rotate * 2 }}
                animate={{ opacity: 1, scale: 1, rotate: s.rotate }}
                transition={{ delay: 0.05 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.07, rotate: 0, zIndex: 30 }}
                onClick={() => unlock(i, img.id)}
                aria-label={`龙焰解锁 ${img.name}`}
              >
                <span
                  className="relative block bg-[#efe3c4] p-[6px] pb-[20px]"
                  style={{ boxShadow: '0 8px 22px rgba(40,22,6,0.55)' }}
                >
                  <span className="relative block overflow-hidden">
                    <img
                      src={img.url}
                      alt={img.name}
                      draggable="false"
                      loading="lazy"
                      className="block w-full"
                      style={{ aspectRatio: r }}
                    />
                    {/* 龙焰烧焦：一角橙光 + 暗角卷曲扩散 */}
                    {burning && (
                      <>
                        <motion.span
                          className="absolute inset-0"
                          style={{
                            background:
                              'radial-gradient(circle at 100% 0%, rgba(30,10,2,0.95) 0%, rgba(30,10,2,0.75) 42%, transparent 72%)',
                            transformOrigin: '100% 0%',
                          }}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1.5, opacity: 1 }}
                          transition={{ duration: BURN_MS / 1000, ease: 'easeIn' }}
                        />
                        <motion.span
                          className="got-ember absolute inset-0"
                          style={{
                            background:
                              'radial-gradient(circle at 100% 0%, rgba(255,170,60,0.95) 0%, rgba(230,81,0,0.7) 32%, transparent 62%)',
                            transformOrigin: '100% 0%',
                          }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1.7 }}
                          transition={{ duration: BURN_MS / 1000, ease: 'easeIn' }}
                        />
                      </>
                    )}
                  </span>
                  <span
                    className="mt-[5px] block truncate text-center font-display text-[10px] italic"
                    style={{ color: '#5e401e' }}
                  >
                    {fileNameToTitle(img.name)}
                  </span>

                  {/* 蜡封：常态圆印，解锁时碎裂飞散 */}
                  {burning ? (
                    <>
                      <motion.span
                        className="got-wax absolute -top-3 left-1/2 z-[2] block h-9 w-9 rounded-full"
                        style={{ x: '-50%' }}
                        initial={{ scale: 1, opacity: 1, rotate: 0 }}
                        animate={{ scale: 1.3, opacity: 0, rotate: 30 }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                      {[0, 1, 2].map((f) => (
                        <motion.span
                          key={f}
                          className="got-wax absolute -top-3 left-1/2 z-[2] block h-3 w-3 rounded-full"
                          initial={{ x: '-50%', y: 0, opacity: 1 }}
                          animate={{
                            x: `calc(-50% + ${(f - 1) * 26}px)`,
                            y: -20 - f * 8,
                            opacity: 0,
                            rotate: 90 * (f + 1),
                          }}
                          transition={{ duration: 0.55, ease: 'easeOut' }}
                        />
                      ))}
                    </>
                  ) : (
                    <span className="got-wax absolute -top-3 left-1/2 z-[2] flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full">
                      <span className="font-display text-[13px] font-semibold text-[#f4d9c8]">
                        {pad(i + 1)}
                      </span>
                    </span>
                  )}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 页脚：学城注记 */}
      <footer className="mt-6 text-center">
        <div className="mx-auto flex items-center justify-center gap-3">
          <span className="h-px w-24" style={{ background: 'var(--color-accent-card-border)' }} />
          <span className="font-display text-[13px]" style={{ color: 'var(--color-accent)' }}>
            ❖
          </span>
          <span className="h-px w-24" style={{ background: 'var(--color-accent-card-border)' }} />
        </div>
        <p
          className="mt-3 font-display text-lg italic tracking-[0.1em]"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Valar Morghulis · baigao
        </p>
        <p className="mt-1 text-[10px] tracking-[0.3em]" style={{ color: 'var(--color-text-muted)' }}>
          点击蜡封以龙焰解锁 · ←/→ 巡览 · ESC 收起
        </p>
      </footer>

      {/* ==================== 羊皮纸大图查看 ==================== */}
      <AnimatePresence>
        {viewer && (
          <motion.div
            className="fixed inset-0 z-[300] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeViewer}
          >
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

            {/* 羊皮纸边框画卷（fitContain） */}
            <motion.div
              key={cur}
              className="relative"
              initial={{ opacity: 0, scale: 0.92, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="got-parchment rounded-[3px] p-[14px] pb-[46px]">
                <img
                  src={curImg.url}
                  alt={curImg.name}
                  draggable="false"
                  className="max-h-[66vh] max-w-[88vw] object-contain"
                  style={{ boxShadow: '0 6px 26px rgba(40,22,6,0.5)' }}
                />
                {/* 地名式标注 */}
                <div className="absolute inset-x-0 bottom-[10px] flex items-center justify-center gap-3 px-6">
                  <span className="h-px w-10 bg-[#7a5527]/60" />
                  <p className="truncate font-display text-base italic tracking-[0.08em] text-[#4a3012]">
                    {fileNameToTitle(curImg.name)} 之境
                  </p>
                  <span className="h-px w-10 bg-[#7a5527]/60" />
                </div>
                <span className="got-wax absolute -bottom-4 right-8 flex h-11 w-11 items-center justify-center rounded-full">
                  <span className="font-display text-[15px] font-semibold text-[#f4d9c8]">
                    {pad(cur + 1)}
                  </span>
                </span>
              </div>
            </motion.div>

            {/* 角标 */}
            <div className="pointer-events-none absolute left-5 top-4 z-[3] font-display text-[10px] tracking-[0.3em] text-white/70">
              WESTEROS · 第 {pad(cur + 1)} / {pad(total)} 处
            </div>
            <div className="pointer-events-none absolute right-5 top-4 z-[3] font-display text-[10px] tracking-[0.3em] text-white/70">
              ←/→ 巡览 · ESC / 点击 收起
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
