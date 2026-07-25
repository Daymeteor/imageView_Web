import { useMemo, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fileNameToTitle } from '../utils/imageHelpers';

const COLS = 9;
const RUNES = ['✦', 'ᚠ', 'ᚱ', '◆', 'ᛟ', 'ᚷ', '✧'];
const RUNE_COLORS = ['#a78bfa', '#c084fc', '#e9d5ff', '#8b5cf6'];

/**
 * PixelReader — 像素世界主题的 Minecraft 物品栏阅读器
 * 界面 = 背包面板：3 行×9 列物品格 + 底部快捷栏，照片像素化填入
 * 入场 = 区块加载：格子按列从上到下逐列"生成"（墩地感过冲）
 * 点击物品 = 附魔台查看：深紫符文浮层 + 像素边框大面板
 */
export default function PixelReader({ images }) {
  const total = images.length;
  // 主栏至少 3 行；超出 27 格则继续加行（面板内部滚动），最后一条为快捷栏
  const totalSlots = Math.max(36, Math.ceil(total / COLS) * COLS);
  const mainSlots = totalSlots - COLS;
  const [viewIdx, setViewIdx] = useState(null);
  const [dir, setDir] = useState(1);

  // 附魔台漂浮符文 — 生成一次，位置/时长/延迟伪随机
  const runes = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        char: RUNES[i % RUNES.length],
        color: RUNE_COLORS[i % RUNE_COLORS.length],
        left: (i * 37 + 11) % 100,
        size: 10 + ((i * 13) % 14),
        duration: 4.5 + ((i * 7) % 30) / 10,
        delay: ((i * 17) % 50) / 10,
      })),
    []
  );

  const openItem = useCallback((i) => {
    setDir(1);
    setViewIdx(i);
  }, []);

  const closeViewer = useCallback(() => setViewIdx(null), []);

  const step = useCallback(
    (d) => {
      setDir(d);
      setViewIdx((i) => (i === null ? i : (i + d + total) % total));
    },
    [total]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (viewIdx === null) return;
      if (e.key === 'Escape') closeViewer();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [viewIdx, closeViewer, step]);

  /** 渲染一格物品槽（img 为空 = 内凹暗槽） */
  const renderSlot = (slotIdx) => {
    const img = slotIdx < total ? images[slotIdx] : null;
    const col = slotIdx % COLS;
    const row = Math.floor(slotIdx / COLS);
    // 区块加载：按列推进（每列 60ms），列内从上到下 40ms
    const delay = col * 0.06 + row * 0.04;

    return (
      <motion.div
        key={slotIdx}
        className="group relative aspect-square"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 480, damping: 19, delay }}
      >
        <div
          className={`absolute inset-0 ${img ? 'cursor-pointer' : ''}`}
          style={{
            // 有图时也保持深色槽底，contain 后照片外的区域仍是槽底质感
            background: 'rgba(0,0,0,0.28)',
            // MC 内凹槽：左上深、右下浅的硬边倒角
            boxShadow:
              'inset 2px 2px 0 rgba(0,0,0,0.55), inset -2px -2px 0 rgba(255,255,255,0.16)',
          }}
          role={img ? 'button' : undefined}
          aria-label={img ? `查看 ${img.name}` : undefined}
          onClick={img ? () => openItem(slotIdx) : undefined}
        >
          {img && (
            <>
              <img
                src={img.url}
                alt={img.name}
                draggable="false"
                className="absolute inset-[3px] h-[calc(100%-6px)] w-[calc(100%-6px)] object-contain"
                style={{ imageRendering: 'pixelated' }}
              />
              {/* hover 白色描边高亮 */}
              <div className="pointer-events-none absolute inset-0 opacity-0 outline outline-2 outline-white/90 transition-opacity duration-75 group-hover:opacity-100" />
              {/* MC 式 tooltip — 深紫黑底 + 白物品名 + 灰 lore */}
              <div
                className="pointer-events-none absolute bottom-full left-1/2 z-40 mb-2 -translate-x-1/2 whitespace-nowrap opacity-0 transition-opacity duration-100 group-hover:opacity-100"
                style={{
                  background: '#100010f0',
                  border: '2px solid rgba(80,0,255,0.85)',
                  boxShadow: '0 0 0 2px #100010, 4px 4px 0 rgba(0,0,0,0.5)',
                  padding: '6px 10px',
                }}
              >
                <p className="font-display text-[8px] leading-relaxed text-white">
                  {fileNameToTitle(img.name)}
                </p>
                <p className="mt-1 text-[9px] tracking-wider text-[#a8a8a8]">
                  No.{String(slotIdx + 1).padStart(2, '0')} / {img.name}
                </p>
              </div>
            </>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="fixed inset-0 z-10 flex select-none flex-col items-center justify-center px-4 pb-6 pt-24">
      {/* MC 背包面板 */}
      <motion.div
        className="w-full max-w-[620px] overflow-y-auto"
        style={{
          maxHeight: 'calc(100vh - 9rem)',
          background: 'rgba(43,43,43,0.85)',
          borderRadius: 4,
          border: '3px solid #1b1b1b',
          // MC 面板倒角：外亮边 + 内暗边
          boxShadow:
            'inset 2px 2px 0 rgba(255,255,255,0.18), inset -2px -2px 0 rgba(0,0,0,0.5), 8px 8px 0 rgba(27,27,27,0.35)',
        }}
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
      >
        {/* 标题栏 */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: '2px solid rgba(0,0,0,0.45)' }}
        >
          <span className="font-display text-[10px] tracking-wider text-white/90">物品栏</span>
          <span className="font-display text-[8px] text-white/40">{total} 件物品</span>
        </div>

        {/* 主物品栏 */}
        <div className="grid grid-cols-9 gap-[3px] p-3">
          {Array.from({ length: mainSlots }, (_, i) => renderSlot(i))}
        </div>

        {/* 分隔线 */}
        <div className="mx-3" style={{ height: 2, background: 'rgba(0,0,0,0.45)' }} />

        {/* 快捷栏 */}
        <div className="grid grid-cols-9 gap-[3px] p-3">
          {Array.from({ length: COLS }, (_, i) => renderSlot(mainSlots + i))}
        </div>
      </motion.div>

      <p className="mt-4 text-center text-[10px] tracking-[0.25em] text-[var(--color-text-secondary)]">
        点击物品查看 · ←/→ 切换 · ESC 关闭
      </p>

      {/* ============ 附魔台查看浮层 ============ */}
      <AnimatePresence>
        {viewIdx !== null && (
          <motion.div
            className="fixed inset-0 z-[300] flex flex-col items-center justify-center"
            style={{ background: 'rgba(26,11,46,0.9)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeViewer}
          >
            <div className="absolute inset-0 backdrop-blur-[3px]" />

            {/* 漂浮符文粒子 */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {runes.map((r, i) => (
                <span
                  key={i}
                  className="px-rune"
                  style={{
                    left: `${r.left}%`,
                    fontSize: r.size,
                    color: r.color,
                    animationDuration: `${r.duration}s`,
                    animationDelay: `${r.delay}s`,
                  }}
                >
                  {r.char}
                </span>
              ))}
            </div>

            {/* 物品大面板 — 从侧边弹入切换 */}
            <AnimatePresence mode="popLayout" custom={dir}>
              <motion.div
                key={viewIdx}
                className="relative z-10"
                initial={{ x: dir >= 0 ? 90 : -90, scale: 0.6, opacity: 0 }}
                animate={{ x: 0, scale: 1, opacity: 1 }}
                exit={{ x: dir >= 0 ? -70 : 70, scale: 0.7, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 380, damping: 24 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className="p-3"
                  style={{
                    background: '#2b2b2b',
                    border: '3px solid #1b1b1b',
                    borderRadius: 4,
                    boxShadow:
                      'inset 2px 2px 0 rgba(196,181,253,0.35), inset -2px -2px 0 rgba(0,0,0,0.6), 0 0 44px rgba(139,92,246,0.45)',
                  }}
                >
                  <img
                    src={images[viewIdx].url}
                    alt={images[viewIdx].name}
                    draggable="false"
                    className="block max-h-[62vh] w-auto max-w-[82vw] object-contain"
                    style={{ imageRendering: 'pixelated' }}
                  />
                </div>
                <p className="mt-5 text-center font-display text-[11px] leading-relaxed tracking-wider text-[#e9d5ff]">
                  {fileNameToTitle(images[viewIdx].name)}
                </p>
                <p className="mt-2 text-center text-[10px] tracking-[0.3em] text-white/40">
                  No.{String(viewIdx + 1).padStart(2, '0')} / {total} · ←/→ 切换 · ESC 关闭
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
