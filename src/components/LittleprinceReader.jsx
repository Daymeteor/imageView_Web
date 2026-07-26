import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fileNameToTitle } from '../utils/imageHelpers';

const pad = (n) => String(n).padStart(2, '0');

/** 三条虚线圆轨道：半径(vmin) / 公转周期(s) / 是否逆行 */
const ORBITS = [
  { r: 15, dur: 80, rev: false },
  { r: 24, dur: 120, rev: true },
  { r: 33, dur: 165, rev: false },
];

/** 星球尺寸节拍 — 大小不一 */
const SIZES = [1.2, 0.85, 1.05, 1.35, 0.95, 1.12, 0.8, 1.28];

/**
 * LittleprinceReader — 小王子主题的星球轨道旅行
 * 照片装进大小不一的圆形星球框，沿三条虚线轨道轻微公转（星球内容反向自转保持直立）
 * 点击星球 = 旅行靠近：星球沿弧线飞至中央、罩上玻璃罩光晕，照片在罩内 fitContain 展开
 * 再点照片 / ←/→ 飞往下一颗，ESC 返回星海
 */
export default function LittleprinceReader({ images, theme = 'littleprince' }) {
  const total = images.length;
  const [cur, setCur] = useState(0);
  const [dir, setDir] = useState(1);
  const [travel, setTravel] = useState(false); // 玻璃罩查看浮层

  const step = useCallback(
    (d) => {
      setDir(d);
      setCur((c) => (c + d + total) % total);
    },
    [total]
  );

  const closeTravel = useCallback(() => setTravel(false), []);

  // ---- 键盘：←/→ 飞往邻星，ESC 返回星海 ----
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeTravel();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, closeTravel]);

  /** 把照片轮流分配到三条轨道，按序计算公转相位角与星球尺寸 */
  const planets = useMemo(() => {
    const per = ORBITS.map((_, o) => images.filter((__, i) => i % ORBITS.length === o).length);
    const seen = ORBITS.map(() => 0);
    return images.map((img, i) => {
      const o = i % ORBITS.length;
      const k = seen[o]++;
      return {
        img,
        i,
        orbit: o,
        angle: (360 / per[o]) * k + o * 37,
        size: SIZES[i % SIZES.length],
      };
    });
  }, [images]);

  if (!total) return null;
  const curImg = images[cur];

  return (
    <div className="relative z-10 flex min-h-screen select-none flex-col overflow-hidden px-4 pb-8 pt-24">
      {/* 页眉：星际航线小标 */}
      <header className="text-center">
        <p className="text-[10px] tracking-[0.42em]" style={{ color: 'var(--color-text-muted)' }}>
          LE PETIT PRINCE · VOYAGE DES PLANÈTES
        </p>
        <h2
          className="mt-2 font-display text-2xl tracking-[0.14em]"
          style={{ color: 'var(--color-accent-light)' }}
        >
          B-612 星际航线
        </h2>
        <div className="mx-auto mt-3 flex items-center justify-center gap-3">
          <span className="h-px w-16" style={{ background: 'var(--color-accent-card-border)' }} />
          <span
            className="font-display text-[11px] tracking-[0.3em]"
            style={{ color: 'var(--color-accent)' }}
          >
            PLANET Nº {pad(cur + 1)} / {pad(total)}
          </span>
          <span className="h-px w-16" style={{ background: 'var(--color-accent-card-border)' }} />
        </div>
      </header>

      {/* 星图舞台：三条虚线轨道 + 公转星球 */}
      <div className="relative mx-auto min-h-[54vh] w-full max-w-[1100px] flex-1">
        {/* 轨道环 */}
        {ORBITS.map((o, oi) => (
          <div
            key={`ring-${oi}`}
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed"
            style={{
              width: `${o.r * 2}vmin`,
              height: `${o.r * 2}vmin`,
              borderColor: 'var(--color-accent-glass-border)',
            }}
          />
        ))}
        {/* 中央小星 */}
        <span
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-xl"
          style={{
            color: 'var(--color-accent-pale)',
            textShadow: '0 0 14px var(--color-accent-shadow-hover)',
            animation: 'lp-twinkle 3.6s ease-in-out infinite',
          }}
        >
          ✦
        </span>

        {/* 每条轨道一个公转层：层内星球反向自转保持直立 */}
        {ORBITS.map((o, oi) => (
          <div
            key={`orbit-${oi}`}
            className="absolute inset-0"
            style={{
              animation: `lp-orbit ${o.dur}s linear infinite`,
              animationDirection: o.rev ? 'reverse' : 'normal',
            }}
          >
            {planets
              .filter((p) => p.orbit === oi)
              .map((p) => (
                <div
                  key={p.img.id ?? p.i}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    transform: `rotate(${p.angle}deg) translateX(${o.r}vmin) rotate(${-p.angle}deg)`,
                  }}
                >
                  <div
                    style={{
                      animation: `lp-orbit-rev ${o.dur}s linear infinite`,
                      animationDirection: o.rev ? 'reverse' : 'normal',
                    }}
                  >
                    <div
                      style={{
                        animation: `lp-planet-bob ${5 + (p.i % 4)}s ease-in-out infinite`,
                        animationDelay: `${-(p.i % 5) * 0.9}s`,
                      }}
                    >
                      <motion.button
                        whileHover={{ scale: 1.14 }}
                        whileTap={{ scale: 0.94 }}
                        onClick={() => {
                          setDir(p.i >= cur ? 1 : -1);
                          setCur(p.i);
                          setTravel(true);
                        }}
                        className="relative block cursor-pointer rounded-full"
                        style={{
                          width: `clamp(52px, ${7.5 * p.size}vmin, 150px)`,
                          aspectRatio: '1 / 1',
                        }}
                        aria-label={`飞往星球 ${p.img.name}`}
                      >
                        <img
                          src={p.img.url}
                          alt={p.img.name}
                          draggable="false"
                          loading="lazy"
                          className="h-full w-full rounded-full object-cover"
                          style={{
                            border: '1px solid var(--color-accent-card-border)',
                            boxShadow:
                              'inset -8px -10px 18px rgba(0,0,0,0.5), 0 0 20px var(--color-accent-shadow)',
                          }}
                        />
                        {/* 当前选中的星球：旋转虚线光环 */}
                        {p.i === cur && (
                          <span
                            className="pointer-events-none absolute -inset-2 rounded-full border border-dashed"
                            style={{
                              borderColor: 'var(--color-accent-card-border-hover)',
                              animation: 'lp-orbit 14s linear infinite',
                            }}
                          />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* 页脚：手写体落款 */}
      <footer className="mt-6 text-center">
        <div className="mx-auto flex items-center justify-center gap-3">
          <span className="h-px w-24" style={{ background: 'var(--color-accent-card-border)' }} />
          <span className="font-display text-[13px]" style={{ color: 'var(--color-accent)' }}>
            ✦
          </span>
          <span className="h-px w-24" style={{ background: 'var(--color-accent-card-border)' }} />
        </div>
        <p
          className="mt-3 font-display text-lg italic tracking-[0.1em]"
          style={{ color: 'var(--color-text-primary)' }}
        >
          On ne voit bien qu'avec le cœur · baigao
        </p>
        <p className="mt-1 text-[10px] tracking-[0.3em]" style={{ color: 'var(--color-text-muted)' }}>
          点击星球开始旅行 · ←/→ 切换 · ESC 返回星海
        </p>
      </footer>

      {/* ==================== 旅行靠近 · 玻璃罩查看 ==================== */}
      <AnimatePresence>
        {travel && (
          <motion.div
            className="fixed inset-0 z-[300] flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={closeTravel}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

            {/* 每次换星整组重排，表演总长 ~1.05s */}
            <div
              key={cur}
              className="relative flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="relative flex items-center justify-center"
                style={{ width: 'min(94vw, 80vh)', height: 'min(94vw, 80vh)' }}
              >
                {/* 玻璃罩光环 */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  initial={{ opacity: 0, scale: 0.72 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.45, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    border: '1.5px solid var(--color-accent-card-border-hover)',
                    boxShadow:
                      '0 0 70px var(--color-accent-shadow-hover), inset 0 0 90px var(--color-accent-shadow)',
                  }}
                />
                {/* 玻璃高光（呼吸明灭） */}
                <motion.div
                  className="pointer-events-none absolute inset-0 rounded-full"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55, duration: 0.4 }}
                >
                  <div
                    className="h-full w-full rounded-full"
                    style={{
                      background:
                        'radial-gradient(ellipse at 32% 22%, rgba(255,255,255,0.16) 0%, transparent 52%)',
                      animation: 'lp-dome-breathe 3.2s ease-in-out infinite',
                    }}
                  />
                </motion.div>
                {/* 罩顶小星 */}
                <motion.span
                  className="pointer-events-none absolute left-1/2 top-[3%] -translate-x-1/2 font-display text-lg"
                  style={{ color: 'var(--color-accent-pale)' }}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.35 }}
                >
                  ✦
                </motion.span>

                {/* 飞来的星球：沿弧线靠近后隐去 */}
                <motion.img
                  src={curImg.url}
                  alt=""
                  draggable="false"
                  className="pointer-events-none absolute z-[2] rounded-full object-cover"
                  style={{
                    width: '52%',
                    height: '52%',
                    border: '1px solid var(--color-accent-card-border-hover)',
                    boxShadow: '0 0 40px var(--color-accent-shadow-hover)',
                  }}
                  initial={{ opacity: 0, x: `${dir * 160}px`, y: '46vh', scale: 0.28 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    x: [`${dir * 160}px`, '0px', '0px', '0px'],
                    y: ['46vh', '0vh', '0vh', '0vh'],
                    scale: [0.28, 1, 1, 1.08],
                  }}
                  transition={{ duration: 1.05, times: [0, 0.42, 0.66, 1], ease: 'easeOut' }}
                />

                {/* 罩内照片（fitContain，圆角框）—— 再点飞往下一颗 */}
                <motion.img
                  src={curImg.url}
                  alt={curImg.name}
                  draggable="false"
                  className="relative max-h-[70%] max-w-[88%] cursor-pointer object-contain"
                  style={{
                    borderRadius: 24,
                    border: '1px solid var(--color-accent-card-border)',
                    boxShadow: '0 18px 60px rgba(0,0,0,0.55)',
                  }}
                  initial={{ opacity: 0, scale: 0.86 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.62, duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => step(1)}
                  title="飞往下一颗星球"
                />
              </div>

              {/* 手写体署名 */}
              <motion.div
                className="mt-4 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85, duration: 0.35 }}
              >
                <p
                  className="max-w-[80vw] truncate font-display text-lg italic tracking-[0.08em]"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  “{fileNameToTitle(curImg.name)}”
                </p>
                <p
                  className="mt-1 font-display text-[12px] tracking-[0.3em]"
                  style={{ color: 'var(--color-accent)' }}
                >
                  — baigao · PLANET Nº {pad(cur + 1)} / {pad(total)}
                </p>
              </motion.div>
            </div>

            {/* 角标 */}
            <div className="pointer-events-none absolute left-5 top-4 z-[3] font-display text-[10px] tracking-[0.3em] text-white/70">
              VOYAGE · B-612
            </div>
            <div className="pointer-events-none absolute right-5 top-4 z-[3] font-display text-[10px] tracking-[0.3em] text-white/70">
              ESC 返回星海 · 点击照片飞往下一颗
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
