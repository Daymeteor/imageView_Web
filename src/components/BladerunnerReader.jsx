import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fileNameToTitle } from '../utils/imageHelpers';
import { imgRatio, fitRowPx, packRows } from '../utils/layoutEngine';

const pad = (n) => String(n).padStart(2, '0');
const evId = (i) => `E-${pad(i + 1)}`;

/** 确定性伪随机（水珠位置随索引稳定，不随渲染漂移） */
const rand = (seed) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** 容器宽度测量（比例行排布的像素基准） */
const useContainerWidth = () => {
  const ref = useRef(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver((es) => setW(es[0].contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
};

/** 湿玻璃水珠层：SVG 小水珠 + 两团光晕模糊 */
const WetGlass = ({ seedBase }) => {
  const drops = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => ({
        cx: rand(seedBase + i * 3) * 100,
        cy: rand(seedBase + i * 3 + 1) * 100,
        rx: 0.35 + rand(seedBase + i * 3 + 2) * 0.9,
        ry: 0.55 + rand(seedBase + i * 7 + 5) * 1.6,
        o: 0.25 + rand(seedBase + i * 11 + 9) * 0.5,
      })),
    [seedBase]
  );
  return (
    <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
      {/* 光晕模糊 */}
      <div
        className="absolute -left-[10%] top-[8%] h-[46%] w-[42%] rounded-full blur-2xl"
        style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.14) 0%, transparent 70%)' }}
      />
      <div
        className="absolute -right-[8%] bottom-[6%] h-[40%] w-[38%] rounded-full blur-2xl"
        style={{ background: 'radial-gradient(circle, rgba(230,81,0,0.10) 0%, transparent 70%)' }}
      />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <radialGradient id="br-drop" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="rgba(220,245,255,0.75)" />
            <stop offset="35%" stopColor="rgba(140,220,240,0.28)" />
            <stop offset="100%" stopColor="rgba(10,30,45,0.35)" />
          </radialGradient>
        </defs>
        {drops.map((d, i) => (
          <ellipse key={i} cx={d.cx} cy={d.cy} rx={d.rx} ry={d.ry} fill="url(#br-drop)" opacity={d.o} />
        ))}
      </svg>
    </div>
  );
};

/**
 * BladerunnerReader — 银翼杀手主题的证物分析台
 * 台面：照片作为"证物扫描件"按真实宽高比分行陈列（packRows + fitRowPx），
 *       亚克力框 + 证物编号 E-01…，hover 扫描线划过 + 数据标注线引出
 * 点击 = 照片分析仪：大屏 fitContain + 四角数据 callout + 湿玻璃水珠纹理
 *       + 底部 Voight-Kampff 式进度条，←/→ 切换，ESC 退出
 */
