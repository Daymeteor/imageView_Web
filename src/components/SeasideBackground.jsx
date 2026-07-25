import { useEffect, useState } from 'react';

/**
 * SeasideBackground — 蓝调时刻 · 三分构图（天空/海洋/沙滩）
 * 太阳从页面顶端斜斜落下、沉入海平线；余晖散尽进入蓝调时刻，
 * 月亮再从上方出来缓缓下沉，星星点亮。
 * 电影感柔光（《燃烧》/《无依之地》），rAF 丝滑驱动。
 */

const T = 60000;
const HORIZON = 0.58; // 海平线：天空 58% / 海洋 58–76% / 沙滩 76–100%

// 以蓝调时刻为主情绪的调色板
const STOPS = [
  { p: 0.0, top: '#ffc98e', mid: '#ff9d7e', hor: '#ff8a6a', sea: '#6a8fbe', sand: '#eed8b4' },
  { p: 0.36, top: '#d88aa8', mid: '#ee8f96', hor: '#ff9a70', sea: '#5a7cae', sand: '#e8d0aa' },
  { p: 0.52, top: '#6a5a9e', mid: '#9a7ab0', hor: '#d88a90', sea: '#42639e', sand: '#d8c4a0' },
  { p: 0.68, top: '#2e3a6e', mid: '#46548e', hor: '#6a6a9e', sea: '#2a4a80', sand: '#c2b294' },
  { p: 0.85, top: '#141c40', mid: '#22305c', hor: '#33436e', sea: '#16294e', sand: '#a4927a' },
  { p: 1.0, top: '#ffc98e', mid: '#ff9d7e', hor: '#ff8a6a', sea: '#6a8fbe', sand: '#eed8b4' },
];

function hexLerp(a, b, t) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `#${pa.map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, '0')).join('')}`;
}

function paletteAt(p) {
  for (let i = 0; i < STOPS.length - 1; i++) {
    const s0 = STOPS[i];
    const s1 = STOPS[i + 1];
    if (p >= s0.p && p <= s1.p) {
      const t = (p - s0.p) / (s1.p - s0.p);
      return {
        top: hexLerp(s0.top, s1.top, t),
        mid: hexLerp(s0.mid, s1.mid, t),
        hor: hexLerp(s0.hor, s1.hor, t),
        sea: hexLerp(s0.sea, s1.sea, t),
        sand: hexLerp(s0.sand, s1.sand, t),
      };
    }
  }
  return STOPS[0];
}

const ramp = (v, a, b) => Math.min(1, Math.max(0, (v - a) / (b - a)));
const lerp = (a, b, t) => a + (b - a) * t;

const STARS = Array.from({ length: 24 }, (_, i) => ({
  x: 3 + ((i * 41.3) % 94),
  y: 2 + ((i * 27.1) % 36),
  r: 1 + (i % 3) * 0.6,
  d: `${(i % 5) * 0.7}s`,
  dur: `${2.4 + (i % 4) * 0.9}s`,
}));

function wavePath(y, amp, len, count, bottom) {
  let d = `M0,${y}`;
  for (let i = 0; i < count; i++) d += ` q${len / 4},${-amp} ${len / 2},0 t${len / 2},0`;
  d += ` L${len * count},${bottom} L0,${bottom} Z`;
  return d;
}

