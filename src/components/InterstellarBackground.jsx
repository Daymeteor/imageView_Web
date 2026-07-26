/**
 * InterstellarBackground — 黑洞吸积盘 + 引力透镜星光 + 沙尘漂流
 * 纯 SVG/CSS，无定时器
 */

const STARS = Array.from({ length: 30 }, (_, i) => ({
  x: 2 + ((i * 31.7) % 96),
  y: 2 + ((i * 47.3) % 88),
  r: 0.9 + (i % 3) * 0.5,
  d: `${(i % 5) * 0.6}s`,
}));

const DUST = Array.from({ length: 12 }, (_, i) => ({
  left: `${15 + ((i * 23.5) % 80)}%`,
  top: `${12 + ((i * 31.1) % 70)}%`,
  size: 1.5 + (i % 3),
  dur: `${14 + (i % 5) * 4}s`,
  delay: `${-(i * 2.3)}s`,
}));

export default function InterstellarBackground() {
  const cx = 980;
  const cy = 380;
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="is-nebula">
            <stop offset="0%" stopColor="#4A148C" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#4A148C" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="is-glow">
            <stop offset="0%" stopColor="#F57C00" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#F57C00" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1440" height="900" fill="#0A0A0A" />

        {/* 星云 */}
        <ellipse cx="360" cy="700" rx="420" ry="280" fill="url(#is-nebula)" />
        <ellipse cx="1220" cy="160" rx="360" ry="220" fill="url(#is-nebula)" opacity="0.6" />

        {/* 星星（闪烁） */}
        {STARS.map((s, i) => (
          <circle key={i} cx={(s.x / 100) * 1440} cy={(s.y / 100) * 900} r={s.r} fill="#fff"
            opacity="0.7" style={{ animation: `is-twinkle ${3 + (i % 4)}s ease-in-out ${s.d} infinite` }} />
        ))}

        {/* 引力透镜：沿弧线弯曲的星轨 */}
        <path d={`M${cx - 260},${cy - 90} Q${cx},${cy - 190} ${cx + 260},${cy - 90}`} stroke="rgba(255,255,255,0.25)" strokeWidth="1" fill="none" strokeDasharray="2 7" />
        <path d={`M${cx - 300},${cy + 110} Q${cx},${cy + 210} ${cx + 300},${cy + 110}`} stroke="rgba(255,255,255,0.18)" strokeWidth="1" fill="none" strokeDasharray="2 8" />

        {/* 土星环剪影（远处） */}
        <g opacity="0.35" transform="translate(180,140) rotate(-16)">
          <circle r="26" fill="#37474F" />
          <ellipse rx="58" ry="12" fill="none" stroke="#5a7a8a" strokeWidth="3" />
        </g>

        {/* 黑洞：光晕 + 吸积盘（双层反向缓转）+ 事件视界 */}
        <circle cx={cx} cy={cy} r="150" fill="url(#is-glow)" />
        <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'is-spin 26s linear infinite' }}>
          <ellipse cx={cx} cy={cy} rx="128" ry="30" fill="none" stroke="#F57C00" strokeWidth="7" opacity="0.9" transform={`rotate(-14 ${cx} ${cy})`} />
        </g>
        <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'is-spin-rev 40s linear infinite' }}>
          <ellipse cx={cx} cy={cy} rx="100" ry="22" fill="none" stroke="#ff9d3c" strokeWidth="3.5" opacity="0.55" transform={`rotate(-14 ${cx} ${cy})`} />
        </g>
        <circle cx={cx} cy={cy} r="44" fill="#000" stroke="rgba(245,124,0,0.6)" strokeWidth="1.5" />
      </svg>

      {/* 沙尘颗粒漂流 */}
      {DUST.map((d, i) => (
        <span key={i} className="absolute rounded-full bg-[#c9a06a]"
          style={{
            left: d.left, top: d.top, width: d.size, height: d.size, opacity: 0.3,
            animation: `is-dust ${d.dur} linear ${d.delay} infinite`,
          }} />
      ))}
    </div>
  );
}
