import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fileNameToTitle } from '../utils/imageHelpers';
import { imgRatio } from '../utils/layoutEngine';

/** 心跳日志池 — 任务回放期间的系统噪音 */
const HEARTBEATS = [
  '> 引力弹弓轨道计算完成',
  '> 生命维持系统 正常',
  '> 卡冈图雅 辐射水平 稳定',
  '> 对接舱压 1.0 ATM',
  '> 相对论时钟偏差 +7Y',
  '> 通讯延迟 04:12:33',
  '> 尘暴预警 解除',
  '> 燃料储备 78%',
];

const pad = (n) => String(n).padStart(3, '0');

/**
 * InterstellarReader — 星际穿越主题的任务回放阅读器
 * 全屏单张浏览 + NASA 任务报告 HUD（MISSION LOG / SOL 计数 / 四角标注线）
 * 切换 = 穿越虫洞：全屏径向速度线 flash 0.5s → 跳帧，带轻微缩放 warp 感
 */
export default function InterstellarReader({ images, theme = 'interstellar', folderName }) {
  const total = images.length;
  const [idx, setIdx] = useState(0);
  const [warpTick, setWarpTick] = useState(0);
  const [logs, setLogs] = useState(() => [
    '> ENDURANCE 任务回放系统 v1.14',
    `> 载入视觉档案 · ${total} 帧`,
    '> 回放就绪 // 等待跃迁指令',
  ]);
  const swapTimer = useRef(null);

  const appendLog = useCallback((line) => {
    setLogs((ls) => [...ls.slice(-5), line]);
  }, []);

  // ---- 跃迁：速度线 flash，中段跳帧 ----
  const navigate = useCallback(
    (dir) => {
      setWarpTick((t) => t + 1);
      clearTimeout(swapTimer.current);
      swapTimer.current = setTimeout(() => {
        setIdx((i) => (i + dir + total) % total);
      }, 240);
    },
    [total]
  );

  // ---- 跳帧后写入任务日志（含照片名） ----
  useEffect(() => {
    appendLog(`> 回放帧 FRAME-${pad(idx + 1)}: ${fileNameToTitle(images[idx].name)}`);
  }, [idx, images, appendLog]);

  // ---- 心跳日志持续滚动 ----
  useEffect(() => {
    const t = setInterval(() => {
      appendLog(HEARTBEATS[Math.floor(Math.random() * HEARTBEATS.length)]);
    }, 3200);
    return () => clearInterval(t);
  }, [appendLog]);

  useEffect(() => () => clearTimeout(swapTimer.current), []);

  // ---- 键盘：←/→ 穿越虫洞 ----
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'ArrowLeft') navigate(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate]);

  const cur = images[idx];
  const ratio = imgRatio(cur);
  const mono = 'var(--font-display)';

  return (
    <div
      className="relative z-10 min-h-screen select-none overflow-hidden"
      style={{ fontFamily: mono }}
    >
      {/* ==================== 中央照片（fitContain 完整显示） ==================== */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-[12vw] py-[16vh]">
        <AnimatePresence mode="wait">
          <motion.img
            key={idx}
            src={cur.url}
            alt={cur.name}
            draggable="false"
            className="max-h-full max-w-full object-contain"
            style={{
              border: '1px solid var(--color-accent-card-border)',
              boxShadow: '0 0 60px var(--color-accent-shadow-hover), 0 12px 60px rgba(0,0,0,0.7)',
            }}
            initial={{ opacity: 0, scale: 1.24, filter: 'blur(9px) brightness(1.7)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px) brightness(1)' }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </AnimatePresence>
      </div>

      {/* 左右半屏点击区 */}
      <button
        className="absolute inset-y-0 left-0 z-[5] w-1/2 cursor-w-resize"
        onClick={() => navigate(-1)}
        aria-label="上一帧"
      />
      <button
        className="absolute inset-y-0 right-0 z-[5] w-1/2 cursor-e-resize"
        onClick={() => navigate(1)}
        aria-label="下一帧"
      />

      {/* ==================== HUD：四角标注线 ==================== */}
      {/* 角部 L 型括线 */}
      <div className="pointer-events-none absolute left-5 top-20 h-10 w-10 border-l border-t lg:left-8" style={{ borderColor: 'var(--color-accent-card-border-hover)' }} />
      <div className="pointer-events-none absolute right-5 top-20 h-10 w-10 border-r border-t lg:right-8" style={{ borderColor: 'var(--color-accent-card-border-hover)' }} />
      <div className="pointer-events-none absolute bottom-5 left-5 h-10 w-10 border-b border-l lg:bottom-8 lg:left-8" style={{ borderColor: 'var(--color-accent-card-border-hover)' }} />
      <div className="pointer-events-none absolute bottom-5 right-5 h-10 w-10 border-b border-r lg:bottom-8 lg:right-8" style={{ borderColor: 'var(--color-accent-card-border-hover)' }} />

      {/* 左上：MISSION LOG 滚动日志 */}
      <div className="pointer-events-none absolute left-12 top-[7.5rem] hidden max-w-[300px] sm:block lg:left-16">
        <p className="text-[11px] tracking-[0.28em]" style={{ color: 'var(--color-accent-light)' }}>
          ▸ MISSION LOG // ENDURANCE
        </p>
        <div className="mt-2 flex flex-col justify-end text-[10px] leading-[1.8]">
          {logs.map((line, i) => (
            <p
              key={`${i}-${line}`}
              className="truncate"
              style={{
                color: line.includes('回放帧') ? 'var(--color-accent-pale)' : 'var(--color-mist-light)',
                opacity: 0.35 + (0.65 * (i + 1)) / logs.length,
              }}
            >
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* 右上：SOL 计数 */}
      <div className="pointer-events-none absolute right-12 top-[7.5rem] text-right lg:right-16">
        <p className="text-[10px] tracking-[0.3em]" style={{ color: 'var(--color-text-muted)' }}>
          MISSION DAY
        </p>
        <p className="mt-1 text-3xl tracking-[0.12em]" style={{ color: 'var(--color-accent-light)' }}>
          SOL {1055 + idx}
        </p>
      </div>

      {/* 左下：数据标注 */}
      <div className="pointer-events-none absolute bottom-12 left-12 hidden text-[10px] leading-[1.9] sm:block lg:bottom-16 lg:left-16" style={{ color: 'var(--color-mist-light)' }}>
        <p>GARGANTUA RELAY · CH {pad((idx % 8) + 1)}</p>
        <p>RA 17H 45M · DEC −29° 00′</p>
        <p>ASPECT {ratio.toFixed(2)} · {cur.width}×{cur.height}</p>
      </div>

      {/* 右下：操作提示 */}
      <div className="pointer-events-none absolute bottom-12 right-12 text-right text-[10px] leading-[1.9] lg:bottom-16 lg:right-16" style={{ color: 'var(--color-text-muted)' }}>
        <p>←/→ 或点击左右半屏</p>
        <p>穿越虫洞切换回放帧</p>
      </div>

      {/* 底部：文件名 + 编号 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-5 flex flex-col items-center lg:bottom-8">
        <p className="text-[10px] tracking-[0.34em]" style={{ color: 'var(--color-accent)' }}>
          FRAME {pad(idx + 1)} / {pad(total)}
        </p>
        <p className="mt-1.5 max-w-[80vw] truncate text-sm tracking-[0.12em]" style={{ color: 'var(--color-text-primary)' }}>
          {fileNameToTitle(cur.name)}
        </p>
        <p className="mt-1 text-[9px] tracking-[0.26em]" style={{ color: 'var(--color-text-muted)' }}>
          ARCHIVE: {(folderName || 'LAZARUS').toUpperCase()}
        </p>
      </div>

      {/* ==================== 虫洞跃迁：全屏径向速度线 flash ==================== */}
      {warpTick > 0 && (
        <motion.div
          key={`warp-${warpTick}`}
          className="is-warp-lines pointer-events-none fixed inset-0 z-[150]"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.5, times: [0, 0.4, 1], ease: 'easeOut' }}
        />
      )}
    </div>
  );
}
