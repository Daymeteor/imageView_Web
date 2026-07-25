/**
 * SpiritedBackground — 汤屋幻境动态背景
 * 墨黑夜海：汤屋暖窗剪影 + 朱红大桥灯笼阵 + 海上列车 + 偶有花火
 * 纯 CSS 动画（sp-* keyframes 定义在 themes/spirited.css）
 */

const W = 1440;
const H = 900;
const WATER_Y = 560;

// 星星 — 确定性伪随机分布
const STARS = Array.from({ length: 30 }, (_, i) => ({
  x: 2 + ((i * 37.7) % 96),
  y: 1 + ((i * 23.3) % 34),
  r: 0.9 + (i % 3) * 0.55,
  d: `${(i % 6) * 0.6}s`,
  dur: `${2.6 + (i % 4) * 0.8}s`,
}));

// 大桥弧线（抛物线）：t∈[0,1] → 桥面坐标
const bridgeY = (t) => 556 - 106 * Math.sin(Math.PI * t);
const bridgeX = (t) => 460 + t * 940;

// 灯笼阵 — 沿桥弧排开，金/朱红交替，各自呼吸相位
const LANTERNS = Array.from({ length: 11 }, (_, i) => {
  const t = i / 10;
  return {
    x: bridgeX(t),
    y: bridgeY(t) - 16,
    gold: i % 2 === 0,
    dur: `${3.2 + (i % 4) * 0.7}s`,
    d: `${(i * 0.53) % 3}s`,
  };
});

// 汤屋暖窗（主楼三层 + 侧楼），部分呼吸
const WINDOWS = [
  // 一层
  { x: 92, y: 502, w: 16, h: 22 }, { x: 126, y: 502, w: 16, h: 22, b: 1 },
  { x: 160, y: 502, w: 16, h: 22 }, { x: 228, y: 502, w: 16, h: 22, b: 2 },
  { x: 262, y: 502, w: 16, h: 22 }, { x: 296, y: 502, w: 16, h: 22, b: 1 },
  // 一层大门（高窗）
  { x: 186, y: 486, w: 26, h: 38, b: 2 },
  // 二层
  { x: 128, y: 352, w: 14, h: 18, b: 1 }, { x: 158, y: 352, w: 14, h: 18 },
  { x: 218, y: 352, w: 14, h: 18, b: 2 }, { x: 248, y: 352, w: 14, h: 18 },
  // 三层
  { x: 168, y: 284, w: 12, h: 15 }, { x: 216, y: 284, w: 12, h: 15, b: 1 },
  // 侧楼
  { x: 352, y: 468, w: 13, h: 18, b: 2 }, { x: 382, y: 468, w: 13, h: 18 },
  { x: 366, y: 428, w: 12, h: 15, b: 1 },
];

// 花火 — 两组径向粒子，错开周期
const FIREWORKS = [
  { cx: 1050, cy: 180, colors: ['#ffd98a', '#f9a825'], dur: '11s', delay: '1.5s', spread: 82 },
  { cx: 620, cy: 140, colors: ['#f2705f', '#4dd0e1'], dur: '15s', delay: '6s', spread: 68 },
];

const fireworkParticles = (fw) =>
  Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2 + 0.3;
    const r = fw.spread * (0.75 + (i % 3) * 0.16);
    return {
      dx: `${(Math.cos(a) * r).toFixed(1)}px`,
      dy: `${(Math.sin(a) * r).toFixed(1)}px`,
      color: fw.colors[i % fw.colors.length],
    };
  });

// 海上列车车窗
const TRAIN_WINDOWS = Array.from({ length: 12 }, (_, i) => 26 + i * 46);

