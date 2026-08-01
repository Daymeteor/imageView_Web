/**
 * GhibliBackground — 青绿山丘 + 巨大树冠 + 胖云 + 飞行器 + 云上城堡
 */

const CLOUDS = [
  { y: 110, s: 1.3, dur: '64s', delay: '0s', op: 0.95 },
  { y: 200, s: 0.9, dur: '82s', delay: '-30s', op: 0.8 },
  { y: 70, s: 0.7, dur: '52s', delay: '-44s', op: 0.7 },
];

export default function GhibliBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="gh-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8ecbf5" />
            <stop offset="70%" stopColor="#d8ecfa" />
            <stop offset="100%" stopColor="#eaf4e4" />
          </linearGradient>
        </defs>

        <rect width="1440" height="900" fill="url(#gh-sky)" />

        {/* 胖云 */}
        {CLOUDS.map((c, i) => (
          <g key={i} transform={`translate(0,${c.y}) scale(${c.s})`} opacity={c.op}
            style={{ animation: `gh-cloud ${c.dur} linear ${c.delay} infinite` }}>
            <ellipse cx="60" cy="0" rx="46" ry="20" fill="#fff" />
            <ellipse cx="96" cy="-10" rx="36" ry="18" fill="#fff" />
            <ellipse cx="120" cy="4" rx="40" ry="16" fill="#fff" />
          </g>
        ))}

        {/* 云上城堡（远处） */}
        <g opacity="0.35" transform="translate(1120,200)">
          <ellipse cx="0" cy="26" rx="90" ry="18" fill="#fff" />
          <rect x="-34" y="-24" width="68" height="50" fill="#9ab8cc" />
          <polygon points="-34,-24 0,-52 34,-24" fill="#7a9ab0" />
          <rect x="-8" y="-66" width="16" height="18" fill="#9ab8cc" />
        </g>

        {/* 巨大树冠（左下） */}
        <g transform="translate(180,560)">
          <rect x="-10" y="0" width="20" height="120" fill="#6a4a2e" />
          <ellipse cx="0" cy="-40" rx="120" ry="60" fill="#3a8a3e" />
          <ellipse cx="-60" cy="-10" rx="70" ry="40" fill="#4CAF50" />
          <ellipse cx="60" cy="-14" rx="70" ry="42" fill="#5cb85f" />
        </g>

        {/* 三层青绿山丘 */}
        <path d="M0,640 Q260,560 520,630 T1040,620 T1440,600 L1440,900 L0,900Z" fill="#8fc98f" />
        <path d="M0,740 Q320,660 680,730 T1440,700 L1440,900 L0,900Z" fill="#6fb56f" />
        <path d="M0,830 Q400,760 820,820 T1440,800 L1440,900 L0,900Z" fill="#4CAF50" />

        {/* 小飞行器 */}
        <g style={{ animation: 'gh-fly 26s linear infinite' }}>
          <g transform="translate(0,240)">
            <ellipse cx="0" cy="0" rx="26" ry="10" fill="#8a6a4a" />
            <rect x="-4" y="-16" width="8" height="10" fill="#6a4a2e" />
            <line x1="-26" y1="0" x2="-44" y2="-8" stroke="#8a6a4a" strokeWidth="3" />
            <line x1="26" y1="0" x2="44" y2="-8" stroke="#8a6a4a" strokeWidth="3" />
            <circle cx="0" cy="-4" r="5" fill="#FFD54F" />
          </g>
        </g>
      </svg>
    </div>
  );
}
