/**
 * PixelBackground — 像素世界（Minecraft）动态背景
 * 蓝天渐变 + 方形太阳 + 矩形组合像素云 + 远处山丘/树 + 草地条带 + 方块羊
 * 全部矩形块构成，纯 CSS 动画，无 Canvas
 */

// 像素云：矩形组合（白 + 浅蓝底影）
const CLOUDS = [
  { x: 160, y: 110, s: 1, anim: 'px-cloud-a 52s ease-in-out infinite alternate' },
  { x: 640, y: 70, s: 0.7, anim: 'px-cloud-b 64s ease-in-out infinite alternate' },
  { x: 1080, y: 170, s: 0.85, anim: 'px-cloud-a 70s ease-in-out -18s infinite alternate-reverse' },
];

// 云的单体形状（单位格 24px）
const CLOUD_BLOCKS = [
  [1, 0, 3, 1], [0, 1, 6, 1], [0, 2, 5, 1], [4, 2, 2, 1],
];

// 远处像素树：棕色树干 + 草绿方块树冠
const TREES = [
  { x: 220, base: 690, s: 1 },
  { x: 890, base: 678, s: 0.8 },
  { x: 1240, base: 694, s: 1.1 },
];

// 方块羊
const SHEEP = [
  { x: 420, y: 748, s: 1, delay: '0s' },
  { x: 760, y: 756, s: 0.8, delay: '1.4s' },
  { x: 1160, y: 744, s: 1.15, delay: '0.7s' },
];

// 草地上的深色草方块点缀
const GRASS_DABS = Array.from({ length: 22 }, (_, i) => ({
  x: (i * 67 + 31) % 1440,
  y: 786 + ((i * 29) % 26),
  w: 10 + (i % 3) * 6,
}));

// 泥土层的深色斑块
const DIRT_DABS = Array.from({ length: 16 }, (_, i) => ({
  x: (i * 89 + 53) % 1440,
  y: 830 + ((i * 37) % 56),
  w: 12 + (i % 4) * 8,
}));

// 天空像素闪光块（方形"星"）
const SPARKLES = Array.from({ length: 8 }, (_, i) => ({
  x: 60 + ((i * 173) % 1320),
  y: 40 + ((i * 97) % 220),
  s: 4 + (i % 3) * 2,
  dur: `${3 + (i % 4)}s`,
  d: `${(i % 5) * 0.8}s`,
}));

const W = 1440;
const H = 900;
const GRASS_Y = 780;

