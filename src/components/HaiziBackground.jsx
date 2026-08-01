/**
 * HaiziBackground — 诗与麦浪
 * 纸米天空 + 低垂太阳（呼吸柔光）+ 远处海平线微光
 * + 三层麦穗剪影波浪起伏（纯 CSS 动画，错相反向轻荡）
 */

/** 确定性伪随机，避免每次渲染抖动 */
function seeded(i, salt = 0) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/** 正弦波基线 */
const waveY = (x, base, amp, freq, phase) =>
  base + amp * Math.sin(x * freq + phase);

/** 由波函数生成一条铺满底部的波浪剪影路径 */
function wavePath(base, amp, freq, phase) {
  let d = `M-60,900 L-60,${waveY(-60, base, amp, freq, phase).toFixed(1)}`;
  for (let x = -60; x <= 1500; x += 30) {
    d += ` L${x},${waveY(x, base, amp, freq, phase).toFixed(1)}`;
  }
  return `${d} L1500,900 Z`;
}

/** 沿波基线撒一排麦穗（<use> 引用 defs 里的单株形状） */
function wheatRow(base, amp, freq, phase, step, salt) {
  const stalks = [];
  for (let x = -30, n = 0; x <= 1480; x += step, n += 1) {
    const jx = x + (seeded(n, salt) - 0.5) * step * 0.7;
    const y = waveY(jx, base, amp, freq, phase) + 3;
    const s = 0.75 + seeded(n, salt + 1) * 0.5;
    const r = (seeded(n, salt + 2) - 0.5) * 10;
    stalks.push(
      <use
        key={n}
        href="#hz-stalk"
        transform={`translate(${jx.toFixed(1)},${y.toFixed(1)}) scale(${s.toFixed(2)}) rotate(${r.toFixed(1)})`}
      />
    );
  }
  return stalks;
}

export default function HaiziBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="hz-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f8f2e2" />
            <stop offset="55%" stopColor="#f5efe0" />
            <stop offset="100%" stopColor="#efe3c6" />
          </linearGradient>
          {/* 单株麦穗：茎 + 芒 */}
          <g id="hz-stalk" fill="none" strokeLinecap="round">
            <path d="M0,0 C1,-14 -1,-30 0,-46" strokeWidth="2.2" />
            <path d="M0,-44 l-6,-8 M0,-44 l6,-8 M0,-47 l-7,-6 M0,-47 l7,-6 M0,-49 l-5,-8 M0,-49 l5,-8 M0,-51 l0,-10" strokeWidth="1.7" />
          </g>
        </defs>

        {/* 纸米天空 */}
        <rect width="1440" height="900" fill="url(#hz-sky)" />

        {/* 低垂太阳 — 柔光圆盘 */}
        <g style={{ animation: 'hz-sun 9s ease-in-out infinite' }}>
          <circle cx="1060" cy="252" r="170" fill="rgba(232,131,74,0.10)" />
          <circle cx="1060" cy="252" r="118" fill="rgba(232,131,74,0.14)" />
          <circle cx="1060" cy="252" r="72" fill="rgba(242,160,110,0.5)" />
          <circle cx="1060" cy="252" r="52" fill="#e8834a" opacity="0.85" />
        </g>

        {/* 远处海平线微光 */}
        <g>
          <rect x="0" y="552" width="1440" height="26" fill="rgba(255,248,224,0.35)" />
          <line x1="0" y1="556" x2="1440" y2="556" stroke="rgba(255,250,230,0.8)" strokeWidth="2"
            style={{ animation: 'hz-shimmer 6s ease-in-out infinite' }} />
          <line x1="180" y1="566" x2="1260" y2="566" stroke="rgba(255,244,210,0.6)" strokeWidth="1.4"
            style={{ animation: 'hz-shimmer 7.5s ease-in-out -2s infinite' }} />
          <line x1="420" y1="575" x2="1020" y2="575" stroke="rgba(255,244,210,0.5)" strokeWidth="1.2"
            style={{ animation: 'hz-shimmer 5.2s ease-in-out -3.6s infinite' }} />
        </g>

        {/* 麦浪 · 远层（最浅） */}
        <g style={{ animation: 'hz-sway 11s ease-in-out infinite' }}>
          <path d={wavePath(620, 14, 0.006, 0.8)} fill="#e8d9ae" />
          <g stroke="#cbb47e">{wheatRow(620, 14, 0.006, 0.8, 34, 1)}</g>
        </g>

        {/* 麦浪 · 中层 */}
        <g style={{ animation: 'hz-sway-f 8.5s ease-in-out -1.4s infinite' }}>
          <path d={wavePath(724, 18, 0.005, 2.1)} fill="#d9bc76" />
          <g stroke="#b39444">{wheatRow(724, 18, 0.005, 2.1, 30, 7)}</g>
        </g>

        {/* 麦浪 · 近层（最深） */}
        <g style={{ animation: 'hz-sway 6.8s ease-in-out -3s infinite' }}>
          <path d={wavePath(836, 22, 0.0042, 4.0)} fill="#bd9245" />
          <g stroke="#96702c">{wheatRow(836, 22, 0.0042, 4.0, 26, 13)}</g>
        </g>
      </svg>
    </div>
  );
}
