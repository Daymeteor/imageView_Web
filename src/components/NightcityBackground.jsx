/**
 * NightcityBackground — 夜之城（霓虹雨夜）动态背景
 * 城市夜空 + 两侧霓虹招牌柱闪烁 + 三层斜雨 + 全息面板 glitch
 * + 街道霓虹反光 + 车灯拖尾掠过
 * 纯 CSS 动画，无 JS 定时器
 */

const NEON = {
  magenta: '#ff0055',
  cyan: '#00f0ff',
  purple: '#7b2fbe',
};

/* 两侧霓虹招牌柱：竖条与方块，各自闪烁相位不同 */
const SIGNS_LEFT = [
  { top: '6%', height: '13%', width: 10, color: NEON.magenta, duration: '5.2s', delay: '0s' },
  { top: '23%', height: '7%', width: 16, color: NEON.cyan, duration: '7.1s', delay: '1.3s' },
  { top: '34%', height: '16%', width: 8, color: NEON.purple, duration: '6.3s', delay: '2.1s' },
  { top: '55%', height: '9%', width: 14, color: NEON.magenta, duration: '4.6s', delay: '0.7s' },
  { top: '69%', height: '12%', width: 9, color: NEON.cyan, duration: '8s', delay: '3s' },
];

const SIGNS_RIGHT = [
  { top: '10%', height: '9%', width: 14, color: NEON.cyan, duration: '6.8s', delay: '0.4s' },
  { top: '24%', height: '15%', width: 9, color: NEON.magenta, duration: '5.5s', delay: '1.8s' },
  { top: '44%', height: '8%', width: 15, color: NEON.purple, duration: '7.6s', delay: '0.9s' },
  { top: '58%', height: '12%', width: 10, color: NEON.cyan, duration: '4.9s', delay: '2.6s' },
  { top: '75%', height: '8%', width: 13, color: NEON.magenta, duration: '6.1s', delay: '1.1s' },
];

function SignColumn({ signs, side }) {
  return signs.map((s, i) => (
    <div
      key={`${side}-${i}`}
      className="absolute"
      style={{
        [side]: '2.5%',
        top: s.top,
        width: s.width,
        height: s.height,
        background: s.color,
        opacity: 0.85,
        boxShadow: `0 0 12px ${s.color}, 0 0 32px ${s.color}66`,
        animation: `nc-flicker ${s.duration} linear ${s.delay} infinite`,
      }}
    />
  ));
}

export default function NightcityBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
      style={{
        background:
          'linear-gradient(180deg, #04060d 0%, #0a0e1a 55%, #0d1226 100%)',
      }}
    >
      {/* 远处楼群剪影 — 天际线 */}
      <div
        className="absolute bottom-[16%] left-0 right-0 h-[26%]"
        style={{
          background: '#060a14',
          clipPath:
            'polygon(0 100%, 0 55%, 4% 55%, 4% 38%, 9% 38%, 9% 62%, 14% 62%, 14% 30%, 18% 30%, 18% 48%, 24% 48%, 24% 20%, 29% 20%, 29% 45%, 35% 45%, 35% 60%, 41% 60%, 41% 34%, 47% 34%, 47% 52%, 53% 52%, 53% 26%, 59% 26%, 59% 58%, 65% 58%, 65% 40%, 71% 40%, 71% 64%, 77% 64%, 77% 32%, 83% 32%, 83% 50%, 89% 50%, 89% 42%, 94% 42%, 94% 58%, 100% 58%, 100% 100%)',
        }}
      />

      {/* 两侧霓虹招牌柱 */}
      <SignColumn signs={SIGNS_LEFT} side="left" />
      <SignColumn signs={SIGNS_RIGHT} side="right" />

      {/* 远处全息面板 — 周期性 glitch 闪 */}
      <div
        className="absolute left-[30%] top-[18%] h-[14%] w-[16%] border"
        style={{
          borderColor: 'rgba(0, 240, 255, 0.35)',
          background:
            'linear-gradient(135deg, rgba(0, 240, 255, 0.08), rgba(123, 47, 190, 0.1))',
          boxShadow: '0 0 24px rgba(0, 240, 255, 0.12)',
          animation: 'nc-holo-glitch 9s linear infinite',
        }}
      />
      <div
        className="absolute right-[26%] top-[42%] h-[10%] w-[11%] border"
        style={{
          borderColor: 'rgba(255, 0, 85, 0.3)',
          background:
            'linear-gradient(135deg, rgba(255, 0, 85, 0.07), rgba(123, 47, 190, 0.08))',
          boxShadow: '0 0 20px rgba(255, 0, 85, 0.1)',
          animation: 'nc-holo-glitch 12s linear 4s infinite',
        }}
      />

      {/* 斜雨 — 三层不同密度/速度（竖纹层旋转成斜雨，沿条纹方向无缝 loop） */}
      <div
        className="absolute -inset-[15%]"
        style={{
          background:
            'repeating-linear-gradient(90deg, transparent 0, transparent 13px, rgba(190, 240, 255, 0.14) 13px, rgba(190, 240, 255, 0.14) 14px)',
          animation: 'nc-rain-a 0.5s linear infinite',
        }}
      />
      <div
        className="absolute -inset-[15%]"
        style={{
          background:
            'repeating-linear-gradient(90deg, transparent 0, transparent 21px, rgba(160, 230, 255, 0.09) 21px, rgba(160, 230, 255, 0.09) 22px)',
          animation: 'nc-rain-b 0.8s linear infinite',
        }}
      />
      <div
        className="absolute -inset-[15%]"
        style={{
          background:
            'repeating-linear-gradient(90deg, transparent 0, transparent 9px, rgba(210, 245, 255, 0.07) 9px, rgba(210, 245, 255, 0.07) 10px)',
          animation: 'nc-rain-c 0.35s linear infinite',
        }}
      />

      {/* 底部街道 — 霓虹模糊倒影条 */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[16%]"
        style={{
          background:
            'repeating-linear-gradient(90deg, rgba(255, 0, 85, 0.14) 0, rgba(255, 0, 85, 0.14) 60px, transparent 60px, transparent 130px, rgba(0, 240, 255, 0.12) 130px, rgba(0, 240, 255, 0.12) 200px, transparent 200px, transparent 260px, rgba(123, 47, 190, 0.12) 260px, rgba(123, 47, 190, 0.12) 320px, transparent 320px, transparent 400px)',
          filter: 'blur(10px)',
          maskImage: 'linear-gradient(180deg, transparent 0%, black 60%)',
          WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, black 60%)',
          animation: 'nc-street-shimmer 6s ease-in-out infinite',
        }}
      />

      {/* 车灯拖尾 — 白灯左行 / 红灯右行，偶尔掠过 */}
      <div
        className="absolute left-0 top-[78%] h-[2px] w-[24vw]"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(240, 248, 255, 0.7) 60%, rgba(240, 248, 255, 0.9))',
          filter: 'blur(1px)',
          animation: 'nc-trail-ltr 11s linear 2s infinite',
        }}
      />
      <div
        className="absolute left-0 top-[85%] h-[2px] w-[20vw]"
        style={{
          background:
            'linear-gradient(90deg, rgba(255, 30, 60, 0.85), rgba(255, 30, 60, 0.5) 40%, transparent)',
          filter: 'blur(1px)',
          animation: 'nc-trail-rtl 14s linear 6s infinite',
        }}
      />

      {/* 暗角 — 收拢视线 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0, 0, 0, 0.55) 100%)',
        }}
      />
    </div>
  );
}