export default function PixelBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <svg className="h-full w-full" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="px-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6fb3e0" />
            <stop offset="62%" stopColor="#a8d4ee" />
            <stop offset="100%" stopColor="#d8eef7" />
          </linearGradient>
        </defs>

        {/* 天空 */}
        <rect width={W} height={H} fill="url(#px-sky)" />

        {/* 方形像素太阳 — 主块 + 高光块 + 角部台阶 */}
        <g transform="translate(1130,90)">
          <rect width="120" height="120" fill="#ffd54f" />
          <rect x="12" y="12" width="40" height="40" fill="#ffecb3" />
          <rect x="96" y="0" width="24" height="24" fill="#ffca28" />
          <rect x="0" y="96" width="24" height="24" fill="#ffca28" />
          <rect x="96" y="96" width="24" height="24" fill="#ffca28" />
          {/* 外圈像素光点 */}
          <rect x="-28" y="48" width="16" height="16" fill="#ffe082" opacity="0.8" />
          <rect x="132" y="48" width="16" height="16" fill="#ffe082" opacity="0.8" />
          <rect x="48" y="-28" width="16" height="16" fill="#ffe082" opacity="0.8" />
          <rect x="48" y="132" width="16" height="16" fill="#ffe082" opacity="0.8" />
        </g>

        {/* 天空像素闪光块 */}
        {SPARKLES.map((s, i) => (
          <rect
            key={i}
            x={s.x}
            y={s.y}
            width={s.s}
            height={s.s}
            fill="#ffffff"
            style={{ animation: `px-sparkle ${s.dur} ease-in-out ${s.d} infinite` }}
          />
        ))}

        {/* 像素云 — 矩形组合，缓慢平移 */}
        {CLOUDS.map((c, i) => (
          <g key={i} transform={`translate(${c.x},${c.y}) scale(${c.s})`} style={{ animation: c.anim }}>
            {/* 底影层 */}
            {CLOUD_BLOCKS.map(([bx, by, bw, bh], j) => (
              <rect key={`s${j}`} x={bx * 24} y={by * 24 + 8} width={bw * 24} height={bh * 24} fill="#d6ecf7" />
            ))}
            {/* 主体层 */}
            {CLOUD_BLOCKS.map(([bx, by, bw, bh], j) => (
              <rect key={`m${j}`} x={bx * 24} y={by * 24} width={bw * 24} height={bh * 24} fill="#ffffff" />
            ))}
          </g>
        ))}

        {/* 远山丘 — 台阶状剪影（浅绿） */}
        <g fill="#aed581">
          <rect x="0" y="700" width="180" height="80" />
          <rect x="60" y="668" width="120" height="32" />
          <rect x="100" y="640" width="60" height="28" />
          <rect x="520" y="708" width="260" height="72" />
          <rect x="580" y="676" width="160" height="32" />
          <rect x="630" y="648" width="80" height="28" />
          <rect x="1000" y="700" width="220" height="80" />
          <rect x="1060" y="670" width="130" height="30" />
        </g>

        {/* 近山丘 — 台阶状剪影（草绿） */}
        <g fill="#8bc34a">
          <rect x="240" y="726" width="280" height="54" />
          <rect x="300" y="698" width="180" height="28" />
          <rect x="350" y="674" width="90" height="24" />
          <rect x="820" y="730" width="240" height="50" />
          <rect x="870" y="704" width="150" height="26" />
          <rect x="1300" y="720" width="140" height="60" />
        </g>

        {/* 像素树 — 树干 + 方块树冠 */}
        {TREES.map((t, i) => (
          <g key={i} transform={`translate(${t.x},${t.base}) scale(${t.s})`}>
            <rect x="-10" y="-56" width="20" height="56" fill="#6d4c41" />
            <rect x="-46" y="-128" width="92" height="52" fill="#558b2f" />
            <rect x="-30" y="-152" width="60" height="24" fill="#689f38" />
            <rect x="-46" y="-104" width="20" height="28" fill="#558b2f" />
            <rect x="26" y="-104" width="20" height="28" fill="#558b2f" />
            <rect x="-34" y="-116" width="18" height="14" fill="#7cb342" />
            <rect x="10" y="-140" width="16" height="12" fill="#7cb342" />
          </g>
        ))}

        {/* 草地方块条带 — 草层 + 泥土层 */}
        <rect y={GRASS_Y} width={W} height={44} fill="#7cb342" />
        <rect y={GRASS_Y} width={W} height="8" fill="#9ccc65" />
        {GRASS_DABS.map((d, i) => (
          <rect key={i} x={d.x} y={d.y} width={d.w} height="8" fill="#689f38" opacity="0.7" />
        ))}
        <rect y={GRASS_Y + 44} width={W} height={H - GRASS_Y - 44} fill="#8d6e63" />
        {DIRT_DABS.map((d, i) => (
          <rect key={i} x={d.x} y={d.y} width={d.w} height="10" fill="#6d4c41" opacity="0.6" />
        ))}

        {/* 方块羊 — 白方块身体 + 灰头 + 短腿，轻微上下颠 */}
        {SHEEP.map((s, i) => (
          <g key={i} transform={`translate(${s.x},${s.y}) scale(${s.s})`} style={{ animation: `px-sheep-bob 3.6s ease-in-out ${s.delay} infinite` }}>
            {/* 腿 */}
            <rect x="4" y="26" width="8" height="14" fill="#424242" />
            <rect x="32" y="26" width="8" height="14" fill="#424242" />
            {/* 身体 */}
            <rect x="0" y="0" width="48" height="30" fill="#f5f5f5" />
            <rect x="4" y="4" width="14" height="10" fill="#ffffff" />
            <rect x="26" y="16" width="12" height="8" fill="#e0e0e0" />
            {/* 头 */}
            <rect x="44" y="4" width="18" height="18" fill="#616161" />
            <rect x="58" y="10" width="4" height="6" fill="#212121" />
          </g>
        ))}
      </svg>
    </div>
  );
}
