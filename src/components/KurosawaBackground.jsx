/**
 * KurosawaBackground — 水墨山水 + 云海 + 武士剪影 + 樱雪飘落
 */

const PETALS = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 71) % 100}%`,
  dur: `${9 + (i % 5) * 3}s`,
  delay: `${-(i * 2.1)}s`,
  size: 4 + (i % 3) * 2,
  sakura: i % 2 === 0,
}));

export default function KurosawaBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="krs-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a2622" />
            <stop offset="100%" stopColor="#141210" />
          </linearGradient>
        </defs>

        <rect width="1440" height="900" fill="url(#krs-sky)" />

        {/* 水墨远山（墨色三层） */}
        <path d="M0,560 L200,430 L360,520 L560,400 L760,520 L980,420 L1200,530 L1440,440 L1440,900 L0,900Z" fill="#221e1a" opacity="0.9" />
        <path d="M0,660 L240,540 L460,640 L700,540 L960,650 L1220,560 L1440,640 L1440,900 L0,900Z" fill="#1a1715" />
        <path d="M0,760 L260,670 L520,750 L800,660 L1080,760 L1440,700 L1440,900 L0,900Z" fill="#100e0c" />

        {/* 云海（下层流动的白） */}
        <g opacity="0.14" style={{ animation: 'krs-cloud 46s linear infinite' }}>
          <ellipse cx="200" cy="620" rx="220" ry="34" fill="#F5E6D3" />
          <ellipse cx="560" cy="660" rx="300" ry="40" fill="#F5E6D3" />
        </g>
        <g opacity="0.1" style={{ animation: 'krs-cloud 62s linear -30s infinite' }}>
          <ellipse cx="1000" cy="600" rx="260" ry="32" fill="#F5E6D3" />
        </g>

        {/* 武士剪影（山巅） */}
        <g transform="translate(1050,486)" fill="#0a0908">
          <path d="M0,0 L-8,-34 L-3,-58 L3,-58 L8,-34 Z" />
          <circle cx="0" cy="-64" r="7" />
          <path d="M-3,-58 L-16,-44 M3,-58 L18,-48" stroke="#0a0908" strokeWidth="4" />
          <line x1="10" y1="-70" x2="34" y2="-92" stroke="#0a0908" strokeWidth="2.5" />
        </g>

        {/* 朱红淡日 */}
        <circle cx="260" cy="200" r="60" fill="#B71C1C" opacity="0.28" />
        <circle cx="260" cy="200" r="40" fill="#B71C1C" opacity="0.4" />
      </svg>

      {/* 樱与雪飘落 */}
      {PETALS.map((p, i) => (
        <span key={i} className="absolute"
          style={{
            left: p.left, top: '-3vh', width: p.size, height: p.size * (p.sakura ? 0.72 : 1),
            background: p.sakura ? 'rgba(238,154,154,0.75)' : 'rgba(245,230,211,0.7)',
            borderRadius: p.sakura ? '60% 40% 60% 40%' : '50%',
            animation: `krs-fall ${p.dur} linear ${p.delay} infinite`,
          }} />
      ))}
    </div>
  );
}
