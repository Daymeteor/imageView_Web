import { useEffect, useRef, useState } from 'react';

/**
 * useInView — 元素进入视口时为 true
 * @param {number} threshold IntersectionObserver 阈值
 * @param {boolean} once true=只触发一次；false=离开视口后重置，再次进入重新触发
 * @returns {[React.RefObject, boolean]}
 */
export default function useInView(threshold = 0.15, once = true) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, once]);

  return [ref, inView];
}
