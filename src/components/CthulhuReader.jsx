import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fileNameToTitle } from '../utils/imageHelpers';
import { imgRatio } from '../utils/layoutEngine';

const pad = (n) => String(n).padStart(2, '0');
const FATHOMS_PER_TABLET = 40; // 每下潜一碑 -40 英寻
const RUNES = ['ᚦ', 'ᚱ', 'ᛟ', 'ᚲ', 'ᛉ', 'ᛗ', 'ᚨ', 'ᚾ'];

/** 石碑进场：从深海黑暗中上浮显现 */
const tabletV = {
  hidden: { opacity: 0, y: 64, scale: 0.94 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

/**
 * CthulhuReader — 克苏鲁主题的深潜典籍
 * 照片蚀刻在古神石碑上（苔藓纹边框 + 符文角饰），竖向 snap 下潜浏览；
 * 右侧深度计随下潜加深（-N 英寻）；点击石碑 = 理智值下降：
 * 查看浮层边缘重度扭曲模糊（SVG 位移滤镜 + 径向边缘虚化）+ 磷光绿描边 + 低频明灭
 */
export default function CthulhuReader({ images, theme = 'cthulhu' }) {
  const total = images.length;
  const [cur, setCur] = useState(0);
  const [vision, setVision] = useState(false); // 理智值下降查看浮层
  const [visited, setVisited] = useState(() => new Set()); // 已凝视过的石碑 → 理智流失
  const scrollRef = useRef(null);
  const sectionRefs = useRef([]);

  const depth = (cur + 1) * FATHOMS_PER_TABLET;
  const maxDepth = total * FATHOMS_PER_TABLET;
  const sanity = Math.max(0, 100 - visited.size * 9);

  const scrollTo = useCallback((i) => {
    sectionRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const step = useCallback(
    (d) => {
      setCur((c) => {
        const n = (c + d + total) % total;
        scrollTo(n);
        return n;
      });
    },
    [total, scrollTo]
  );

  const openVision = useCallback((i) => {
    setVisited((s) => (s.has(i) ? s : new Set(s).add(i)));
    setVision(true);
  }, []);
  const closeVision = useCallback(() => setVision(false), []);

  // ---- 滚动侦察：哪块石碑占据视野，深度计就跟到哪 ----
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return undefined;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = el.clientHeight || 1;
        const i = Math.min(total - 1, Math.max(0, Math.round(el.scrollTop / h)));
        setCur((c) => (c === i ? c : i));
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [total]);

  // ---- 键盘：←/→ 下潜/上浮（浮层内切换照片），ESC 回到典籍 ----
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeVision();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') step(1);
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, closeVision]);

  const curImg = images[cur];

  /** 蚀刻符文角饰 */
  const RuneCorner = ({ pos, rune }) => (
    <span
      className={`pointer-events-none absolute ${pos} select-none font-display text-sm`}
      style={{ color: 'var(--color-accent-subtle)', opacity: 0.7, textShadow: '0 0 8px var(--color-accent-shadow)' }}
      aria-hidden="true"
    >
      {rune}
    </span>
  );

  return (
    <div className="relative z-10 flex h-screen select-none flex-col overflow-hidden pt-24">
      {/* 页眉：典籍题名 */}
      <header className="flex-none px-6 text-center">
        <p className="text-[10px] tracking-[0.42em]" style={{ color: 'var(--color-text-muted)' }}>
          THE SUNKEN CODEX · R'LYEH ARCHIVE
        </p>
        <h2 className="mt-1 font-display text-2xl tracking-[0.14em]" style={{ color: 'var(--color-accent-dim)' }}>
          深潜典籍
        </h2>
        <p className="mt-1 font-display text-[11px] tracking-[0.3em]" style={{ color: 'var(--color-text-secondary)' }}>
          第 {pad(cur + 1)} 碑 / 共 {pad(total)} 碑 · −{depth} 英寻
        </p>
      </header>

      <div className="relative flex min-h-0 flex-1">
        {/* ============ 竖向下潜石碑序列 ============ */}
        <div
          ref={scrollRef}
          className="cth-descent min-w-0 flex-1 snap-y snap-mandatory overflow-y-auto"
        >
          {images.map((img, i) => {
            const r = imgRatio(img);
            return (
              <section
                key={img.id ?? i}
                ref={(el) => { sectionRefs.current[i] = el; }}
                className="flex h-full snap-start items-center justify-center px-6 sm:px-16"
              >
                <motion.button
                  variants={tabletV}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ root: scrollRef, amount: 0.45, once: true }}
                  className="group relative block cursor-pointer"
                  style={{ width: `min(100%, calc(58vh * ${r}))` }}
                  onClick={() => { setCur(i); openVision(i); }}
                  aria-label={`凝视第 ${i + 1} 碑 ${img.name}`}
                >
                  {/* 古神石碑：苔藓纹边框 + 石质底 */}
                  <div
                    className="relative p-[14px] transition-all duration-500 group-hover:-translate-y-1"
                    style={{
                      background:
                        'linear-gradient(160deg, var(--color-moss) 0%, var(--color-leaf) 45%, var(--color-bg-surface) 100%)',
                      border: 'var(--card-border)',
                      boxShadow: i === cur ? 'var(--card-shadow-hover)' : 'var(--card-shadow)',
                    }}
                  >
                    {/* 苔藓侵蚀内沿 */}
                    <div
                      className="pointer-events-none absolute inset-[5px]"
                      style={{
                        border: '1px solid var(--color-accent-card-border)',
                        background:
                          'radial-gradient(ellipse at 0% 0%, rgba(74,122,98,0.28) 0%, transparent 40%), radial-gradient(ellipse at 100% 100%, rgba(74,122,98,0.22) 0%, transparent 42%)',
                      }}
                      aria-hidden="true"
                    />
                    <RuneCorner pos="left-1 top-0" rune={RUNES[i % RUNES.length]} />
                    <RuneCorner pos="right-1 top-0" rune={RUNES[(i + 3) % RUNES.length]} />
                    <RuneCorner pos="bottom-0 left-1" rune={RUNES[(i + 5) % RUNES.length]} />
                    <RuneCorner pos="bottom-0 right-1" rune={RUNES[(i + 7) % RUNES.length]} />

                    <img
                      src={img.url}
                      alt={img.name}
                      draggable="false"
                      loading={Math.abs(i - cur) <= 1 ? 'eager' : 'lazy'}
                      className="block w-full transition-[filter] duration-700 group-hover:brightness-110"
                      style={{ aspectRatio: r, filter: 'saturate(0.82) brightness(0.9)' }}
                    />

                    {/* 碑铭 */}
                    <div className="mt-3 flex items-baseline justify-between gap-3 px-1">
                      <p
                        className="truncate font-display text-[13px] italic tracking-[0.08em]"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {fileNameToTitle(img.name)}
                      </p>
                      <p
                        className="flex-none font-display text-[10px] tracking-[0.24em]"
                        style={{ color: 'var(--color-accent-subtle)' }}
                      >
                        −{(i + 1) * FATHOMS_PER_TABLET} FT
                      </p>
                    </div>
                  </div>
                </motion.button>
              </section>
            );
          })}
        </div>

        {/* ============ 右侧深度计 ============ */}
        <aside className="pointer-events-auto flex w-14 flex-none flex-col items-center justify-center gap-3 pr-3">
          <span
            className="font-display text-[10px] tracking-[0.2em]"
            style={{ color: 'var(--color-text-muted)', writingMode: 'vertical-rl' }}
          >
            DEPTH
          </span>
          <div
            className="relative w-[3px] flex-1 overflow-hidden rounded-full"
            style={{ background: 'var(--color-accent-card-border)' }}
          >
            <motion.div
              className="absolute inset-x-0 top-0 rounded-full"
              style={{ background: 'linear-gradient(180deg, var(--color-accent-subtle), var(--color-accent))' }}
              animate={{ height: `${((cur + 1) / total) * 100}%` }}
              transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            />
            {/* 每碑刻度（可点击下潜） */}
            {images.map((_, i) => (
              <button
                key={i}
                className="absolute left-1/2 h-[10px] w-[10px] -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full transition-transform hover:scale-150"
                style={{
                  top: `${((i + 0.5) / total) * 100}%`,
                  background: i === cur ? 'var(--color-accent)' : 'var(--color-accent-card-border-hover)',
                  boxShadow: i === cur ? '0 0 10px var(--color-accent)' : 'none',
                }}
                onClick={() => { setCur(i); scrollTo(i); }}
                aria-label={`下潜至第 ${i + 1} 碑`}
              />
            ))}
          </div>
          <motion.span
            key={depth}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="font-display text-[11px] tracking-[0.08em]"
            style={{ color: 'var(--color-accent)' }}
          >
            −{depth}
          </motion.span>
          <span className="text-[9px] tracking-[0.2em]" style={{ color: 'var(--color-text-muted)' }}>
            英寻
          </span>
        </aside>
      </div>

      {/* 页脚：理智值 */}
      <footer className="flex-none px-6 pb-5 pt-2 text-center">
        <p className="font-display text-[11px] tracking-[0.3em]" style={{ color: 'var(--color-text-muted)' }}>
          SAN {sanity} / 100 · 滚动或 ←/→ 下潜 · 点击石碑凝视深渊 · ESC 浮回
        </p>
        <div
          className="mx-auto mt-2 h-[3px] w-48 overflow-hidden rounded-full"
          style={{ background: 'var(--color-accent-card-border)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${sanity}%`,
              background: sanity > 40 ? 'var(--color-accent-dim)' : 'var(--color-accent)',
              boxShadow: sanity > 40 ? 'none' : '0 0 12px var(--color-accent)',
            }}
          />
        </div>
      </footer>

      {/* ============ 理智值下降：凝视浮层 ============ */}
      <AnimatePresence>
        {vision && (
          <motion.div
            className="fixed inset-0 z-[300] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeVision}
          >
            {/* 深渊压暗 */}
            <div className="absolute inset-0 backdrop-blur-md" style={{ background: 'rgba(3, 8, 15, 0.88)' }} />

            {/* SVG 扭曲滤镜定义 */}
            <svg className="absolute h-0 w-0" aria-hidden="true">
              <filter id="cth-warp">
                <feTurbulence type="fractalNoise" baseFrequency="0.012 0.035" numOctaves="2" seed="7" result="n" />
                <feDisplacementMap in="SourceGraphic" in2="n" scale="34" />
              </filter>
            </svg>

            {/* 被凝视的照片：磷光描边 + 低频明灭 */}
            <motion.div
              key={curImg.id ?? cur}
              className="cth-flicker relative"
              initial={{ opacity: 0, scale: 1.08, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 磷光绿描边（外层光晕） */}
              <div
                className="absolute -inset-3"
                style={{
                  border: '1px solid var(--color-accent)',
                  boxShadow:
                    '0 0 24px var(--color-accent-shadow-hover), 0 0 72px var(--color-accent-shadow), inset 0 0 32px var(--color-accent-shadow)',
                }}
                aria-hidden="true"
              />
              {/* 边缘重度扭曲环：SVG 位移滤镜驱动的扭曲边框 */}
              <div
                className="absolute -inset-10"
                style={{
                  filter: 'url(#cth-warp)',
                  border: '22px solid rgba(0, 230, 118, 0.10)',
                  borderRadius: '38% 62% 55% 45% / 48% 42% 58% 52%',
                }}
                aria-hidden="true"
              />
              <img
                src={curImg.url}
                alt={curImg.name}
                draggable="false"
                className="max-h-[74vh] max-w-[88vw] object-contain"
                style={{ boxShadow: '0 24px 90px rgba(0,0,0,0.8)' }}
              />
              {/* 边缘重度模糊（径向遮罩只虚化四周） */}
              <div
                className="pointer-events-none absolute -inset-16 backdrop-blur-lg"
                style={{
                  WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 52%, black 82%)',
                  maskImage: 'radial-gradient(ellipse at center, transparent 52%, black 82%)',
                }}
                aria-hidden="true"
              />
              {/* 碑铭落款 */}
              <p
                className="mt-4 text-center font-display text-base italic tracking-[0.12em]"
                style={{ color: 'var(--color-accent-pale)', textShadow: '0 0 14px var(--color-accent-shadow-hover)' }}
              >
                “{fileNameToTitle(curImg.name)}”
              </p>
            </motion.div>

            {/* 角标 */}
            <div className="pointer-events-none absolute left-5 top-4 z-[3] font-display text-[10px] tracking-[0.3em] text-white/60">
              TABLET {pad(cur + 1)} / {pad(total)} · −{depth} FATHOMS
            </div>
            <div className="pointer-events-none absolute right-5 top-4 z-[3] font-display text-[10px] tracking-[0.3em] text-white/60">
              SANITY −{100 - sanity} · ESC 浮回
            </div>
            <div className="pointer-events-none absolute bottom-4 left-1/2 z-[3] -translate-x-1/2 font-display text-[10px] tracking-[0.34em] text-white/45">
              PH'NGLUI MGLW'NAFH · ←/→ 切换石碑
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