export default function BladerunnerReader({ images, theme = 'bladerunner', folderName }) {
  const total = images.length;
  const [cur, setCur] = useState(0);
  const [dir, setDir] = useState(1);
  const [analyzer, setAnalyzer] = useState(false); // 照片分析仪浮层
  const [tableRef, tableW] = useContainerWidth();

  const openAt = useCallback((i) => {
    setCur(i);
    setAnalyzer(true);
  }, []);
  const closeAnalyzer = useCallback(() => setAnalyzer(false), []);
  const step = useCallback(
    (d) => {
      setDir(d);
      setCur((c) => (c + d + total) % total);
    },
    [total]
  );

  // ---- 键盘：←/→ 切换证物，ESC 退出分析仪 ----
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeAnalyzer();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, closeAnalyzer]);

  // ---- 证物台分行：比例驱动（packRows + fitRowPx）----
  const ratios = useMemo(() => images.map(imgRatio), [images]);
  const rows = useMemo(() => packRows(ratios, 4.6, 5), [ratios]);

  const img = images[cur];
  const r = imgRatio(img);
  const seedBase = (cur + 1) * 97;

  return (
    <div className="relative z-10 flex min-h-screen select-none flex-col px-4 pb-8 pt-24 sm:px-8">
      {/* 页眉：警局证物科抬头 */}
      <header className="text-center">
        <p className="text-[10px] tracking-[0.42em]" style={{ color: 'var(--color-text-muted)' }}>
          LAPD · REP-DETECT DIVISION · EVIDENCE ANALYSIS UNIT
        </p>
        <h2 className="mt-2 font-display text-2xl uppercase tracking-[0.18em]" style={{ color: 'var(--color-accent-dim)' }}>
          证物分析台
        </h2>
        <div className="mx-auto mt-3 flex items-center justify-center gap-3">
          <span className="h-px w-16" style={{ background: 'var(--color-accent-card-border)' }} />
          <span className="font-display text-[11px] tracking-[0.3em]" style={{ color: 'var(--color-accent)' }}>
            CASE FILE · {folderName || 'UNNAMED'} · {pad(total)} ITEMS
          </span>
          <span className="h-px w-16" style={{ background: 'var(--color-accent-card-border)' }} />
        </div>
      </header>

      {/* 冷光台面：证物扫描件按行陈列 */}
      <div ref={tableRef} className="mx-auto mt-8 w-full max-w-6xl flex-1">
        <div className="flex flex-col gap-4">
          {rows.map((row, ri) => {
            const { widths, height } = fitRowPx(
              row.map((i) => ratios[i]),
              tableW || 960,
              200,
              16
            );
            return (
              <div key={ri} className="flex justify-center gap-4">
                {row.map((i, k) => {
                  const item = images[i];
                  return (
                    <motion.button
                      key={item.id ?? i}
                      className="group relative block cursor-pointer text-left"
                      style={{ width: widths[k] }}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.6), ease: [0.16, 1, 0.3, 1] }}
                      onClick={() => openAt(i)}
                      aria-label={`分析证物 ${evId(i)} ${item.name}`}
                    >
                      {/* 半透明亚克力框 */}
                      <div
                        className="relative p-[7px] transition-all duration-300 group-hover:-translate-y-1"
                        style={{
                          background: 'var(--color-accent-glass-bg)',
                          border: '1px solid var(--color-accent-card-border)',
                          boxShadow: 'var(--card-shadow)',
                          backdropFilter: 'blur(6px)',
                        }}
                      >
                        <div className="relative overflow-hidden" style={{ height: Math.max(height - 14, 40) }}>
                          <img
                            src={item.url}
                            alt={item.name}
                            draggable="false"
                            loading="lazy"
                            className="block h-full w-full object-contain"
                            style={{ aspectRatio: ratios[i] }}
                          />
                          {/* hover 扫描线划过 */}
                          <span className="br-scan" />
                        </div>
                        {/* 证物编号标签 */}
                        <div className="mt-[6px] flex items-center justify-between">
                          <span
                            className="font-display text-[10px] tracking-[0.24em]"
                            style={{ color: 'var(--color-accent)' }}
                          >
                            {evId(i)}
                          </span>
                          <span
                            className="max-w-[62%] truncate text-[9px] tracking-[0.08em]"
                            style={{ color: 'var(--color-text-muted)' }}
                          >
                            {fileNameToTitle(item.name)}
                          </span>
                        </div>
                        {/* hover 数据标注线引出 */}
                        <span className="br-callout-line" />
                        <span className="br-callout-tag">
                          RATIO {ratios[i].toFixed(2)} · SCAN OK
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* 页脚：操作提示 */}
      <footer className="mt-8 text-center">
        <p className="font-display text-[11px] tracking-[0.3em]" style={{ color: 'var(--color-text-muted)' }}>
          点击证物进入分析仪 · ←/→ 切换 · ESC 退出
        </p>
      </footer>

      {/* ==================== 照片分析仪 ==================== */}
      <AnimatePresence>
        {analyzer && (
          <motion.div
            className="fixed inset-0 z-[300] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={closeAnalyzer}
          >
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

            {/* 分析仪主体 */}
            <motion.div
              key={cur}
              className="relative"
              initial={{ opacity: 0, x: dir * 90, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="relative p-[10px]"
                style={{
                  background: 'var(--color-accent-glass-bg)',
                  border: '1px solid var(--color-accent-card-border-hover)',
                  boxShadow: '0 0 70px var(--color-accent-shadow-hover), 0 24px 80px rgba(0,0,0,0.7)',
                }}
              >
                <div className="relative">
                  <img
                    src={img.url}
                    alt={img.name}
                    draggable="false"
                    className="max-h-[68vh] max-w-[86vw] object-contain"
                    style={{ aspectRatio: r }}
                  />
                  {/* 湿玻璃检视层 */}
                  <WetGlass seedBase={seedBase} />
                </div>

                {/* 四角数据 callout */}
                <div className="pointer-events-none absolute -top-7 left-0 flex items-end gap-2">
                  <span className="font-display text-[10px] tracking-[0.24em]" style={{ color: 'var(--color-accent)' }}>
                    FILE · {fileNameToTitle(img.name)}
                  </span>
                  <span className="mb-[3px] h-px w-10" style={{ background: 'var(--color-accent-dim)' }} />
                </div>
                <div className="pointer-events-none absolute -top-7 right-0 flex items-end gap-2">
                  <span className="mb-[3px] h-px w-10" style={{ background: 'var(--color-accent-dim)' }} />
                  <span className="font-display text-[10px] tracking-[0.24em]" style={{ color: 'var(--color-moss-light)' }}>
                    EVIDENCE {evId(cur)}
                  </span>
                </div>
                <div className="pointer-events-none absolute -bottom-7 left-0 flex items-start gap-2">
                  <span className="font-display text-[10px] tracking-[0.24em]" style={{ color: 'var(--color-text-secondary)' }}>
                    ASPECT {r.toFixed(3)}
                  </span>
                  <span className="mt-[7px] h-px w-10" style={{ background: 'var(--color-accent-card-border-hover)' }} />
                </div>
                <div className="pointer-events-none absolute -bottom-7 right-0 flex items-start gap-2">
                  <span className="mt-[7px] h-px w-10" style={{ background: 'var(--color-accent-card-border-hover)' }} />
                  <span className="font-display text-[10px] tracking-[0.24em]" style={{ color: 'var(--color-text-secondary)' }}>
                    {img.width || '—'} × {img.height || '—'} PX
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Voight-Kampff 式进度条 */}
            <div className="absolute inset-x-0 bottom-6 z-[3] mx-auto w-[min(560px,80vw)]">
              <div className="flex items-center justify-between font-display text-[9px] tracking-[0.3em] text-white/60">
                <span>VOIGHT-KAMPFF</span>
                <span>
                  {evId(cur)} / {evId(total - 1)}
                </span>
              </div>
              <div className="mt-2 flex gap-1">
                {images.map((_, i) => (
                  <span
                    key={i}
                    className="h-[3px] flex-1"
                    style={{
                      background: i <= cur ? 'var(--color-accent)' : 'rgba(255,255,255,0.14)',
                      animation: i === cur ? 'br-vk-pulse 1.6s ease-in-out infinite' : 'none',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* 角标 */}
            <div className="pointer-events-none absolute left-5 top-4 z-[3] font-display text-[10px] tracking-[0.3em] text-white/70">
              ESPER PHOTO ANALYZER · {evId(cur)}
            </div>
            <div className="pointer-events-none absolute right-5 top-4 z-[3] font-display text-[10px] tracking-[0.3em] text-white/70">
              ←/→ 切换 · ESC 退出
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
