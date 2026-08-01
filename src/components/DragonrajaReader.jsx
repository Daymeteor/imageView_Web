import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fileNameToTitle } from '../utils/imageHelpers';
import { imgRatio, fitContain, fitRowPx, packRows } from '../utils/layoutEngine';

/**
 * DragonrajaReader — 龙族 · 卡塞尔档案馆
 * 金边档案卡：言灵编号 + 血统等级(S/A/B 伪随机) + 档案名；
 * 点击 → 龙血觉醒（绯金脉冲从卡中心炸开 + 龙鳞纹在照片上短暂浮现）
 *      → 大图查看（fitContain，卡背附言灵注解）。
 * ←/→ 切换，ESC/点背景归档。
 */

/** 确定性伪随机，避免每次渲染抖动 */
function seeded(i, salt = 0) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** 言灵谱系（编号 + 名） */
const YANLING = [
  ['059', '时间零'], ['091', '君焰'], ['073', '镰鼬'], ['047', '无尘之地'],
  ['112', '烛龙'], ['066', '镜瞳'], ['038', '冥照'], ['084', '蛇'],
  ['077', '吸血镰'], ['101', '王权'], ['052', '风王之瞳'], ['096', '青铜御座'],
];
/** 卡背言灵注解 */
const NOTES = [
  '血脉回响稳定，言灵序列已归档。',
  '觉醒阈值低于均值，列为重点观察对象。',
  '龙文共鸣强烈，禁止单独接触档案原件。',
  '血清样检见微量龙血因子，等级上调。',
  '言灵释放伴生领域扩张，需三级以上许可。',
  '档案封印完好，执行部定期巡检。',
  '共鸣测试中观测到短暂鳞化现象。',
  '血统溯源指向古龙一脉，存疑待查。',
];
const GRADES = ['S', 'A', 'A', 'B', 'B', 'B']; // S 稀有

/** 照片区统一高度（px）：卡宽 = 照片高 × 片比 + 金边留白 */
const PHOTO_H = 150;
/** 卡体比照片区多出的固定横宽 */
const CARD_EXTRA = 26;
const GAP_X = 26;

