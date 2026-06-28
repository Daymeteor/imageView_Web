/**
 * CyberBackground — 赛博博物馆背景系统
 * Hermes 暗色玻璃拟态风格
 * - 3 层环境光晕（琥珀暖光 + 冷青微光）
 * - Dither 点阵纹理
 * - 扫描线动画
 */

export default function CyberBackground() {
  return (
    <div className="cbg">
      {/* 环境光晕 */}
      <div className="cbg-glow cbg-glow--tl" />
      <div className="cbg-glow cbg-glow--br" />
      <div className="cbg-glow cbg-glow--ctr" />

      {/* Dither 纹理覆盖层 */}
      <div className="cbg-dither" />

      {/* 扫描线 */}
      <div className="cbg-scan" />

      <style>{`
        .cbg {
          position: fixed; inset: 0; pointer-events: none; z-index: -1;
          background: var(--color-bg-deep, #041c1c);
          overflow: hidden;
        }

        /* --- 环境光晕 --- */
        .cbg-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(120px);
          opacity: 0.18;
        }
        .cbg-glow--tl {
          top: -10%; left: -5%;
          width: 60vw; height: 60vw;
          background: radial-gradient(circle, rgba(255, 172, 2, 0.25) 0%, transparent 60%);
        }
        .cbg-glow--br {
          bottom: -15%; right: -10%;
          width: 50vw; height: 50vw;
          background: radial-gradient(circle, rgba(255, 172, 2, 0.12) 0%, transparent 55%);
        }
        .cbg-glow--ctr {
          top: 40%; left: 30%;
          width: 40vw; height: 40vw;
          background: radial-gradient(circle, rgba(0, 229, 255, 0.05) 0%, transparent 50%);
          opacity: 0.06;
        }

        /* --- Dither 纹理（Hermes conic-gradient 点阵） --- */
        .cbg-dither {
          position: absolute; inset: 0;
          opacity: 0.025;
          background: repeating-conic-gradient(
            var(--color-text-primary, #fff) 0% 25%,
            transparent 0% 50%
          ) 0 0 / 2px 2px;
          mix-blend-mode: overlay;
        }

        /* --- 扫描线 --- */
        .cbg-scan {
          position: absolute; top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 172, 2, 0.2) 30%,
            rgba(255, 172, 2, 0.45) 50%,
            rgba(255, 172, 2, 0.2) 70%,
            transparent 100%
          );
          animation: scan-line 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
