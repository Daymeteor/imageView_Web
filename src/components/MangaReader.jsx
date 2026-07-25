import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fileNameToTitle } from '../utils/imageHelpers';
import PhotoModal from './PhotoModal';

/** 拟声词池 — 日漫味 */
const SFX = ['ドン!!', 'バン!!', 'ゴゴゴゴ', 'ドカッ!!', 'ザワッ…', 'ズドン!!', 'ババッ!!'];

/** 容器固定 16:9，槽位宽高换算视觉比例：r = w% × A / h% */
const A = 16 / 9;

/**
 * 漫画版式库 — 经典コマ割り
 * 槽位按阅读顺序排列，坐标为容器百分比
 */
const TEMPLATES = {
  // 单页冲击：整页一格
  splash: { size: 1, slots: [{ x: 0, y: 0, w: 100, h: 100 }] },
  // 双格横排
  duoH: {
    size: 2,
    slots: [
      { x: 0, y: 0, w: 49, h: 100 },
      { x: 51, y: 0, w: 49, h: 100 },
    ],
  },
  // 双横堆叠
  duoV: {
    size: 2,
    slots: [
      { x: 0, y: 0, w: 100, h: 49 },
      { x: 0, y: 51, w: 100, h: 49 },
    ],
  },
  // 左一右二：左大格 + 右侧上下两格
  L1R2: {
    size: 3,
    slots: [
      { x: 0, y: 0, w: 58, h: 100 },
      { x: 60, y: 0, w: 40, h: 49 },
      { x: 60, y: 51, w: 40, h: 49 },
    ],
  },
  // 右一左二：镜像，避免版式单调
  R1L2: {
    size: 3,
    slots: [
      { x: 42, y: 0, w: 58, h: 100 },
      { x: 0, y: 0, w: 40, h: 49 },
      { x: 0, y: 51, w: 40, h: 49 },
    ],
  },
  // 上一下二：顶部宽格 + 底部两格
  T1B2: {
    size: 3,
    slots: [
      { x: 0, y: 0, w: 100, h: 56 },
      { x: 0, y: 58, w: 49, h: 42 },
      { x: 51, y: 58, w: 49, h: 42 },
    ],
  },
  // 三竖连排
  trioRow: {
    size: 3,
    slots: [
      { x: 0, y: 0, w: 32, h: 100 },
      { x: 34, y: 0, w: 32, h: 100 },
      { x: 68, y: 0, w: 32, h: 100 },
    ],
  },
};

const slotRatio = (s) => (s.w * A) / s.h;

/**
 * 比例自适应选版：取接下来 1–3 张，对所有可行版式打分
 * （照片比例 vs 槽位比例的对数差），避免与上页同版式，轻微鼓励多格页
 */
function choosePage(photos, lastId) {
  let best = null;
  const maxSize = Math.min(3, photos.length);
  for (let size = 1; size <= maxSize; size++) {
    const group = photos.slice(0, size);
    for (const [id, t] of Object.entries(TEMPLATES)) {
      if (t.size !== size) continue;
      let score = 0;
      for (let i = 0; i < size; i++) {
        score += Math.abs(Math.log(group[i].r / slotRatio(t.slots[i])));
      }
      if (id === lastId) score += 0.35; // 连续同版式惩罚
      if (size === 3) score -= 0.12; // 漫画感来自多格
      if (size === 1) score += 0.1; // 单页冲击留给真正合适的
      if (!best || score < best.score) best = { id, t, group, score };
    }
  }
  return best;
}

/** 按照片宽高比 + 版式库编排书页 */
function buildPages(images) {
  const photos = images.map((img, idx) => ({
    img,
    idx,
    r: img.width && img.height ? img.width / img.height : 1,
  }));
  const pages = [];
  let i = 0;
  let lastId = null;
  while (i < photos.length) {
    const { id, t, group } = choosePage(photos.slice(i), lastId);
    pages.push({
      sfx: SFX[pages.length % SFX.length],
      panels: group.map((p, j) => ({
        ...p,
        rect: { left: t.slots[j].x, top: t.slots[j].y, width: t.slots[j].w, height: t.slots[j].h },
        cut: j === 0, // 阅读顺序首格 = 斜切演出格
        cutVariant: slotRatio(t.slots[j]) > 1.3 ? 'mg-cut-b' : 'mg-cut-a',
      })),
    });
    lastId = id;
    i += group.length;
  }
  return pages;
}

const wrapV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.24, delayChildren: 0.08 } },
};

