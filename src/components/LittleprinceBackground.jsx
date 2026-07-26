/**
 * LittleprinceBackground — B612 星球 + 轨道小星球 + 星空 + 日落带
 */

const STARS = Array.from({ length: 40 }, (_, i) => ({
  x: 2 + ((i * 29.3) % 96),
  y: 2 + ((i * 43.7) % 70),
  r: 0.8 + (i % 3) * 0.5,
  d: `${(i % 6) * 0.5}s`,
}));

const ORBITERS = [
  { r: 150, size: 14, color: '#B3E5FC', dur: '24s', delay: '0s' },
  { r: 210, size: 10, color: '#FFE082', dur: '36s', delay: '-12s' },
  { r: 265, size: 18, color: '#F48FB1', dur: '48s', delay: '-26s' },
];

export default function LittleprinceBackground() {
  const cx = 720;
  const cy = 430;
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="lp-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1040" />
            <stop offset="100%" stopColor="#2a1a4a" />
          </linearGradient>
          <radialGradient id="lp-glow">
            <stop offset="0%" stopColor="#F48FB1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#F48FB1" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1440" height="900" fill="url(#lp-sky)" />

        {/* 星空 */}
        {STARS.map((s, i) => (
          <circle key={i} cx={(s.x / 100) * 1440} cy={(s.y / 100) * 900} r={s.r} fill="#fff"
            style={{ animation: `lp-twinkle ${2.6 + (i % 4)}s ease-in-out ${s.d} infinite` }} />
        ))}

        {/* 日落钟摆色带（底部） */}
        <rect y="760" width="1440" height="140" fill="#FFE082" opacity="0.08" />
        <rect y="800" width="1440" height="100" fill="#F48FB1" opacity="0.06" />

        {/* B612 星球 */}
        <circle cx={cx} cy={cy} r="120" fill="url(#lp-glow)" />
        <circle cx={cx} cy={cy} r="52" fill="#7a6ac4" />
        <circle cx={cx} cy={cy} r="52" fill="none" stroke="#b8aacd" strokeWidth="1.5" opacity="0.6" />
        <ellipse cx={cx - 14} cy={cy - 12} rx="10" ry="6" fill="#5a4a9a" opacity="0.8" />
        <ellipse cx={cx + 16} cy={cy + 14} rx="7" ry="4" fill="#5a4a9a" opacity="0.7" />
        {/* 星球上的玫瑰 */}
        <g transform={`translate(${cx + 20},${cy - 48})`}>
          <line x1="0" y1="0" x2="0" y2="-14" stroke="#4a7a4a" strokeWidth="2" />
          <circle cx="0" cy="-18" r="6" fill="#F48FB1" />
          <circle cx="-4" cy="-16" r="3.5" fill="#ffadc6" />
          <path d="M-8,-26 Q0,-34 8,-26" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none" />
        </g>

        {/* 轨道与小星球 */}
        {ORBITERS.map((o, i) => (
          <g key={i}>
            <circle cx={cx} cy={cy} r={o.r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="3 6" />
            <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: `lp-orbit ${o.dur} linear ${o.delay} infinite` }}>
              <circle cx={cx + o.r} cy={cy} r={o.size} fill={o.color} opacity="0.9" />
            </g>
          </g>
        ))}

        {/* 小王子的围巾（飘动曲线） */}
        <path d={`M${cx - 200},${cy - 160} q60,-30 110,-6 q50,22 96,-8`} stroke="#FFE082" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.7">
          <animate attributeName="d" dur="5s" repeatCount="indefinite"
            values={`M${cx - 200},${cy - 160} q60,-30 110,-6 q50,22 96,-8;
                     M${cx - 200},${cy - 150} q60,-16 110,-14 q50,10 96,-16;
                     M${cx - 200},${cy - 160} q60,-30 110,-6 q50,22 96,-8`} />
        </path>
      </svg>
    </div>
  );
}
