/**
 * BladerunnerBackground — 泰瑞尔金字塔 + 全息艺伎 + 双层雨 + 雾 + 飞行车
 */

const RAIN_FAR = { img: 'repeating-linear-gradient(100deg, transparent 0 10px, rgba(170,220,255,0.10) 10px 11px, transparent 11px 24px)' };
const RAIN_NEAR = { img: 'repeating-linear-gradient(100deg, transparent 0 16px, rgba(200,235,255,0.16) 16px 17.5px, transparent 17.5px 40px)' };

export default function BladerunnerBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="br-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a1626" />
            <stop offset="100%" stopColor="#0D1B2A" />
          </linearGradient>
          <linearGradient id="br-holo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        <rect width="1440" height="900" fill="url(#br-sky)" />

        {/* 城市剪影 */}
        <g fill="#0a1420">
          <rect x="40" y="420" width="120" height="480" />
          <rect x="190" y="360" width="90" height="540" />
          <rect x="310" y="460" width="140" height="440" />
          <rect x="1050" y="380" width="110" height="520" />
          <rect x="1190" y="440" width="150" height="460" />
        </g>
        {/* 楼宇零星窗灯 */}
        {Array.from({ length: 20 }, (_, i) => (
          <rect key={i} x={60 + ((i * 67) % 1300)} y={430 + ((i * 53) % 380)} width="4" height="6"
            fill={i % 3 ? 'rgba(0,229,255,0.35)' : 'rgba(230,81,0,0.4)'}
            style={{ animation: `br-pulse ${3 + (i % 4)}s ease-in-out ${(i % 5) * 0.7}s infinite` }} />
        ))}

        {/* 泰瑞尔金字塔（顶部脉动光） */}
        <g>
          <polygon points="720,140 520,900 920,900" fill="#0e1e30" stroke="rgba(0,229,255,0.14)" strokeWidth="2" />
          <polygon points="720,140 690,230 750,230" fill="#00E5FF" opacity="0.7"
            style={{ animation: 'br-pulse 5s ease-in-out infinite' }} />
          <line x1="720" y1="230" x2="720" y2="900" stroke="rgba(0,229,255,0.1)" strokeWidth="1.5" />
        </g>

        {/* 全息艺伎面板（侧脸色块 + glitch 闪） */}
        <g style={{ animation: 'br-pulse 7s ease-in-out infinite' }}>
          <rect x="1050" y="90" width="220" height="280" fill="url(#br-holo)" stroke="rgba(0,229,255,0.4)" strokeWidth="1.5" />
          <ellipse cx="1160" cy="190" rx="52" ry="76" fill="#00E5FF" opacity="0.22" />
          <path d="M1160,120 q40,10 38,60 q-2,44 -38,60 q-36,-16 -38,-60 q2,-50 38,-60Z" fill="#ff7a9c" opacity="0.3" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect key={i} x="1050" y={110 + i * 44} width="220" height="2" fill="#0D1B2A" opacity="0.6" />
          ))}
        </g>

        {/* 飞行车灯光点 */}
        <g style={{ animation: 'br-car 14s linear infinite' }}>
          <circle cy="300" r="3.5" fill="#ff7a2e" />
          <circle cx="14" cy="300" r="2" fill="#ffd0a8" />
        </g>
        <g style={{ animation: 'br-car 19s linear -8s infinite' }}>
          <circle cy="480" r="3" fill="#00E5FF" />
        </g>
      </svg>

      {/* 双层雨（远细密 + 近稀疏） */}
      <div className="absolute inset-[-60px]" style={{ backgroundImage: RAIN_FAR.img, animation: 'br-rain 1.1s linear infinite' }} />
      <div className="absolute inset-[-80px]" style={{ backgroundImage: RAIN_NEAR.img, animation: 'br-rain 0.7s linear infinite' }} />

      {/* 底部雾带 */}
      <div className="absolute bottom-[-10%] left-[-10%] h-[36vh] w-[70vw] rounded-full"
        style={{ background: 'radial-gradient(ellipse, rgba(120,160,190,0.14) 0%, transparent 65%)', filter: 'blur(24px)', animation: 'br-mist 16s ease-in-out infinite alternate' }} />
      <div className="absolute bottom-[-12%] right-[-10%] h-[32vh] w-[60vw] rounded-full"
        style={{ background: 'radial-gradient(ellipse, rgba(120,160,190,0.1) 0%, transparent 65%)', filter: 'blur(28px)', animation: 'br-mist 20s ease-in-out -6s infinite alternate-reverse' }} />
    </div>
  );
}
