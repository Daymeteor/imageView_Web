import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fileNameToTitle } from '../utils/imageHelpers';
import { imgRatio, fitContain, fitRowPx, packRows } from '../utils/layoutEngine';

/**
 * ThreebodyReader — 红岸监听站
 * 左侧终端面板滚动监听日志，周期性逐字打出「不要回答！」三连；
 * 右侧监听记录卡（编号 + 信号强度条 + 照片，比例分行零裁切）。
 * 点击记录 → 水滴拖曳光线横穿全屏（0.6s）→ 照片扫描显影（fitContain）。
 * ←/→ 切换，ESC/点背景关闭。
 */

/** 由序号生成确定性的伪随机值，避免每次渲染抖动 */
function seeded(i, salt = 0) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** 记录卡照片区统一高度（px）：卡宽 = 照片高 × 片比 + 卡片留白 */
const PHOTO_H = 148;
/** 卡片比照片区多出的固定横宽：卡 padding(p-2×2) + 照片边框(1px×2) */
const CARD_EXTRA = 18;
/** 行内卡片间距（px） */
const GAP_X = 20;

/** 终端例行日志 */
const ROUTINE_LOGS = [
  '监听频段 1420.4MHz … 背景噪声正常',
  '天线阵列 A-01 方位校准完成',
  '数据归档 >> /rc/log/1979.log',
  '太阳活动平稳，电离层反射良好',
  '接收宇宙微波背景辐射 2.7K',
  '译解系统自检 …… OK',
  '监听频段 8415.2MHz … 无异常',
  '红岸系统运行第 3471 天',
  '值班员签到：叶文洁',
  '太阳电波增幅，准备二次发射',
];
/** 周期性逐字打出的警告 */
const WARN_LINES = ['不要回答！', '不要回答！！', '不要回答！！！'];
/** 终端最大保留行数 */
const MAX_LINES = 18;

