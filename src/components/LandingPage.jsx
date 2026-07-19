import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { THEMES } from '../data/themeConfig';
import { cn } from '../lib/utils';

const themes = THEMES.map((t) => ({
  id: t.id,
  title: t.title,
  subtitle: t.subtitle,
  desc: t.desc,
  icon: t.icon,
  gradient: t.gradient,
  accent: t.accent,
  glow: t.glow,
}));

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1] },
  },
};

export default function LandingPage({ onEnter }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[#060806]">
      {/* 环境光晕背景 */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 30% 20%, rgba(191,155,94,.04) 0%, transparent 55%), radial-gradient(ellipse at 70% 60%, rgba(0,229,255,.03) 0%, transparent 55%), radial-gradient(ellipse at 50% 80%, rgba(90,125,74,.04) 0%, transparent 50%)',
        }}
      />

      {/* 顶部微光 */}
      <div className="pointer-events-none absolute left-1/2 top-[15%] h-px w-40 -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--color-gold-dim)] to-transparent opacity-40" />

      <motion.div
        className="relative z-10 w-[90%] max-w-[880px] text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
      >
        {/* Header */}
        <header className="mb-12 md:mb-16">
          <div className="mx-auto mb-6 h-px w-16 bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent" />
          <h1 className="font-display text-3xl font-normal tracking-[0.12em] text-[var(--color-gold-pale)] md:text-4xl lg:text-5xl">
            光影艺术展
          </h1>
          <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
            Light & Shadow Exhibition
          </p>
          <span className="mt-5 inline-block text-xs tracking-[0.08em] text-[var(--color-text-muted)] opacity-60">
            选择一个主题进入
          </span>
        </header>

        {/* Theme Cards */}
        <motion.div
          className="flex flex-col items-center justify-center gap-5 md:flex-row md:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {themes.map((t) => (
            <ThemeCard key={t.id} theme={t} onEnter={onEnter} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

function ThemeCard({ theme, onEnter }) {
  return (
    <motion.div
      className={cn(
        'group relative w-full max-w-[320px] cursor-pointer overflow-hidden rounded-2xl',
        'border border-white/[0.07] p-8 text-left md:w-[270px] md:p-9',
        'transition-all duration-500 hover:border-white/[0.18]'
      )}
      style={{ '--accent': theme.accent, '--glow': theme.glow }}
      variants={cardVariants}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onEnter(theme.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onEnter(theme.id); }}
      aria-label={`进入${theme.title}`}
    >
      {/* 卡片背景渐变 */}
      <div
        className="absolute inset-0 opacity-80 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: theme.gradient }}
      />

      {/* 边框发光层 */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.08), 0 0 40px ${theme.glow}`,
        }}
      />

      {/* Hover 顶部光晕 */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
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
      <div className="relative z-10">
        <span className="mb-4 block text-4xl transition-transform duration-500 group-hover:scale-110">{theme.icon}</span>
        <h2 className="font-display text-xl font-normal tracking-[0.06em] text-[#f0ece4]">
          {theme.title}
        </h2>
        <p className="mb-3 text-[10px] uppercase tracking-[0.12em] text-white/50">
          {theme.subtitle}
        </p>
        <p className="mb-8 text-xs leading-relaxed tracking-wide text-white/45">
          {theme.desc}
        </p>

        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-[11px] tracking-[0.06em]',
            'opacity-80 transition-all duration-300 group-hover:opacity-100',
            'group-hover:bg-white/[0.05]'
          )}
          style={{ borderColor: theme.accent, color: theme.accent }}
        >
          进入
          <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </div>
    </motion.div>
  );
}
