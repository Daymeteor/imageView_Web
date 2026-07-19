import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * MemphisBackground — 孟菲斯波普几何背景
 * - 纯白/浅灰基底
 * - 不规则几何形状漂浮（三角形、圆点、波浪线、网格）
 * - 粗黑边框 + 高饱和填充
 * - 活泼的浮动动画
 */
export default function MemphisBackground() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // 动态点阵纹理 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      // 绘制稀疏的点阵
      const spacing = 40;
      for (let x = 0; x < w; x += spacing) {
        for (let y = 0; y < h; y += spacing) {
          const offset = Math.sin((x + y) * 0.01 + Date.now() * 0.001) * 2;
          ctx.beginPath();
          ctx.arc(x + offset, y + offset, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(26, 26, 26, 0.08)';
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  // GSAP 动画：形状浮动、旋转、缩放
  useGSAP(() => {
    const shapes = gsap.utils.toArray('.mbg-shape');
    shapes.forEach((shape, i) => {
      const duration = gsap.utils.random(4, 8);
      const delay = gsap.utils.random(0, 3);

      // 浮动
      gsap.to(shape, {
        y: gsap.utils.random(-30, 30),
        x: gsap.utils.random(-20, 20),
        rotation: gsap.utils.random(-15, 15),
        duration,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay,
      });

      // 缩放呼吸
      gsap.to(shape, {
        scale: gsap.utils.random(0.9, 1.1),
        duration: duration * 0.8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: delay + 0.5,
      });
    });

    // 波浪线动画
    const waves = gsap.utils.toArray('.mbg-wave');
    waves.forEach((wave, i) => {
      gsap.to(wave, {
        strokeDashoffset: 0,
        duration: 3,
        ease: 'none',
        repeat: -1,
        delay: i * 0.5,
      });
    });
  }, { scope: containerRef });

  // 孟菲斯配色
  const colors = {
    red: '#FF2E63',
    blue: '#00D4FF',
    yellow: '#FFE600',
    black: '#1a1a1a',
    white: '#ffffff',
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      style={{ background: '#f5f5f0' }}
    >
      {/* 点阵 Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* === 大三角形（左上）=== */}
      <div
        className="mbg-shape absolute"
        style={{
          top: '5%',
          left: '3%',
          width: 'min(18vw, 200px)',
          height: 'min(18vw, 200px)',
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon
            points="50,5 95,90 5,90"
            fill={colors.yellow}
            stroke={colors.black}
            strokeWidth="4"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* === 大圆形（右上）=== */}
      <div
        className="mbg-shape absolute"
        style={{
          top: '8%',
          right: '5%',
          width: 'min(14vw, 160px)',
          height: 'min(14vw, 160px)',
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle
            cx="50"
            cy="50"
            r="42"
            fill={colors.red}
            stroke={colors.black}
            strokeWidth="4"
          />
          {/* 内部网格 */}
          <path
            d="M20 20 L80 80 M80 20 L20 80"
            stroke={colors.black}
            strokeWidth="2"
            opacity="0.3"
          />
        </svg>
      </div>

      {/* === 半圆/拱形（右中）=== */}
      <div
        className="mbg-shape absolute"
        style={{
          top: '35%',
          right: '8%',
          width: 'min(12vw, 140px)',
          height: 'min(6vw, 70px)',
        }}
      >
        <svg viewBox="0 0 100 50" className="w-full h-full">
          <path
            d="M 5 50 A 45 45 0 0 1 95 50 Z"
            fill={colors.blue}
            stroke={colors.black}
            strokeWidth="4"
          />
        </svg>
      </div>

      {/* === 波浪线（左中）=== */}
      <div
        className="mbg-shape absolute"
        style={{
          top: '40%',
          left: '6%',
          width: 'min(20vw, 240px)',
          height: 'min(8vw, 100px)',
        }}
      >
        <svg viewBox="0 0 200 80" className="w-full h-full">
          <path
            d="M10 40 Q 35 10, 60 40 T 110 40 T 160 40 T 210 40"
            fill="none"
            stroke={colors.black}
            strokeWidth="5"
            strokeLinecap="round"
            className="mbg-wave"
            strokeDasharray="300"
            strokeDashoffset="300"
          />
          <path
            d="M10 55 Q 35 25, 60 55 T 110 55 T 160 55 T 210 55"
            fill="none"
            stroke={colors.red}
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.7"
          />
        </svg>
      </div>

      {/* === 小圆点群（散布）=== */}
      {[
        { top: '15%', left: '45%', size: 24, color: colors.blue },
        { top: '25%', left: '70%', size: 16, color: colors.yellow },
        { top: '55%', left: '15%', size: 20, color: colors.red },
        { top: '65%', left: '75%', size: 28, color: colors.black },
        { top: '75%', left: '30%', size: 18, color: colors.blue },
        { top: '85%', left: '60%', size: 22, color: colors.yellow },
        { top: '30%', left: '25%', size: 14, color: colors.red },
        { top: '50%', left: '55%', size: 26, color: colors.white, border: true },
        { top: '80%', left: '10%', size: 20, color: colors.yellow },
        { top: '12%', left: '85%', size: 18, color: colors.red },
      ].map((dot, i) => (
        <div
          key={`dot-${i}`}
          className="mbg-shape absolute rounded-full"
          style={{
            top: dot.top,
            left: dot.left,
            width: dot.size,
            height: dot.size,
            backgroundColor: dot.color,
            border: dot.border ? `3px solid ${colors.black}` : 'none',
          }}
        />
      ))}

      {/* === 小三角形（散布）=== */}
      {[
        { top: '20%', left: '60%', size: 40, color: colors.red, rotate: 15 },
        { top: '45%', left: '85%', size: 32, color: colors.yellow, rotate: -20 },
        { top: '70%', left: '5%', size: 36, color: colors.blue, rotate: 45 },
        { top: '85%', left: '45%', size: 28, color: colors.red, rotate: -10 },
        { top: '35%', left: '35%', size: 24, color: colors.yellow, rotate: 30 },
      ].map((tri, i) => (
        <div
          key={`tri-${i}`}
          className="mbg-shape absolute"
          style={{
            top: tri.top,
            left: tri.left,
            width: tri.size,
            height: tri.size,
            transform: `rotate(${tri.rotate}deg)`,
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon
              points="50,10 90,85 10,85"
              fill={tri.color}
              stroke={colors.black}
              strokeWidth="6"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ))}

      {/* === 锯齿/闪电形状（底部）=== */}
      <div
        className="mbg-shape absolute"
        style={{
          bottom: '8%',
          left: '20%',
          width: 'min(16vw, 180px)',
          height: 'min(10vw, 120px)',
        }}
      >
        <svg viewBox="0 0 160 100" className="w-full h-full">
          <polyline
            points="10,50 40,20 60,50 90,10 110,50 150,30"
            fill="none"
            stroke={colors.black}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points="10,70 40,40 60,70 90,30 110,70 150,50"
            fill="none"
            stroke={colors.red}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* === 网格方块（右下）=== */}
      <div
        className="mbg-shape absolute"
        style={{
          bottom: '12%',
          right: '15%',
          width: 'min(14vw, 160px)',
          height: 'min(14vw, 160px)',
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect
            x="5"
            y="5"
            width="90"
            height="90"
            fill={colors.white}
            stroke={colors.black}
            strokeWidth="4"
          />
          {/* 内部网格线 */}
          <line x1="35" y1="5" x2="35" y2="95" stroke={colors.black} strokeWidth="2" />
          <line x1="65" y1="5" x2="65" y2="95" stroke={colors.black} strokeWidth="2" />
          <line x1="5" y1="35" x2="95" y2="35" stroke={colors.black} strokeWidth="2" />
          <line x1="5" y1="65" x2="95" y2="65" stroke={colors.black} strokeWidth="2" />
          {/* 填充色块 */}
          <rect x="5" y="5" width="30" height="30" fill={colors.red} opacity="0.8" />
          <rect x="65" y="35" width="30" height="30" fill={colors.blue} opacity="0.8" />
          <rect x="35" y="65" width="30" height="30" fill={colors.yellow} opacity="0.8" />
        </svg>
      </div>

      {/* === 长条矩形（中部横贯）=== */}
      <div
        className="mbg-shape absolute"
        style={{
          top: '60%',
          left: '40%',
          width: 'min(25vw, 300px)',
          height: 'min(4vw, 48px)',
          transform: 'rotate(-5deg)',
        }}
      >
        <svg viewBox="0 0 300 48" className="w-full h-full">
          <rect
            x="2"
            y="2"
            width="296"
            height="44"
            fill={colors.blue}
            stroke={colors.black}
            strokeWidth="4"
          />
          {/* 内部条纹 */}
          {[40, 80, 120, 160, 200, 240].map((x) => (
            <line
              key={x}
              x1={x}
              y1="2"
              x2={x}
              y2="46"
              stroke={colors.black}
              strokeWidth="2"
              opacity="0.3"
            />
          ))}
        </svg>
      </div>

      {/* === 对角线装饰（左上到右下）=== */}
      <div
        className="absolute opacity-[0.06]"
        style={{
          inset: 0,
          background: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 20px,
            ${colors.black} 20px,
            ${colors.black} 22px
          )`,
        }}
      />

      {/* === 大圆环（左下）=== */}
      <div
        className="mbg-shape absolute"
        style={{
          bottom: '20%',
          left: '2%',
          width: 'min(10vw, 120px)',
          height: 'min(10vw, 120px)',
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={colors.black}
            strokeWidth="6"
          />
          <circle
            cx="50"
            cy="50"
            r="25"
            fill={colors.yellow}
            stroke={colors.black}
            strokeWidth="3"
          />
        </svg>
      </div>

      {/* === 十字形（右上偏中）=== */}
      <div
        className="mbg-shape absolute"
        style={{
          top: '18%',
          right: '25%',
          width: 'min(8vw, 90px)',
          height: 'min(8vw, 90px)',
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect x="35" y="5" width="30" height="90" fill={colors.blue} stroke={colors.black} strokeWidth="4" />
          <rect x="5" y="35" width="90" height="30" fill={colors.blue} stroke={colors.black} strokeWidth="4" />
          <rect x="42" y="12" width="16" height="76" fill={colors.white} />
          <rect x="12" y="42" width="76" height="16" fill={colors.white} />
        </svg>
      </div>
    </div>
  );
}
