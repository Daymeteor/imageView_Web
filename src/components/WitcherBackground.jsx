/**
 * WitcherBackground — 夜色荒野：远山剪影 + 游雾 + 火星/灰烬微粒 + 远处篝火明灭
 */

const EMBERS = Array.from({ length: 16 }, (_, i) => ({
  x: 6 + ((i * 57) % 88),
  y: 62 + ((i * 23) % 30),
  size: 1.6 + (i % 3) * 0.9,
  dur: `${5 + (i % 5) * 1.7}s`,
  delay: `${-(i * 1.3)}s`,
  gold: i % 3 !== 0,
}));

const ASHES = Array.from({ length: 10 }, (_, i) => ({
  x: 10 + ((i * 71) % 80),
  y: 6 + ((i * 17) % 26),
  size: 1.4 + (i % 2) * 0.8,
  dur: `${7 + (i % 4) * 2.1}s`,
  delay: `${-(i * 1.9)}s`,
}));

export default function WitcherBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="wt-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0c1219" />
            <stop offset="0.55" stopColor="#141c24" />
            <stop offset="1" stopColor="#1a242e" />
          </linearGradient>
          <radialGradient id="wt-fire-glow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="rgba(212,169,78,0.55)" />
            <stop offset="0.45" stopColor="rgba(212,140,60,0.22)" />
            <stop offset="1" stopColor="rgba(212,140,60,0)" />
          </radialGradient>
        </defs>

        <rect width="1440" height="900" fill="url(#wt-sky)" />

        {/* 疏星 */}
        {Array.from({ length: 26 }, (_, i) => (
          <circle key={`s${i}`} cx={40 + ((i * 137) % 1360)} cy={30 + ((i * 61) % 300)}
            r={0.8 + (i % 3) * 0.5} fill="rgba(201,212,221,0.5)"
            style={{ animation: `wt-campfire ${3 + (i % 4)}s ease-in-out ${(i % 5) * 0.6}s infinite` }} />
        ))}

        {/* 远山剪影 — 三层 */}
        <path d="M0,520 L180,380 L340,470 L520,340 L700,460 L900,330 L1100,450 L1280,370 L1440,470 L1440,900 L0,900 Z"
          fill="#101820" opacity="0.85" />
        <path d="M0,600 L220,470 L420,560 L640,440 L860,560 L1080,450 L1300,560 L1440,490 L1440,900 L0,900 Z"
          fill="#0d141b" opacity="0.92" />
        <path d="M0,690 L260,580 L520,660 L800,560 L1060,660 L1320,590 L1440,650 L1440,900 L0,900 Z"
          fill="#0a1016" />

        {/* 游雾两层 */}
        <g style={{ animation: 'wt-mist-a 16s ease-in-out infinite' }}>
          <ellipse cx="420" cy="560" rx="380" ry="46" fill="rgba(138,154,171,0.09)" />
          <ellipse cx="1020" cy="610" rx="320" ry="38" fill="rgba(138,154,171,0.07)" />
        </g>
        <g style={{ animation: 'wt-mist-b 21s ease-in-out infinite' }}>
          <ellipse cx="720" cy="700" rx="460" ry="52" fill="rgba(138,154,171,0.08)" />
        </g>

        {/* 远处篝火 — 光晕明灭 + 火点 */}
        <g transform="translate(1120,742)">
          <ellipse cx="0" cy="0" rx="150" ry="58" fill="url(#wt-fire-glow)"
            style={{ animation: 'wt-campfire 3.2s ease-in-out infinite' }} />
          <circle cx="0" cy="0" r="5" fill="#e2c178"
            style={{ animation: 'wt-campfire 1.7s ease-in-out infinite' }} />
          <circle cx="14" cy="4" r="2.6" fill="#d4893c"
            style={{ animation: 'wt-campfire 2.3s ease-in-out -0.8s infinite' }} />
        </g>

        {/* 火星上升 */}
        {EMBERS.map((e, i) => (
          <circle key={`e${i}`} cx={(e.x / 100) * 1440} cy={(e.y / 100) * 900} r={e.size}
            fill={e.gold ? 'rgba(226,193,120,0.85)' : 'rgba(212,137,60,0.7)'}
            style={{ animation: `wt-ember ${e.dur} linear ${e.delay} infinite` }} />
        ))}

        {/* 灰烬飘落 */}
        {ASHES.map((a, i) => (
          <circle key={`a${i}`} cx={(a.x / 100) * 1440} cy={(a.y / 100) * 900} r={a.size}
            fill="rgba(138,154,171,0.4)"
            style={{ animation: `wt-ash ${a.dur} linear ${a.delay} infinite` }} />
        ))}
      </svg>
    </div>
  );
}