function useShelfWidth() {
  const ref = useRef(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setW(el.clientWidth);
    const ro = new ResizeObserver((es) => setW(es[0].contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

export default function DragonrajaReader({ images }) {
  const [sel, setSel] = useState(null); // 查看中的档案序号
  const [pulse, setPulse] = useState(null); // 龙血觉醒脉冲 {i, x, y}
  const timer = useRef(null);
  const total = images.length;

  const closeViewer = useCallback(() => setSel(null), []);
  const step = useCallback(
    (d) => setSel((v) => (v === null ? v : (v + d + total) % total)),
    [total]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeViewer();
      if (sel === null) return;
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sel, closeViewer, step]);

  useEffect(() => () => clearTimeout(timer.current), []);

  /** 龙血觉醒：绯金脉冲从卡中心炸开，随后开卷 */
  const awaken = (i, e) => {
    if (pulse) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setPulse({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setSel(i);
      setPulse(null);
    }, 620);
  };

  // 比例分行：片比驱动卡宽，行容量按架面宽/照片高估算
  const [shelfRef, shelfW] = useShelfWidth();
  const ratios = images.map(imgRatio);
  const maxPerRow = shelfW < 560 ? 2 : shelfW < 900 ? 3 : 4;
  const rows = shelfW > 0 ? packRows(ratios, shelfW / PHOTO_H, maxPerRow) : [];

  if (!total) return null;

  return (
    <div className="fixed inset-0 z-10 select-none overflow-y-auto pt-24 pb-10">
      <div className="mx-auto w-[min(1120px,94vw)]">
        {/* 馆头 */}
        <header className="mb-7 text-center">
          <p className="font-display text-[10px] tracking-[0.5em] text-[var(--color-text-muted)]">
            CASSELL ARCHIVES · 卡塞尔档案馆
          </p>
          <h2
            className="mt-3 font-display text-2xl tracking-[0.3em] text-[var(--color-gold-light)] sm:text-3xl"
            style={{ textShadow: '0 0 24px rgba(212,175,55,0.35)' }}
          >
            龙血档案 · 启封
          </h2>
          <p className="mt-2 text-[10px] tracking-[0.3em] text-[var(--color-text-secondary)]">
            共 {total} 卷 · 点击档案，唤醒龙血
          </p>
        </header>

        {/* 档案卡墙 — 按片比分行 */}
        <div ref={shelfRef}>
          <div className="space-y-9">
            {rows.map((idxs, r) => {
              const inner = shelfW - idxs.length * CARD_EXTRA;
              const { widths, height } = fitRowPx(
                idxs.map((i) => ratios[i]),
                inner,
                PHOTO_H,
                GAP_X
              );
              return (
                <div key={images[idxs[0]].id} className="flex flex-wrap justify-center" style={{ gap: `${GAP_X}px` }}>
                  {idxs.map((i, k) => {
                    const cardW = Math.round(widths[k] + CARD_EXTRA);
                    const [num, name] = YANLING[Math.floor(seeded(i, 3) * YANLING.length)];
                    const grade = GRADES[Math.floor(seeded(i, 5) * GRADES.length)];
                    return (
                      <motion.button
                        key={images[i].id}
                        className="group relative cursor-pointer text-left"
                        style={{ width: cardW }}
                        initial={{ opacity: 0, y: 26 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(0.1 + i * 0.08, 0.8), duration: 0.45 }}
                        whileHover={{ y: -6 }}
                        onClick={(e) => awaken(i, e)}
                        aria-label={`启封档案 ${images[i].name}`}
                      >
                        <ArchiveCard
                          img={images[i]}
                          num={num}
                          name={name}
                          grade={grade}
                          photoH={height}
                        />
                      </motion.button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* 馆尾 */}
        <p className="mt-12 text-center font-display text-sm tracking-[0.34em] text-[var(--color-text-muted)]">
          凡王之血，必以剑终 · baigao
        </p>
      </div>

      {/* 龙血觉醒 — 绯金脉冲从卡中心炸开 */}
      <AnimatePresence>
        {pulse && (
          <div
            className="pointer-events-none fixed z-[290] h-[160vmax] w-[160vmax] rounded-full"
            style={{
              left: pulse.x,
              top: pulse.y,
              background:
                'radial-gradient(circle, rgba(232,204,106,0.85) 0%, rgba(212,175,55,0.5) 12%, rgba(139,0,0,0.4) 26%, rgba(13,13,18,0.0) 46%)',
              animation: 'dgr-pulse 0.62s cubic-bezier(0.2,0.6,0.2,1) forwards',
            }}
          />
        )}
      </AnimatePresence>

      {/* 开卷查看 — 档案大图 */}
      <AnimatePresence>
        {sel !== null && (
          <motion.div
            className="fixed inset-0 z-[300] flex flex-col items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeViewer}
          >
            <div
              className="absolute inset-0 backdrop-blur-[5px]"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(20,16,8,0.6) 0%, rgba(8,8,11,0.94) 100%)',
              }}
            />
            <motion.div
              key={sel}
              className="relative z-10 w-[min(520px,92vw)]"
              initial={{ scale: 0.6, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0, y: 24 }}
              transition={{ type: 'spring', stiffness: 230, damping: 21 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ViewerCard img={images[sel]} index={sel} total={total} />
            </motion.div>
            <p className="relative z-10 mt-5 text-[10px] tracking-[0.3em] text-[var(--color-text-secondary)]">
              ←/→ 换卷 · ESC 归档
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** 金边档案卡 */
function ArchiveCard({ img, num, name, grade, photoH = PHOTO_H }) {
  const isS = grade === 'S';
  return (
    <div
      className="dgr-scale-pattern relative rounded-[4px] border p-[9px] pb-2.5 transition-shadow duration-300"
      style={{
        background: 'linear-gradient(165deg, #1b1b26 0%, #12121a 55%, #17171f 100%)',
        borderColor: 'var(--color-accent-card-border)',
        boxShadow: '0 10px 28px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(212,175,55,0.08)',
      }}
    >
      {/* 卡头：言灵编号 + 血统等级 */}
      <div className="mb-2 flex items-center justify-between">
        <p className="font-display text-[10px] tracking-[0.2em] text-[var(--color-gold-light)]">
          言灵 Nº.{num} · {name}
        </p>
        <span
          className="flex h-5 w-5 items-center justify-center rounded-full border font-display text-[10px] font-semibold"
          style={{
            color: isS ? '#e8cc6a' : 'var(--color-text-secondary)',
            borderColor: isS ? 'rgba(212,175,55,0.7)' : 'rgba(232,224,208,0.3)',
            background: isS ? 'rgba(212,175,55,0.14)' : 'transparent',
            boxShadow: isS ? '0 0 10px rgba(212,175,55,0.35)' : 'none',
          }}
        >
          {grade}
        </span>
      </div>

      {/* 照片：高度统一，宽度由外层按片比给定 */}
      <div
        className="overflow-hidden rounded-[2px] border border-[rgba(212,175,55,0.25)] bg-black/60"
        style={{ boxShadow: 'inset 0 0 20px rgba(0,0,0,0.6)' }}
      >
        <img
          src={img.url}
          alt={img.name}
          draggable="false"
          loading="lazy"
          className="block w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          style={{ height: photoH, filter: 'saturate(0.92) contrast(1.05)' }}
        />
      </div>

      {/* 档案名 */}
      <p className="mt-2 truncate text-center text-[10px] tracking-[0.22em] text-[var(--color-text-secondary)]">
        档案 · {fileNameToTitle(img.name)}
      </p>

      {/* 底部金线 */}
      <div
        className="pointer-events-none absolute inset-x-4 bottom-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.55), transparent)' }}
      />
    </div>
  );
}

/** 开卷大档：fitContain 大图 + 龙鳞纹短暂浮现 + 卡背言灵注解 */
function ViewerCard({ img, index, total }) {
  const r = imgRatio(img);
  const [num, name] = YANLING[Math.floor(seeded(index, 3) * YANLING.length)];
  const note = NOTES[Math.floor(seeded(index, 7) * NOTES.length)];
  const grade = GRADES[Math.floor(seeded(index, 5) * GRADES.length)];
  const fit = fitContain(
    Math.min(480, window.innerWidth * 0.86),
    window.innerHeight * 0.56,
    r
  );
  return (
    <div
      className="dgr-scale-pattern rounded-[5px] border p-4 sm:p-5"
      style={{
        background: 'linear-gradient(168deg, #1d1d28 0%, #111118 60%, #171720 100%)',
        borderColor: 'rgba(212,175,55,0.45)',
        boxShadow: '0 40px 90px rgba(0,0,0,0.75), 0 0 60px rgba(212,175,55,0.16)',
      }}
    >
      <div className="mb-3 flex items-center justify-between">
        <p className="font-display text-xs tracking-[0.24em] text-[var(--color-gold-light)]">
          言灵 Nº.{num} · {name}
        </p>
        <p className="font-display text-xs tracking-[0.2em] text-[var(--color-text-muted)]">
          血统 {grade} 级
        </p>
      </div>

      {/* 照片 — 龙鳞纹短暂浮现 */}
      <div
        className="relative mx-auto overflow-hidden rounded-[2px] border border-[rgba(212,175,55,0.4)] bg-black"
        style={{ width: fit.width, height: fit.height }}
      >
        <img
          src={img.url}
          alt={img.name}
          draggable="false"
          className="block h-full w-full object-contain"
        />
        <div
          key={index}
          className="dgr-scale-pattern pointer-events-none absolute inset-0"
          style={{
            backgroundColor: 'rgba(139,0,0,0.1)',
            animation: 'dgr-scale-reveal 1.1s ease-out forwards',
          }}
        />
      </div>

      {/* 卡背言灵注解 */}
      <div className="mt-4 border-t border-[rgba(212,175,55,0.22)] pt-3">
        <p className="text-center font-display text-sm tracking-[0.18em] text-[var(--color-text-primary)]">
          {fileNameToTitle(img.name)}
        </p>
        <p className="mt-1.5 text-center text-[11px] leading-relaxed tracking-[0.12em] text-[var(--color-text-secondary)]">
          言灵注解：{note}
        </p>
        <p className="mt-2 text-center text-[9px] tracking-[0.3em] text-[var(--color-text-muted)]">
          CASSELL COLLEGE · EXECUTION DEPT. · Nº.{String(index + 1).padStart(3, '0')} / {total}
        </p>
      </div>
    </div>
  );
}
