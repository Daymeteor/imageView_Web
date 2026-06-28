import { useEffect, useRef, useState } from 'react';

/**
 * useScrollParallax — 滚动驱动视差
 * 返回当前的 scrollY 和归一化的滚动进度（0-1）
 */
export default function useScrollParallax() {
  const [scrollData, setScrollData] = useState({ y: 0, progress: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const y = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? y / maxScroll : 0;
        setScrollData({ y, progress: Math.min(1, progress) });
        rafRef.current = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return scrollData;
}
