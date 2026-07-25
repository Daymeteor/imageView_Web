import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fileNameToTitle } from '../utils/imageHelpers';
import { imgRatio, packRows, fitRowPx } from '../utils/layoutEngine';

/** 心跳日志池 — 终端持续滚动的系统噪音 */
const HEARTBEATS = [
  '> 链路稳定 // 延迟 12ms',
  '> 神经信号强度 97%',
  '> 记忆库同步中…',
  '> 防火墙巡检通过',
  '> 数据流加密轮换完成',
  '> 突触带宽占用 78%',
  '> ICE 扫描: 无入侵',
  '> 感官缓冲写入正常',
];

const pad = (n) => String(n).padStart(2, '0');

/** 网格入场：芯片逐枚接入 */
const gridV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};
const chipV = {
  hidden: { opacity: 0, y: 18, scale: 0.94 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 240, damping: 22 } },
};

/**
 * NightcityReader — 夜之城主题的超梦终端阅读器
 * CRT 开屏 + 启动日志 → 终端布局（左命令行 / 右记忆芯片网格）
 * 点芯片 → glitch 解密 → 全屏超梦回放（扫描线 + RGB 色散 + HUD）
 */
export default function NightcityReader({ images, theme = 'nightcity', folderName }) {
  const total = images.length;
  const [phase, setPhase] = useState('boot'); // boot | main
  const [bootLines, setBootLines] = useState(0);
  const [logs, setLogs] = useState([]);
  const [viewerIdx, setViewerIdx] = useState(null);
  const [decodeTick, setDecodeTick] = useState(0);
  const [timecode, setTimecode] = useState('00:00:00:00');
  const logRef = useRef(null);
  const gridRef = useRef(null);
  const [gridW, setGridW] = useState(0);

  const BOOT_LINES = useMemo(
    () => [
      '> NIGHT CITY DECK v2.7',
      '> 神经连接已建立',
      `> 检测到 ${total} 枚记忆芯片`,
    ],
    [total]
  );

  const appendLog = useCallback((line) => {
    setLogs((ls) => [...ls.slice(-39), line]);
  }, []);

  // ---- 启动序列：CRT 开屏 0.7s → 逐行日志 → 1.75s 进主界面 ----
  useEffect(() => {
    const timers = [
      setTimeout(() => setBootLines(1), 700),
      setTimeout(() => setBootLines(2), 980),
      setTimeout(() => setBootLines(3), 1260),
      setTimeout(() => {
        setPhase('main');
        setLogs([...BOOT_LINES, '> 系统就绪 // 等待指令']);
      }, 1750),
    ];
    return () => timers.forEach(clearTimeout);
  }, [BOOT_LINES]);

  // ---- 心跳日志：主界面持续滚动 ----
  useEffect(() => {
    if (phase !== 'main') return;
    const t = setInterval(() => {
      appendLog(HEARTBEATS[Math.floor(Math.random() * HEARTBEATS.length)]);
    }, 2600);
    return () => clearInterval(t);
  }, [phase, appendLog]);

  // ---- 日志自动滚到底 ----
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [logs]);

  const openViewer = useCallback((idx) => {
    setViewerIdx(idx);
    setDecodeTick((t) => t + 1);
  }, []);

  const closeViewer = useCallback(() => setViewerIdx(null), []);

  const stepViewer = useCallback(
    (dir) => {
      setViewerIdx((i) => (i === null ? i : (i + dir + total) % total));
      setDecodeTick((t) => t + 1);
    },
    [total]
  );

  // ---- 键盘：←/→ 切换，ESC 弹出芯片 ----
  useEffect(() => {
    const onKey = (e) => {
      if (viewerIdx === null) return;
      if (e.key === 'Escape') closeViewer();
      if (e.key === 'ArrowRight') stepViewer(1);
      if (e.key === 'ArrowLeft') stepViewer(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [viewerIdx, closeViewer, stepViewer]);

  // ---- 计时码走字（25fps） ----
  useEffect(() => {
    if (viewerIdx === null) return;
    const start = performance.now();
    const t = setInterval(() => {
      const el = performance.now() - start;
      const f = Math.floor(el / 40) % 25;
      const s = Math.floor(el / 1000) % 60;
      const m = Math.floor(el / 60000) % 60;
      const h = Math.floor(el / 3600000);
      setTimecode(`${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`);
    }, 40);
    return () => clearInterval(t);
  }, [viewerIdx]);

  // ---- 网格容器宽度测量（比例墙布局依赖） ----
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setGridW(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, [phase]);

  // ---- justified 比例墙：packRows 分行 + fitRowPx 定宽，芯片比 = 照片比，零裁切 ----
  const chipRows = useMemo(() => {
    if (!gridW) return [];
    const rowH = gridW < 560 ? 132 : 184;
    const gap = 16;
    const ratios = images.map(imgRatio);
    const rows = packRows(ratios, gridW / rowH, gridW < 560 ? 3 : 5);
    return rows.map((idxs) => {
      const { widths, height } = fitRowPx(idxs.map((i) => ratios[i]), gridW, rowH, gap);
      return { idxs, widths, height };
    });
  }, [images, gridW]);

  const current = viewerIdx !== null ? images[viewerIdx] : null;

  return (
    <div className="relative z-10 min-h-screen select-none px-4 pb-10 pt-24 lg:px-8">
      {/* ==================== 启动序列 ==================== */}
      {phase === 'boot' && (
        <div className="nc-terminal fixed inset-0 z-[200] overflow-hidden bg-black">
          {/* CRT 开屏：中央亮线垂直撑开 */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'var(--color-bg-primary)',
              boxShadow: 'inset 0 0 140px rgba(0, 216, 232, 0.07)',
            }}
            initial={{ scaleY: 0.003 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.55, ease: [0.7, 0, 0.3, 1], delay: 0.1 }}
          />
          <motion.div
            className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2"
            style={{
              background: 'var(--color-moss-light)',
              boxShadow: '0 0 24px 4px rgba(92, 242, 255, 0.8)',
            }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ delay: 0.62, duration: 0.18 }}
          />
          {/* 启动日志 — 左侧逐行打出 */}
          <div className="absolute left-6 top-24 text-[13px] leading-7 lg:left-10">
            {BOOT_LINES.slice(0, bootLines).map((line, i) => (
              <motion.p
                key={line}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ color: i === 0 ? 'var(--color-accent-light)' : 'var(--color-moss)' }}
              >
                {line}
              </motion.p>
            ))}
            <span
              className="nc-caret inline-block h-[14px] w-[8px]"
              style={{ background: 'var(--color-moss)' }}
            />
          </div>
        </div>
      )}

      {/* ==================== 主界面：终端布局 ==================== */}
      {phase === 'main' && (
        <motion.div
          className="mx-auto flex max-w-7xl flex-col gap-5 lg:flex-row"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* 左：命令行面板 */}
          <div
            className="nc-terminal w-full shrink-0 lg:w-[340px]"
            style={{
              border: '1px solid var(--color-accent-card-border)',
              background: 'var(--color-accent-glass-bg)',
              boxShadow: 'var(--card-shadow)',
            }}
          >
            <div
              className="flex items-center justify-between border-b px-4 py-2.5 text-[11px] tracking-[0.18em]"
              style={{ borderColor: 'var(--color-accent-card-border)', color: 'var(--color-accent-light)' }}
            >
              <span>NIGHT CITY DECK v2.7</span>
              <span className="flex items-center gap-1.5" style={{ color: 'var(--color-moss)' }}>
                <span className="nc-rec-dot inline-block h-[6px] w-[6px] rounded-full" style={{ background: 'var(--color-moss)' }} />
                ONLINE
              </span>
            </div>
            <div
              ref={logRef}
              className="flex h-[180px] flex-col justify-end overflow-hidden px-4 py-3 text-[11px] leading-[1.75] lg:h-[62vh]"
            >
              {logs.map((line, i) => (
                <p
                  key={`${i}-${line}`}
                  style={{
                    color: line.startsWith('> 访问')
                      ? 'var(--color-accent-light)'
                      : 'var(--color-moss)',
                    opacity: 0.45 + (0.55 * (i + 1)) / logs.length,
                  }}
                >
                  {line}
                </p>
              ))}
              <span
                className="nc-caret mt-0.5 inline-block h-[11px] w-[7px]"
                style={{ background: 'var(--color-moss)' }}
              />
            </div>
            <div
              className="border-t px-4 py-2 text-[10px] tracking-[0.14em]"
              style={{ borderColor: 'var(--color-accent-card-border)', color: 'var(--color-text-muted)' }}
            >
              ARCHIVE: {(folderName || 'LOCAL').toUpperCase()} · {total} CHIPS
            </div>
          </div>

          {/* 右：记忆芯片网格 */}
          <div className="min-w-0 flex-1">
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="font-display text-lg tracking-[0.12em] text-[var(--color-text-primary)]">
                记忆芯片库 <span style={{ color: 'var(--color-accent)' }}>//</span> MEMORY CHIPS
              </h2>
              <span className="nc-terminal text-[11px]" style={{ color: 'var(--color-moss)' }}>
                {total} 枚已接入
              </span>
            </div>
            <div ref={gridRef}>
              <motion.div className="flex flex-col gap-4" variants={gridV} initial="hidden" animate="show">
                {chipRows.map((row, ri) => (
                  <div key={ri} className="flex gap-4" style={{ height: row.height }}>
                    {row.idxs.map((imgIdx, ci) => {
                      const img = images[imgIdx];
                      const cyan = imgIdx % 2 === 1;
                      const edge = cyan ? 'var(--color-moss)' : 'var(--color-accent)';
                      return (
                        <motion.button
                          key={img.id ?? imgIdx}
                          variants={chipV}
                          className="nc-chip-scan group relative block flex-none cursor-pointer overflow-hidden text-left transition-transform duration-200 hover:-translate-y-1"
                          style={{
                            width: row.widths[ci],
                            height: row.height,
                            border: `1px solid ${edge}`,
                            boxShadow: `0 0 18px ${cyan ? 'rgba(0,216,232,0.18)' : 'rgba(255,0,85,0.2)'}`,
                          }}
                          onMouseEnter={() => appendLog(`> 访问: ${img.name}`)}
                          onClick={() => openViewer(imgIdx)}
                          aria-label={`解密记忆芯片 ${img.name}`}
                        >
                          <img
                            src={img.url}
                            alt={img.name}
                            draggable="false"
                            loading="lazy"
                            className="h-full w-full object-cover transition-[filter] duration-200 group-hover:brightness-110"
                          />
                          <span
                            className="nc-terminal absolute bottom-1.5 left-1.5 z-[2] px-1.5 py-0.5 text-[9px] tracking-[0.08em]"
                            style={{ background: 'rgba(6,8,15,0.78)', color: edge }}
                          >
                            CHIP-{pad(imgIdx + 1)} · {fileNameToTitle(img.name)}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ==================== 超梦回放 ==================== */}
      <AnimatePresence>
        {current && (
          <motion.div
            className="nc-terminal fixed inset-0 z-[300] flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={closeViewer}
          >
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md" />

            {/* 解密 + 回放画面 */}
            <motion.div
              key={`${viewerIdx}-${decodeTick}`}
              className="nc-decode relative"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={current.url}
                alt={current.name}
                draggable="false"
                className="max-h-[74vh] max-w-[86vw]"
                style={{
                  border: '1px solid var(--color-accent-card-border-hover)',
                  filter:
                    'drop-shadow(2px 0 0 rgba(255, 0, 85, 0.45)) drop-shadow(-2px 0 0 rgba(0, 240, 255, 0.45))',
                }}
              />
              <div className="nc-viewer-scan" />
            </motion.div>

            {/* HUD 四角 */}
            <div className="pointer-events-none absolute left-5 top-5 text-[11px] leading-5" style={{ color: 'var(--color-moss)' }}>
              <p style={{ color: 'var(--color-accent-light)' }}>▸ BRAINDANCE PLAYBACK</p>
              <p>FILE: {current.name}</p>
            </div>
            <div className="pointer-events-none absolute right-5 top-5 flex items-center gap-2 text-[11px] tracking-[0.2em] text-white">
              <span className="nc-rec-dot inline-block h-[9px] w-[9px] rounded-full bg-[#ff2244]" />
              REC
            </div>
            <div className="pointer-events-none absolute bottom-5 left-5 text-[11px] leading-5" style={{ color: 'var(--color-moss)' }}>
              <p>CHIP-{pad(viewerIdx + 1)} / {pad(total)}</p>
              <p>{fileNameToTitle(current.name)}</p>
            </div>
            <div className="pointer-events-none absolute bottom-5 right-5 text-right text-[11px] leading-5" style={{ color: 'var(--color-moss)' }}>
              <p>TC {timecode}</p>
              <p className="text-[var(--color-text-muted)]">←/→ 切换 · ESC 弹出芯片</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
