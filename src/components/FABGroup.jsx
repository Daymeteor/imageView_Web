import { useCallback } from 'react';
import { motion } from 'framer-motion';

export default function FABGroup({ scrollStackRef }) {
  const backToPrev = useCallback(() => {
    if (!scrollStackRef?.current) return;
    const pos = scrollStackRef.current.pop();
    if (pos != null) window.scrollTo({ top: pos, behavior: 'smooth' });
  }, [scrollStackRef]);

  const scrollToTop = useCallback(() => {
    const y = window.scrollY;
    if (y > 100 && scrollStackRef?.current) {
      scrollStackRef.current.push(y);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [scrollStackRef]);

  return (
    <div className="fab-group">
      <motion.button
        className="fab fab-prev"
        onClick={backToPrev}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label="回到上一个位置"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <polyline points="15 18 9 12 15 6"/>
          <line x1="21" y1="6" x2="9" y2="6"/>
        </svg>
      </motion.button>
      <motion.button
        className="fab fab-top"
        onClick={scrollToTop}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label="回到顶部"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <polyline points="18 15 12 9 6 15"/>
        </svg>
      </motion.button>
    </div>
  );
}
