import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fileNameToTitle } from '../utils/imageHelpers';
import { imgRatio, fitContain } from '../utils/layoutEngine';

const TILTS = [-2.4, 1.6, -1.2, 2.2, -1.8, 1.1, -2.0, 1.9];

/**
 * GhibliReader — 赛璐珞漂浮画廊
 * 照片装成半透明赛璐珞画片，错落漂浮在青绿山坡上方；
 * 点击 = 画片被"手接住"般弹下来（spring 过冲弹跳）+ 柔光晕大图
 */
export default function GhibliReader({ images }) {
  const [sel, setSel] = useState(null);
  const total = images.length;

  const step = useCallback(
    (d) => setSel((v) => (v === null ? null : (v + d + total) % total)),
    [total]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setSel(null);
      if (sel !== null && e.key === 'ArrowRight') step(1);
      if (sel !== null && e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sel, step]);

  if (!total) return null;

  return (
    <div className="relative z-10 flex min-h-screen flex-col px-4 pb-16 pt-24">
      <header className="text-center">
        <p className="text-[10px] tracking-[0.4em] text-[var(--color-text-muted)]">GHIBLI MEADOWS · CEL GALLERY</p>
        <h2 className="mt-2 font-display text-3xl tracking-[0.12em] text-[var(--color-accent-dim)]">田园画册</h2>
        <p className="mt-2 text-[11px] tracking-[0.2em] text-[var(--color-text-muted)]">
          画片飘在风里 · 点一张接住它 · 共 {total} 张
        </p>
      </header>

      {/* 漂浮画片场 */}
      <div className="mx-auto mt-8 flex w-full max-w-[1100px] flex-1 flex-wrap items-center justify-center gap-8">
        {images.map((img, i) => {
          const r = imgRatio(img);
          const h = 200 + (i % 3) * 26;
          const w = Math.min(h * r, 320);
          return (
            <motion.button
              key={img.id}
              className="group relative cursor-pointer"
              style={{ width: w, height: h }}
              onClick={() => setSel(i)}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.12, type: 'spring', stiffness: 160, damping: 16 }}
              aria-label={`接住画片 ${img.name}`}
            >
              <div
                className="h-full w-full overflow-hidden rounded-xl border border-white/60 bg-white/40 backdrop-blur-[2px]"
                style={{
                  padding: 10,
                  boxShadow: '0 12px 30px rgba(46,125,50,0.16)',
                  transform: `rotate(${TILTS[i % TILTS.length]}deg)`,
                  animation: `gh-cel-float ${4.6 + (i % 4) * 0.9}s ease-in-out ${-i * 0.8}s infinite`,
                }}
              >
                <img
                  src={img.url}
                  alt={img.name}
                  draggable="false"
                  loading="lazy"
                  className="h-full w-full rounded-lg object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  style={{ opacity: 0.96 }}
                />
              </div>
              <span className="absolute -bottom-6 left-1 font-display text-[12px] tracking-[0.1em] text-[var(--color-text-muted)]">
                {fileNameToTitle(img.name)}
              </span>
            </motion.button>
          );
        })}
      </div>

      <p className="mt-10 text-center font-display text-sm tracking-[0.3em] text-[var(--color-text-muted)]">
        — 风之谷 · baigao —
      </p>

      {/* 接住画片：弹跳大图 */}
      <AnimatePresence>
        {sel !== null && (
          <motion.div
            className="fixed inset-0 z-[300] flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSel(null)}
          >
            <div className="absolute inset-0 bg-[#2e4a30]/45 backdrop-blur-md" />
            <motion.div
              key={sel}
              className="relative z-10"
              initial={{ scale: 0.5, y: 120, rotate: -6, opacity: 0 }}
              animate={{ scale: 1, y: 0, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.7, y: 60, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 17 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="rounded-2xl bg-white/90 p-3 pb-4"
                style={{ boxShadow: '0 30px 70px rgba(20,40,22,0.45), 0 0 60px rgba(255,213,79,0.25)' }}
              >
                <img
                  src={images[sel].url}
                  alt={images[sel].name}
                  draggable="false"
                  className="block rounded-xl object-contain"
                  style={(() => {
                    const s = fitContain(72 * (window.innerWidth / 100), 62 * (window.innerHeight / 100), imgRatio(images[sel]));
                    return { width: s.width, height: s.height, maxWidth: '72vw', maxHeight: '62vh' };
                  })()}
                />
                <p className="mt-3 text-center font-display text-sm tracking-[0.14em] text-[var(--color-text-secondary)]">
                  {fileNameToTitle(images[sel].name)} · {sel + 1} / {total}
                </p>
              </div>
            </motion.div>
            <p className="relative z-10 mt-5 text-[11px] tracking-[0.3em] text-white/70">
              ←/→ 换一张 · ESC 放它回风里
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes gh-cel-float {
          0%, 100% { transform: translateY(0) rotate(var(--tilt, 0deg)); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}
