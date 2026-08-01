import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fileNameToTitle } from '../utils/imageHelpers';
import { imgRatio, fitRowPx, packRows } from '../utils/layoutEngine';

/**
 * WitcherReader — 猎魔人委托板
 * 木板墙上钉满羊皮委托纸（CONTRACT Nº + 赏金 + 狼头蜡封 + sepia 照片），倾斜错落；
 * 点击委托 → 昆恩法印亮起（金色护罩光自中心扩散）→ 狼头蜡封碎成 3 瓣飞散 → 大图查看；
 * ←/→ 剑光白线切换，ESC/点背景钉回委托板。
 */

/** 由序号生成确定性的伪随机值，避免每次渲染抖动 */
function seeded(i, salt = 0) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** 照片区统一高度（px）：委托纸宽 = 照片高 × 片比 + 纸张留白 */
const PHOTO_H = 140;
/** 委托纸比照片区多出的固定横宽：纸 padding ×2 + 照片边框 ×2 */
const PAPER_EXTRA = 26;
/** 行内委托纸间距（px） */
const GAP_X = 26;
/** 解锁表演总时长：法印 0.55s + 蜡封碎裂 0.5s，留一点缓冲 */
const UNLOCK_MS = 1000;

/** 测量板面可用宽度（响应式重排行） */
function useBoardWidth() {
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

export default function WitcherReader({ images, folderName }) {
  const [breaking, setBreaking] = useState(null); // 正在碎封解锁的委托序号
  const [viewing, setViewing] = useState(null); // 大图查看中的委托序号
  const timerRef = useRef(null);
  const total = images.length;

  const closeViewer = useCallback(() => setViewing(null), []);

  const step = useCallback(
    (dir) => {
      setViewing((v) => (v === null ? v : (v + dir + total) % total));
    },
    [total]
  );

  /** 点击委托：先演昆恩碎封，再开大图 */
  const unlock = useCallback(
    (i) => {
      if (breaking !== null) return; // 表演进行中，忽略连点
      setBreaking(i);
      timerRef.current = setTimeout(() => {
        setBreaking(null);
        setViewing(i);
      }, UNLOCK_MS);
    },
    [breaking]
  );

  useEffect(() => () => clearTimeout(timerRef.current), []);

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

  // 比例分行：片比驱动委托纸宽度，行容量按板面宽/照片高估算
  const [boardRef, boardW] = useBoardWidth();
  const ratios = images.map(imgRatio);
  const maxPerRow = boardW < 560 ? 2 : boardW < 900 ? 3 : 4;
  const rows = boardW > 0 ? packRows(ratios, boardW / PHOTO_H, maxPerRow) : [];

  return (
    <div className="fixed inset-0 z-10 select-none overflow-y-auto pt-24 pb-10">
      {/* 委托板 — 深色木板墙 */}
      <div className="mx-auto w-[min(1120px,94vw)]">
        <div
          className="rounded-md p-2.5 sm:p-3.5"
          style={{
            background:
              'linear-gradient(155deg, #3a2c1e 0%, #2a1f14 45%, #352818 80%, #241a10 100%)',
            boxShadow:
              '0 30px 70px rgba(0,0,0,0.7), inset 0 2px 3px rgba(232,220,196,0.12), inset 0 -3px 6px rgba(0,0,0,0.55)',
          }}
        >
          <div
            className="rounded-sm px-4 py-6 sm:px-8 sm:py-8"
            style={{
              background:
                'repeating-linear-gradient(90deg, #221910 0 118px, #1d150d 118px 122px, #251b11 122px 240px)',
              boxShadow: 'inset 0 0 60px rgba(0,0,0,0.55)',
            }}
          >
            {/* 板头 */}
            <div className="mb-6 text-center">
              <p
                className="font-display text-xl tracking-[0.4em] text-[var(--color-gold-pale)] sm:text-2xl"
                style={{ textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}
              >
                CONTRACT BOARD
              </p>
              <p className="mt-2 text-[10px] tracking-[0.3em] text-[var(--color-text-secondary)]">
                {folderName ? `${folderName} · ` : ''}{total} 份委托 · 法印解封后细读
              </p>
            </div>

            {/* 委托墙 — 按片比分行，每行整体缩放到板面宽内 */}
            <div ref={boardRef}>
              <div className="space-y-8">
                {rows.map((idxs, r) => {
                  const inner = boardW - idxs.length * PAPER_EXTRA;
                  const { widths, height } = fitRowPx(
                    idxs.map((i) => ratios[i]),
                    inner,
                    PHOTO_H,
                    GAP_X
                  );
                  return (
                    <div key={images[idxs[0]].id} className="flex justify-center" style={{ gap: `${GAP_X}px` }}>
                      {idxs.map((i, k) => {
                        const paperW = Math.round(widths[k] + PAPER_EXTRA);
                        const rot = (seeded(i) - 0.5) * 7; // ±3.5°
                        const lift = seeded(i, 1) * 12; // 纵向错落
                        const delay = Math.min(i * 0.08, 0.8);
                        return (
                          <div
                            key={images[i].id}
                            className="relative flex justify-center"
                            style={{ transform: `translateY(${lift}px)` }}
                          >
                            <motion.div
                              className="cursor-pointer"
                              style={{ width: paperW, transformOrigin: '50% 5%' }}
                              initial={{ scale: 0.5, opacity: 0, rotate: rot * 2 }}
                              animate={{ scale: 1, opacity: 1, rotate: rot }}
                              transition={{
                                delay,
                                type: 'spring',
                                stiffness: 300,
                                damping: 18,
                              }}
                              whileHover={{ scale: 1.05, rotate: 0, zIndex: 5 }}
                              onClick={() => unlock(i)}
                            >
                              <ContractPaper
                                img={images[i]}
                                index={i}
                                photoH={height}
                                breaking={breaking === i}
                              />
                            </motion.div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-10 text-center font-display text-sm tracking-[0.3em] text-[var(--color-text-muted)]">
        — Wind&apos;s howling · baigao —
      </p>

      {/* 大图细读 — 法印解封后的委托全文 */}
      <AnimatePresence>
        {viewing !== null && (
          <motion.div
            className="fixed inset-0 z-[300] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeViewer}
          >
            <div
              className="absolute inset-0 backdrop-blur-[4px]"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(20,28,36,0.55) 0%, rgba(8,11,15,0.94) 100%)',
              }}
            />
            <motion.div
              key={viewing}
              className="relative z-10 w-[min(460px,90vw)]"
              initial={{ scale: 0.6, rotate: (seeded(viewing) - 0.5) * 8, y: 26, opacity: 0 }}
              animate={{ scale: 1, rotate: -1, y: 0, opacity: 1 }}
              exit={{ scale: 0.65, opacity: 0, y: 18 }}
              transition={{ type: 'spring', stiffness: 230, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ContractPaper img={images[viewing]} index={viewing} large viewingKey={viewing} />
              <p className="mt-4 text-center font-display text-sm tracking-[0.3em] text-[var(--color-gold-pale)] uppercase">
                {fileNameToTitle(images[viewing].name)}
              </p>
              <p className="mt-1.5 text-center text-[10px] tracking-[0.28em] text-[var(--color-text-secondary)]">
                Nº {String(viewing + 1).padStart(2, '0')} / {total} · ←/→ 切换 · ESC 钉回板上
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** 单张羊皮委托纸 — CONTRACT Nº + 赏金 + 狼头蜡封 + sepia 照片 */
function ContractPaper({ img, index, photoH = PHOTO_H, large = false, breaking = false, viewingKey = 0 }) {
  const bounty = 25 + Math.round(seeded(index, 2) * 35) * 5; // 25~200 克朗
  const r = imgRatio(img);
  return (
    <div className="relative">
      {/* 铁钉 */}
      {!large && (
        <div
          className="absolute left-1/2 top-1 z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(circle at 32% 28%, #a5b4c2 0%, #4a545e 42%, #1a2026 100%)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.6)',
          }}
        />
      )}

      {/* 羊皮纸 */}
      <div
        className={`${breaking ? 'wt-contract-lit' : ''} ${large ? 'p-4 pb-5 sm:p-5' : 'p-2.5 pb-3'}`}
        style={{
          background:
            'linear-gradient(168deg, #efe3c8 0%, #e7d8b8 38%, #dbcaa4 74%, #cbb488 100%)',
          boxShadow: large
            ? '0 40px 80px rgba(0,0,0,0.75), 0 0 50px rgba(212,169,78,0.18)'
            : '0 8px 20px rgba(0,0,0,0.55)',
          borderRadius: '3px',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        <p
          className={`text-center font-display font-semibold uppercase leading-none text-[#33261a] ${
            large ? 'text-2xl tracking-[0.26em] sm:text-3xl' : 'text-sm tracking-[0.2em] sm:text-base'
          }`}
          style={{ textShadow: '0 1px 0 rgba(255,244,220,0.5)' }}
        >
          Contract-Nº {String(index + 1).padStart(2, '0')}
        </p>
        <p
          className={`mt-1 text-center uppercase text-[#6b5236] ${
            large ? 'text-[10px] tracking-[0.32em]' : 'text-[7px] tracking-[0.24em]'
          }`}
        >
          By order of the Wolf School
        </p>

        {/* 照片 — sepia 30%，容器适应片比零裁切 */}
        <div
          className={`relative ${large ? 'mt-3 border-4' : 'mt-2 border-2'} border-[#33261a]/70 bg-[#1c150e]`}
          style={{ boxShadow: 'inset 0 0 18px rgba(0,0,0,0.55)' }}
        >
          <img
            src={img.url}
            alt={img.name}
            draggable="false"
            className="block w-full select-none object-cover"
            style={
              large
                ? {
                    // 大面板：宽 = min(面板宽, 52vh × 片比)，比例精确贴合零裁切
                    width: `min(100%, calc(52vh * ${r}))`,
                    aspectRatio: String(r),
                    margin: '0 auto',
                    filter: 'sepia(0.3) contrast(1.03)',
                  }
                : {
                    // 板上：高度统一，宽度由外层按片比给定，object-cover 精确贴合
                    height: photoH,
                    filter: 'sepia(0.3) contrast(1.03)',
                  }
            }
          />
          {/* 剑光白线 — 大图进场/切换时横扫一次 */}
          {large && (
            <motion.div
              key={viewingKey}
              className="pointer-events-none absolute inset-y-[-20%] w-[3px]"
              style={{
                background:
                  'linear-gradient(180deg, transparent, rgba(255,255,255,0.95) 45%, rgba(255,255,255,0.95) 55%, transparent)',
                boxShadow: '0 0 14px rgba(255,255,255,0.8)',
                transform: 'rotate(18deg)',
              }}
              initial={{ left: '-12%', opacity: 0 }}
              animate={{ left: '108%', opacity: [0, 1, 1, 0] }}
              transition={{ duration: 0.55, ease: 'easeIn' }}
            />
          )}
        </div>

        {/* 赏金 + 蜡封行 */}
        <div className={`flex items-end justify-between ${large ? 'mt-3' : 'mt-2'}`}>
          <p
            className={`font-display font-medium uppercase text-[#33261a] ${
              large ? 'text-lg tracking-[0.16em]' : 'text-[11px] tracking-[0.12em] sm:text-xs'
            }`}
          >
            赏金 <span className="font-semibold">{bounty}</span> 克朗
          </p>
          {/* 狼头蜡封：完整 / 碎成 3 瓣 */}
          <WolfSeal size={large ? 56 : 38} shattering={breaking} />
        </div>
        <p
          className={`mt-1 truncate text-center uppercase text-[#6b5236] ${
            large ? 'text-[10px] tracking-[0.22em]' : 'text-[6.5px] tracking-[0.16em]'
          }`}
        >
          {fileNameToTitle(img.name)}
        </p>

        {/* 昆恩法印 — 金色护罩光自中心扩散 */}
        {breaking && (
          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: 70,
              height: 70,
              marginLeft: -35,
              marginTop: -35,
              border: '2px solid rgba(226,193,120,0.95)',
              background:
                'radial-gradient(circle, rgba(212,169,78,0.4) 0%, rgba(212,169,78,0.12) 55%, transparent 75%)',
              boxShadow: '0 0 30px rgba(212,169,78,0.7), inset 0 0 22px rgba(212,169,78,0.5)',
            }}
            initial={{ scale: 0.1, opacity: 1 }}
            animate={{ scale: 3.4, opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        )}
      </div>
    </div>
  );
}

/** 狼头蜡封 — 暗红蜡圆 + 狼头刻印；碎裂时分成 3 瓣向外飞散 */
function WolfSeal({ size = 38, shattering = false }) {
  const shards = [
    { clip: 'polygon(0 0, 58% 0, 42% 100%, 0 100%)', x: -26, y: -14, r: -38 },
    { clip: 'polygon(58% 0, 100% 0, 100% 52%, 42% 100%)', x: 24, y: -20, r: 30 },
    { clip: 'polygon(100% 52%, 100% 100%, 42% 100%)', x: 16, y: 26, r: 55 },
  ];
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      {shattering ? (
        shards.map((s, i) => (
          <motion.div
            key={i}
            className="wt-seal absolute inset-0 rounded-full"
            style={{ clipPath: s.clip }}
            initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
            animate={{ x: s.x, y: s.y, rotate: s.r, opacity: 0 }}
            transition={{ delay: 0.35, duration: 0.5, ease: 'easeOut' }}
          >
            <SealWolf size={size} />
          </motion.div>
        ))
      ) : (
        <div className="wt-seal absolute inset-0 rounded-full">
          <SealWolf size={size} />
        </div>
      )}
    </div>
  );
}

/** 蜡封上的狼头刻印（几何剪影） */
function SealWolf({ size }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className="absolute inset-0 m-auto"
      width={size * 0.68}
      height={size * 0.68}
      aria-hidden="true"
    >
      <path
        d="M16 29 L10.5 20.5 L4.5 22.5 L8 13 L5 4 L13 8.5 L16 5.5 L19 8.5 L27 4 L24 13 L27.5 22.5 L21.5 20.5 Z"
        fill="rgba(240,221,174,0.85)"
        stroke="rgba(30,8,6,0.6)"
        strokeWidth="0.8"
      />
      <circle cx="12.4" cy="14.5" r="1.1" fill="#2a0d0a" />
      <circle cx="19.6" cy="14.5" r="1.1" fill="#2a0d0a" />
    </svg>
  );
}
