/**
 * PotterBackground — 魔法世界 · 霍格沃茨之夜
 * 星空闪烁 + 城堡剪影暖窗 + 漂浮蜡烛 + 禁林雾气 + 猫头鹰掠过
 * 纯 CSS 动画，无 Canvas / rAF
 */

// 星野 — 固定伪随机分布（确定性，避免 hydration 抖动）
const STARS = Array.from({ length: 42 }, (_, i) => ({
  left: `${2 + ((i * 37.7) % 96)}%`,
  top: `${1 + ((i * 23.3) % 46)}%`,
  size: 1 + (i % 3) * 0.7,
  delay: `${(i % 7) * 0.6}s`,
  dur: `${2.2 + (i % 5) * 0.8}s`,
}));

// 漂浮蜡烛 — 各自位置 / 高度 / 相位不同
const CANDLES = Array.from({ length: 14 }, (_, i) => ({
  left: `${5 + ((i * 6.9) % 90)}%`,
  top: `${8 + ((i * 17.3) % 40)}%`,
  body: 22 + (i % 4) * 6,
  floatDur: `${4.5 + (i % 5) * 0.9}s`,
  floatDelay: `${-(i % 6) * 0.8}s`,
  flickDelay: `${-(i % 5) * 0.35}s`,
}));

// 城堡暖窗 — [x, y, w, h, 延迟s]
const WINDOWS = [
  [706, 510, 7, 12, 0.0], [724, 530, 7, 12, 1.2], [706, 560, 7, 12, 2.1],
  [574, 570, 6, 10, 0.6], [588, 600, 6, 10, 1.8],
  [848, 590, 6, 10, 0.3], [848, 620, 6, 10, 2.5],
  [906, 650, 5, 9, 1.5],
  [518, 630, 5, 9, 0.9],
  [630, 660, 8, 12, 0.2], [660, 660, 8, 12, 1.0], [690, 660, 8, 12, 1.7],
  [720, 660, 8, 12, 0.5], [750, 660, 8, 12, 2.3], [780, 660, 8, 12, 1.4],
  [645, 700, 8, 12, 2.8], [705, 700, 8, 12, 0.8], [765, 700, 8, 12, 1.9],
];

export default function PotterBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* 夜空底色 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #070512 0%, #0d0a1a 40%, #151030 70%, #0d0a1a 100%)',
        }}
      />

      {/* 星野 — 逐颗闪烁 */}
      {STARS.map((s, i) => (
        <div
          key={`star-${i}`}
          className="absolute rounded-full"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            background: '#f0ecff',
            boxShadow: '0 0 4px rgba(240,236,255,0.8)',
            animation: `pot-twinkle ${s.dur} ease-in-out ${s.delay} infinite`,
          }}
        />
      ))}

      {/* 猫头鹰 — 周期性掠过夜空 */}
      <div className="absolute left-0 top-0" style={{ animation: 'pot-owl 36s linear infinite' }}>
        <svg
          width="64"
          height="30"
          viewBox="0 0 64 30"
          style={{ animation: 'pot-flap 0.9s steps(2) infinite', transformOrigin: '50% 50%' }}
        >
          <path
            d="M32 14 Q40 8 50 6 Q62 4 63 8 Q58 12 48 14 Q56 14 58 18 Q50 20 40 17 L34 20 L32 26 L30 20 L24 17 Q14 20 6 18 Q8 14 16 14 Q6 12 1 8 Q2 4 14 6 Q24 8 32 14 Z"
            fill="#050310"
            opacity="0.9"
          />
        </svg>
      </div>

      {/* 霍格沃茨城堡剪影 + 暖窗 */}
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        {/* 远山 */}
        <path
          d="M0,760 Q240,690 480,740 T960,730 T1440,745 L1440,900 L0,900 Z"
          fill="#0a0716"
        />
        {/* 城堡剪影 */}
        <g fill="#060412">
          {/* 大厅 */}
          <rect x="600" y="620" width="240" height="180" />
          {/* 大厅雉堞 */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => (
            <rect key={`bm-${n}`} x={604 + n * 30} y="608" width="14" height="14" />
          ))}
          {/* 中央主塔 */}
          <rect x="690" y="480" width="60" height="150" />
          <polygon points="690,480 750,480 720,384" />
          {/* 左塔 */}
          <rect x="560" y="540" width="44" height="200" />
          <polygon points="560,540 604,540 582,438" />
          {/* 右塔 */}
          <rect x="836" y="560" width="40" height="180" />
          <polygon points="836,560 876,560 856,468" />
          {/* 远端小塔 */}
          <rect x="900" y="620" width="30" height="150" />
          <polygon points="900,620 930,620 915,544" />
          <rect x="510" y="600" width="28" height="170" />
          <polygon points="510,600 538,600 524,520" />
          {/* 连廊 */}
          <rect x="604" y="680" width="86" height="120" />
          <rect x="750" y="690" width="86" height="110" />
        </g>
        {/* 暖窗 — 烛火明灭 */}
        <g>
          {WINDOWS.map(([x, y, w, h, d], i) => (
            <rect
              key={`win-${i}`}
              x={x}
              y={y}
              width={w}
              height={h}
              rx="1"
              fill="#ffd700"
              style={{ animation: `pot-window ${2.6 + (i % 4) * 0.7}s ease-in-out ${d}s infinite` }}
            />
          ))}
        </g>
        {/* 山脚地面 */}
        <path
          d="M0,820 Q360,780 720,800 T1440,810 L1440,900 L0,900 Z"
          fill="#080614"
        />
      </svg>

      {/* 漂浮蜡烛 — 大厅上空的魔法 */}
      {CANDLES.map((c, i) => (
        <div
          key={`candle-${i}`}
          className="absolute"
          style={{
            left: c.left,
            top: c.top,
            animation: `pot-float ${c.floatDur} ease-in-out ${c.floatDelay} infinite`,
          }}
        >
          <div className="pot-flame" style={{ animationDelay: c.flickDelay }} />
          <div className="pot-wick" />
          <div className="pot-candle-body" style={{ height: c.body }} />
        </div>
      ))}

      {/* 禁林雾气 — 两条缓慢漂移的半透明雾带 */}
      <div
        className="absolute -bottom-[6%] -left-[10%] h-[26vh] w-[80vw] rounded-full blur-2xl"
        style={{
          background:
            'radial-gradient(ellipse, rgba(70,90,110,0.16) 0%, rgba(46,93,67,0.1) 55%, transparent 75%)',
          animation: 'pot-mist 26s ease-in-out infinite alternate',
        }}
      />
      <div
        className="absolute -bottom-[10%] right-[-15%] h-[30vh] w-[90vw] rounded-full blur-2xl"
        style={{
          background:
            'radial-gradient(ellipse, rgba(90,100,130,0.14) 0%, rgba(46,93,67,0.08) 50%, transparent 72%)',
          animation: 'pot-mist 34s ease-in-out -8s infinite alternate-reverse',
        }}
      />

      {/* 暗角 — 收拢视线 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 42%, transparent 55%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </div>
  );
}
