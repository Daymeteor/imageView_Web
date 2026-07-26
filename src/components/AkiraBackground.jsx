/**
 * AkiraBackground — 新东京霓虹 + 红色摩托光轨 + 巨蛋废墟 + 漂浮胶囊
 */

const CAPSULES = Array.from({ length: 7 }, (_, i) => ({
  x: 10 + ((i * 41) % 82),
  y: 16 + ((i * 29) % 40),
  dur: `${6 + (i % 3) * 2}s`,
  delay: `${-(i * 1.8)}s`,
}));

export default function AkiraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <rect width="1440" height="900" fill="#0D0D0D" />

        {/* 新东京夜景楼群 */}
        <g fill="#161616">
          <rect x="60" y="300" width="130" height="420" />
          <rect x="240" y="240" width="100" height="480" />
          <rect x="420" y="330" width="150" height="390" />
          <rect x="900" y="270" width="120" height="450" />
          <rect x="1080" y="330" width="160" height="390" />
          <rect x="1290" y="250" width="110" height="470" />
        </g>
        {/* 霓虹窗 */}
        {Array.from({ length: 24 }, (_, i) => (
          <rect key={i} x={80 + ((i * 61) % 1280)} y={280 + ((i * 47) % 360)} width="7" height="10"
            fill={i % 3 === 0 ? 'rgba(0,188,212,0.55)' : 'rgba(211,47,47,0.55)'}
            style={{ animation: `akr-pulse ${2.4 + (i % 4)}s ease-in-out ${(i % 5) * 0.5}s infinite` }} />
        ))}

        {/* 巨蛋爆炸废墟（远景裂纹半球） */}
        <g transform="translate(700,760)">
          <path d="M-160,0 A160,110 0 0 1 160,0Z" fill="#1c1c1c" />
          <path d="M-160,0 A160,110 0 0 1 160,0" fill="none" stroke="rgba(211,47,47,0.35)" strokeWidth="2" />
          <path d="M-40,-70 L-10,-30 L-30,-8 M30,-80 L20,-36 L44,-10" stroke="rgba(211,47,47,0.45)" strokeWidth="2.5" fill="none" />
          <ellipse cx="0" cy="-30" rx="200" ry="60" fill="rgba(211,47,47,0.06)" />
        </g>

        {/* 红色摩托光轨（反复掠过） */}
        <g style={{ animation: 'akr-trail 5.5s linear infinite' }}>
          <rect x="0" y="640" width="340" height="7" fill="#D32F2F" />
          <rect x="300" y="640" width="90" height="7" fill="#ff9a97" />
          <rect x="0" y="654" width="240" height="3" fill="rgba(0,188,212,0.7)" />
        </g>
        <g style={{ animation: 'akr-trail 7.5s linear -3.4s infinite' }}>
          <rect x="0" y="700" width="260" height="5" fill="rgba(211,47,47,0.8)" />
        </g>

        {/* 漂浮胶囊 */}
        {CAPSULES.map((c, i) => (
          <g key={i} transform={`translate(${(c.x / 100) * 1440},${(c.y / 100) * 900})`}
            style={{ animation: `akr-pulse ${c.dur} ease-in-out ${c.delay} infinite` }}>
            <rect x="-13" y="-6" width="26" height="12" rx="6" fill="rgba(211,47,47,0.3)" stroke="rgba(239,83,80,0.7)" strokeWidth="1.2" />
            <line x1="0" y1="-6" x2="0" y2="6" stroke="rgba(239,83,80,0.7)" strokeWidth="1.2" />
          </g>
        ))}

        {/* 速度线 */}
        {[0, 1, 2].map((i) => (
          <line key={i} x1="80" y1={120 + i * 40} x2="360" y2={96 + i * 40} stroke="rgba(255,255,255,0.14)" strokeWidth="2" />
        ))}
      </svg>
    </div>
  );
}
