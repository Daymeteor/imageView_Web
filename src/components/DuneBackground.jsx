/**
 * DuneBackground — 连绵沙丘 + 沙虫穿行 + 香料云 + 扑翼机
 */

export default function DuneBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="dn-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a2a3a" />
            <stop offset="60%" stopColor="#3a2a1a" />
            <stop offset="100%" stopColor="#0D1B2A" />
          </linearGradient>
        </defs>

        <rect width="1440" height="900" fill="url(#dn-sky)" />

        {/* 双日（厄拉科斯） */}
        <circle cx="1180" cy="150" r="34" fill="#ffc98f" opacity="0.7" />
        <circle cx="1240" cy="180" r="20" fill="#f09848" opacity="0.55" />

        {/* 香料云 */}
        <ellipse cx="400" cy="300" rx="300" ry="60" fill="#D4A373" opacity="0.1"
          style={{ animation: 'dn-mist 22s ease-in-out infinite alternate' }} />
        <ellipse cx="1000" cy="420" rx="340" ry="70" fill="#E67E22" opacity="0.07"
          style={{ animation: 'dn-mist 28s ease-in-out -10s infinite alternate-reverse' }} />

        {/* 扑翼机 */}
        <g style={{ animation: 'dn-worm 24s linear infinite' }} transform="translate(0,260)">
          <path d="M0,0 L34,-6 L60,0 L34,6Z" fill="#8D6E63" opacity="0.8" />
          <line x1="12" y1="-4" x2="4" y2="-14" stroke="#8D6E63" strokeWidth="2" />
          <line x1="48" y1="-4" x2="56" y2="-14" stroke="#8D6E63" strokeWidth="2" />
        </g>

        {/* 沙丘四层 */}
        <path d="M0,560 Q260,500 520,552 T1040,540 T1440,530 L1440,900 L0,900Z" fill="#5a4028" />
        <path d="M0,660 Q320,590 660,650 T1440,630 L1440,900 L0,900Z" fill="#4a3320" />
        <path d="M0,760 Q380,690 760,750 T1440,720 L1440,900 L0,900Z" fill="#3a2716" />
        <path d="M0,840 Q420,790 860,830 T1440,810 L1440,900 L0,900Z" fill="#2a1c10" />

        {/* 沙虫穿行轨迹（周期性） */}
        <g style={{ animation: 'dn-worm 16s linear infinite' }} transform="translate(0,700)">
          <path d="M0,0 Q60,-26 120,-4 T240,-8 T360,-2" stroke="#D4A373" strokeWidth="10" fill="none" strokeLinecap="round" opacity="0.75" />
          <path d="M0,10 Q60,-14 120,6 T240,2" stroke="#8D6E63" strokeWidth="4" fill="none" opacity="0.5" />
        </g>
      </svg>
    </div>
  );
}
