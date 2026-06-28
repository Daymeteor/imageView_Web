import { useEffect, useRef } from 'react';

/**
 * useParallax — 鼠标视差效果
 * 跟踪鼠标位置，输出归一化坐标供光束和粒子系统使用
 */
export default function useParallax() {
  const mouseRef = useRef({ x: 0.5, y: 0.3 });
  const targetRef = useRef({ x: 0.5, y: 0.3 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      targetRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };

    // 触摸设备支持
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        targetRef.current = {
          x: e.touches[0].clientX / window.innerWidth,
          y: e.touches[0].clientY / window.innerHeight,
        };
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // 平滑插值
    let rafId;
    const lerp = () => {
      const ease = 0.05;
      mouseRef.current = {
        x: mouseRef.current.x + (targetRef.current.x - mouseRef.current.x) * ease,
        y: mouseRef.current.y + (targetRef.current.y - mouseRef.current.y) * ease,
      };
      rafId = requestAnimationFrame(lerp);
    };
    rafId = requestAnimationFrame(lerp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return mouseRef;
}
