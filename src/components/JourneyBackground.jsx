/**
 * JourneyBackground — 连绵沙丘 + 遗迹剪影 + 光之生物 + 飘带
 */

export default function JourneyBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="jrn-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff2dc" />
            <stop offset="100%" stopColor="#E8C39E" />
          </linearGradient>
        </defs>

        <rect width="1440" height="900" fill="url(#jrn-sky)" />

        {/* 远处巨大遗迹剪影（山巅之门） */}
        <g fill="#c89878" opacity="0.55">
          <polygon points="1050,460 1100,280 1150,460" />
          <polygon points="1160,460 1200,330 1240,460" />
          <rect x="1080" y="460" width="190" height="16" />
        </g>

        {/* 沙丘三层 */}
        <path d="M0,560 Q240,500 480,552 T960,548 T1440,540 L1440,900 L0,900Z" fill="#dcb088" />
        <path d="M0,680 Q300,610 620,672 T1440,650 L1440,900 L0,900Z" fill="#d0a075" />
        <path d="M0,800 Q360,740 760,796 T1440,780 L1440,900 L0,900Z" fill="#c08f66" />

        {/* 沙纹 */}
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M${160 + i * 320},${700 + (i % 2) * 60} q60,-10 120,0 q60,8 120,-2`}
            stroke="rgba(138,106,58,0.25)" strokeWidth="2" fill="none" />
        ))}

        {/* 光之生物（蜿蜒游动的光带） */}
        <g style={{ animation: 'jrn-creature 26s linear infinite' }}>
          <path d="M0,600 Q40,580 80,598 T160,596 T240,600" stroke="#FFF8E1" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.95"
            style={{ filter: 'drop-shadow(0 0 12px rgba(255,248,225,0.9))' }} />
          <circle cx="240" cy="600" r="5" fill="#fff" />
        </g>

        {/* 飘带（旅人遗落的围巾） */}
        <g transform="translate(300,380)" style={{ animation: 'jrn-scarf 6s ease-in-out infinite' }}>
          <path d="M0,0 Q30,-24 66,-14 Q100,-4 128,-22" stroke="#E67E22" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.8" />
        </g>

        {/* 山顶光柱（目的地） */}
        <rect x="1116" y="180" width="8" height="110" fill="#FFF8E1" opacity="0.75"
          style={{ filter: 'drop-shadow(0 0 14px rgba(255,248,225,0.95))' }} />
      </svg>
    </div>
  );
}
