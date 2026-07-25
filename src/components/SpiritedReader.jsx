import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fileNameToTitle } from '../utils/imageHelpers';
import { imgRatio, fitRowPx } from '../utils/layoutEngine';

/** 灯笼数量与点亮节奏 */
const LANTERNS = 9;
const LANTERN_STAGGER = 0.08;
/** 绘马架落下前的等待（灯笼全部点亮后稍顿） */
const RACK_DELAY = LANTERNS * LANTERN_STAGGER + 0.18;
/** 每根横杆最多挂几块绘马 */
const PER_ROW = 6;
/** 牌面照片统一高度（px），宽度由照片比例决定 */
const PHOTO_H = 96;
/** 牌宽 = 照片宽 + 左右留白（牌体 px-3 + 照片白边 p-1.5，两侧共 36px） */
const PLAQUE_PAD = 36;
/** 同一横杆上绘马之间的间距（gap-x-6） */
const ROW_GAP = 24;

const chunk = (arr, size) => {
  const rows = [];
  for (let i = 0; i < arr.length; i += size) rows.push(arr.slice(i, i + size));
  return rows;
};

/**
 * SpiritedReader — 汤屋幻境主题的绘马架 + 纸门阅读器
 * 入场仪式：画面先暗 → 灯笼自左而右逐一点亮 → 绘马架落下
 * 照片做成绘马木牌挂在木架横杆上，微倾 + 轻摇
 * 点击木牌 → 两扇障子门向左右滑开，照片在暖光晕中亮起
 */
