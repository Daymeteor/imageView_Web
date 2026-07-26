/**
 * ShanhaijingBackground — 青绿山水层叠 + 祥云 + 仙鹤 + 泥金淡日
 */

/** 如意祥云 */
function Cloud({ y, dur, delay, s = 1, opacity = 0.8 }) {
  return (
    <g transform={`translate(0,${y}) scale(${s})`} opacity={opacity}
      style={{ animation: `shj-cloud ${dur} linear ${delay} infinite` }}>
      <path
        d="M-80,0 q20,-26 46,-18 q6,-20 30,-16 q22,4 22,22 q24,-6 30,12 q4,14 -14,16 l-114,0 q-12,-8 0,-16Z"
        fill="#ffffff"
        stroke="rgba(46,125,50,0.18)"
        strokeWidth="1.5"
      />
    </g>
  );
}

/** 仙鹤（飞鹤剪影） */
function Crane({ top, dur, delay }) {
  return (
    <g style={{ animation: `shj-crane ${dur} linear ${delay} infinite`, top }}>
      <g transform={`translate(0,${top})`} style={{ animation: 'shj-flap 0.9s ease-in-out infinite', transformOrigin: 'center' }}>
        <path d="M0,10 Q14,-6 28,8 Q42,-8 56,6 L46,12 Q38,4 28,14 Q18,4 10,14Z" fill="#1A1A1A" opacity="0.75" />
        <circle cx="30" cy="9" r="2.5" fill="#C62828" opacity="0.8" />
      </g>
    </g>
  );
}

export default function ShanhaijingBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <rect width="1440" height="900" fill="#F5F0E1" />

        {/* 泥金淡日 */}
        <circle cx="1180" cy="150" r="52" fill="#F9A825" opacity="0.35" />
        <circle cx="1180" cy="150" r="34" fill="#F9A825" opacity="0.5" />

        {/* 青绿山水：四层由远及近 */}
        <path d="M0,520 L180,380 L320,480 L480,340 L640,470 L820,360 L1000,480 L1180,390 L1440,510 L1440,900 L0,900Z" fill="#a8d0ab" opacity="0.55" />
        <path d="M0,600 L160,480 L340,580 L520,460 L700,570 L900,470 L1120,580 L1300,500 L1440,570 L1440,900 L0,900Z" fill="#4c9a52" opacity="0.5" />
        <path d="M0,700 L200,580 L400,680 L620,570 L840,690 L1080,590 L1300,690 L1440,620 L1440,900 L0,900Z" fill="#2E7D32" opacity="0.55" />
        <path d="M0,800 L240,700 L480,790 L720,690 L980,800 L1240,720 L1440,790 L1440,900 L0,900Z" fill="#1a4a1e" opacity="0.6" />

        {/* 水纹 */}
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${120 + i * 380},${830 + i * 12} q40,-8 80,0 t80,0`} stroke="rgba(46,125,50,0.3)" strokeWidth="1.5" fill="none" />
        ))}

        {/* 祥云 */}
        <Cloud y={200} s={1.2} dur="52s" delay="0s" opacity={0.85} />
        <Cloud y={320} s={0.85} dur="64s" delay="-26s" opacity={0.7} />
        <Cloud y={130} s={0.7} dur="58s" delay="-44s" opacity={0.6} />

        {/* 仙鹤两只 */}
        <Crane top={240} dur="34s" delay="-6s" />
        <Crane top={360} dur="44s" delay="-28s" />
      </svg>
    </div>
  );
}