/** 抽帧 slam：大幅顿一拍 → 急砸到位 → 微回弹，张力来自"顿" */
const panelV = {
  hidden: { opacity: 0, scale: 1.55, rotate: 3 },
  show: {
    opacity: [0, 1, 1, 1],
    scale: [1.55, 1.55, 1.06, 1],
    rotate: [3, 3, -1, 0],
    transition: { duration: 0.5, times: [0, 0.32, 0.68, 1], ease: 'easeOut' },
  },
};

/** 每格落定的白闪 */
const flashV = {
  hidden: { opacity: 0 },
  show: { opacity: [0.85, 0], transition: { duration: 0.35, delay: 0.24, ease: 'easeOut' } },
};

/** 拟声词：慢放蓄力 → 急停 */
const sfxInitial = { scale: 0.2, rotate: -26, skewX: -6, opacity: 0 };
const sfxAnimate = {
  scale: [0.2, 1.22, 1],
  rotate: [-26, -4, -7],
  skewX: -6,
  opacity: [0, 1, 1],
};
const sfxTransition = { duration: 0.65, times: [0, 0.6, 1], delay: 0.55, ease: ['circOut', 'easeOut'] };

/**
 * MangaReader — 漫波普主题的连载漫画阅读器（Persona 5 演出）
 * 版式库 + 比例自适应编排；抽帧 slam + 慢放拟声词
 */
