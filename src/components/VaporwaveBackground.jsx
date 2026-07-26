/**
 * VaporwaveBackground — 粉紫网格地板 + 希腊雕塑 + 棕榈树 + VHS 噪点
 */

export default function VaporwaveBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="vw-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a1a4a" />
            <stop offset="60%" stopColor="#4a2a6a" />
            <stop offset="100%" stopColor="#FF6B9D" />
          </linearGradient>
          <linearGradient id="vw-sun" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFE082" />
            <stop offset="100%" stopColor="#FF6B9D" />
          </linearGradient>
        </defs>

        <rect width="1440" height="900" fill="url(#vw-sky)" />

        {/* 复古落日（条纹切割） */}
        <circle cx="720" cy="430" r="130" fill="url(#vw-sun)" />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x="580" y={400 + i * 18} width="280" height={4 + i * 2} fill="#2a1a4a" />
        ))}

        {/* 棕榈树剪影 */}
        <g transform="translate(180,470)" style={{ transformOrigin: '180px 560px', animation: 'vw-palm 8s ease-in-out infinite' }}>
          <path d="M0,90 Q-4,30 6,0" stroke="#1a0a2e" strokeWidth="9" fill="none" />
          {[-60, -30, 0, 30, 60].map((a) => (
            <path key={a} d={`M6,0 Q${30 * Math.cos((a * Math.PI) / 180)},${-26} ${60 * Math.cos((a * Math.PI) / 180)},${10 - Math.abs(a) / 4}`}
              stroke="#1a0a2e" strokeWidth="6" fill="none" strokeLinecap="round" />
          ))}
        </g>
        <g transform="translate(1260,480) scale(-0.8,0.8)" style={{ transformOrigin: '1260px 560px', animation: 'vw-palm 10s ease-in-out -3s infinite' }}>
          <path d="M0,90 Q-4,30 6,0" stroke="#1a0a2e" strokeWidth="9" fill="none" />
          {[-60, -30, 0, 30, 60].map((a) => (
            <path key={a} d={`M6,0 Q${30 * Math.cos((a * Math.PI) / 180)},${-26} ${60 * Math.cos((a * Math.PI) / 180)},${10 - Math.abs(a) / 4}`}
              stroke="#1a0a2e" strokeWidth="6" fill="none" strokeLinecap="round" />
          ))}
        </g>

        {/* 希腊雕塑头像（漂浮） */}
        <g transform="translate(320,220)" style={{ animation: 'vw-float 9s ease-in-out infinite' }} opacity="0.85">
          <circle cx="0" cy="0" r="34" fill="#e8e0f0" />
          <path d="M-34,4 Q-40,44 -16,54 L16,54 Q40,44 34,4" fill="#e8e0f0" />
          <path d="M-14,-8 Q0,-16 14,-8" stroke="#8a7a9a" strokeWidth="2.5" fill="none" />
          <ellipse cx="-10" cy="2" rx="4" ry="6" fill="#8a7a9a" />
          <ellipse cx="10" cy="2" rx="4" ry="6" fill="#8a7a9a" />
          <path d="M-8,18 Q0,22 8,18" stroke="#8a7a9a" strokeWidth="2" fill="none" />
          <path d="M-46,58 L46,58" stroke="#FF6B9D" strokeWidth="3" />
        </g>

        {/* 漂浮几何 */}
        <polygon points="1120,180 1150,230 1090,230" fill="none" stroke="#00D4FF" strokeWidth="2.5"
          style={{ animation: 'vw-float 7s ease-in-out -2s infinite', transformOrigin: '1120px 210px' }} />
        <rect x="980" y="300" width="26" height="26" fill="none" stroke="#FF6B9D" strokeWidth="2.5" transform="rotate(18 993 313)"
          style={{ animation: 'vw-float 8s ease-in-out -5s infinite', transformOrigin: '993px 313px' }} />
      </svg>

      {/* 网格地板（透视 + 滚动） */}
      <div className="absolute inset-x-0 bottom-0 h-[38vh]"
        style={{
          background:
            'linear-gradient(rgba(0,212,255,0.22) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(255,107,157,0.22) 1.5px, transparent 1.5px)',
          backgroundSize: '56px 56px',
          transform: 'perspective(520px) rotateX(58deg)',
          transformOrigin: 'top center',
          animation: 'vw-grid 3.2s linear infinite',
          maskImage: 'linear-gradient(to bottom, transparent, #000 26%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 26%)',
        }}
      />

      {/* VHS 噪点扫描带 */}
      <div className="absolute inset-x-0 top-[30%] h-[2px] bg-white/10" style={{ animation: 'vw-grid 9s linear infinite' }} />
    </div>
  );
}