export default function SeasideBackground() {
  const [now, setNow] = useState(0);

  useEffect(() => {
    let raf;
    const tick = (t) => {
      setNow(t);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const p = (now % T) / T;
  const pal = paletteAt(p);

  // 太阳：从页面顶端斜斜落下，沉到海平线下（前 45% 周期）
  const sunU = Math.min(p / 0.45, 1);
  const sunVis = p < 0.45 ? 1 - ramp(sunU, 0.9, 1) : 0;
  const sun = { x: lerp(0.38, 0.62, sunU), y: lerp(-0.07, HORIZON + 0.07, sunU) };
  const sunLow = ramp(sunU, 0.5, 0.95); // 接近海平线 → 染色增强

  // 月亮：蓝调后从上方出来，缓缓下沉（60% 周期起）
  const moonU = Math.min(Math.max((p - 0.6) / 0.4, 0), 1);
  const moonVis = p >= 0.6 ? ramp(moonU, 0, 0.08) * (1 - ramp(moonU, 0.94, 1)) : 0;
  const moon = { x: lerp(0.6, 0.42, moonU), y: lerp(-0.06, HORIZON + 0.05, moonU) };

  const starVis = ramp(p, 0.52, 0.66) * (1 - ramp(p, 0.94, 1));
  const seaDark = hexLerp(pal.sea, '#0c1e3c', 0.4);

  // 海鸥：只在落日段远远掠过
  const gullVis = 1 - ramp(p, 0.3, 0.44);
  const g1x = (((now / 30000) % 1.3) - 0.15) * 1440;
  const g1y = 190 + Math.sin(now / 1600) * 12;
  const flap = Math.floor(now / 320) % 2;
  const gullPath = flap ? 'M0,10 Q9,0 18,10 Q27,0 36,10' : 'M0,4 Q9,10 18,4 Q27,10 36,4';

  const W = 1440;
  const H = 900;
  const hz = HORIZON * H;
  const sandY = H * 0.76;
  const shimmer = 0.82 + 0.18 * Math.sin(now / 1100);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <svg className="h-full w-full" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="ss-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={pal.top} />
            <stop offset="60%" stopColor={pal.mid} />
            <stop offset="95%" stopColor={pal.hor} />
          </linearGradient>
          <radialGradient id="ss-suncore">
            <stop offset="0%" stopColor="#fff6d8" />
            <stop offset="42%" stopColor="#ffd93d" />
            <stop offset="100%" stopColor="#ffd93d" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ss-sunhaze">
            <stop offset="0%" stopColor="#ffab5e" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ffab5e" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ss-mooncore">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#f5f0dc" />
            <stop offset="100%" stopColor="#f5f0dc" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ss-lightpath" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffd93d" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#ffd93d" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ss-moonpath" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#dce8ff" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#dce8ff" stopOpacity="0" />
          </linearGradient>
          <filter id="ss-haze" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
        </defs>

        {/* 天空（58%） */}
        <rect width={W} height={H} fill="url(#ss-sky)" />

        {/* 太阳的大气透光 */}
        <circle cx={sun.x * W} cy={sun.y * H} r="400" fill="url(#ss-sunhaze)" opacity={sunVis} />

        {/* 星星 — 蓝调时刻点亮 */}
        <g opacity={starVis}>
          {STARS.map((s, i) => (
            <circle
              key={i}
              cx={(s.x / 100) * W}
              cy={(s.y / 100) * H}
              r={s.r}
              fill="#fff8e8"
              style={{ animation: `ss-twinkle ${s.dur} ease-in-out ${s.d} infinite` }}
            />
          ))}
        </g>

        {/* 太阳 — 从顶端斜落，低垂时更大更霾 */}
        <g opacity={sunVis}>
          <circle cx={sun.x * W} cy={sun.y * H} r={140 + sunLow * 70} fill="url(#ss-sunhaze)" />
          <circle cx={sun.x * W} cy={sun.y * H} r={54 + sunLow * 18} fill="url(#ss-suncore)" />
        </g>

        {/* 月亮 — 蓝调后从上方出来 */}
        <g opacity={moonVis}>
          <circle cx={moon.x * W} cy={moon.y * H} r="120" fill="url(#ss-mooncore)" opacity="0.5" />
          <circle cx={moon.x * W} cy={moon.y * H} r="50" fill="url(#ss-mooncore)" />
        </g>

        {/* 海洋（58–76%） */}
        <rect y={hz} width={W} height={sandY - hz} fill={pal.sea} />

        {/* 落日烧地平线 + 海面光路 */}
        <ellipse cx={sun.x * W} cy={hz} rx="500" ry="70" fill="#ff9e5e" opacity={sunVis * sunLow * 0.42} filter="url(#ss-haze)" />
        <rect x={sun.x * W - 44} y={hz} width="88" height={sandY - hz} fill="url(#ss-lightpath)" opacity={sunVis * shimmer} filter="url(#ss-haze)" />
        <rect x={moon.x * W - 32} y={hz} width="64" height={sandY - hz} fill="url(#ss-moonpath)" opacity={moonVis * shimmer} filter="url(#ss-haze)" />

        {/* 两层剪影浪 */}
        <g style={{ animation: 'ss-wave-far 24s linear infinite' }} filter="url(#ss-haze)">
          <path d={wavePath(hz + 30, 12, 360, 5, sandY)} fill={seaDark} opacity="0.4" />
        </g>
        <g style={{ animation: 'ss-wave-near 12s linear infinite' }}>
          <path d={wavePath(sandY - 34, 16, 480, 4, sandY + 10)} fill={hexLerp(pal.sea, '#ffffff', 0.2)} opacity="0.85" />
        </g>

        {/* 沙滩（76–100%）+ 泡沫线 */}
        <rect y={sandY} width={W} height={H - sandY} fill={pal.sand} />
        <path
          d={`M0,${sandY} Q180,${sandY - 10} 360,${sandY} T720,${sandY} T1080,${sandY} T1440,${sandY} L1440,${sandY + 12} Q1260,${sandY + 2} 1080,${sandY + 12} T720,${sandY + 12} T360,${sandY + 12} T0,${sandY + 12} Z`}
          fill="#ffffff"
          opacity="0.5"
        />

        {/* 海鸥 */}
        <g opacity={gullVis * 0.8} stroke="#3a4a66" strokeWidth="3" strokeLinecap="round" fill="none">
          <path d={gullPath} transform={`translate(${g1x},${g1y})`} />
        </g>

        {/* 全场景色温联动 */}
        <rect width={W} height={H} fill="#ff9e5e" opacity={sunVis * sunLow * 0.1} />
        <rect width={W} height={H} fill="#16224a" opacity={ramp(p, 0.55, 0.75) * 0.14} />
      </svg>
    </div>
  );
}
