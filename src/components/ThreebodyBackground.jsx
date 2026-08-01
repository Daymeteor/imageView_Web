/**
 * ThreebodyBackground — 红岸基地夜景：两座碟形天线剪影 + 波束线
 * 星点闪烁 + 智子（蓝光点）折线飞行
 * 纯 CSS 动画（tb-* keyframes 定义在 themes/threebody.css）
 */

const STARS = Array.from({ length: 46 }, (_, i) => ({
  x: 18 + ((i * 97) % 1404),
  y: 16 + ((i * 53) % 500),
  r: 0.7 + (i % 3) * 0.5,
  blue: i % 4 === 0,
  dur: `${2.4 + (i % 5) * 0.9}s`,
  delay: `${(i % 7) * 0.55}s`,
}));

export default function ThreebodyBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <rect width="1440" height="900" fill="#050810" />

        {/* 红岸落日余晖 — 极低处的暗红光晕 */}
        <ellipse cx="470" cy="770" rx="430" ry="130" fill="rgba(212,48,48,0.07)" />
        <circle cx="470" cy="742" r="44" fill="rgba(212,48,48,0.14)" />

        {/* 星点闪烁 */}
        {STARS.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill={s.blue ? 'rgba(176,216,240,0.9)' : 'rgba(230,240,250,0.85)'}
            style={{ animation: `tb-twinkle ${s.dur} ease-in-out ${s.delay} infinite` }}
          />
        ))}

        {/* 波束线 — 主天线（红，发射） */}
        <g strokeLinecap="round">
          <line x1="430" y1="648" x2="690" y2="58" stroke="rgba(212,48,48,0.5)" strokeWidth="2"
            style={{ animation: 'tb-beam 3.2s ease-in-out infinite' }} />
          <line x1="430" y1="648" x2="800" y2="118" stroke="rgba(212,48,48,0.38)" strokeWidth="1.4"
            style={{ animation: 'tb-beam 4.1s ease-in-out -1.4s infinite' }} />
          <line x1="430" y1="648" x2="566" y2="36" stroke="rgba(239,83,80,0.3)" strokeWidth="1"
            style={{ animation: 'tb-beam 2.7s ease-in-out -0.8s infinite' }} />
          {/* 副天线（蓝，监听） */}
          <line x1="1092" y1="706" x2="872" y2="140" stroke="rgba(74,159,216,0.45)" strokeWidth="1.6"
            style={{ animation: 'tb-beam 3.6s ease-in-out -2s infinite' }} />
          <line x1="1092" y1="706" x2="966" y2="92" stroke="rgba(122,188,232,0.3)" strokeWidth="1"
            style={{ animation: 'tb-beam 2.9s ease-in-out -0.5s infinite' }} />
        </g>

        {/* 远山剪影 */}
        <path d="M0,780 L180,742 L360,772 L560,738 L760,776 L960,744 L1160,778 L1330,752 L1440,770 L1440,900 L0,900 Z" fill="#04070d" />

        {/* 基地机房剪影 + 窗口红灯 */}
        <g fill="#060b14">
          <rect x="600" y="806" width="96" height="42" />
          <rect x="716" y="820" width="60" height="28" />
          <rect x="952" y="812" width="70" height="36" />
        </g>
        <rect x="624" y="818" width="6" height="8" fill="rgba(212,48,48,0.55)"
          style={{ animation: 'tb-blink 2.2s ease-in-out infinite' }} />
        <rect x="658" y="818" width="6" height="8" fill="rgba(74,224,160,0.4)"
          style={{ animation: 'tb-blink 3.1s ease-in-out -1s infinite' }} />
        <rect x="972" y="824" width="6" height="8" fill="rgba(212,48,48,0.45)"
          style={{ animation: 'tb-blink 2.7s ease-in-out -0.6s infinite' }} />

        {/* 主碟形天线（红岸一号） */}
        <g transform="translate(430,672) rotate(-18)">
          <path d="M-30,118 L30,118 L18,18 L-18,18 Z" fill="#0a121e" />
          <line x1="0" y1="4" x2="0" y2="-54" stroke="#0d1624" strokeWidth="5" />
          <ellipse cx="0" cy="0" rx="88" ry="30" fill="#0d1624" stroke="rgba(122,188,232,0.4)" strokeWidth="1.5" />
          <ellipse cx="0" cy="4" rx="70" ry="21" fill="#081019" />
          <circle cx="0" cy="-56" r="3.5" fill="rgba(239,83,80,0.9)"
            style={{ animation: 'tb-blink 1.6s ease-in-out infinite' }} />
        </g>

        {/* 副碟形天线（红岸二号） */}
        <g transform="translate(1092,748) scale(0.62) rotate(14)">
          <path d="M-26,68 L26,68 L16,0 L-16,0 Z" fill="#0a121e" />
          <line x1="0" y1="-4" x2="0" y2="-52" stroke="#0d1624" strokeWidth="5" />
          <ellipse cx="0" cy="-8" rx="78" ry="26" fill="#0d1624" stroke="rgba(122,188,232,0.32)" strokeWidth="1.5" />
          <ellipse cx="0" cy="-5" rx="60" ry="18" fill="#081019" />
          <circle cx="0" cy="-54" r="3.2" fill="rgba(74,159,216,0.9)"
            style={{ animation: 'tb-blink 2s ease-in-out -0.7s infinite' }} />
        </g>

        {/* 近地面深色层 + 地面冷雾 */}
        <path d="M0,842 L240,812 L470,844 L720,816 L980,848 L1220,820 L1440,842 L1440,900 L0,900 Z" fill="#02050a" />
        <ellipse cx="720" cy="880" rx="700" ry="40" fill="rgba(74,159,216,0.05)" />

        {/* 智子 — 蓝光点复杂折线飞行（两层残影跟随） */}
        <g style={{ animation: 'tb-sophon 16s linear infinite' }}>
          <circle r="2.6" fill="#cfeaff" style={{ filter: 'drop-shadow(0 0 7px rgba(122,188,232,0.95))' }} />
        </g>
        <g style={{ animation: 'tb-sophon 16s linear -0.32s infinite' }} opacity="0.5">
          <circle r="1.7" fill="#7abce8" />
        </g>
        <g style={{ animation: 'tb-sophon 16s linear -0.64s infinite' }} opacity="0.26">
          <circle r="1.1" fill="#4a9fd8" />
        </g>
      </svg>
    </div>
  );
}
