import { useMemo } from 'react';

/**
 * LightBeam — 穿林光束
 * 多层叠加，响应鼠标微调 + 滚动视差
 */

const BEAM_CONFIGS = [
  { width: 70,  skew: -12, top: '3%',  left: '-5%', opacity: 0.10, blur: 70,  delay: 0 },
  { width: 110, skew: -14, top: '12%', left: '-3%', opacity: 0.07, blur: 100, delay: 2.5 },
  { width: 50,  skew: -10, top: '0%',  left: '8%',  opacity: 0.13, blur: 45,  delay: 4 },
  { width: 180, skew: -17, top: '22%', left: '-10%',opacity: 0.04, blur: 130, delay: 1.2 },
  { width: 35,  skew: -7,  top: '8%',  left: '18%', opacity: 0.16, blur: 28,  delay: 3.5 },
];

export default function LightBeam({ mouseX = 0.5, mouseY = 0.3, scrollProgress = 0 }) {
  const beams = useMemo(() => {
    return BEAM_CONFIGS.map((config, i) => ({
      ...config,
      id: `beam-${i}`,
      // 鼠标微调 + 滚动视差（光束随滚动微微偏移）
      adjustedSkew: config.skew + (mouseX - 0.5) * 4 - scrollProgress * 2,
      adjustedTop: `calc(${config.top} + ${(mouseY - 0.3) * 2}% + ${scrollProgress * 5}%)`,
      adjustedLeft: `calc(${config.left} + ${(mouseX - 0.5) * 4}%)`,
    }));
  }, [mouseX, mouseY, scrollProgress]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2,
      pointerEvents: 'none', overflow: 'hidden',
    }}>
      {beams.map((beam) => (
        <div
          key={beam.id}
          style={{
            position: 'absolute',
            top: beam.adjustedTop,
            left: beam.adjustedLeft,
            width: `${beam.width}px`,
            height: '130vh',
            background: `linear-gradient(
              180deg,
              rgba(220, 200, 154, ${beam.opacity * 1.3}) 0%,
              rgba(191, 155, 94, ${beam.opacity}) 25%,
              rgba(191, 155, 94, ${beam.opacity * 0.5}) 55%,
              rgba(120, 158, 102, ${beam.opacity * 0.2}) 80%,
              transparent 100%
            )`,
            transform: `skewX(${beam.adjustedSkew}deg)`,
            filter: `blur(${beam.blur}px)`,
            animation: `beamFlow ${9 + beam.delay}s ease-in-out infinite`,
            animationDelay: `${beam.delay}s`,
            mixBlendMode: 'screen',
          }}
        />
      ))}

      {/* 光斑 */}
      {beams.slice(0, 4).map((beam, i) => (
        <div
          key={`spot-${beam.id}`}
          style={{
            position: 'absolute',
            top: `calc(${beam.adjustedTop} + ${25 + i * 18}%)`,
            left: `calc(${beam.adjustedLeft} + ${35 + i * 12}%)`,
            width: `${beam.width * 1.6}px`,
            height: `${beam.width * 1.6}px`,
            background: `radial-gradient(
              ellipse at center,
              rgba(220, 200, 154, 0.055) 0%,
              rgba(191, 155, 94, 0.025) 35%,
              transparent 70%
            )`,
            filter: 'blur(35px)',
            animation: `beamBreath ${7 + i * 1.5}s ease-in-out infinite`,
            animationDelay: `${i * 1.8}s`,
            mixBlendMode: 'screen',
          }}
        />
      ))}
    </div>
  );
}
