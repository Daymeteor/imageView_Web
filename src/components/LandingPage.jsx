import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { THEMES } from '../data/themeConfig';
import { cn } from '../lib/utils';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.4 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.19, 1, 0.22, 1] },
  },
};

export default function LandingPage({ onEnter }) {
  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto bg-[#060806]">
      {/* 环境光晕背景 */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 30% 20%, rgba(191,155,94,.05) 0%, transparent 55%), radial-gradient(ellipse at 70% 60%, rgba(0,229,255,.03) 0%, transparent 55%), radial-gradient(ellipse at 50% 80%, rgba(90,125,74,.05) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 mx-auto flex min-h-full w-[95%] max-w-[1200px] flex-col text-center">
      <motion.div
        className="my-auto w-full py-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
      >
        {/* Header */}
        <header className="mb-10 md:mb-12">
          <div className="mx-auto mb-8 flex items-center justify-center gap-3">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--color-gold)] opacity-60" />
            <span className="h-1.5 w-1.5 rotate-45 bg-[var(--color-gold)] opacity-80" />
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--color-gold)] opacity-60" />
          </div>
          <h1 className="font-display text-[clamp(2.5rem,5.5vw,4rem)] font-normal leading-tight tracking-[0.16em] text-[var(--color-gold-pale)]">
            光影艺术展
          </h1>
          <p className="mt-3 font-display text-sm italic tracking-[0.08em] text-[var(--color-text-secondary)] md:text-base">
            Light &amp; Shadow Exhibition
          </p>
          <span className="mt-6 inline-block text-[11px] tracking-[0.32em] text-[var(--color-text-muted)]">
            选择一个主题进入
          </span>
        </header>

        {/* Theme Cards */}
        <motion.div
          className="grid max-w-[1200px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {THEMES.map((t, i) => (
            <ThemeCard key={t.id} theme={t} index={i} onEnter={onEnter} />
          ))}
        </motion.div>

        {/* 底部提示 */}
        <p className="mt-10 text-[11px] tracking-[0.24em] text-[var(--color-text-muted)] opacity-70">
          本地文件夹浏览 · 照片不会离开你的设备
        </p>
      </motion.div>
      </div>
    </div>
  );
}

function ThemeCard({ theme, index, onEnter }) {
  const isLight = theme.scheme === 'light';

  return (
    <motion.div
      className={cn(
        'group relative flex w-full cursor-pointer flex-col overflow-hidden rounded-2xl',
        'border p-7 text-left',
        'transition-all duration-500 ease-out',
        isLight
          ? 'border-black/[0.1] hover:border-black/[0.3]'
          : 'border-white/[0.07] hover:border-white/[0.22]',
        'md:min-h-[min(330px,32vh)] md:p-8'
      )}
      style={{ '--accent': theme.accent, '--glow': theme.glow }}
      variants={cardVariants}
      whileHover={{ y: -10, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
      onClick={() => onEnter(theme.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onEnter(theme.id); }}
      aria-label={`进入${theme.title}`}
    >
      {/* 卡片背景渐变 */}
      <div
        className="absolute inset-0 opacity-90 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: theme.gradient }}
      />

      {/* 边框发光层 */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          boxShadow: isLight
            ? `inset 0 1px 0 0 rgba(255,255,255,0.6), 0 12px 48px ${theme.glow}`
            : `inset 0 1px 0 0 rgba(255,255,255,0.1), 0 0 48px ${theme.glow}`,
        }}
      />

      {/* 底部遮罩，保证文字可读（浅主题用白色柔光，深主题用暗色渐变） */}
      <div
        className={cn(
          'pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t to-transparent',
          isLight ? 'h-2/3 from-white/95 via-white/60' : 'h-3/5 from-black/75 via-black/30'
        )}
      />

      {/* Hover 顶部光晕 */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-28 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `linear-gradient(180deg, ${theme.glow} 0%, transparent 70%)`,
        }}
      />

      {/* 顶部渐变线 */}
      <div
        className="absolute left-0 right-0 top-0 h-px opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `linear-gradient(90deg, transparent, ${theme.accent}, transparent)`,
        }}
      />

      {/* 内容 */}
      <div className="relative z-10 flex flex-1 flex-col">
        <div className="mb-6 flex items-start justify-between">
          <span
            className="block text-3xl leading-none transition-transform duration-500 group-hover:scale-110"
            style={{ color: theme.accent }}
          >
            {theme.icon}
          </span>
          <span
            className={cn(
              'font-display text-xs italic tracking-[0.2em]',
              isLight ? 'text-black/35' : 'text-white/30'
            )}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <h2
          className={cn(
            'font-display text-xl font-normal tracking-[0.08em]',
            isLight ? 'text-[#17171c]' : 'text-[#f0ece4]'
          )}
        >
          {theme.title}
        </h2>
        <p
          className={cn(
            'mb-4 mt-1 text-[10px] uppercase tracking-[0.16em]',
            isLight ? 'text-black/50' : 'text-white/50'
          )}
        >
          {theme.subtitle}
        </p>
        <p
          className={cn(
            'mb-8 flex-1 text-xs leading-[1.8] tracking-wide md:line-clamp-3',
            isLight ? 'text-black/50' : 'text-white/45'
          )}
        >
          {theme.desc}
        </p>

        <span
          className={cn(
            'inline-flex w-fit items-center gap-1.5 rounded-full border px-4 py-1.5 text-[11px] tracking-[0.1em]',
            'transition-all duration-300',
            isLight
              ? 'group-hover:bg-black/[0.05]'
              : 'group-hover:bg-white/[0.07] group-hover:shadow-[0_0_20px_var(--glow)]'
          )}
          style={{ borderColor: theme.accent, color: theme.accent }}
        >
          进入
          <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </motion.div>
  );
}
