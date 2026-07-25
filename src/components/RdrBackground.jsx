/**
 * RdrBackground — 荒野大镖客 黄昏峡谷背景
 * 橙紫渐变天 + 低垂落日 + 三层台地剪影 + 仙人掌
 * 风滚草周期性滚过底部，秃鹫高空盘旋
 * 纯 CSS 动画，无 JS 驱动
 */
export default function RdrBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* 黄昏天空 — 橙到紫棕的垂直渐变 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #241019 0%, #4a1f1a 28%, #8a3d1e 46%, #d9712a 58%, #e8923f 64%, #6b3a22 76%, #1a0f0a 92%)',
        }}
      />

      {/* 低垂落日 — 压在地平线上的柔光圆盘 */}
      <div
        className="absolute left-1/2 top-[56%] h-[26vmin] w-[26vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle, #ffd9a0 0%, #f5a74e 38%, rgba(230,126,34,0.55) 62%, transparent 72%)',
          animation: 'rdr-sun-breathe 9s ease-in-out infinite',
        }}
      />
      {/* 落日光晕 */}
      <div
        className="absolute left-1/2 top-[56%] h-[70vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(ellipse, rgba(230,126,34,0.2) 0%, rgba(230,126,34,0.06) 45%, transparent 70%)',
        }}
      />

      {/* 峡谷台地 — 三层剪影，由远及近加深 */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* 远山（最浅，被夕阳照亮一点） */}
        <path
          fill="#5a2d18"
          opacity="0.75"
          d="M0 620 L120 600 L200 560 L260 560 L300 596 L420 584 L480 540 L560 540 L600 580 L700 572 L760 596 L880 588 L940 552 L1020 552 L1060 590 L1200 578 L1260 540 L1340 540 L1380 576 L1440 568 L1440 900 L0 900 Z"
        />
        {/* 中层台地 — 平顶孤峰 */}
        <path
          fill="#38200f"
          opacity="0.9"
          d="M0 690 L90 676 L140 630 L260 630 L300 668 L430 656 L470 620 L470 600 L560 600 L560 622 L640 646 L760 638 L820 668 L950 658 L1000 616 L1120 616 L1160 652 L1280 644 L1330 668 L1440 660 L1440 900 L0 900 Z"
        />
        {/* 近景地面 + 平顶山 */}
        <path
          fill="#1c0f07"
          d="M0 780 L160 764 L220 720 L340 720 L380 756 L520 748 L580 772 L720 764 L800 786 L960 776 L1040 742 L1040 712 L1150 712 L1150 744 L1260 760 L1440 752 L1440 900 L0 900 Z"
        />
        {/* 仙人掌剪影 — 两株 saguaro */}
        <path
          fill="#140a05"
          d="M176 780 h14 v-58 a8 8 0 0 0 -16 0 z M170 744 v-18 a6 6 0 0 1 12 0 v10 M188 752 v-24 a6 6 0 0 1 12 0 v14 h-12"
        />
        <path
          fill="#140a05"
          d="M1252 800 h16 v-70 a9 9 0 0 0 -18 0 z M1244 762 v-22 a7 7 0 0 1 14 0 v12 M1268 772 v-28 a7 7 0 0 1 14 0 v18 h-14"
        />
      </svg>

      {/* 秃鹫 — 高空盘旋（外圈公转，剪影反向自转保持姿态） */}
      {[
        { left: '28%', top: '15%', radius: 90, dur: '26s', rev: false, scale: 1 },
        { left: '64%', top: '11%', radius: 70, dur: '34s', rev: true, scale: 0.75 },
      ].map((v, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: v.left,
            top: v.top,
            animation: `rdr-vulture-orbit ${v.dur} linear infinite ${v.rev ? 'reverse' : ''}`,
          }}
        >
          <div
            style={{
              transform: `translateX(${v.radius}px) scale(${v.scale})`,
            }}
          >
            <svg
              width="46"
              height="16"
              viewBox="0 0 46 16"
              style={{
                display: 'block',
                animation: `rdr-vulture-orbit-rev ${v.dur} linear infinite ${v.rev ? 'reverse' : ''}`,
              }}
            >
              {/* 展翅剪影 — 宽 M 形 */}
              <path
                fill="#170c06"
                d="M0 10 Q8 2 16 7 Q21 10 23 10 Q25 10 30 7 Q38 2 46 10 Q38 7 30 10 Q25 12 23 12 Q21 12 16 10 Q8 7 0 10 Z"
              />
            </svg>
          </div>
        </div>
      ))}

      {/* 风滚草 — 周期性从画面底部滚过（外层平移，内层滚动） */}
      <div
        className="absolute bottom-[4%] left-0"
        style={{ animation: 'rdr-tumbleweed-x 19s linear 3s infinite' }}
      >
        <svg
          width="54"
          height="54"
          viewBox="0 0 54 54"
          style={{ display: 'block', animation: 'rdr-tumbleweed-roll 4.2s linear infinite' }}
        >
          <g stroke="#2e1c10" strokeWidth="1.6" opacity="0.85">
            <circle cx="27" cy="27" r="22" fill="rgba(46,28,16,0.25)" />
            {Array.from({ length: 12 }).map((_, i) => {
              const a = (i * Math.PI) / 6;
              return (
                <line
                  key={i}
                  x1={27 + Math.cos(a) * 6}
                  y1={27 + Math.sin(a) * 6}
                  x2={27 + Math.cos(a + 0.35) * 22}
                  y2={27 + Math.sin(a + 0.35) * 22}
                />
              );
            })}
            <circle cx="27" cy="27" r="6" fill="none" />
          </g>
        </svg>
      </div>

      {/* 暗角 — 收拢视线，老照片的暗边 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 46%, transparent 52%, rgba(16,8,4,0.62) 100%)',
        }}
      />
    </div>
  );
}
