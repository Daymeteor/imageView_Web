/**
 * CthulhuBackground — 深海拉莱耶 + 巨触手游弋 + 深潜者眼睛 + 气泡
 */

const EYES = Array.from({ length: 18 }, (_, i) => ({
  x: 6 + ((i * 53.7) % 88),
  y: 20 + ((i * 37.3) % 60),
  d: `${2.4 + (i % 4) * 0.9}s`,
  dl: `${(i % 6) * 0.7}s`,
}));

export default function CthulhuBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="cth-sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0A1628" />
            <stop offset="100%" stopColor="#050d18" />
          </linearGradient>
          <radialGradient id="cth-glow">
            <stop offset="0%" stopColor="#00E676" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#00E676" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1440" height="900" fill="url(#cth-sea)" />

        {/* 磷光（深海微光） */}
        <ellipse cx="720" cy="880" rx="700" ry="260" fill="url(#cth-glow)" />

        {/* 拉莱耶沉没都市（非欧几何尖塔） */}
        <g fill="#0e2418" opacity="0.85">
          <polygon points="200,800 260,560 320,800" />
          <polygon points="300,800 380,620 440,800" />
          <polygon points="980,800 1060,540 1140,800" />
          <polygon points="1120,800 1180,640 1240,800" />
          <polygon points="600,820 700,660 800,820" />
        </g>

        {/* 巨大触手（远处游弋） */}
        <g style={{ transformOrigin: '300px 900px', animation: 'cth-sway 9s ease-in-out infinite' }}>
          <path d="M300,900 Q280,700 360,560 Q420,460 380,340" stroke="#1B3A2A" strokeWidth="46" fill="none" strokeLinecap="round" />
          <path d="M300,900 Q280,700 360,560 Q420,460 380,340" stroke="#2a5240" strokeWidth="20" fill="none" strokeLinecap="round" opacity="0.6" />
        </g>
        <g style={{ transformOrigin: '1150px 900px', animation: 'cth-sway 12s ease-in-out -4s infinite reverse' }}>
          <path d="M1150,900 Q1180,720 1100,600 Q1040,500 1080,380" stroke="#1B3A2A" strokeWidth="38" fill="none" strokeLinecap="round" />
        </g>

        {/* 深潜者的眼睛（密布、明灭） */}
        {EYES.map((e, i) => (
          <g key={i} style={{ animation: `cth-eye ${e.d} ease-in-out ${e.dl} infinite` }}>
            <circle cx={(e.x / 100) * 1440} cy={(e.y / 100) * 900} r="3.4" fill="#00E676" opacity="0.9" />
            <circle cx={(e.x / 100) * 1440 + 8} cy={(e.y / 100) * 900} r="3.4" fill="#00E676" opacity="0.9" />
          </g>
        ))}

        {/* 上升气泡 */}
        {Array.from({ length: 10 }, (_, i) => (
          <circle key={i} cx={80 + ((i * 137) % 1280)} cy={860 - (i % 3) * 40} r={2 + (i % 3)}
            fill="none" stroke="rgba(163,255,200,0.3)" strokeWidth="1"
            style={{ animation: `cth-drift ${6 + (i % 4)}s ease-in-out ${-i * 1.4}s infinite alternate` }} />
        ))}

        {/* 旧日支配者的轮廓（极远处巨大剪影） */}
        <ellipse cx="720" cy="520" rx="180" ry="230" fill="#050d18" opacity="0.55" style={{ animation: 'cth-drift 18s ease-in-out infinite alternate' }} />
      </svg>
    </div>
  );
}
