import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PhotoModal({ image, images, onClose, onPrev, onNext }) {
  const [rotation, setRotation] = useState(0);
  const modalRef = useRef(null);

  // 焦点捕获 + 键盘
  useEffect(() => {
    if (!image) return;
    const el = modalRef.current;
    if (el) el.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'Tab' && el) {
        const focusable = el.querySelectorAll('button, [tabindex]');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [image, onClose, onPrev, onNext]);

  if (!image) return null;
  const name = image.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');

  return (
    <AnimatePresence>
      <motion.div
        ref={modalRef}
        className="modal-bg"
        role="dialog"
        aria-modal="true"
        aria-label={`查看图片: ${name}`}
        tabIndex={-1}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-area"
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          onClick={e => e.stopPropagation()}
        >
          <div className="modal-rot">
            <motion.button aria-label="向左旋转" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setRotation(r => r - 90)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="15 18 9 12 15 6"/></svg>
            </motion.button>
            <motion.button aria-label="重置旋转" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="rst" onClick={() => setRotation(0)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21.5 2v6h-6M2.5 22v-6h6M21.34 8a10 0 0 1-4.23 12.14M2.66 16A10 0 0 1 6.9 3.86"/></svg>
            </motion.button>
            <motion.button aria-label="向右旋转" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setRotation(r => r + 90)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="9 18 15 12 9 6"/></svg>
            </motion.button>
          </div>
          <motion.div
            className="modal-wrap"
            animate={{ rotate: rotation }}
            transition={{ type: 'spring', stiffness: 200, damping: 22 }}
          >
            <img src={image.url} alt={name} draggable="false" />
          </motion.div>
        </motion.div>

        <motion.div className="modal-name" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          {name}
        </motion.div>

        <motion.button className="modal-nav prev" aria-label="上一张" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={e => { e.stopPropagation(); onPrev(); }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="15 18 9 12 15 6"/></svg>
        </motion.button>
        <motion.button className="modal-nav next" aria-label="下一张" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={e => { e.stopPropagation(); onNext(); }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="9 18 15 12 9 6"/></svg>
        </motion.button>
        <motion.button className="modal-x" aria-label="关闭" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
