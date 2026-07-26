import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fileNameToTitle } from '../utils/imageHelpers';
import { imgRatio } from '../utils/layoutEngine';

const pad = (n) => String(n).padStart(2, '0');

/** 碑高（vh）与碑距（vh）——碑宽完全由照片宽高比驱动 */
const STELE_H = 44;
const GAP = 7;
const MAX_W = 62;
/** 视窗内渲染当前碑前后各 N 座，避免大图集一次性挂载 */
const WINDOW = 4;

const springX = { type: 'spring', stiffness: 90, damping: 20, mass: 0.9 };

/**
 * JourneyReader — 风之旅人主题的石碑之路
 * 照片刻为圆顶遗迹石碑，立在沙丘上横向排开；←/→ 沿沙路 spring 滑行
 * 点击当前石碑 = 巨大石门向两侧移开，光束照入，照片在光中浮现（fitContain）
 */
export default function JourneyReader({ images, theme = 'journey' }) {
  const total = images.length;
  const [cur, setCur] = useState(0);
  const [gate, setGate] = useState(false); // 石门查看浮层

  // ---- 石碑之路布局：全部坐标以 vh 推导，宽度 = 高度 × 照片宽高比 ----
  const path = useMemo(() => {
    let acc = 0;
    const steles = images.map((img) => {
      const r = imgRatio(img);
      const w = Math.min(STELE_H * r, MAX_W);
      const h = w / r;
      const s = { img, r, w, h, left: acc, center: acc + w / 2 };
      acc += w + GAP;
      return s;
    });
    return steles;
  }, [images]);

  const step = useCallback(
    (d) => setCur((c) => (c + d + total) % total),
    [total]
  );
  const closeGate = useCallback(() => setGate(false), []);

  // ---- 键盘：←/→ 滑行切换（石门内同样换碑），ESC 关闭石门 ----
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeGate();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, closeGate]);

  const curImg = images[cur];
  const lo = Math.max(0, cur - WINDOW);
  const hi = Math.min(total - 1, cur + WINDOW);

  /** 单座石碑：圆顶石形 + 沙纹底座，hover 浮起微光 */
  const Stele = ({ s, i }) => {
    const active = i === cur;
    return (
      <motion.button
        className="group absolute bottom-0 block cursor-pointer"
        style={{ left: `${s.left}vh`, width: `${s.w}vh` }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: Math.abs(i - cur) * 0.05, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => (active ? setGate(true) : setCur(i))}
        aria-label={active ? `开启石门查看 ${s.img.name}` : `滑行至第 ${i + 1} 碑`}
      >
        {/* 碑身：圆顶石形 */}
        <div
          className="relative mx-auto overflow-hidden p-[0.9vh] transition-all duration-300 group-hover:-translate-y-2"
          style={{
            width: '100%',
            height: `${s.h}vh`,
            borderRadius: '50% 50% 6px 6px / 16% 16% 6px 6px',
            background: 'var(--color-bg-elevated)',
            border: active
              ? '1px solid var(--color-accent-card-border-hover)'
              : 'var(--card-border)',
            boxShadow: active ? 'var(--card-shadow-hover)' : 'var(--card-shadow)',
            opacity: active ? 1 : 0.72,
          }}
        >
          {/* 碑顶刻符（光之印记） */}
          <span
            className="jrn-rune pointer-events-none absolute left-1/2 top-[1.6vh] z-[2] -translate-x-1/2 font-display"
            style={{
              fontSize: '1.6vh',
              color: 'var(--color-accent)',
              textShadow: '0 0 8px var(--color-accent-shadow-hover)',
            }}
          >
            ✦
          </span>
          <img
            src={s.img.url}
            alt={s.img.name}
            draggable="false"
            loading={Math.abs(i - cur) <= 1 ? 'eager' : 'lazy'}
            className="block h-full w-full object-contain"
            style={{
              borderRadius: '50% 50% 4px 4px / 14% 14% 4px 4px',
              background: 'var(--color-twilight)',
            }}
          />
        </div>
        {/* 沙纹底座 */}
        <div
          className="mx-auto mt-[0.6vh]"
          style={{
            width: '118%',
            marginLeft: '-9%',
            height: '1.6vh',
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse at 50% 40%, var(--color-mist) 0%, var(--color-mist-light) 55%, transparent 75%)',
            opacity: 0.85,
          }}
        />
        {/* 碑号 */}
        <p
          className="mt-[0.8vh] text-center font-display tracking-[0.3em]"
          style={{
            fontSize: '1.4vh',
            color: active ? 'var(--color-accent-dim)' : 'var(--color-text-muted)',
          }}
        >
          {pad(i + 1)}
        </p>
      </motion.button>
    );
  };

  return (
    <div className="relative z-10 flex min-h-screen select-none flex-col overflow-hidden pt-24">
      {/* 页眉：旅人手记式小标 */}
      <header className="text-center">
        <p className="text-[10px] tracking-[0.42em]" style={{ color: 'var(--color-text-muted)' }}>
          THE PATH OF STELAE · A JOURNEY THROUGH SANDS
        </p>
        <h2
          className="mt-2 font-display text-2xl tracking-[0.14em]"
          style={{ color: 'var(--color-accent-dim)' }}
        >
          石碑之路
        </h2>
        <div className="mx-auto mt-3 flex items-center justify-center gap-3">
          <span className="h-px w-16" style={{ background: 'var(--color-accent-card-border)' }} />
          <span
            className="font-display text-[11px] tracking-[0.3em]"
            style={{ color: 'var(--color-accent)' }}
          >
            第 {pad(cur + 1)} 碑 / 共 {pad(total)} 碑
          </span>
          <span className="h-px w-16" style={{ background: 'var(--color-accent-card-border)' }} />
        </div>
      </header>

      {/* 沙路视窗：石碑沿路径排开，spring 平移滑行 */}
      <div className="relative flex-1">
        {/* 地平线沙脊 */}
        <div
          className="absolute inset-x-0 bottom-[9vh] h-px"
          style={{ background: 'var(--color-accent-card-border)' }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[9vh]"
          style={{
            background:
              'linear-gradient(to bottom, transparent, var(--color-bg-deep) 70%)',
          }}
        />
        {/* 碑列：锚定视窗中轴，整体 spring 滑行 */}
        <motion.div
          className="absolute bottom-[10.5vh] left-1/2 h-0"
          animate={{ x: `-${path[cur]?.center ?? 0}vh` }}
          transition={springX}
        >
          {path.slice(lo, hi + 1).map((s, k) => (
            <Stele key={s.img.id ?? lo + k} s={s} i={lo + k} />
          ))}
        </motion.div>
      </div>

      {/* 页脚：沙路进度 + 操作提示 */}
      <footer className="pb-6 text-center">
        <div className="mx-auto flex max-w-[70vw] items-center justify-center gap-[2px]">
          {images.map((img, i) => (
            <button
              key={img.id ?? i}
              className="h-[3px] flex-1 cursor-pointer rounded-full transition-all duration-300"
              style={{
                background:
                  i === cur ? 'var(--color-accent)' : 'var(--color-accent-card-border)',
                transform: i === cur ? 'scaleY(2.2)' : 'none',
              }}
              onClick={() => setCur(i)}
              aria-label={`滑行至第 ${i + 1} 碑`}
            />
          ))}
        </div>
        <p
          className="mt-3 font-display text-sm italic tracking-[0.1em]"
          style={{ color: 'var(--color-text-primary)' }}
        >
          “{fileNameToTitle(curImg.name)}”
        </p>
        <p className="mt-1 text-[10px] tracking-[0.3em]" style={{ color: 'var(--color-text-muted)' }}>
          点击石碑开启石门 · ←/→ 沿沙路滑行 · ESC 关闭
        </p>
      </footer>

      {/* ==================== 巨大石门 ==================== */}
      <AnimatePresence>
        {gate && (
          <motion.div
            className="fixed inset-0 z-[300] flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeGate}
          >
            {/* 背景模糊压暗 */}
            <div className="absolute inset-0 backdrop-blur-md" style={{ background: 'rgba(62, 39, 35, 0.62)' }} />

            {/* 光束：门开后自顶部照入 */}
            <motion.div
              className="jrn-gate-beam pointer-events-none absolute left-1/2 top-0 z-[2] h-full w-[62vw] -translate-x-1/2"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(255, 248, 225, 0.85) 0%, rgba(255, 248, 225, 0.28) 45%, transparent 85%)',
                clipPath: 'polygon(38% 0, 62% 0, 100% 100%, 0 100%)',
                mixBlendMode: 'screen',
              }}
              initial={{ opacity: 0, scaleY: 0.2 }}
              animate={{ opacity: 1, scaleY: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* 左扇石门 */}
            <motion.div
              className="absolute inset-y-0 left-0 z-[3] w-[51vw]"
              style={{
                background:
                  'repeating-linear-gradient(90deg, var(--color-mist) 0 2px, transparent 2px 9vw), linear-gradient(to right, var(--color-bg-deep), var(--color-mist-light))',
                borderRight: '3px solid var(--color-twilight)',
                boxShadow: 'inset -40px 0 80px rgba(62,39,35,0.35)',
              }}
              initial={{ x: 0 }}
              animate={{ x: '-101%' }}
              exit={{ x: 0 }}
              transition={{ duration: 0.8, ease: [0.7, 0, 0.3, 1] }}
            >
              <span
                className="absolute right-6 top-1/2 -translate-y-1/2 font-display"
                style={{ fontSize: '5vh', color: 'var(--color-accent-subtle)', opacity: 0.6 }}
              >
                ✦
              </span>
            </motion.div>
            {/* 右扇石门 */}
            <motion.div
              className="absolute inset-y-0 right-0 z-[3] w-[51vw]"
              style={{
                background:
                  'repeating-linear-gradient(90deg, var(--color-mist) 0 2px, transparent 2px 9vw), linear-gradient(to left, var(--color-bg-deep), var(--color-mist-light))',
                borderLeft: '3px solid var(--color-twilight)',
                boxShadow: 'inset 40px 0 80px rgba(62,39,35,0.35)',
              }}
              initial={{ x: 0 }}
              animate={{ x: '101%' }}
              exit={{ x: 0 }}
              transition={{ duration: 0.8, ease: [0.7, 0, 0.3, 1] }}
            >
              <span
                className="absolute left-6 top-1/2 -translate-y-1/2 font-display"
                style={{ fontSize: '5vh', color: 'var(--color-accent-subtle)', opacity: 0.6 }}
              >
                ✦
              </span>
            </motion.div>

            {/* 光中浮现的照片（fitContain），门内 ←/→ 换碑时重新浮现 */}
            <motion.div
              key={cur}
              className="relative z-[2]"
              initial={{ opacity: 0, y: 36, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: gate ? 0.45 : 0, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={curImg.url}
                alt={curImg.name}
                draggable="false"
                className="max-h-[70vh] max-w-[80vw] object-contain"
                style={{
                  border: '5px solid var(--color-moss)',
                  boxShadow:
                    '0 0 60px rgba(255, 248, 225, 0.55), 0 30px 90px rgba(0,0,0,0.5)',
                }}
              />
              <p
                className="mt-4 text-center font-display text-lg italic tracking-[0.1em]"
                style={{ color: 'var(--color-moss)' }}
              >
                “{fileNameToTitle(curImg.name)}”
              </p>
            </motion.div>

            {/* 角标 */}
            <div className="pointer-events-none absolute left-5 top-4 z-[4] font-display text-[10px] tracking-[0.3em] text-white/75">
              GATE OF LIGHT · 第 {pad(cur + 1)} 碑 / 共 {pad(total)} 碑
            </div>
            <div className="pointer-events-none absolute right-5 top-4 z-[4] font-display text-[10px] tracking-[0.3em] text-white/75">
              ←/→ 换碑 · ESC / 点击 关闭石门
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
