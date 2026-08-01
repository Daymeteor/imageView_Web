/**
 * DragonrajaBackground — 卡塞尔档案馆地宫
 * 龙鳞纹暗纹 + 极远处黑王剪影缓缓呼吸 + 金尘漂浮
 */

const DUST = Array.from({ length: 16 }, (_, i) => ({
  x: 4 + ((i * 61) % 92),
  y: 30 + ((i * 37) % 64),
  r: 1.2 + (i % 3) * 0.7,
  dur: `${7 + (i % 4) * 2.4}s`,
  delay: `${-(i * 1.3)}s`,
}));

export default function DragonrajaBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* 龙鳞纹暗纹 — 重复鳞片弧线，铺满全幅 */}
      <div className="dgr-scale-pattern absolute inset-0 opacity-40" />

      <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <rect width="1440" height="900" fill="rgba(13,13,18,0.35)" />

        {/* 地宫拱顶微光 */}
        <ellipse cx="720" cy="-80" rx="700" ry="260" fill="rgba(212,175,55,0.05)" />

        {/* 黑王剪影 — 极远处巨龙轮廓缓缓呼吸 */}
        <g
          transform="translate(720,690)"
          fill="#08080c"
          style={{ animation: 'dgr-breathe 9s ease-in-out infinite' }}
        >
          {/* 龙身与颈 */}
          <path d="M-420,210 C-360,120 -260,90 -160,96 C-90,100 -40,60 -10,-10 C4,-46 30,-58 52,-50 C30,-30 26,-6 34,22 C48,72 30,120 80,132 C180,156 320,150 420,210 Z" />
          {/* 龙首与角 */}
          <path d="M-10,-10 C-30,-40 -58,-52 -92,-48 C-120,-44 -140,-56 -148,-84 C-126,-74 -108,-76 -96,-90 C-84,-104 -60,-108 -40,-98 C-18,-88 -4,-52 -2,-26 Z" />
          {/* 展翼（左） */}
          <path d="M-160,96 C-260,20 -380,-30 -520,-30 C-430,10 -390,60 -380,110 C-420,96 -470,96 -520,116 C-430,140 -320,150 -200,130 Z" />
          {/* 展翼（右） */}
          <path d="M80,132 C180,60 300,20 440,30 C350,56 310,100 302,146 C340,134 388,136 436,156 C350,176 240,176 120,160 Z" />
          {/* 翼膜骨线 */}
          <g stroke="rgba(139,0,0,0.28)" strokeWidth="2" fill="none">
            <path d="M-200,110 C-300,50 -400,10 -500,-8" />
            <path d="M-220,120 C-320,90 -420,84 -505,110" />
            <path d="M120,140 C220,80 320,50 420,44" />
            <path d="M140,152 C240,120 340,118 425,150" />
          </g>
          {/* 龙眼 — 明灭 */}
          <circle cx="-86" cy="-72" r="4.5" fill="rgba(212,175,55,0.9)"
            style={{ animation: 'dgr-eye 4.2s ease-in-out infinite' }} />
        </g>

        {/* 地平线血色微光 */}
        <rect x="0" y="896" width="1440" height="4" fill="rgba(139,0,0,0.35)" />
        <ellipse cx="720" cy="900" rx="800" ry="26" fill="rgba(139,0,0,0.1)" />
      </svg>

      {/* 金尘漂浮 */}
      {DUST.map((d, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.r * 2,
            height: d.r * 2,
            background: 'radial-gradient(circle, rgba(232,204,106,0.95) 0%, rgba(212,175,55,0.4) 60%, transparent 100%)',
            boxShadow: '0 0 6px rgba(212,175,55,0.6)',
            animation: `dgr-dust ${d.dur} linear ${d.delay} infinite`,
          }}
        />
      ))}

      {/* 四角暗角 */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 45%, rgba(5,5,8,0.55) 100%)' }}
      />
    </div>
  );
}
