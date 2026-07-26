/**
 * Nineteen84Background — 混凝土巨楼 + 电幕"老大哥在看着你" + 滚动标语
 */

const SLOGAN = '战争即和平 · 自由即奴役 · 无知即力量 · WAR IS PEACE · FREEDOM IS SLAVERY · ';

export default function Nineteen84Background() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <rect width="1440" height="900" fill="#1A1A1A" />

        {/* 粗野主义混凝土楼群 */}
        <g fill="#262626">
          <rect x="0" y="200" width="240" height="700" />
          <rect x="1200" y="160" width="240" height="740" />
          <rect x="300" y="420" width="160" height="480" />
          <rect x="1000" y="460" width="140" height="440" />
        </g>
        {/* 楼体窗格（死寂） */}
        {Array.from({ length: 24 }, (_, i) => (
          <rect key={i} x={20 + (i % 4) * 54 + (i > 11 ? 1200 : 0)} y={230 + Math.floor((i % 12) / 4) * 90} width="30" height="40"
            fill="none" stroke="#333" strokeWidth="2" />
        ))}

        {/* 中央巨大电幕 */}
        <g style={{ animation: 'n84-flicker 6s linear infinite' }}>
          <rect x="470" y="120" width="500" height="270" fill="#ECEFF1" />
          <rect x="470" y="120" width="500" height="270" fill="none" stroke="#455A64" strokeWidth="8" />
          {/* 老大哥的眼 */}
          <circle cx="720" cy="240" r="62" fill="none" stroke="#1A1A1A" strokeWidth="7" />
          <circle cx="720" cy="240" r="24" fill="#1A1A1A" />
          <circle cx="728" cy="232" r="6" fill="#ECEFF1" />
          <text x="720" y="356" textAnchor="middle" fill="#B71C1C" fontSize="34" letterSpacing="6" fontFamily="Courier Prime, monospace" fontWeight="bold">
            BIG BROTHER IS WATCHING YOU
          </text>
        </g>

        {/* 电幕扫描线 */}
        {Array.from({ length: 9 }, (_, i) => (
          <rect key={i} x="470" y={120 + i * 30} width="500" height="2" fill="rgba(26,26,26,0.08)" />
        ))}

        {/* 红色标语撕裂带 */}
        <g transform="translate(0,640)">
          <rect x="-40" y="0" width="1520" height="64" fill="#B71C1C" transform="rotate(-2 720 32)" />
          <g style={{ animation: 'n84-roll 18s linear infinite' }}>
            <text x="0" y="42" fill="#ECEFF1" fontSize="26" letterSpacing="3" fontFamily="Courier Prime, monospace" fontWeight="bold" transform="rotate(-2 720 32)">
              {SLOGAN + SLOGAN}
            </text>
          </g>
        </g>

        {/* 探照灯 */}
        <polygon points="180,900 320,300 400,300" fill="rgba(236,239,241,0.05)" />
        <polygon points="1260,900 1100,260 1020,260" fill="rgba(236,239,241,0.05)" />
      </svg>
    </div>
  );
}
