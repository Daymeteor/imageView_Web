import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fileNameToTitle } from '../utils/imageHelpers';
import { imgRatio, fitRowPx, packRows } from '../utils/layoutEngine';

/**
 * RdrReader — 荒野镖客 · 悬赏令木板
 * 酒馆软木大板上钉满 WANTED 悬赏令，逐张"钉"上板；
 * 点击撕下放大细读，原位置留下浅色矩形痕迹；
 * ←/→ 切换，ESC/点背景钉回去。
 */

/** 由序号生成确定性的伪随机值，避免每次渲染抖动 */
function seeded(i, salt = 0) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** 照片区统一高度（px）：悬赏令宽度 = 照片高 × 片比 + 纸张留白 */
const PHOTO_H = 132;
/** 悬赏令比照片区多出的固定横宽：纸 padding(p-2.5×2) + 照片边框(border-2×2) */
const POSTER_EXTRA = 24;
/** 行内悬赏令间距（px） */
const GAP_X = 24;
/** 撕走痕迹的估算高度补偿：WANTED 字样 + REWARD 段 + 纸张上下 padding */
const POSTER_H_EXTRA = 104;

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

export default function RdrReader({ images }) {
  const [viewing, setViewing] = useState(null); // 被撕下来的悬赏令序号
  const total = images.length;

  const closeViewer = useCallback(() => setViewing(null), []);

  const step = useCallback(
    (dir) => {
      setViewing((v) => (v === null ? v : (v + dir + total) % total));
    },
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

  // 比例分行：片比驱动悬赏令宽度，行容量按板面宽/照片高估算
  const [boardRef, boardW] = useBoardWidth();
  const ratios = images.map(imgRatio);
  const maxPerRow = boardW < 560 ? 2 : boardW < 900 ? 3 : 4;
  const rows = boardW > 0 ? packRows(ratios, boardW / PHOTO_H, maxPerRow) : [];

  return (
    <div className="fixed inset-0 z-10 select-none overflow-y-auto pt-24 pb-10">
      {/* 酒馆软木大板 — 木框 + 软木纹理底 */}
      <div className="mx-auto w-[min(1100px,94vw)]">
        <div
          className="rounded-md p-2.5 sm:p-3.5"
          style={{
            background:
              'linear-gradient(155deg, #5a3a22 0%, #3f2716 45%, #54341d 80%, #43291a 100%)',
            boxShadow:
              '0 30px 70px rgba(0,0,0,0.65), inset 0 2px 3px rgba(255,220,170,0.18), inset 0 -3px 6px rgba(0,0,0,0.5)',
          }}
        >
          <div className="theme-rdr-cork rounded-sm px-4 py-6 sm:px-8 sm:py-8">
            {/* 板头 */}
            <div className="mb-6 text-center">
              <p
                className="font-display text-xl tracking-[0.42em] text-[#f0d9bd] sm:text-2xl"
                style={{ textShadow: '0 2px 6px rgba(0,0,0,0.6)' }}
              >
                WANTED BOARD
              </p>
              <p className="mt-2 text-[10px] tracking-[0.3em] text-[var(--color-text-secondary)]">
                {total} 张悬赏令 · 点一张撕下来看看
              </p>
            </div>

            {/* 悬赏令墙 — 按片比分行，每行整体缩放到板面宽内 */}
            <div ref={boardRef}>
              <div className="space-y-8">
                {rows.map((idxs, r) => {
                  const inner = boardW - idxs.length * POSTER_EXTRA;
                  const { widths, height } = fitRowPx(
                    idxs.map((i) => ratios[i]),
                    inner,
                    PHOTO_H,
                    GAP_X
                  );
                  return (
                    <div key={images[idxs[0]].id} className="flex justify-center" style={{ gap: `${GAP_X}px` }}>
                      {idxs.map((i, k) => {
                        const posterW = Math.round(widths[k] + POSTER_EXTRA);
                        const rot = (seeded(i) - 0.5) * 6; // ±3°
                        const lift = seeded(i, 1) * 10; // 纵向错落
                        const clip = (i % 3) + 1;
                        const delay = Math.min(i * 0.09, 0.9);
                        const torn = viewing === i;
                        return (
                          <div
                            key={images[i].id}
                            className="relative flex justify-center"
                            style={{ transform: `translateY(${lift}px)` }}
                          >
                            {torn ? (
                              /* 撕走后留下的浅色矩形痕迹 */
                              <div
                                className="rounded-[2px]"
                                style={{
                                  width: posterW,
                                  height: Math.round(height + POSTER_H_EXTRA),
                                  background: 'rgba(240,217,189,0.16)',
                                  boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.25)',
                                  transform: `rotate(${rot}deg)`,
                                }}
                              />
                            ) : (
                              <motion.div
                                className="cursor-pointer"
                                style={{ width: posterW, transformOrigin: '50% 6%' }}
                                initial={{ scale: 0.5, opacity: 0, rotate: rot * 2 }}
                                animate={{
                                  scale: 1,
                                  opacity: 1,
                                  rotate: rot,
                                  x: [0, -1.5, 1.5, 0], // 钉上板的微震
                                }}
                                transition={{
                                  delay,
                                  duration: 0.3,
                                  scale: { type: 'spring', stiffness: 320, damping: 17, delay },
                                  x: { delay: delay + 0.22, duration: 0.18 },
                                }}
                                whileHover={{ scale: 1.05, rotate: 0, zIndex: 5 }}
                                onClick={() => setViewing(i)}
                              >
                                <WantedPoster
                                  img={images[i]}
                                  index={i}
                                  clip={clip}
                                  dustDelay={delay + 0.24}
                                  photoH={height}
                                />
                              </motion.div>
                            )}
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

      {/* 撕下来细读 — heavy vignette 浮层 */}
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
                  'radial-gradient(ellipse at center, rgba(20,10,5,0.55) 0%, rgba(10,5,2,0.94) 100%)',
              }}
            />
            <motion.div
              key={viewing}
              className="relative z-10 w-[min(430px,88vw)]"
              initial={{ scale: 0.55, rotate: (seeded(viewing) - 0.5) * 10, y: 30, opacity: 0 }}
              animate={{ scale: 1, rotate: -1, y: 0, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 220, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <WantedPoster img={images[viewing]} index={viewing} clip={(viewing % 3) + 1} large />
              <p className="mt-4 text-center font-display text-sm tracking-[0.3em] text-[var(--color-gold-pale,#f8c795)] uppercase">
                {fileNameToTitle(images[viewing].name)}
              </p>
              <p className="mt-1.5 text-center text-[10px] tracking-[0.28em] text-[var(--color-text-secondary)]">
                NO.{String(viewing + 1).padStart(2, '0')} / {total} · ←/→ 切换 · ESC 钉回去
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** 单张 WANTED 悬赏令 — 做旧牛皮纸 + 铁钉 */
function WantedPoster({ img, index, clip = 1, large = false, dustDelay = 0, photoH = PHOTO_H }) {
  const reward = (index + 1) * 100;
  const r = imgRatio(img);
  return (
    <div className="relative">
      {/* 铁钉 — 深色小圆 + 高光 */}
      <div
        className="absolute left-1/2 top-1 z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 32% 28%, #b8b0a4 0%, #4a4038 42%, #1c1512 100%)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.6)',
        }}
      >
        {/* 钉上板时的尘点 */}
        {!large && (
          <span
            className="theme-rdr-dust absolute inset-0 rounded-full"
            style={{
              background: 'rgba(220,190,150,0.7)',
              animationDelay: `${dustDelay}s`,
            }}
          />
        )}
      </div>

      {/* 牛皮纸 — 撕边 clip-path */}
      <div
        className={`theme-rdr-clip-${clip} ${large ? 'p-4 pb-5 sm:p-5' : 'p-2.5 pb-3'}`}
        style={{
          background:
            'linear-gradient(168deg, #efdcb8 0%, #e8d5b5 38%, #dfc9a2 74%, #d5ba8c 100%)',
          boxShadow: large
            ? '0 40px 80px rgba(0,0,0,0.7), 0 8px 24px rgba(0,0,0,0.5)'
            : '0 8px 20px rgba(0,0,0,0.5)',
        }}
      >
        <p
          className={`text-center font-display font-semibold uppercase leading-none text-[#3a2418] ${
            large ? 'text-3xl tracking-[0.3em] sm:text-4xl' : 'text-base tracking-[0.22em] sm:text-lg'
          }`}
          style={{ textShadow: '0 1px 0 rgba(255,244,220,0.5)' }}
        >
          Wanted
        </p>
        <p
          className={`mt-1 text-center uppercase text-[#6b4a2e] ${
            large ? 'text-[10px] tracking-[0.34em]' : 'text-[7px] tracking-[0.26em]'
          }`}
        >
          Dead or Alive
        </p>

        <div
          className={`${large ? 'mt-3 border-4' : 'mt-2 border-2'} border-[#3a2418]/70 bg-[#241510]`}
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
                    // 大面板：宽 = min(面板宽, 46vh × 片比)，比例精确贴合零裁切
                    width: `min(100%, calc(46vh * ${r}))`,
                    aspectRatio: String(r),
                    margin: '0 auto',
                    filter: 'sepia(0.4) contrast(1.02)',
                  }
                : {
                    // 板上：高度统一，宽度由外层按片比给定，object-cover 精确贴合
                    height: photoH,
                    filter: 'sepia(0.4) contrast(1.02)',
                  }
            }
          />
        </div>

        <p
          className={`${large ? 'mt-3 text-xl' : 'mt-2 text-xs sm:text-sm'} text-center font-display font-medium uppercase tracking-[0.18em] text-[#3a2418]`}
        >
          Reward <span className="font-semibold">${reward}</span>
        </p>
        <p
          className={`text-center uppercase text-[#6b4a2e] ${
            large ? 'mt-1 text-[10px] tracking-[0.22em]' : 'mt-0.5 text-[6.5px] tracking-[0.16em]'
          }`}
        >
          {fileNameToTitle(img.name)}
        </p>
      </div>
    </div>
  );
}
