/**
 * AnimePopBackground — 漫波普（P5 血统）动态背景
 * 墨黑底 + 红色斜切多边形缓动 + 速度线漂移 + 网点呼吸
 * 纯 CSS，常动但不抢戏
 */
export default function AnimePopBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* 右上红色斜切多边形 — 缓慢摆动 */}
      <div
        className="absolute -right-[12%] -top-[18%] h-[60vh] w-[55vw] opacity-[0.1]"
        style={{
          background: 'var(--color-accent)',
          clipPath: 'polygon(30% 0, 100% 0, 100% 70%, 55% 100%, 0 45%)',
          animation: 'mg-sway 9s ease-in-out infinite',
        }}
      />

      {/* 左下红色斜条 */}
      <div
        className="absolute -bottom-[10%] -left-[8%] h-[36vh] w-[42vw] opacity-[0.07]"
        style={{
          background: 'var(--color-accent)',
          clipPath: 'polygon(0 30%, 75% 0, 100% 65%, 25% 100%)',
          animation: 'mg-sway 11s ease-in-out 1.5s infinite',
        }}
      />

      {/* 网点层 — 呼吸 */}
      <div
        className="mg-halftone absolute inset-0"
        style={{ animation: 'mg-flash-pulse 6s ease-in-out infinite' }}
      />

      {/* 速度线 — 三条斜线不时掠过（中间一条抽帧漂移，动漫低帧感） */}
      {[
        { top: '22%', width: '55vw', duration: '7s', delay: '0s', steps: false },
        { top: '51%', width: '70vw', duration: '9s', delay: '2.6s', steps: true },
        { top: '76%', width: '48vw', duration: '8s', delay: '4.8s', steps: false },
      ].map((l, i) => (
        <div
          key={i}
          className="absolute h-[2px]"
          style={{
            top: l.top,
            left: 0,
            width: l.width,
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.35) 50%, transparent)',
            animation: `mg-drift ${l.duration} ${l.steps ? 'steps(48)' : 'linear'} ${l.delay} infinite`,
          }}
        />
      ))}

      {/* 暗角 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,0.5) 100%)',
        }}
      />
    </div>
  );
}
