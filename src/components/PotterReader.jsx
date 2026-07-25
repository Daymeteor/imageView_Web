import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fileNameToTitle } from '../utils/imageHelpers';
import { imgRatio, fitRowPx } from '../utils/layoutEngine';
import useInView from '../hooks/useInView';

/** 容器可用宽度（ResizeObserver 跟踪，供 fitRowPx 行宽适配） */
function useContainerWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, width];
}

/** 响应式列数：每行最多几幅肖像 */
function useColumns() {
  const get = () => {
    const w = window.innerWidth;
    if (w < 640) return 2;
    if (w < 1024) return 3;
    if (w < 1440) return 4;
    return 5;
  };
  const [cols, setCols] = useState(get);
  useEffect(() => {
    const onResize = () => setCols(get());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return cols;
}

/** 魔杖轨迹 — 金色光点，限频 ~30/s，0.6s 淡出上飘 */
function WandTrail() {
  const [sparks, setSparks] = useState([]);
  const lastRef = useRef(0);
  const idRef = useRef(0);

  useEffect(() => {
    const onMove = (e) => {
      const now = performance.now();
      if (now - lastRef.current < 33) return;
      lastRef.current = now;
      const id = ++idRef.current;
      setSparks((s) => [...s.slice(-40), { id, x: e.clientX, y: e.clientY }]);
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[250]">
      {sparks.map((sp) => (
        <motion.span
          key={sp.id}
          className="absolute h-[6px] w-[6px] rounded-full"
          style={{
            left: sp.x - 3,
            top: sp.y - 3,
            background: 'var(--color-gold-light)',
            boxShadow: '0 0 8px 2px rgba(255, 215, 0, 0.8), 0 0 18px 6px rgba(255, 215, 0, 0.3)',
          }}
          initial={{ opacity: 1, y: 0, scale: 1 }}
          animate={{ opacity: 0, y: -30, scale: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          onAnimationComplete={() => setSparks((s) => s.filter((x) => x.id !== sp.id))}
        />
      ))}
    </div>
  );
}

/** 金色雕花相框 — 沉睡/苏醒肖像；宽高比 = 照片真实比例，零裁切 */
function PortraitFrame({ img, idx, onOpen, delay, width, ratio }) {
  const [ref, inView] = useInView(0.35, false);

  return (
    <motion.div
      ref={ref}
      className="min-w-0"
      style={{ width }}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      <button
        className={`pot-frame group block w-full cursor-pointer ${inView ? 'awake' : ''}`}
        onClick={() => onOpen(idx)}
        aria-label={`查看肖像 ${img.name}`}
      >
        <div className="pot-frame-inner relative">
          {/* 四角装饰 */}
          {['-top-[5px] -left-[5px]', '-top-[5px] -right-[5px]', '-bottom-[5px] -left-[5px]', '-bottom-[5px] -right-[5px]'].map((pos) => (
            <span key={pos} className={`pot-corner absolute ${pos}`} />
          ))}
          {/* 烛光晕 */}
          <span className="pot-glow pointer-events-none absolute -inset-4 rounded-full" />
          <div className="overflow-hidden" style={{ aspectRatio: String(ratio) }}>
            <img
              className="pot-portrait h-full w-full object-cover"
              src={img.url}
              alt={img.name}
              draggable="false"
              loading="lazy"
            />
          </div>
        </div>
        {/* 铭牌 */}
        <span className="pot-plate mx-auto mt-2 block w-fit max-w-full truncate px-3 py-[3px] font-display text-[11px] italic tracking-[0.12em]">
          {fileNameToTitle(img.name)}
        </span>
      </button>
    </motion.div>
  );
}

/** 冥想盆查看器 — 银色雾漩 + 照片浮现 */
function Pensieve({ images, idx, onClose, onNav }) {
  const img = images[idx];

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNav(-1);
      if (e.key === 'ArrowRight') onNav(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onNav]);

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-[#0d0a1a]/80 backdrop-blur-[6px]" />

      {/* 银色雾漩 — 换照片时 key 变化，漩涡再起 */}
      <div key={`swirl-${idx}`} className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <motion.div
          className="pot-swirl h-[130vmin] w-[130vmin] rounded-full"
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>

      {/* 照片从漩涡中心浮现 */}
      <motion.figure
        key={idx}
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.85, filter: 'blur(12px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pot-frame awake">
          <div className="pot-frame-inner relative">
            {['-top-[5px] -left-[5px]', '-top-[5px] -right-[5px]', '-bottom-[5px] -left-[5px]', '-bottom-[5px] -right-[5px]'].map((pos) => (
              <span key={pos} className={`pot-corner absolute ${pos}`} />
            ))}
            <img
              className="block max-h-[62vh] w-auto max-w-[82vw] select-none object-contain"
              src={img.url}
              alt={img.name}
              draggable="false"
            />
          </div>
        </div>
        <figcaption className="mt-5 font-display text-xl italic tracking-[0.14em] text-[var(--color-text-primary)]">
          {fileNameToTitle(img.name)}
        </figcaption>
        <span className="mt-1 text-[10px] tracking-[0.3em] text-[var(--color-text-muted)]">
          No.{String(idx + 1).padStart(2, '0')} · ←/→ 切换 · ESC 雾散
        </span>
      </motion.figure>
    </motion.div>
  );
}

/**
 * PotterReader — 魔法世界主题的苏醒肖像墙
 * 城堡石墙 + 金色雕花相框沙龙挂墙；入视口苏醒（烛光晕 + 呼吸），离视口沉睡
 * 魔杖轨迹金色光点；点击开启冥想盆查看
 */
export default function PotterReader({ images, folderName }) {
  const cols = useColumns();
  const [viewing, setViewing] = useState(null);
  const [wallRef, wallWidth] = useContainerWidth();

  const rows = useMemo(() => {
    const out = [];
    for (let i = 0; i < images.length; i += cols) {
      out.push(images.slice(i, i + cols).map((img, j) => ({ img, idx: i + j })));
    }
    return out;
  }, [images, cols]);

  const closeViewer = useCallback(() => setViewing(null), []);
  const navViewer = useCallback(
    (dir) => setViewing((v) => (v === null ? v : (v + dir + images.length) % images.length)),
    [images.length]
  );

  if (!images.length) return null;

  return (
    <div className="relative z-10 min-h-screen select-none">
      <WandTrail />

      {/* 城堡石墙 */}
      <div className="pot-wall px-4 pb-24 pt-24 sm:px-8">
        {/* 墙头标题 */}
        <header className="mx-auto mb-10 max-w-6xl text-center">
          <motion.p
            className="text-[10px] tracking-[0.42em] text-[var(--color-text-muted)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            HOGWARTS PORTRAIT GALLERY
          </motion.p>
          <motion.h1
            className="mt-3 font-display text-[clamp(2rem,5vw,3.4rem)] font-semibold italic tracking-[0.06em] text-[var(--color-text-primary)]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
          >
            苏醒肖像墙
          </motion.h1>
          <motion.p
            className="mt-3 text-[11px] tracking-[0.24em] text-[var(--color-text-secondary)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.28 }}
          >
            {folderName ? `${folderName} · ` : ''}共 {images.length} 幅肖像 · 滚动唤醒沉睡的画像 · 点击潜入冥想盆
          </motion.p>
        </header>

        {/* 比例挂墙 — 相框宽高比 = 照片真实比例，fitRowPx 整行适配容器宽 */}
        <div ref={wallRef} className="mx-auto max-w-6xl space-y-8">
          {wallWidth > 0 &&
            rows.map((row, r) => {
              const ratios = row.map(({ img }) => imgRatio(img));
              const gap = wallWidth < 640 ? 16 : 24;
              const rowH = wallWidth < 640 ? 200 : 280;
              const { widths } = fitRowPx(ratios, wallWidth, rowH, gap);
              return (
                <div key={r} className="flex justify-center" style={{ gap }}>
                  {row.map(({ img, idx }, i) => (
                    <PortraitFrame
                      key={img.id ?? idx}
                      img={img}
                      idx={idx}
                      onOpen={setViewing}
                      delay={Math.min(0.6, (idx % cols) * 0.06 + r * 0.08)}
                      width={widths[i]}
                      ratio={ratios[i]}
                    />
                  ))}
                </div>
              );
            })}
        </div>
      </div>

      {/* 冥想盆查看器 */}
      <AnimatePresence>
        {viewing !== null && (
          <Pensieve
            key="pensieve"
            images={images}
            idx={viewing}
            onClose={closeViewer}
            onNav={navViewer}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
