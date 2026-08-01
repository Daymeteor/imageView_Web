/**
 * DeantingBackground — 奶油纸底 + 蓝红拼贴色块错位漂浮 + 细噪点
 * 神经志式拼贴：两色块、细双线、圆点贴纸，全部缓慢漂移
 */

export default function DeantingBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="dt-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>

        {/* 奶油纸底 */}
        <rect width="1440" height="900" fill="#f4ead8" />

        {/* 复古蓝大色块（左上） */}
        <g style={{ animation: 'dt-drift-a 13s ease-in-out infinite' }}>
          <rect x="120" y="110" width="430" height="300" fill="rgba(58,90,138,0.09)" />
          <rect x="150" y="140" width="430" height="300" fill="none" stroke="rgba(58,90,138,0.16)" strokeWidth="1.5" />
        </g>

        {/* 复古红大色块（右下） */}
        <g style={{ animation: 'dt-drift-b 16s ease-in-out -4s infinite' }}>
          <rect x="880" y="470" width="400" height="270" fill="rgba(192,58,58,0.08)" />
          <rect x="852" y="442" width="400" height="270" fill="none" stroke="rgba(192,58,58,0.14)" strokeWidth="1.5" />
        </g>

        {/* 小色块拼贴 */}
        <g style={{ animation: 'dt-drift-c 11s ease-in-out -2s infinite' }}>
          <rect x="1080" y="120" width="150" height="110" fill="rgba(58,90,138,0.12)" />
          <rect x="1052" y="148" width="46" height="46" fill="rgba(192,58,58,0.14)" />
        </g>
        <g style={{ animation: 'dt-drift-a 15s ease-in-out -7s infinite' }}>
          <rect x="240" y="620" width="170" height="120" fill="rgba(192,58,58,0.1)" />
          <rect x="392" y="600" width="40" height="40" fill="rgba(58,90,138,0.12)" />
        </g>

        {/* 复古蓝红双线装饰 */}
        <g>
          <line x1="0" y1="72" x2="1440" y2="72" stroke="rgba(58,90,138,0.2)" strokeWidth="2" />
          <line x1="0" y1="79" x2="1440" y2="79" stroke="rgba(192,58,58,0.16)" strokeWidth="1" />
          <line x1="0" y1="836" x2="1440" y2="836" stroke="rgba(192,58,58,0.16)" strokeWidth="1" />
          <line x1="0" y1="843" x2="1440" y2="843" stroke="rgba(58,90,138,0.2)" strokeWidth="2" />
        </g>

        {/* 圆点贴纸 */}
        {[
          [700, 180, 'rgba(192,58,58,0.2)'],
          [760, 210, 'rgba(58,90,138,0.22)'],
          [660, 720, 'rgba(58,90,138,0.18)'],
          [1230, 620, 'rgba(192,58,58,0.18)'],
          [80, 480, 'rgba(58,90,138,0.16)'],
        ].map(([cx, cy, fill], i) => (
          <circle key={i} cx={cx} cy={cy} r={6 + (i % 3) * 3} fill={fill}
            style={{ animation: `dt-drift-c ${10 + i * 1.6}s ease-in-out ${-i * 2.2}s infinite` }} />
        ))}

        {/* 细噪点 */}
        <rect width="1440" height="900" filter="url(#dt-noise)" opacity="0.05" />
      </svg>
    </div>
  );
}