export default function SpiritedReader({ images, folderName }) {
  const total = images.length;
  const rows = useMemo(() => chunk(images, PER_ROW), [images]);

  /** 绘马架可用宽度 — 单行超宽时用 fitRowPx 整行等比缩放进来 */
  const rackRef = useRef(null);
  const [rackW, setRackW] = useState(0);
  useEffect(() => {
    if (!rackRef.current) return;
    const ro = new ResizeObserver((entries) => setRackW(entries[0].contentRect.width));
    ro.observe(rackRef.current);
    return () => ro.disconnect();
  }, []);

  /**
   * 每行的比例排布：牌宽随照片比例变化（照片区高统一、宽 = 高 × 片比），
   * 把"牌宽 / 照片高"当作等效片比交给 fitRowPx，整行超宽则等比缩小
   */
  const rowLayouts = useMemo(() => {
    if (!rackW) return null;
    return rows.map((row) =>
      fitRowPx(
        row.map((img) => imgRatio(img) + PLAQUE_PAD / PHOTO_H),
        rackW,
        PHOTO_H,
        ROW_GAP
      )
    );
  }, [rows, rackW]);

  const [viewerIdx, setViewerIdx] = useState(null);
  const [doorsOpen, setDoorsOpen] = useState(false);
  const swapping = useRef(false);
  const doorTimer = useRef(null);

  const clearDoorTimer = () => clearTimeout(doorTimer.current);

  const openViewer = useCallback((i) => {
    clearDoorTimer();
    setViewerIdx(i);
    setDoorsOpen(false);
    // 等浮层暗场落定，纸门再开启
    doorTimer.current = setTimeout(() => setDoorsOpen(true), 380);
  }, []);

  const closeViewer = useCallback(() => {
    clearDoorTimer();
    setDoorsOpen(false);
    doorTimer.current = setTimeout(() => setViewerIdx(null), 320);
  }, []);

  /** 切换照片：门快速合拢 → 换照片 → 再滑开 */
  const navViewer = useCallback(
    (dir) => {
      if (swapping.current) return;
      swapping.current = true;
      clearDoorTimer();
      setDoorsOpen(false);
      doorTimer.current = setTimeout(() => {
        setViewerIdx((i) => (i + dir + total) % total);
        setDoorsOpen(true);
        swapping.current = false;
      }, 300);
    },
    [total]
  );

  useEffect(() => {
    if (viewerIdx === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeViewer();
      if (e.key === 'ArrowRight') navViewer(1);
      if (e.key === 'ArrowLeft') navViewer(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [viewerIdx, closeViewer, navViewer]);

  useEffect(() => () => clearDoorTimer(), []);

  return (
    <div className="fixed inset-0 z-10 select-none overflow-y-auto pb-20 pt-24">
      {/* 入场暗幕 — 仪式后散去 */}
      <motion.div
        className="pointer-events-none fixed inset-0 z-30 bg-black"
        initial={{ opacity: 0.92 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 1.1, delay: RACK_DELAY - 0.3, ease: 'easeOut' }}
      />

      {/* 灯笼列 — 自左而右逐一点亮 */}
      <div className="pointer-events-none mx-auto flex w-full max-w-3xl items-start justify-between px-6">
        {Array.from({ length: LANTERNS }).map((_, i) => (
          <motion.div
            key={i}
            className="relative h-9 w-6"
            initial={{ opacity: 0.08 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * LANTERN_STAGGER, duration: 0.3, ease: 'easeOut' }}
          >
            <span className="absolute -top-1 left-1/2 h-1.5 w-3 -translate-x-1/2 rounded-sm bg-[#3a281a]" />
            <span
              className="spirited-lantern block h-full w-full rounded-full"
              style={{ animationDelay: `${i * 0.35}s` }}
            />
          </motion.div>
        ))}
      </div>

      {/* 架名 */}
      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: RACK_DELAY + 0.35, duration: 0.5 }}
      >
        <p className="font-display text-lg tracking-[0.42em] text-[var(--color-text-primary)]">絵馬架</p>
        <p className="mt-2 text-[10px] tracking-[0.3em] text-[var(--color-text-muted)]">
          {folderName || '汤屋幻境'} · {total} 枚の願い
        </p>
      </motion.div>

      {/* 绘马架 — 落下 */}
      <motion.div
        ref={rackRef}
        className="mx-auto mt-8 w-full max-w-6xl px-6"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: RACK_DELAY, type: 'spring', stiffness: 120, damping: 16 }}
      >
        {rows.map((row, r) => (
          <div key={r} className="relative mb-12">
            {/* 木架横杆 + 两端立柱 */}
            <div className="relative">
              <div
                className="h-2.5 w-full rounded-sm"
                style={{
                  background: 'linear-gradient(180deg, #4a3524 0%, #2e2015 60%, #1d140c 100%)',
                  boxShadow: '0 3px 8px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,220,170,0.12)',
                }}
              />
              <span
                className="absolute -bottom-2 left-2 h-4 w-2 rounded-b-sm"
                style={{ background: 'linear-gradient(180deg, #2e2015, #1d140c)' }}
              />
              <span
                className="absolute -bottom-2 right-2 h-4 w-2 rounded-b-sm"
                style={{ background: 'linear-gradient(180deg, #2e2015, #1d140c)' }}
              />
            </div>

            {/* 挂在横杆上的绘马 */}
            <div className="flex flex-wrap items-start justify-center gap-x-6 gap-y-8">
              {row.map((img, j) => {
                const gIdx = r * PER_ROW + j;
                const tilt = (gIdx % 2 ? 1 : -1) * (0.7 + (gIdx % 3) * 0.4); // ±0.7~1.5°
                // 牌宽 = 照片宽（高 × 片比）+ 左右留白；行超宽时整行等比缩小
                const layout = rowLayouts?.[r];
                const plaqueW = layout
                  ? layout.widths[j]
                  : PHOTO_H * imgRatio(img) + PLAQUE_PAD;
                const photoH = layout ? layout.height : PHOTO_H;
                const photoW = plaqueW - PLAQUE_PAD * (layout ? layout.scale : 1);
                return (
                  <motion.button
                    key={img.id ?? gIdx}
                    className="group relative flex cursor-pointer flex-col items-center outline-none"
                    initial={{ opacity: 0, y: -14, rotate: tilt }}
                    animate={{ opacity: 1, y: 0, rotate: tilt }}
                    transition={{
                      delay: RACK_DELAY + 0.25 + r * 0.16 + j * 0.06,
                      type: 'spring',
                      stiffness: 190,
                      damping: 15,
                    }}
                    whileHover={{ scale: 1.05, y: -4 }}
                    onClick={() => openViewer(gIdx)}
                    aria-label={`查看 ${img.name}`}
                  >
                    {/* 红绳 */}
                    <span className="block h-4 w-[3px] rounded-full bg-[#c23729]" />
                    {/* 顶部红绳小结 */}
                    <span
                      className="z-10 -mb-1 block h-2.5 w-2.5 rounded-full"
                      style={{ background: 'radial-gradient(circle at 35% 30%, #f2705f, #a52a1c 70%)' }}
                    />
                    {/* 绘马木牌（摇晃动画在内层，避免与入场 transform 冲突） */}
                    <div style={{ filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.5))' }}>
                      <div
                        className="spirited-ema px-3 pb-2.5 pt-5 transition-[filter] duration-300 group-hover:brightness-110"
                        style={{
                          width: plaqueW,
                          animationDuration: `${3.6 + (gIdx % 3) * 0.7}s`,
                          animationDelay: `${(gIdx % 5) * 0.4}s`,
                        }}
                      >
                        {/* 贴在牌面中央的照片（白边）— 尺寸精确匹配片比，零裁切 */}
                        <div className="bg-[#f7efdd] p-1.5 shadow-[inset_0_1px_3px_rgba(60,40,20,0.25)]">
                          <img
                            src={img.url}
                            alt={img.name}
                            draggable="false"
                            className="block object-cover"
                            style={{ width: photoW, height: photoH }}
                          />
                        </div>
                        <p className="mt-1.5 truncate text-center text-[9px] tracking-[0.12em] text-[#f5e6d3]/75">
                          {fileNameToTitle(img.name)}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </motion.div>

      {/* ==================== 纸门查看器 ==================== */}
      <AnimatePresence>
        {viewerIdx !== null && (
          <motion.div
            className="fixed inset-0 z-[300] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeViewer}
          >
            {/* 暗场压底 */}
            <div className="absolute inset-0 bg-[#0b0b16]/82 backdrop-blur-md" />

            {/* 暖光晕 — 门开后托起照片 */}
            <motion.div
              className="pointer-events-none absolute left-1/2 top-1/2 h-[74vh] w-[74vw] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background: 'radial-gradient(ellipse, rgba(249,168,37,0.22) 0%, rgba(232,75,60,0.08) 45%, transparent 70%)',
                filter: 'blur(24px)',
              }}
              animate={{ opacity: doorsOpen ? 1 : 0, scale: doorsOpen ? 1 : 0.8 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            />

            {/* 照片面板 + 纸门 */}
            <motion.div
              className="relative z-10 flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.94, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="relative overflow-hidden rounded-[3px] border-[7px] border-[#3a281a] bg-[#14101c]"
                style={{ boxShadow: '0 30px 70px rgba(0,0,0,0.65), 0 0 50px rgba(249,168,37,0.12)' }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={viewerIdx}
                    src={images[viewerIdx].url}
                    alt={images[viewerIdx].name}
                    draggable="false"
                    className="block max-h-[62vh] w-auto max-w-[78vw] select-none"
                    initial={{ opacity: 0.4 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22 }}
                  />
                </AnimatePresence>

                {/* 左扇障子门 */}
                <motion.div
                  className="spirited-shoji absolute inset-y-0 left-0 w-1/2 border-r-[3px] border-[#3a281a]"
                  initial={false}
                  animate={{ x: doorsOpen ? '-103%' : '0%' }}
                  transition={{ type: 'spring', stiffness: 150, damping: 21 }}
                />
                {/* 右扇障子门 */}
                <motion.div
                  className="spirited-shoji absolute inset-y-0 right-0 w-1/2 border-l-[3px] border-[#3a281a]"
                  initial={false}
                  animate={{ x: doorsOpen ? '103%' : '0%' }}
                  transition={{ type: 'spring', stiffness: 150, damping: 21 }}
                />
              </div>

              <p className="mt-5 font-display text-base tracking-[0.3em] text-[var(--color-text-primary)]">
                {fileNameToTitle(images[viewerIdx].name)}
              </p>
              <p className="mt-2 text-[10px] tracking-[0.28em] text-[var(--color-text-muted)]">
                其の{String(viewerIdx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} · ←/→ 換え · ESC 閉じる
              </p>
            </motion.div>

            {/* 左右切换热区 */}
            <button
              className="absolute inset-y-0 left-0 z-20 w-[14vw] cursor-w-resize"
              onClick={(e) => { e.stopPropagation(); navViewer(-1); }}
              aria-label="上一张"
            />
            <button
              className="absolute inset-y-0 right-0 z-20 w-[14vw] cursor-e-resize"
              onClick={(e) => { e.stopPropagation(); navViewer(1); }}
              aria-label="下一张"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