export default function MangaReader({ images, theme = 'animepop', folderName }) {
  const pages = useMemo(() => buildPages(images), [images]);
  const last = pages.length;
  const [pos, setPos] = useState(-1);
  const [wipeTick, setWipeTick] = useState(0);
  const [modalIdx, setModalIdx] = useState(null);
  const swapTimer = useRef(null);

  const navigate = useCallback(
    (dir) => {
      setPos((v) => {
        const target = Math.min(Math.max(v + dir, -1), last);
        if (target === v) return v;
        setWipeTick((t) => t + 1);
        clearTimeout(swapTimer.current);
        swapTimer.current = setTimeout(() => setPos(target), 250);
        return v;
      });
    },
    [last]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (modalIdx !== null) return;
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'ArrowLeft') navigate(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate, modalIdx]);

  useEffect(() => () => clearTimeout(swapTimer.current), []);

  // 再读一遍 — 直接回到 PAGE 1（带红色扫过）
  const restart = useCallback(() => {
    setWipeTick((t) => t + 1);
    clearTimeout(swapTimer.current);
    swapTimer.current = setTimeout(() => setPos(0), 250);
  }, []);

  const onStageClick = (e) => {
    if (e.target.closest('.mg-cut-border, .mg-rect, button')) return;
    if (pos === -1) { navigate(1); return; }
    const x = e.clientX / window.innerWidth;
    navigate(x > 0.5 ? 1 : -1);
  };

  const openPhoto = (e, idx) => {
    e.stopPropagation();
    setModalIdx(idx);
  };

  // ==================== 封面 / 结尾 ====================
  const Cover = (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div
        className="mg-halftone-red absolute left-1/2 top-1/2 -z-0 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ maskImage: 'radial-gradient(circle, #000 30%, transparent 70%)', WebkitMaskImage: 'radial-gradient(circle, #000 30%, transparent 70%)' }}
      />
      <motion.span className="mg-label" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        ISSUE #01
      </motion.span>
      <motion.h1
        className="relative z-10 mt-6 font-display text-[clamp(3rem,9vw,6.5rem)] font-black leading-none tracking-[0.08em] text-white"
        style={{ textShadow: '8px 8px 0 var(--color-accent)' }}
        initial={{ opacity: 0, scale: 1.3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 16, delay: 0.2 }}
      >
        漫波普
      </motion.h1>
      <motion.p
        className="mt-5 text-xs tracking-[0.3em] text-[var(--color-text-secondary)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {folderName || 'ANIME POP COMIC'} · 全 {images.length} 格
      </motion.p>
      <motion.button
        className="mt-10 skew-x-[-10deg] px-10 py-3 text-sm font-bold tracking-[0.3em] text-white transition-transform hover:scale-105"
        style={{ background: 'var(--color-accent)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        onClick={(e) => { e.stopPropagation(); navigate(1); }}
      >
        START ▸
      </motion.button>
    </div>
  );

  const EndPage = (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <motion.span
        className="mg-sfx"
        style={{ position: 'relative' }}
        initial={sfxInitial}
        animate={sfxAnimate}
        transition={sfxTransition}
      >
        つづく
      </motion.span>
      <motion.p
        className="mt-8 text-[11px] tracking-[0.4em] text-[var(--color-text-muted)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        TO BE CONTINUED
      </motion.p>
      <motion.button
        className="mt-10 skew-x-[-10deg] border-2 border-white px-8 py-2.5 text-xs font-bold tracking-[0.3em] text-white transition-colors hover:bg-white hover:text-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75 }}
        onClick={(e) => { e.stopPropagation(); restart(); }}
      >
        ◂ 再读一遍
      </motion.button>
    </div>
  );

  // ==================== 渲染 ====================
  return (
    <div
      className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pb-10 pt-24"
      onClick={onStageClick}
    >
      {pos >= 0 && pos < last && (
        <div className="mb-4 flex items-center justify-between" style={{ width: 'min(94vw, calc(68vh * 16 / 9), 1080px)' }}>
          <span className="mg-label">PAGE {pos + 1} / {last}</span>
          <span className="text-[10px] tracking-[0.2em] text-[var(--color-text-muted)]">
            点击左右两侧翻页 · ←/→
          </span>
        </div>
      )}

      {/* 页面区 — 固定 16:9 */}
      <div
        className="relative"
        style={{ aspectRatio: '16 / 9', width: 'min(94vw, calc(68vh * 16 / 9), 1080px)' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={pos}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {pos === -1 && Cover}
            {pos === last && EndPage}
            {pos >= 0 && pos < last && (
              <motion.div
                key={`shake-${pos}`}
                className="absolute inset-0"
                animate={{ x: [0, -7, 6, -3, 1, 0] }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <motion.div className="absolute inset-0" variants={wrapV} initial="hidden" animate="show">
                  {pages[pos].panels.map((p, j) => (
                    <motion.div
                      key={`${pos}-${j}`}
                      variants={panelV}
                      className="absolute"
                      style={{
                        left: `${p.rect.left}%`,
                        top: `${p.rect.top}%`,
                        width: `${p.rect.width}%`,
                        height: `${p.rect.height}%`,
                      }}
                    >
                      {p.cut ? (
                        <div className={`mg-cut ${p.cutVariant}`}>
                          <div className="mg-cut-border" onClick={(e) => openPhoto(e, p.idx)} role="button" aria-label={`查看大图 ${p.img.name}`}>
                            <img className="mg-cut-img" src={p.img.url} alt={p.img.name} draggable="false" />
                            <span className="mg-tag">{fileNameToTitle(p.img.name)}</span>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="mg-rect"
                          style={{ transform: `rotate(${j % 2 ? 0.8 : -0.8}deg)` }}
                          onClick={(e) => openPhoto(e, p.idx)}
                          role="button"
                          aria-label={`查看大图 ${p.img.name}`}
                        >
                          <img src={p.img.url} alt={p.img.name} draggable="false" />
                          <span className="mg-tag">{fileNameToTitle(p.img.name)}</span>
                        </div>
                      )}
                      <motion.div variants={flashV} className="pointer-events-none absolute inset-0 z-10 bg-white" />
                    </motion.div>
                  ))}
                  <motion.span
                    className="mg-sfx"
                    style={pos % 2 === 0 ? { right: '2%', bottom: '-4px' } : { left: '2%', bottom: '-4px' }}
                    initial={sfxInitial}
                    animate={sfxAnimate}
                    transition={sfxTransition}
                  >
                    {pages[pos].sfx}
                  </motion.span>
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 翻页红色斜切扫过 + 白闪 */}
      {wipeTick > 0 && (
        <motion.div
          key={`wipe-${wipeTick}`}
          className="pointer-events-none fixed inset-y-0 z-[150] w-[135vw] bg-[var(--color-accent)]"
          initial={{ x: '-140%', skewX: -12 }}
          animate={{ x: '140%', skewX: -12 }}
          transition={{ duration: 0.6, ease: [0.7, 0, 0.3, 1] }}
        />
      )}
      {wipeTick > 0 && (
        <motion.div
          key={`flash-${wipeTick}`}
          className="pointer-events-none fixed inset-0 z-[151] bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.75, 0] }}
          transition={{ duration: 0.32, delay: 0.22 }}
        />
      )}

      {/* 大图弹窗（复用） */}
      <PhotoModal
        image={modalIdx !== null ? images[modalIdx] : null}
        images={images}
        theme={theme}
        onClose={() => setModalIdx(null)}
        onPrev={() => setModalIdx((i) => (i - 1 + images.length) % images.length)}
        onNext={() => setModalIdx((i) => (i + 1) % images.length)}
      />
    </div>
  );
}