export default function SpiritedBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <svg className="h-full w-full" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="sp-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d0d1c" />
            <stop offset="62%" stopColor="#1a1a2e" />
            <stop offset="100%" stopColor="#28284a" />
          </linearGradient>
          <linearGradient id="sp-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#161630" />
            <stop offset="100%" stopColor="#0a0a16" />
          </linearGradient>
          <radialGradient id="sp-glow-gold">
            <stop offset="0%" stopColor="#ffc94d" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#f9a825" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f9a825" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sp-glow-red">
            <stop offset="0%" stopColor="#f2705f" stopOpacity="0.9" />
            <stop offset="45%" stopColor="#e84b3c" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#e84b3c" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="sp-moon">
            <stop offset="0%" stopColor="#f5e6d3" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#f5e6d3" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#f5e6d3" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 夜空 */}
        <rect width={W} height={H} fill="url(#sp-sky)" />

        {/* 星星 */}
        {STARS.map((s, i) => (
          <circle
            key={i}
            cx={(s.x / 100) * W}
            cy={(s.y / 100) * H}
            r={s.r}
            fill="#fff8e8"
            style={{ animation: `sp-twinkle ${s.dur} ease-in-out ${s.d} infinite` }}
          />
        ))}

        {/* 月亮 — 远天一轮淡金 */}
        <circle cx="1250" cy="120" r="86" fill="url(#sp-moon)" opacity="0.55" />
        <circle cx="1250" cy="120" r="34" fill="#f5e6d3" opacity="0.85" />

        {/* 花火 — 偶有的径向小爆发 */}
        {FIREWORKS.map((fw, fi) => (
          <g key={fi} transform={`translate(${fw.cx},${fw.cy})`}>
            {fireworkParticles(fw).map((p, pi) => (
              <circle
                key={pi}
                r="3.2"
                fill={p.color}
                opacity="0"
                style={{
                  '--dx': p.dx,
                  '--dy': p.dy,
                  animation: `sp-hanabi ${fw.dur} ease-out ${fw.delay} infinite`,
                }}
              />
            ))}
          </g>
        ))}

        {/* 汤屋剪影 — 左侧多层暖窗小楼 */}
        <g fill="#131327">
          {/* 主楼三层 + 重檐 */}
          <rect x="70" y="430" width="260" height="130" />
          <polygon points="50,430 350,430 318,398 82,398" fill="#0e0e20" />
          <rect x="110" y="338" width="180" height="62" />
          <polygon points="94,338 306,338 278,310 122,310" fill="#0e0e20" />
          <rect x="150" y="270" width="100" height="42" />
          <polygon points="136,270 264,270 240,244 160,244" fill="#0e0e20" />
          {/* 顶塔 */}
          <rect x="190" y="212" width="20" height="34" />
          <polygon points="182,212 218,212 200,192" fill="#0e0e20" />
          {/* 侧楼 */}
          <rect x="330" y="452" width="100" height="108" />
          <polygon points="318,452 442,452 418,420 342,420" fill="#0e0e20" />
          <rect x="346" y="410" width="60" height="14" />
          <polygon points="338,410 414,410 398,392 354,392" fill="#0e0e20" />
        </g>

        {/* 汤屋暖窗 */}
        {WINDOWS.map((w, i) => (
          <rect
            key={i}
            x={w.x}
            y={w.y}
            width={w.w}
            height={w.h}
            rx="1.5"
            fill="#ffcf7a"
            style={
              w.b
                ? { animation: `sp-window ${4.5 + w.b}s ease-in-out ${w.b * 0.9}s infinite` }
                : undefined
            }
            opacity={w.b ? undefined : 0.85}
          />
        ))}

        {/* 朱红大桥 — 横亘画面右侧 */}
        <g>
          {/* 桥墩 */}
          {[0.18, 0.42, 0.66, 0.9].map((t, i) => (
            <rect
              key={i}
              x={bridgeX(t) - 7}
              y={bridgeY(t) + 4}
              width="14"
              height={WATER_Y + 60 - bridgeY(t)}
              fill="#8a2a20"
            />
          ))}
          {/* 桥身弧板 */}
          <path
            d={`M${bridgeX(0)},${bridgeY(0)} Q${bridgeX(0.5)},${bridgeY(0.5) - 116} ${bridgeX(1)},${bridgeY(1)} L${bridgeX(1)},${bridgeY(1) + 18} Q${bridgeX(0.5)},${bridgeY(0.5) - 98} ${bridgeX(0)},${bridgeY(0) + 18} Z`}
            fill="#c23729"
          />
          {/* 栏杆 */}
          <path
            d={`M${bridgeX(0)},${bridgeY(0) - 6} Q${bridgeX(0.5)},${bridgeY(0.5) - 122} ${bridgeX(1)},${bridgeY(1) - 6}`}
            fill="none"
            stroke="#e84b3c"
            strokeWidth="4"
          />
          {Array.from({ length: 21 }, (_, i) => {
            const t = i / 20;
            return (
              <line
                key={i}
                x1={bridgeX(t)}
                y1={bridgeY(t) - 6}
                x2={bridgeX(t)}
                y2={bridgeY(t) + 2}
                stroke="#e84b3c"
                strokeWidth="2.5"
              />
            );
          })}
        </g>

        {/* 灯笼阵 — 金/红圆点各自呼吸 */}
        {LANTERNS.map((l, i) => (
          <g
            key={i}
            style={{ animation: `sp-lantern ${l.dur} ease-in-out ${l.d} infinite` }}
          >
            <circle cx={l.x} cy={l.y} r="17" fill={l.gold ? 'url(#sp-glow-gold)' : 'url(#sp-glow-red)'} />
            <circle cx={l.x} cy={l.y} r="6" fill={l.gold ? '#ffc94d' : '#f2705f'} />
          </g>
        ))}

        {/* 夜海 */}
        <rect y={WATER_Y} width={W} height={H - WATER_Y} fill="url(#sp-water)" />
        <rect y={WATER_Y} width={W} height="2" fill="#4dd0e1" opacity="0.14" />

        {/* 灯笼倒影 — 水面上颤动的光点 */}
        {LANTERNS.map((l, i) => (
          <ellipse
            key={i}
            cx={l.x}
            cy={WATER_Y + (WATER_Y - l.y) * 0.28}
            rx="7"
            ry="13"
            fill={l.gold ? '#f9a825' : '#e84b3c'}
            style={{ animation: `sp-shimmer ${l.dur} ease-in-out ${l.d} infinite` }}
          />
        ))}

        {/* 汤屋倒影 — 一汪暖色 */}
        <ellipse cx="230" cy={WATER_Y + 40} rx="180" ry="26" fill="#f9a825" opacity="0.06" />
        <ellipse cx="230" cy={WATER_Y + 70} rx="120" ry="16" fill="#e84b3c" opacity="0.05" />

        {/* 海上列车 — 带暖窗的长条剪影缓缓驶过 */}
        <g style={{ animation: 'sp-train 64s linear infinite' }}>
          <g transform={`translate(0,${WATER_Y + 96})`}>
            {/* 倒影 */}
            <rect x="8" y="34" width="576" height="10" fill="#f9a825" opacity="0.08" />
            {/* 车身 */}
            <rect x="0" y="0" width="592" height="30" rx="6" fill="#101022" />
            <rect x="0" y="0" width="592" height="5" rx="2.5" fill="#1c1c34" />
            {/* 车头灯 */}
            <circle cx="586" cy="16" r="5" fill="#ffe9b0" opacity="0.9" />
            {/* 暖窗 */}
            {TRAIN_WINDOWS.map((x, i) => (
              <rect key={i} x={x} y="8" width="26" height="14" rx="2" fill="#ffd98a" opacity="0.85" />
            ))}
          </g>
        </g>

        {/* 暗角 — 收拢视线 */}
        <rect
          width={W}
          height={H}
          fill="url(#sp-vignette)"
          style={{ pointerEvents: 'none' }}
        />
        <defs>
          <radialGradient id="sp-vignette" cx="0.5" cy="0.45" r="0.75">
            <stop offset="55%" stopColor="#000000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.5" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
