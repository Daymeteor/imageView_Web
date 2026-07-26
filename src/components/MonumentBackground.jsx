/**
 * MonumentBackground — 等轴测漂浮岛 + 旋转不可能三角 + 粉蓝渐变天空
 */

/** 等轴测小岛（菱形台地 + 侧壁 + 小塔） */
function Islet({ x, y, s, dur, delay }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} style={{ animation: `mv-float ${dur} ease-in-out ${delay} infinite` }}>
      {/* 顶面 */}
      <polygon points="0,-30 70,5 0,40 -70,5" fill="#8fd0a8" />
      {/* 左右侧壁 */}
      <polygon points="-70,5 0,40 0,86 -70,51" fill="#B8A9C9" />
      <polygon points="70,5 0,40 0,86 70,51" fill="#9a8ab8" />
      {/* 小塔 */}
      <polygon points="0,-66 22,-49 0,-32 -22,-49" fill="#FF6B9D" />
      <polygon points="-22,-49 0,-32 0,-6 -22,-23" fill="#d85a88" />
      <polygon points="22,-49 0,-32 0,-6 22,-23" fill="#c44a78" />
    </g>
  );
}

export default function MonumentBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="mv-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a8c8f0" />
            <stop offset="55%" stopColor="#d8c4e0" />
            <stop offset="100%" stopColor="#F5E6D3" />
          </linearGradient>
        </defs>

        <rect width="1440" height="900" fill="url(#mv-sky)" />

        {/* 旋转的不可能三角（三段错位描边） */}
        <g style={{ transformOrigin: '1180px 210px', animation: 'mv-spin 30s linear infinite' }}>
          <g transform="translate(1180,210)">
            <path d="M0,-80 L70,42 L-14,42 L40,-30" fill="none" stroke="#FF6B9D" strokeWidth="10" strokeLinejoin="round" />
            <path d="M40,-30 L70,42 L-70,42 L-24,-18" fill="none" stroke="#4A90D9" strokeWidth="10" strokeLinejoin="round" opacity="0.85" />
            <path d="M-24,-18 L-70,42 L24,42 L0,-80" fill="none" stroke="#B8A9C9" strokeWidth="10" strokeLinejoin="round" opacity="0.9" />
          </g>
        </g>

        {/* 漂浮岛屿 */}
        <Islet x={300} y={420} s={1.15} dur="7s" delay="0s" />
        <Islet x={760} y={620} s={0.9} dur="9s" delay="-3s" />
        <Islet x={1120} y={560} s={0.7} dur="8s" delay="-5s" />

        {/* 远处图腾柱 */}
        <g opacity="0.5" transform="translate(150,640)">
          <rect x="-14" y="-120" width="28" height="120" fill="#9a8ab8" />
          <rect x="-20" y="-132" width="40" height="14" fill="#FF6B9D" />
          <circle cx="0" cy="-88" r="8" fill="#F5E6D3" />
          <circle cx="0" cy="-56" r="8" fill="#F5E6D3" />
        </g>
      </svg>
    </div>
  );
}
