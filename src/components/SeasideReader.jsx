import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { fileNameToTitle } from '../utils/imageHelpers';

/**
 * SeasideReader（方案 B）— 漂流瓶
 * 浪把瓶子推上岸 → 点瓶拔塞 → 照片展开成卡片
 * 读完的瓶子留在沙滩上，点它可以重读
 * 与电影感落日背景（SeasideBackground）配套
 */
export default function SeasideReader({ images }) {
  const total = images.length;
  const [idx, setIdx] = useState(0); // 当前漂来的瓶子
  const [status, setStatus] = useState('sailing'); // sailing | ready | open
  const [readIdxs, setReadIdxs] = useState([]); // 沙滩上读完的瓶子
  const [viewing, setViewing] = useState(null); // 正在看的照片序号
  const done = idx >= total;

  // 瓶子上岸后等待拔塞
  useEffect(() => {
    if (done) return;
    setStatus('sailing');
    const t = setTimeout(() => setStatus('ready'), 2400);
    return () => clearTimeout(t);
  }, [idx, done]);

  const openBottle = () => {
    if (status !== 'ready') return;
    setStatus('open');
    setTimeout(() => setViewing(idx), 600);
  };

  const closeViewer = useCallback(() => {
    if (viewing === null) return;
    const isCurrent = viewing === idx && !readIdxs.includes(idx);
    setViewing(null);
    if (isCurrent) {
      setReadIdxs((r) => [...r, idx]);
      setIdx((i) => i + 1);
    }
  }, [viewing, idx, readIdxs]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeViewer();
      if (e.key === 'Enter' && status === 'ready') openBottle();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const restart = () => {
    setIdx(0);
    setReadIdxs([]);
    setViewing(null);
  };

  const shoreX = typeof window !== 'undefined' ? window.innerWidth * 0.5 : 720;
  const seaX = typeof window !== 'undefined' ? window.innerWidth * 1.15 : 1600;

  return (
    <div className="fixed inset-0 z-10 select-none">
      {/* 进度 */}
      {!done && (
        <p className="pointer-events-none fixed bottom-6 left-1/2 z-20 -translate-x-1/2 text-[11px] tracking-[0.26em] text-[var(--color-text-secondary)]">
          第 {Math.min(idx + 1, total)} / {total} 瓶 · {status === 'ready' ? '点瓶子拔塞' : '浪正把瓶子推上岸…'}
        </p>
      )}

      {/* 读完的瓶子 — 躺在沙滩上，可点重读 */}
      {readIdxs.map((ri, k) => (
        <motion.button
          key={ri}
          className="absolute z-10 cursor-pointer"
          style={{
            left: `${8 + (k % 6) * 11}%`,
            top: `${80.5 + (k % 3) * 3.5}vh`,
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 0.9, y: 0 }}
          whileHover={{ scale: 1.08, rotate: 4 }}
          onClick={() => setViewing(ri)}
          aria-label={`重读第 ${ri + 1} 瓶`}
        >
          <BottleSVG lying corked={false} />
        </motion.button>
      ))}

      {/* 当前瓶子 — 乘浪而来，立在沙滩 */}
      {!done && viewing === null && (
        <motion.button
          key={`bottle-${idx}`}
          className="absolute z-10 cursor-pointer"
          initial={{ x: seaX - shoreX, y: '-16vh', rotate: 72, opacity: 0 }}
          animate={{
            x: 0,
            y: ['-16vh', '-19vh', '-15vh', '0vh'],
            rotate: [72, 55, 26, 9],
            opacity: 1,
          }}
          transition={{ duration: 2.4, times: [0, 0.45, 0.75, 1], ease: 'easeInOut' }}
          style={{ left: shoreX - 45, top: '79vh' }}
          onClick={openBottle}
          aria-label="拔塞打开漂流瓶"
        >
          <motion.span
            className="block"
            animate={status !== 'sailing' ? { y: [0, -4, 0] } : {}}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <BottleSVG corked={status !== 'open'} popping={status === 'open'} />
          </motion.span>
          {status === 'ready' && (
            <motion.span
              className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[10px] tracking-[0.2em] text-white"
              style={{ background: 'rgba(43,58,74,0.55)' }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              点我拔塞 ▸
            </motion.span>
          )}
        </motion.button>
      )}

      {/* 全部读完 */}
      {done && (
        <motion.div
          className="fixed inset-0 z-20 flex flex-col items-center justify-center text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="font-display text-3xl tracking-[0.3em] text-[var(--color-text-primary)]">潮汐尽头</p>
          <p className="mt-4 text-xs tracking-[0.3em] text-[var(--color-text-secondary)]">
            {total} 个瓶子都上了岸
          </p>
          <button
            className="mt-8 rounded-full border border-[var(--color-accent)] px-7 py-2.5 text-xs tracking-[0.26em] text-[var(--color-accent-dim)] transition-colors hover:bg-[var(--color-accent-glass-bg)]"
            onClick={restart}
          >
            再拾一次
          </button>
        </motion.div>
      )}

      {/* 照片卡片 — 从瓶中展开 */}
      <AnimatePresence>
        {viewing !== null && (
          <motion.div
            className="fixed inset-0 z-[300] flex flex-col items-center justify-end pb-[9vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeViewer}
          >
            <div className="absolute inset-0 bg-[#2b3a4a]/45 backdrop-blur-[6px]" />
            <TiltCard img={images[viewing]} />
            <motion.p
              className="relative z-10 mt-5 font-display text-lg tracking-[0.2em] text-[#f2e8d5]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {fileNameToTitle(images[viewing].name)}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** 漂流瓶 SVG — 平涂电影感 */
function BottleSVG({ lying = false, corked = true, popping = false }) {
  return (
    <svg
      width="64"
      height="120"
      viewBox="0 0 64 120"
      style={lying ? { transform: 'rotate(76deg)' } : undefined}
    >
      {/* 瓶内纸卷 */}
      {corked && <rect x="24" y="58" width="16" height="42" rx="6" fill="#f2e8d5" opacity="0.9" />}
      {/* 瓶身 */}
      <rect x="14" y="38" width="36" height="72" rx="14" fill="rgba(200,228,240,0.4)" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5" />
      <rect x="24" y="18" width="16" height="26" rx="6" fill="rgba(200,228,240,0.4)" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5" />
      {/* 高光 */}
      <path d="M20,48 Q18,76 22,102" stroke="rgba(255,255,255,0.75)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* 软木塞（拔塞时飞起） */}
      {corked && (
        <motion.rect
          x="22"
          y="8"
          width="20"
          height="14"
          rx="4"
          fill="#b98d63"
          animate={popping ? { y: -80, x: 34, rotate: 200, opacity: [1, 1, 0] } : {}}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      )}
    </svg>
  );
}

/** 从瓶中展开的照片卡 — 指针驱动 3D 倾斜（方案 D 的 3D 基础） */
function TiltCard({ img }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(my, { stiffness: 140, damping: 16 });
  const ry = useSpring(mx, { stiffness: 140, damping: 16 });

  return (
    <motion.div
      className="relative z-10"
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1100 }}
      initial={{ opacity: 0, y: 90, scale: 0.7, rotate: -5 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, y: 40, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 180, damping: 20 }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width - 0.5) * 16);
        my.set(-((e.clientY - r.top) / r.height - 0.5) * 13);
      }}
      onPointerLeave={() => { mx.set(0); my.set(0); }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="bg-[#fffdf8] p-3 pb-4"
        style={{
          borderRadius: 2,
          boxShadow: '0 30px 60px rgba(20,28,56,0.45), 0 6px 18px rgba(20,28,56,0.3)',
        }}
      >
        <div
          className="absolute -top-3 left-1/2 h-7 w-24 -translate-x-1/2 rotate-[-3deg]"
          style={{ background: 'rgba(232,220,190,0.85)', boxShadow: '0 1px 3px rgba(43,58,74,0.2)' }}
        />
        <img
          src={img.url}
          alt={img.name}
          draggable="false"
          className="block max-h-[52vh] w-auto max-w-[72vw] select-none"
        />
      </div>
    </motion.div>
  );
}
