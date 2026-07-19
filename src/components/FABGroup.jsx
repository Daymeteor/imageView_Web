import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, CornerUpLeft } from 'lucide-react';
import { cn } from '../lib/utils';

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

  const fabBase = cn(
    'flex items-center justify-center rounded-full',
    'bg-[var(--glass-bg)] backdrop-blur-[var(--glass-blur)]',
    'border border-[var(--glass-border)] text-[var(--color-accent-dim)]',
    'shadow-[var(--glass-shadow)] transition-colors duration-200',
    'hover:border-[var(--color-accent-card-border-hover)] hover:text-[var(--color-accent)]'
  );

  return (
    <div className="fixed bottom-6 right-5 z-[200] flex flex-col-reverse gap-2.5">
      <motion.button
        className={cn(fabBase, 'h-9 w-9')}
        onClick={backToPrev}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label="回到上一个位置"
      >
        <CornerUpLeft className="h-[18px] w-[18px]" strokeWidth={1.8} />
      </motion.button>
      <motion.button
        className={cn(fabBase, 'h-10 w-10')}
        onClick={scrollToTop}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label="回到顶部"
      >
        <ArrowUp className="h-[18px] w-[18px]" strokeWidth={1.8} />
      </motion.button>
    </div>
  );
}
