/**
 * GrandbudapestBackground — 韦斯·安德森式严格对称的酒店立面
 * 粉紫主楼 + 对称暖窗 + 月牙 + 对称阶梯
 */

// 立面对称窗户：5 层 × 8 列（含中轴），明暗交错呼吸
const FLOORS = [0, 1, 2, 3, 4];
const COLS = [-3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5];

export default function GrandbudapestBackground() {
  const bx = 720; // 中轴
  const top = 130;
  const w = 560;
  const h = 560;
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="gb-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8c8e0" />
            <stop offset="100%" stopColor="#f3dce8" />
          </linearGradient>
          <linearGradient id="gb-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8a4c4" />
            <stop offset="100%" stopColor="#d88ab4" />
          </linearGradient>
        </defs>

        <rect width="1440" height="900" fill="url(#gb-sky)" />

        {/* 月牙（月升王国式） */}
        <g style={{ animation: 'gb-moon 7s ease-in-out infinite' }}>
          <circle cx="720" cy="72" r="26" fill="#fdf1f6" />
          <circle cx="730" cy="66" r="22" fill="#e8c8e0" />
        </g>

        {/* 酒店主楼（严格中轴对称） */}
        <g>
          {/* 屋顶 */}
          <rect x={bx - w / 2 + 60} y={top - 34} width={w - 120} height="34" fill="#C62828" />
          <rect x={bx - 30} y={top - 62} width="60" height="28" fill="#C62828" />
          <circle cx={bx} cy={top - 62} r="8" fill="#D4A373" />
          {/* 主立面 */}
          <rect x={bx - w / 2} y={top} width={w} height={h} fill="url(#gb-wall)" />
          <rect x={bx - w / 2} y={top} width={w} height="14" fill="#D4A373" />
          {/* 中轴装饰线 */}
          <line x1={bx} y1={top} x2={bx} y2={top + h} stroke="rgba(110,74,90,0.25)" strokeWidth="2" />
          {/* 对称窗户：交错明灭 */}
          {FLOORS.map((f) =>
            COLS.map((c, ci) => (
              <rect
                key={`${f}-${c}`}
                x={bx + c * 64 - 14}
                y={top + 56 + f * 92}
                width="28"
                height="42"
                fill="#ffe9b8"
                stroke="rgba(110,74,90,0.35)"
                strokeWidth="2"
                style={{
                  animation: `gb-window ${4 + ((f + ci) % 4)}s ease-in-out ${((f * 3 + ci) % 5) * 0.8}s infinite`,
                }}
              />
            ))
          )}
          {/* 大门 */}
          <rect x={bx - 34} y={top + h - 86} width="68" height="86" fill="#6e1515" />
          <rect x={bx - 46} y={top + h - 96} width="92" height="12" fill="#D4A373" />
        </g>

        {/* 对称阶梯 */}
        {[0, 1, 2].map((i) => (
          <rect
            key={i}
            x={bx - w / 2 - 40 - i * 40}
            y={top + h + i * 18}
            width={w + 80 + i * 80}
            height="18"
            fill={i % 2 ? '#e8a4c4' : '#d88ab4'}
          />
        ))}

        {/* 两侧对称灌木 */}
        {[-1, 1].map((s) => (
          <g key={s}>
            <rect x={bx + s * (w / 2 + 90) - 10} y={top + h - 60} width="20" height="60" fill="#8a6a45" />
            <ellipse cx={bx + s * (w / 2 + 90)} cy={top + h - 78} rx="34" ry="42" fill="#7a9a6a" />
          </g>
        ))}
      </svg>
    </div>
  );
}
