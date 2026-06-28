import { useEffect, useRef } from 'react';
import useParallax from '../hooks/useParallax';

/**
 * ParticleSystem — Canvas 粒子系统
 * 模拟萤火虫/光尘在光束中漂浮的效果
 */

const PARTICLE_COUNT = 80;
const PARTICLE_COLORS = [
  'rgba(220, 200, 154, ',  // 暖金
  'rgba(191, 155, 94, ',   // 暗金
  'rgba(237, 224, 200, ',  // 浅金
  'rgba(163, 188, 148, ',  // 苔色光点
  'rgba(120, 158, 102, ',  // 若草色
];

export default function ParticleSystem() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useParallax();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    resize();
    window.addEventListener('resize', resize);

    // 初始化粒子
    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 20;
        this.size = Math.random() * 2.5 + 0.8;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = -(Math.random() * 0.4 + 0.15);
        this.opacity = Math.random() * 0.5 + 0.2;
        this.opacitySpeed = (Math.random() - 0.5) * 0.008;
        this.colorIndex = Math.floor(Math.random() * PARTICLE_COLORS.length);
        // 每颗粒子有独立的闪烁相位
        this.twinklePhase = Math.random() * Math.PI * 2;
        this.twinkleSpeed = Math.random() * 0.03 + 0.01;
        // 接近光束区域时亮度更高
        this.inBeam = Math.random() < 0.3;
      }

      update(time, mouseX, mouseY) {
        // 轻微向鼠标位置飘动
        const dx = (mouseX - 0.5) * 15;
        const dy = (mouseY - 0.5) * 10;

        this.x += this.speedX + dx * 0.002;
        this.y += this.speedY + dy * 0.002;

        // 闪烁
        this.twinklePhase += this.twinkleSpeed;
        const twinkle = Math.sin(this.twinklePhase) * 0.5 + 0.5;
        this.currentOpacity = this.opacity * (0.6 + twinkle * 0.4);

        // 判断是否在光束区域（左上角射入的斜向光柱带）
        const beamStart = this.x * 0.25;
        const distToBeam = Math.abs((this.y - beamStart - height * 0.1) / height);
        if (distToBeam < 0.15) {
          this.currentOpacity = Math.min(1, this.currentOpacity * 1.5);
        }

        // 超出屏幕则重置
        if (this.y < -20 || this.x < -20 || this.x > width + 20) {
          this.reset();
        }
      }

      draw(ctx) {
        const color = PARTICLE_COLORS[this.colorIndex] + this.currentOpacity + ')';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = color;

        // 光晕
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
        gradient.addColorStop(0, color);
        gradient.addColorStop(0.5, PARTICLE_COLORS[this.colorIndex] + this.currentOpacity * 0.3 + ')');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    // 批量创建粒子
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particlesRef.current.push(new Particle());
    }

    const animate = (time) => {
      ctx.clearRect(0, 0, width, height);

      const mx = mouseRef.current?.x ?? 0.5;
      const my = mouseRef.current?.y ?? 0.3;

      particlesRef.current.forEach((p) => {
        p.update(time, mx, my);
        p.draw(ctx);
      });

      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
      particlesRef.current = [];
    };
  }, [mouseRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  );
}