/** 测量面板可用宽度（响应式重排行） */
function usePaneWidth() {
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

/** 监听终端 — 例行日志滚动 + 周期性逐字打出警告 */
function useTerminal() {
  const [lines, setLines] = useState(() => [
    { id: 0, text: '红岸监听系统 v2.1 已启动 …', kind: 'sys' },
    { id: 1, text: '接入天线阵列 A-01 / A-02 … OK', kind: 'sys' },
  ]);
  const idRef = useRef(2);

  useEffect(() => {
    let tick = 0;
    let warnIdx = -1; // 正在打第几行警告（-1 = 例行状态）
    let warnChar = 0;
    const timer = setInterval(() => {
      if (warnIdx >= 0) {
        // 逐字打警告行：每次往末尾那行补一个字
        const target = WARN_LINES[warnIdx];
        warnChar += 1;
        const partial = target.slice(0, warnChar);
        setLines((prev) => {
          const next = prev.slice();
          next[next.length - 1] = { ...next[next.length - 1], text: partial };
          return next;
        });
        if (warnChar >= target.length) {
          warnChar = 0;
          warnIdx += 1;
          if (warnIdx >= WARN_LINES.length) {
            warnIdx = -1;
            tick = 0;
          } else {
            setLines((prev) => [
              ...prev.slice(-MAX_LINES + 1),
              { id: idRef.current++, text: '', kind: 'warn' },
            ]);
          }
        }
        return;
      }
      tick += 1;
      // 例行日志：每 5 tick（约 0.9s）一行
      if (tick % 5 === 0) {
        const stamp = new Date().toTimeString().slice(0, 8);
        const text = ROUTINE_LOGS[Math.floor(seeded(tick, 3) * ROUTINE_LOGS.length)];
        setLines((prev) => [
          ...prev.slice(-MAX_LINES + 1),
          { id: idRef.current++, text: `[${stamp}] ${text}`, kind: 'log' },
        ]);
      }
      // 每 ~13s 触发一次强烈信号 + 警告三连
      if (tick >= 72) {
        warnIdx = 0;
        warnChar = 0;
        setLines((prev) => [
          ...prev.slice(-MAX_LINES + 2),
          { id: idRef.current++, text: '>> 接收到强烈信号！来源：半人马座 α …', kind: 'alert' },
          { id: idRef.current++, text: '', kind: 'warn' },
        ]);
      }
    }, 180);
    return () => clearInterval(timer);
  }, []);

  return lines;
}

export default function ThreebodyReader({ images, folderName }) {
  const [pending, setPending] = useState(null); // 水滴飞行目标序号
  const [viewing, setViewing] = useState(null); // 正在显影的记录序号
  const total = images.length;

  const closeViewer = useCallback(() => setViewing(null), []);
  const step = useCallback(
    (dir) => setViewing((v) => (v === null ? v : (v + dir + total) % total)),
    [total]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') closeViewer();
      if (viewing === null) return;
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [viewing, closeViewer, step]);

  // 查看浮层照片尺寸：窗口尺寸变化时用 fitContain 重算
  const [win, setWin] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  useEffect(() => {
    const onResize = () => setWin({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // 终端日志 + 自动滚到底
  const lines = useTerminal();
  const termRef = useRef(null);
  useEffect(() => {
    const el = termRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  // 比例分行：片比驱动卡宽，行容量按面板宽/照片高估算
  const [paneRef, paneW] = usePaneWidth();
  const ratios = images.map(imgRatio);
  const maxPerRow = paneW < 480 ? 2 : paneW < 780 ? 3 : 4;
  const rows = paneW > 0 ? packRows(ratios, paneW / PHOTO_H, maxPerRow) : [];

  return (
    <div className="fixed inset-0 z-10 select-none overflow-y-auto pb-10 pt-24">
      <div className="mx-auto w-[min(1220px,94vw)]">
        {/* 站头 */}
        <div className="mb-6 text-center">
          <p className="font-display text-xl font-bold tracking-[0.34em] text-[#d8e6ea] sm:text-2xl"
            style={{ textShadow: '0 0 18px rgba(212,48,48,0.35)' }}>
            红岸监听站
          </p>
          <p className="mt-2 font-display text-[10px] tracking-[0.3em] text-[var(--color-text-secondary)]">
            RED COAST LISTENING POST · {folderName || '绝密档案'} · {total} 条监听记录
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* ======== 左侧：监听终端 ======== */}
          <div className="lg:w-[340px] lg:shrink-0">
            <div
              className="overflow-hidden rounded border border-[rgba(74,159,216,0.28)] bg-[#060b14]/90"
              style={{ boxShadow: '0 12px 40px rgba(0,0,0,0.6), inset 0 0 40px rgba(74,159,216,0.05)' }}
            >
              {/* 终端标题栏 */}
              <div className="flex items-center justify-between border-b border-[rgba(74,159,216,0.2)] bg-[#0a1220] px-3 py-2">
                <p className="font-display text-[10px] tracking-[0.22em] text-[#4ae0a0]">
                  ▮ 红岸系统 v2.1 · 监听日志
                </p>
                <span className="flex gap-1.5">
                  <i className="h-2 w-2 rounded-full bg-[#d43030]" style={{ animation: 'tb-blink 1.8s ease-in-out infinite' }} />
                  <i className="h-2 w-2 rounded-full bg-[#4a9fd8]/70" />
                  <i className="h-2 w-2 rounded-full bg-[#4ae0a0]/70" />
                </span>
              </div>
              {/* 日志体 */}
              <div className="relative">
                <div ref={termRef} className="tb-terminal h-64 overflow-y-auto px-3 py-2.5 lg:h-[520px]">
                  {lines.map((l) => (
                    <p
                      key={l.id}
                      className={`font-display text-[11px] leading-[1.75] ${
                        l.kind === 'warn'
                          ? 'font-bold tracking-[0.12em] text-[#ef5350]'
                          : l.kind === 'alert'
                            ? 'text-[#ff9a8a]'
                            : l.kind === 'sys'
                              ? 'text-[#4a9fd8]'
                              : 'text-[#4ae0a0]/85'
                      }`}
                      style={
                        l.kind === 'warn' ? { textShadow: '0 0 10px rgba(212,48,48,0.55)' } : undefined
                      }
                    >
                      {l.text}
                      {l.kind === 'warn' && <span className="tb-caret" />}
                    </p>
                  ))}
                  <p className="font-display text-[11px] text-[#4ae0a0]/85">
                    <span className="tb-caret" />
                  </p>
                </div>
                {/* CRT 扫描线覆盖 */}
                <div className="tb-scanlines pointer-events-none absolute inset-0" />
              </div>
            </div>
          </div>

          {/* ======== 右侧：监听记录卡墙 ======== */}
          <div ref={paneRef} className="min-w-0 flex-1">
            <div className="space-y-6">
              {rows.map((idxs) => {
                const inner = paneW - idxs.length * CARD_EXTRA;
                const { widths, height } = fitRowPx(
                  idxs.map((i) => ratios[i]),
                  inner,
                  PHOTO_H,
                  GAP_X
                );
                return (
                  <div key={images[idxs[0]].id} className="flex justify-center" style={{ gap: `${GAP_X}px` }}>
                    {idxs.map((i, k) => (
                      <RecordCard
                        key={images[i].id}
                        img={images[i]}
                        index={i}
                        width={Math.round(widths[k] + CARD_EXTRA)}
                        photoH={height}
                        delay={Math.min(i * 0.07, 0.8)}
                        onClick={() => setPending(i)}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 页脚 */}
        <p className="mt-12 text-center font-display text-[11px] tracking-[0.4em] text-[var(--color-text-muted)]">
          — 给岁月以文明 · baigao —
        </p>
      </div>

      {/* ======== 水滴穿越 — 光点拖曳光线横穿全屏 ======== */}
      <AnimatePresence>
        {pending !== null && (
          <motion.div
            className="pointer-events-none fixed inset-0 z-[350] overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="absolute inset-0 bg-[#020408]/70" />
            <motion.div
              className="absolute left-0 top-1/2 flex -translate-y-1/2 items-center"
              initial={{ x: '-42vw' }}
              animate={{ x: '116vw' }}
              transition={{ duration: 0.6, ease: [0.45, 0, 0.85, 0.35] }}
              onAnimationComplete={() => {
                setViewing(pending);
                setPending(null);
              }}
            >
              {/* 拖曳光线 */}
              <div
                className="h-[2px] w-[38vw]"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(74,159,216,0.55) 55%, rgba(220,240,255,0.95) 100%)',
                  boxShadow: '0 0 18px rgba(74,159,216,0.8)',
                }}
              />
              {/* 水滴头 */}
              <div
                className="-ml-1 h-3.5 w-6 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle at 62% 40%, #ffffff 0%, #9fd4ff 52%, rgba(74,159,216,0.15) 100%)',
                  boxShadow: '0 0 28px 7px rgba(160,215,255,0.85)',
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======== 记录显影查看器 ======== */}
      <AnimatePresence>
        {viewing !== null && (
          <Viewer
            images={images}
            viewing={viewing}
            total={total}
            win={win}
            onClose={closeViewer}
            onStep={step}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/** 单张监听记录卡 — 编号 + 信号强度条 + 照片 */
function RecordCard({ img, index, width, photoH, delay, onClick }) {
  const code = `REC-Nº ${String(1049 + index * 7).padStart(4, '0')}`;
  const strength = 2 + Math.floor(seeded(index, 5) * 4); // 2~5 格
  const db = (10 + seeded(index, 6) * 42).toFixed(1);
  const level = index % 4 === 0 ? { t: '绝密', c: '#ef5350' } : index % 4 === 1 ? { t: '机密', c: '#7abce8' } : { t: '监听中', c: '#4ae0a0' };

  return (
    <motion.button
      className="group relative cursor-pointer overflow-hidden rounded border border-[rgba(74,159,216,0.28)] p-2 text-left outline-none"
      style={{
        width,
        background: 'linear-gradient(172deg, #0c1626 0%, #070d18 100%)',
        boxShadow: '0 8px 26px rgba(0,0,0,0.55)',
      }}
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -5, borderColor: 'rgba(212,48,48,0.6)', boxShadow: '0 14px 40px rgba(0,0,0,0.7), 0 0 34px rgba(212,48,48,0.25)' }}
      onClick={onClick}
      aria-label={`查看 ${img.name}`}
    >
      {/* 卡头：编号 + 密级 */}
      <div className="flex items-center justify-between px-0.5 pb-1.5">
        <p className="font-display text-[10px] font-bold tracking-[0.14em] text-[#4ae0a0]">{code}</p>
        <p className="font-display text-[9px] tracking-[0.2em]" style={{ color: level.c }}>
          ▣ {level.t}
        </p>
      </div>

      {/* 照片 — 高度统一，宽度由外层按片比给定，零裁切 */}
      <div className="relative overflow-hidden border border-[rgba(74,159,216,0.22)] bg-[#03070e]">
        <img
          src={img.url}
          alt={img.name}
          draggable="false"
          className="block w-full select-none object-cover"
          style={{ height: photoH, filter: 'saturate(0.85) contrast(1.06)' }}
        />
        <div className="tb-scanlines pointer-events-none absolute inset-0" />
      </div>

      {/* 卡脚：信号强度条 + dB */}
      <div className="flex items-end justify-between px-0.5 pt-1.5">
        <div className="flex items-end gap-[3px]">
          {Array.from({ length: 5 }).map((_, b) => (
            <span
              key={b}
              className="w-[5px] rounded-[1px]"
              style={{
                height: 4 + b * 3,
                background:
                  b < strength
                    ? b >= 3
                      ? '#d43030'
                      : '#4ae0a0'
                    : 'rgba(74,159,216,0.18)',
                boxShadow: b < strength ? '0 0 6px rgba(74,224,160,0.4)' : 'none',
              }}
            />
          ))}
        </div>
        <p className="font-display text-[9px] tracking-[0.12em] text-[#4a9fd8]">{db}dB</p>
      </div>
    </motion.button>
  );
}

/** 查看浮层 — 扫描线扫过，照片解锁显影（fitContain） */
function Viewer({ images, viewing, total, win, onClose, onStep }) {
  const img = images[viewing];
  const r = imgRatio(img);
  const box = fitContain(win.w * 0.8, win.h * 0.58, r);
  const code = `REC-Nº ${String(1049 + viewing * 7).padStart(4, '0')}`;

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
    >
      {/* 暗场压底 */}
      <div className="absolute inset-0 bg-[#02060c]/85 backdrop-blur-md" />

      <motion.div
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.94, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ type: 'spring', stiffness: 210, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 档案面板 */}
        <div
          className="overflow-hidden rounded border border-[rgba(74,159,216,0.35)] bg-[#060b14]"
          style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.75), 0 0 60px rgba(74,159,216,0.14)' }}
        >
          {/* 面板头 */}
          <div className="flex items-center justify-between border-b border-[rgba(74,159,216,0.22)] bg-[#0a1220] px-3.5 py-2">
            <p className="font-display text-[11px] font-bold tracking-[0.2em] text-[#4ae0a0]">{code}</p>
            <p className="font-display text-[9px] tracking-[0.26em] text-[#ef5350]"
              style={{ animation: 'tb-blink 1.6s ease-in-out infinite' }}>
              ▮ 信号锁定 SIGNAL LOCKED
            </p>
          </div>

          {/* 照片显影区 — fitContain 精确尺寸 */}
          <div
            className="relative overflow-hidden bg-[#02050a]"
            style={{ width: Math.round(box.width), height: Math.round(box.height), maxWidth: '86vw' }}
          >
            <motion.img
              key={viewing}
              src={img.url}
              alt={img.name}
              draggable="false"
              className="block h-full w-full select-none object-cover"
              initial={{ opacity: 0.12, filter: 'brightness(0.25) saturate(0) contrast(1.4)' }}
              animate={{ opacity: 1, filter: 'brightness(1) saturate(0.92) contrast(1.05)' }}
              transition={{ duration: 0.9, delay: 0.12, ease: 'easeOut' }}
            />
            {/* 扫描线扫过 */}
            <motion.div
              key={`scan-${viewing}`}
              className="pointer-events-none absolute inset-x-0 h-16"
              style={{
                background:
                  'linear-gradient(180deg, transparent 0%, rgba(74,224,160,0.28) 45%, rgba(74,224,160,0.85) 50%, rgba(74,224,160,0.28) 55%, transparent 100%)',
                mixBlendMode: 'screen',
              }}
              initial={{ top: '-18%' }}
              animate={{ top: '112%' }}
              transition={{ duration: 0.85, delay: 0.1, ease: 'linear' }}
            />
            {/* CRT 扫描纹理常驻 */}
            <div className="tb-scanlines pointer-events-none absolute inset-0" />
          </div>
        </div>

        <p className="mt-4 font-display text-sm font-bold tracking-[0.26em] text-[#d8e6ea]">
          {fileNameToTitle(img.name)}
        </p>
        <p className="mt-1.5 font-display text-[10px] tracking-[0.24em] text-[var(--color-text-secondary)]">
          {code} · {String(viewing + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} · ←/→ 切换 · ESC 关闭
        </p>
      </motion.div>

      {/* 左右切换热区 */}
      <button
        className="absolute inset-y-0 left-0 z-20 w-[14vw] cursor-w-resize"
        onClick={(e) => { e.stopPropagation(); onStep(-1); }}
        aria-label="上一张"
      />
      <button
        className="absolute inset-y-0 right-0 z-20 w-[14vw] cursor-e-resize"
        onClick={(e) => { e.stopPropagation(); onStep(1); }}
        aria-label="下一张"
      />
    </motion.div>
  );
}
