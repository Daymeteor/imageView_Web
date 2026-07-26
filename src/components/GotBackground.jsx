/**
 * GotBackground — 临冬城雪夜 + 长城 + 龙影掠月 + 飘雪
 */

const SNOW = Array.from({ length: 36 }, (_, i) => ({
  left: `${(i * 27.7) % 100}%`,
  size: 1.5 + (i % 3),
  dur: `${7 + (i % 5) * 2.4}s`,
  delay: `${-(i * 1.3)}s`,
}));

export default function GotBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="got-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f1524" />
            <stop offset="100%" stopColor="#0a0e1a" />
          </linearGradient>
        </defs>

        <rect width="1440" height="900" fill="url(#got-sky)" />

        {/* 满月 + 月晕 */}
        <circle cx="1140" cy="170" r="90" fill="#ECEFF1" opacity="0.12" />
        <circle cx="1140" cy="170" r="56" fill="#ECEFF1" opacity="0.85" />
        <circle cx="1122" cy="156" r="10" fill="#cfd8dc" opacity="0.7" />
        <circle cx="1156" cy="182" r="7" fill="#cfd8dc" opacity="0.6" />

        {/* 星 */}
        {Array.from({ length: 22 }, (_, i) => (
          <circle key={i} cx={(3 + ((i * 41) % 94) / 100) * 1440} cy={(2 + ((i * 29) % 40) / 100) * 900} r={0.8 + (i % 3) * 0.5} fill="#fff" opacity={0.3 + (i % 4) * 0.15} />
        ))}

        {/* 长城（横亘的冰墙） */}
        <rect x="0" y="470" width="1440" height="90" fill="#22304a" />
        <rect x="0" y="470" width="1440" height="14" fill="#B0BEC5" opacity="0.6" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <rect key={i} x={40 + i * 180} y="448" width="46" height="22" fill="#22304a" />
        ))}

        {/* 临冬城剪影 */}
        <g fill="#141b2e">
          <rect x="140" y="360" width="60" height="120" />
          <polygon points="140,360 170,322 200,360" />
          <rect x="230" y="390" width="46" height="90" />
          <polygon points="230,390 253,360 276,390" />
          <rect x="90" y="400" width="36" height="80" />
          <polygon points="90,400 108,372 126,400" />
        </g>
        {/* 城内暖窗 */}
        {[0, 1, 2].map((i) => (
          <rect key={i} x={156 + i * 16} y={400 + (i % 2) * 20} width="6" height="8" fill="#E65100" opacity="0.8" />
        ))}

        {/* 龙影掠月（周期性） */}
        <g style={{ animation: 'got-dragon 24s linear infinite' }}>
          <g transform="translate(0,190)" style={{ animation: 'got-flap 1s ease-in-out infinite', transformOrigin: 'center' }}>
            <path d="M0,0 Q22,-14 44,-2 L66,-14 Q60,4 44,8 Q22,14 0,0Z" fill="#0a0e1a" opacity="0.95" />
            <path d="M44,-2 L58,10 L50,4" stroke="#0a0e1a" strokeWidth="3" fill="none" />
          </g>
        </g>

        {/* 雪原 */}
        <rect y="560" width="1440" height="340" fill="#1a2338" />
        <rect y="560" width="1440" height="10" fill="#B0BEC5" opacity="0.3" />
      </svg>

      {/* 飘雪 */}
      {SNOW.map((s, i) => (
        <span key={i} className="absolute rounded-full bg-white/80"
          style={{
            left: s.left, top: '-2vh', width: s.size, height: s.size,
            animation: `got-snow ${s.dur} linear ${s.delay} infinite`,
          }} />
      ))}
    </div>
  );
}
