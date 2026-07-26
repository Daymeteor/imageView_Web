/**
 * EvaBackground — 第三新东京市 + 使徒轮廓 + NERV + LCL 红海 + 光柱
 */

export default function EvaBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="eva-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#12061e" />
            <stop offset="100%" stopColor="#0D0D0D" />
          </linearGradient>
          <linearGradient id="eva-sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8a1a10" />
            <stop offset="100%" stopColor="#3a0a06" />
          </linearGradient>
        </defs>

        <rect width="1440" height="900" fill="url(#eva-sky)" />

        {/* 城市剪影 + 紫窗 */}
        <g fill="#150a20">
          <rect x="80" y="380" width="130" height="340" />
          <rect x="260" y="320" width="100" height="400" />
          <rect x="1050" y="340" width="120" height="380" />
          <rect x="1220" y="400" width="140" height="320" />
        </g>
        {Array.from({ length: 16 }, (_, i) => (
          <rect key={i} x={100 + ((i * 79) % 1220)} y={360 + ((i * 61) % 300)} width="5" height="7"
            fill="rgba(156,60,196,0.5)" style={{ animation: `eva-heart ${4 + (i % 3)}s ease-in-out ${(i % 5) * 0.8}s infinite` }} />
        ))}

        {/* 使徒轮廓（远处巨大剪影，心跳明灭） */}
        <g style={{ animation: 'eva-heart 3.2s ease-in-out infinite' }} opacity="0.5">
          <ellipse cx="720" cy="430" rx="70" ry="110" fill="#1e0a2e" stroke="rgba(156,60,196,0.5)" strokeWidth="2" />
          <polygon points="720,300 690,360 750,360" fill="#1e0a2e" stroke="rgba(156,60,196,0.5)" strokeWidth="2" />
          <circle cx="720" cy="420" r="16" fill="#F44336" opacity="0.85" />
        </g>

        {/* EVA 启动光柱（周期性冲天） */}
        <g style={{ animation: 'eva-rise 11s linear infinite' }}>
          <rect x="556" y="680" width="10" height="70" fill="#9c3cc4" opacity="0.7" />
          <rect x="559" y="680" width="4" height="70" fill="#e0b0ff" opacity="0.8" />
        </g>
        <g style={{ animation: 'eva-rise 14s linear -6s infinite' }}>
          <rect x="880" y="680" width="8" height="60" fill="#9c3cc4" opacity="0.55" />
        </g>

        {/* NERV 标志（半叶） */}
        <g transform="translate(130,120)" opacity="0.8">
          <path d="M0,-26 L24,20 L-24,20Z" fill="none" stroke="#00E676" strokeWidth="2.5" />
          <path d="M0,-12 L12,14 L-12,14Z" fill="#00E676" opacity="0.4" />
          <text x="0" y="44" textAnchor="middle" fill="#00E676" fontSize="16" letterSpacing="4" fontFamily="Archivo Black, sans-serif">NERV</text>
        </g>

        {/* LCL 红海 */}
        <g style={{ animation: 'eva-sea 9s ease-in-out infinite' }}>
          <rect x="-60" y="720" width="1560" height="180" fill="url(#eva-sea)" />
          <path d="M-60,726 q90,-10 180,0 t180,0 t180,0 t180,0 t180,0 t180,0 t180,0 t180,0 t180,0" stroke="rgba(255,120,90,0.35)" strokeWidth="2" fill="none" />
        </g>
        {/* 海上十字架光 */}
        {[300, 760, 1180].map((x, i) => (
          <g key={i} opacity="0.5" style={{ animation: `eva-heart ${5 + i}s ease-in-out ${i * 1.3}s infinite` }}>
            <rect x={x - 2} y="640" width="4" height="56" fill="#F44336" />
            <rect x={x - 14} y="656" width="28" height="4" fill="#F44336" />
          </g>
        ))}
      </svg>
    </div>
  );
}
