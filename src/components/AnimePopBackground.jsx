import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * AnimePopBackground — 漫波普背景
 * - 对角红/白/蓝大色块
 * - 速度线（Canvas）
 * - 漫画网点纸纹理
 * - 星芒/爆炸效果
 * - 漫画对话框装饰
 */
export default function AnimePopBackground() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // 速度线 Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, speedLines = [];

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      // 从画面中心向外辐射的速度线
      speedLines = Array.from({ length: 80 }, () => {
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * Math.max(w, h) * 0.7;
        return {
          angle,
          distance,
          length: Math.random() * 60 + 20,
          speed: Math.random() * 2 + 1,
          width: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.3 + 0.05,
          color: Math.random() > 0.5 ? '255, 26, 26' : '0, 85, 255',
        };
      });
    };
    resize();
    window.addEventListener('resize', resize);

    let raf;
    const centerX = () => w / 2;
    const centerY = () => h / 2;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const cx = centerX();
      const cy = centerY();

      speedLines.forEach((line) => {
        line.distance += line.speed;
        if (line.distance > Math.max(w, h)) {
          line.distance = 0;
          line.angle = Math.random() * Math.PI * 2;
        }

        const startX = cx + Math.cos(line.angle) * line.distance;
        const startY = cy + Math.sin(line.angle) * line.distance;
        const endX = cx + Math.cos(line.angle) * (line.distance + line.length);
        const endY = cy + Math.sin(line.angle) * (line.distance + line.length);

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = `rgba(${line.color}, ${line.opacity})`;
        ctx.lineWidth = line.width;
        ctx.lineCap = 'round';
        ctx.stroke();
      });

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  // 星芒旋转 + 色块呼吸
  useGSAP(() => {
    gsap.to('.apbg-starburst', {
      rotation: 360, duration: 30, ease: 'none', repeat: -1,
    });
    gsap.to('.apbg-block-red', {
      scale: 1.03, duration: 4, ease: 'sine.inOut', yoyo: true, repeat: -1,
    });
    gsap.to('.apbg-block-blue', {
      scale: 1.02, duration: 5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1,
    });

    // 漂浮装饰点
    const dots = gsap.utils.toArray('.apbg-dot');
    dots.forEach((dot, i) => {
      gsap.to(dot, {
        y: gsap.utils.random(-15, 15),
        x: gsap.utils.random(-10, 10),
        rotation: gsap.utils.random(-10, 10),
        duration: gsap.utils.random(2, 3.5),
        ease: 'sine.inOut',
        yoyo: true, repeat: -1,
        delay: gsap.utils.random(0, 2),
      });
    });
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 overflow-hidden bg-white pointer-events-none"
    >
      {/* 对角大色块 — 红 */}
      <div
        className="apbg-block-red absolute"
        style={{
          top: '-10%',
          left: '-15%',
          width: '55vw',
          height: '70vh',
          background: 'linear-gradient(135deg, rgba(255, 26, 26, 0.12) 0%, rgba(255, 26, 26, 0.04) 60%, transparent 100%)',
          transform: 'rotate(-15deg)',
          borderRadius: '4px',
        }}
      />

      {/* 对角大色块 — 蓝 */}
      <div
        className="apbg-block-blue absolute"
        style={{
          bottom: '-15%',
          right: '-10%',
          width: '50vw',
          height: '65vh',
          background: 'linear-gradient(315deg, rgba(0, 85, 255, 0.1) 0%, rgba(0, 85, 255, 0.03) 60%, transparent 100%)',
          transform: 'rotate(10deg)',
          borderRadius: '4px',
        }}
      />

      {/* 对角大色块 — 黑（顶部装饰） */}
      <div
        className="absolute"
        style={{
          top: '-5%',
          right: '-5%',
          width: '30vw',
          height: '25vh',
          background: 'linear-gradient(225deg, rgba(26, 26, 26, 0.06) 0%, transparent 70%)',
          transform: 'rotate(20deg)',
        }}
      />

      {/* 星芒装饰 */}
      <div
        className="apbg-starburst absolute"
        style={{
          top: '12%',
          left: '8%',
          width: 'min(18vw, 200px)',
          height: 'min(18vw, 200px)',
          background: `conic-gradient(
            from 0deg,
            transparent 0deg 8deg,
            rgba(255, 26, 26, 0.15) 8deg 16deg,
            transparent 16deg 24deg,
            rgba(0, 85, 255, 0.1) 24deg 32deg,
            transparent 32deg 40deg,
            rgba(255, 26, 26, 0.12) 40deg 48deg,
            transparent 48deg 56deg,
            rgba(0, 85, 255, 0.08) 56deg 64deg,
            transparent 64deg 72deg,
            rgba(255, 26, 26, 0.1) 72deg 80deg,
            transparent 80deg 360deg
          )`,
          borderRadius: '50%',
        }}
      />

      {/* 第二个星芒（小） */}
      <div
        className="apbg-starburst absolute"
        style={{
          bottom: '20%',
          right: '12%',
          width: 'min(12vw, 140px)',
          height: 'min(12vw, 140px)',
          background: `conic-gradient(
            from 45deg,
            transparent 0deg 10deg,
            rgba(255, 26, 26, 0.1) 10deg 20deg,
            transparent 20deg 30deg,
            rgba(0, 85, 255, 0.08) 30deg 40deg,
            transparent 40deg 360deg
          )`,
          borderRadius: '50%',
        }}
      />

      {/* 漫画网点纸纹理 */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-multiply"
        style={{
          backgroundImage: 'radial-gradient(circle, #1a1a1a 1.2px, transparent 1.2px)',
          backgroundSize: '12px 12px',
        }}
      />

      {/* 密集网点纸（局部） */}
      <div
        className="absolute opacity-[0.04]"
        style={{
          top: '40%',
          left: '60%',
          width: '25vw',
          height: '25vw',
          backgroundImage: 'radial-gradient(circle, #1a1a1a 1px, transparent 1px)',
          backgroundSize: '6px 6px',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* 速度线 Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* 漫画对话框装饰 */}
      <div
        className="absolute opacity-[0.08]"
        style={{
          top: '15%',
          right: '20%',
          width: '120px',
          height: '80px',
          background: '#fff',
          border: '3px solid #1a1a1a',
          borderRadius: '50%',
          boxShadow: '3px 3px 0 #1a1a1a',
        }}
      />
      <div
        className="absolute opacity-[0.06]"
        style={{
          top: '22%',
          right: '18%',
          width: '0',
          height: '0',
          borderLeft: '10px solid transparent',
          borderRight: '10px solid transparent',
          borderTop: '20px solid #1a1a1a',
        }}
      />

      {/* 第二个对话框 */}
      <div
        className="absolute opacity-[0.06]"
        style={{
          bottom: '25%',
          left: '15%',
          width: '100px',
          height: '70px',
          background: '#fff',
          border: '3px solid #1a1a1a',
          borderRadius: '20px 20px 20px 4px',
          boxShadow: '3px 3px 0 #1a1a1a',
        }}
      />

      {/* 爆炸线装饰（四角） */}
      <div
        className="absolute opacity-[0.07]"
        style={{
          top: '5%',
          left: '5%',
          width: '80px',
          height: '80px',
          background: `repeating-conic-gradient(
            from 0deg at 50% 50%,
            transparent 0deg 5deg,
            #1a1a1a 5deg 7deg,
            transparent 7deg 12deg
          )`,
          borderRadius: '50%',
        }}
      />
      <div
        className="absolute opacity-[0.05]"
        style={{
          bottom: '8%',
          right: '8%',
          width: '60px',
          height: '60px',
          background: `repeating-conic-gradient(
            from 0deg at 50% 50%,
            transparent 0deg 4deg,
            #FF1A1A 4deg 6deg,
            transparent 6deg 10deg
          )`,
          borderRadius: '50%',
        }}
      />

      {/* 漂浮装饰点 */}
      {Array.from({ length: 12 }, (_, i) => (
        <div
          key={`d-${i}`}
          className="apbg-dot absolute pointer-events-none"
          style={{
            left: `${10 + (i * 13) % 80}%`,
            top: `${8 + (i * 19) % 84}%`,
            width: `${4 + (i % 4) * 2}px`,
            height: `${4 + (i % 4) * 2}px`,
            background: i % 3 === 0 ? '#FF1A1A' : i % 3 === 1 ? '#0055FF' : '#1a1a1a',
            borderRadius: i % 2 === 0 ? '50%' : '2px',
            opacity: 0.15 + (i % 3) * 0.05,
          }}
        />
      ))}

      {/* 速度线纹理（底部） */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[30vh] opacity-[0.03]"
        style={{
          background: 'repeating-conic-gradient(from 0deg at 50% 100%, transparent 0deg 1deg, rgba(26,26,26,0.5) 1deg 2deg)',
        }}
      />

      {/* 对角条纹装饰 */}
      <div
        className="absolute opacity-[0.03]"
        style={{
          top: 0,
          right: 0,
          width: '25vw',
          height: '100vh',
          background: 'repeating-linear-gradient(135deg, transparent 0px, transparent 20px, rgba(255, 26, 26, 0.3) 20px, rgba(255, 26, 26, 0.3) 22px)',
        }}
      />
    </div>
  );
}
