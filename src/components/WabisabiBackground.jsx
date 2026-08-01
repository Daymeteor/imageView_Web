/**
 * WabisabiBackground — 枯山水波纹 + 竹影 + 纸门透光
 */

export default function WabisabiBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <rect width="1440" height="900" fill="#F5F0E1" />

        {/* 枯山水同心波纹（围绕两块石） */}
        {[0, 1, 2, 3, 4].map((i) => (
          <ellipse key={i} cx="380" cy="620" rx={60 + i * 42} ry={30 + i * 22} fill="none"
            stroke="#b5aa90" strokeWidth="1.5" opacity={0.55 - i * 0.09} />
        ))}
        {[0, 1, 2].map((i) => (
          <ellipse key={i} cx="980" cy="700" rx={50 + i * 36} ry={26 + i * 18} fill="none"
            stroke="#b5aa90" strokeWidth="1.5" opacity={0.45 - i * 0.1} />
        ))}
        {/* 耙纹直线 */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line key={i} x1="100" y1={180 + i * 26} x2="640" y2={180 + i * 26} stroke="#c9bda2" strokeWidth="1.2" opacity="0.5" />
        ))}

        {/* 两块石 */}
        <ellipse cx="380" cy="620" rx="34" ry="20" fill="#6a6a5a" opacity="0.85" />
        <ellipse cx="990" cy="698" rx="24" ry="15" fill="#5a5a4a" opacity="0.8" />

        {/* 竹枝剪影（极轻摇曳） */}
        <g transform="translate(1240,120)" style={{ transformOrigin: '1240px 120px', animation: 'ws-sway 9s ease-in-out infinite' }} opacity="0.35">
          <path d="M0,-60 Q-30,120 -10,360" stroke="#37474F" strokeWidth="5" fill="none" />
          {[-1, 1, -1, 1, -1].map((s, i) => (
            <path key={i} d={`M${-6 - i * 3},${20 + i * 60} q${s * 46},${-18} ${s * 72},${-6}`}
              stroke="#37474F" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          ))}
        </g>

        {/* 纸门透光 */}
        <ellipse cx="300" cy="200" rx="260" ry="160" fill="#ffffff" opacity="0.35" />
      </svg>
    </div>
  );
}
