import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, RotateCw, ChevronLeft, ChevronRight, Undo2 } from 'lucide-react';
import { Dialog, DialogContent } from './ui/dialog';
import { cn } from '../lib/utils';

export default function PhotoModal({ image, images, onClose, onPrev, onNext }) {
  const [rotation, setRotation] = useState(0);
  const [direction, setDirection] = useState(0);

  // 切换图片时重置旋转并记录方向
  useEffect(() => {
    setRotation(0);
  }, [image?.id]);

  const name = image ? image.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ') : '';
  const isOpen = !!image;

  const handlePrev = (e) => {
    e?.stopPropagation();
    setDirection(-1);
    onPrev();
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setDirection(1);
    onNext();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent
        className="border-none bg-transparent p-0 shadow-none"
        showCloseButton={false}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {image && (
          <ModalInner
            image={image}
            name={name}
            rotation={rotation}
            setRotation={setRotation}
            direction={direction}
            onPrev={handlePrev}
            onNext={handleNext}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ModalInner({ image, name, rotation, setRotation, direction, onPrev, onNext, onClose }) {
  // 键盘导航
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="relative flex h-full w-full flex-col items-center justify-center outline-none"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`查看图片: ${name}`}
    >
      <div className="flex flex-row items-center gap-3 md:gap-4" onClick={(e) => e.stopPropagation()}>
        {/* 旋转控制 */}
        <div className="flex flex-col gap-1">
          <RotateBtn label="向左旋转" onClick={() => setRotation((r) => r - 90)}>
            <RotateCcw className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </RotateBtn>
          <RotateBtn label="重置旋转" className="border-dashed" small onClick={() => setRotation(0)}>
            <Undo2 className="h-3.5 w-3.5" strokeWidth={1.5} />
          </RotateBtn>
          <RotateBtn label="向右旋转" onClick={() => setRotation((r) => r + 90)}>
            <RotateCw className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </RotateBtn>
        </div>

        {/* 图片 — 容器不裁剪，图片旋转后可完整显示 */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={image.id}
            className="flex items-center justify-center"
            style={{
              width: '75vw',
              height: '85vh',
              maxWidth: '100%',
              maxHeight: '100%',
            }}
            initial={{ opacity: 0, x: direction * 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: direction * -20, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          >
            <motion.img
              src={image.url}
              alt={name}
              draggable="false"
              className="block max-h-full max-w-full select-none object-contain shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_100px_var(--color-accent-shadow)]"
              animate={{ rotate: rotation }}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 图片名称 */}
      <motion.p
        className="mt-4 font-display text-sm tracking-[0.05em] text-[var(--color-accent-pale)] opacity-60"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.6, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        {name}
      </motion.p>

      {/* 导航按钮 */}
      <motion.button
        className="fixed left-4 top-1/2 z-[301] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--color-accent)_12%,transparent)] bg-[var(--color-accent-glass-bg)] text-[var(--color-accent-dim)] backdrop-blur-md transition-colors hover:border-[color-mix(in_oklab,var(--color-accent)_35%,transparent)] hover:text-[var(--color-accent-light)] md:left-5 md:h-12 md:w-12"
        onClick={onPrev}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="上一张"
      >
        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.5} />
      </motion.button>

      <motion.button
        className="fixed right-4 top-1/2 z-[301] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--color-accent)_12%,transparent)] bg-[var(--color-accent-glass-bg)] text-[var(--color-accent-dim)] backdrop-blur-md transition-colors hover:border-[color-mix(in_oklab,var(--color-accent)_35%,transparent)] hover:text-[var(--color-accent-light)] md:right-5 md:h-12 md:w-12"
        onClick={onNext}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="下一张"
      >
        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" strokeWidth={1.5} />
      </motion.button>

      {/* 关闭按钮 */}
      <motion.button
        className="fixed right-4 top-4 z-[302] flex h-10 w-10 items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--color-accent)_12%,transparent)] bg-[var(--color-accent-glass-bg)] text-[var(--color-accent-dim)] backdrop-blur-md transition-colors hover:border-[color-mix(in_oklab,var(--color-accent)_35%,transparent)] hover:text-[var(--color-accent-light)] md:right-5 md:top-5 md:h-11 md:w-11"
        onClick={onClose}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="关闭"
      >
        <span className="text-lg leading-none">×</span>
      </motion.button>
    </div>
  );
}

function RotateBtn({ children, label, onClick, small = false, className = '' }) {
  return (
    <motion.button
      className={cn(
        'flex items-center justify-center rounded-full border border-[color-mix(in_oklab,var(--color-accent)_18%,transparent)] bg-[var(--color-accent-glass-bg)] text-[var(--color-accent-dim)] backdrop-blur-md transition-colors hover:border-[color-mix(in_oklab,var(--color-accent)_40%,transparent)] hover:text-[var(--color-accent-light)]',
        small ? 'h-7 w-7' : 'h-9 w-9',
        className
      )}
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={label}
    >
      {children}
    </motion.button>
  );
}
