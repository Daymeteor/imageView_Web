/**
 * FolderSelector — 文件夹选择入口
 * 空状态时显示的大选择按钮
 */

import { getTheme } from '../data/themeConfig';
import { cn } from '../lib/utils';

export default function FolderSelector({ onSelect, loading, error, theme = 'forest' }) {
  const t = getTheme(theme);
  const isCyber = theme === 'cyber';
  const isConstellation = theme === 'constellation';
  const isAnime = theme === 'anime';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--color-bg-deep)]">
      <div className="relative animate-fade-in-up px-8 py-16 text-center md:px-16 md:py-20">
        {/* 装饰性光晕 */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 animate-glow-breathe rounded-full md:h-[380px] md:w-[380px]"
          style={{
            background: `radial-gradient(circle, color-mix(in oklab, var(--color-accent) 10%, transparent) 0%, transparent 70%)`,
          }}
        />

        {/* 图标 */}
        <div className="relative z-10 mb-8 flex justify-center text-[var(--color-accent)]">
          <div className="animate-glow-breathe rounded-full p-4"
            style={{ boxShadow: '0 0 40px color-mix(in oklab, var(--color-accent) 12%, transparent)' }}
          >
            {isConstellation ? <ConstellationIcon /> : isCyber ? <CyberIcon /> : isAnime ? <AnimeIcon /> : <ForestIcon />}
          </div>
        </div>

        {/* 文字 */}
        <h1 className="relative z-10 mb-2 font-display text-3xl font-normal tracking-[0.08em] text-[var(--color-accent-pale)] md:text-4xl">
          {t.selectTitle}
        </h1>
        <p className="relative z-10 mb-6 font-display text-xs uppercase tracking-[0.14em] text-[var(--color-accent)]">
          {t.selectSubtitle}
        </p>
        <p className="relative z-10 mx-auto mb-10 max-w-[360px] text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {t.selectDesc}
        </p>

        {/* 选择按钮 */}
        <button
          className={cn(
            'group relative z-10 inline-flex items-center gap-2 overflow-hidden rounded-sm',
            'border border-[color-mix(in_oklab,var(--color-accent)_40%,transparent)]',
            'bg-[color-mix(in_oklab,var(--color-accent)_12%,transparent)]',
            'px-9 py-4 text-sm tracking-[0.06em] text-[var(--color-accent-pale)]',
            'transition-all duration-500',
            'hover:border-[color-mix(in_oklab,var(--color-accent)_65%,transparent)]',
            'hover:bg-[color-mix(in_oklab,var(--color-accent)_22%,transparent)]',
            'hover:shadow-[0_0_40px_color-mix(in_oklab,var(--color-accent)_18%,transparent)]',
            'disabled:cursor-wait disabled:opacity-60'
          )}
          onClick={onSelect}
          disabled={loading}
        >
          {/* hover 扫光 */}
          <span
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[color-mix(in_oklab,var(--color-accent-pale)_12%,transparent)] to-transparent transition-transform duration-700 group-hover:translate-x-full"
          />

          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-[var(--color-accent)]" />
              <span className="relative z-10">读取中...</span>
            </>
          ) : (
            <>
              <PlusIcon />
              <span className="relative z-10">选择文件夹</span>
            </>
          )}
        </button>

        {/* 错误提示 */}
        {error && (
          <p className="relative z-10 mt-6 text-sm text-[#c96e6e]">{error}</p>
        )}

        {/* 提示 */}
        <p className="relative z-10 mt-10 text-xs leading-relaxed text-[var(--color-text-muted)]">
          支持 JPG / PNG / WebP / GIF / AVIF 格式
          <br />
          需要 Chrome 86+ 或 Edge 86+
        </p>
      </div>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M10 3V17M3 10H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ConstellationIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="22" r="2.5" fill="currentColor" opacity="0.9" />
      <circle cx="22" cy="32" r="2" fill="currentColor" opacity="0.7" />
      <circle cx="42" cy="32" r="2" fill="currentColor" opacity="0.7" />
      <circle cx="26" cy="46" r="1.5" fill="currentColor" opacity="0.5" />
      <circle cx="38" cy="46" r="1.5" fill="currentColor" opacity="0.5" />
      <circle cx="50" cy="40" r="1.8" fill="currentColor" opacity="0.6" />
      <line x1="32" y1="22" x2="22" y2="32" stroke="currentColor" strokeWidth="0.4" opacity="0.35" />
      <line x1="32" y1="22" x2="42" y2="32" stroke="currentColor" strokeWidth="0.4" opacity="0.35" />
      <line x1="22" y1="32" x2="26" y2="46" stroke="currentColor" strokeWidth="0.3" opacity="0.25" />
      <line x1="42" y1="32" x2="38" y2="46" stroke="currentColor" strokeWidth="0.3" opacity="0.25" />
      <line x1="26" y1="46" x2="38" y2="46" stroke="currentColor" strokeWidth="0.3" opacity="0.2" />
      <line x1="42" y1="32" x2="50" y2="40" stroke="currentColor" strokeWidth="0.3" opacity="0.2" />
      <polygon points="32,32 34,24 38,26 36,32" fill="currentColor" opacity="0.15" className="animate-dash" />
    </svg>
  );
}

function CyberIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon
        points="32,8 56,22 56,46 32,58 8,46 8,22"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <polygon
        points="32,8 56,22 56,46 32,58 8,46 8,22"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="120"
        strokeDashoffset="120"
        className="animate-dash"
      />
      <circle cx="32" cy="32" r="4" stroke="currentColor" strokeWidth="1" fill="none" />
      <line x1="32" y1="28" x2="32" y2="8" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      <line x1="32" y1="36" x2="32" y2="58" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      <line x1="28" y1="32" x2="8" y2="22" stroke="currentColor" strokeWidth="0.3" opacity="0.25" />
      <line x1="36" y1="32" x2="56" y2="22" stroke="currentColor" strokeWidth="0.3" opacity="0.25" />
    </svg>
  );
}

function ForestIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 16C8 13.7909 9.79086 12 12 12H24L28 18H52C54.2091 18 56 19.7909 56 22V48C56 50.2091 54.2091 52 52 52H12C9.79086 52 8 50.2091 8 48V16Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M8 16C8 13.7909 9.79086 12 12 12H24L28 18H52C54.2091 18 56 19.7909 56 22V48"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="100"
        strokeDashoffset="100"
        className="animate-dash"
      />
      <line x1="56" y1="18" x2="32" y2="42" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
      <line x1="50" y1="16" x2="30" y2="38" stroke="currentColor" strokeWidth="0.3" opacity="0.25" />
    </svg>
  );
}

function AnimeIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 樱花 */}
      <path
        d="M32 12C34 20 42 22 42 22C42 22 34 24 32 32C30 24 22 22 22 22C22 22 30 20 32 12Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M32 52C30 44 22 42 22 42C22 42 30 40 32 32C34 40 42 42 42 42C42 42 34 44 32 52Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
        opacity="0.6"
      />
      <circle cx="32" cy="32" r="3" fill="currentColor" opacity="0.9" />
      {/* 小星星 */}
      <path
        d="M48 16L49.5 20L54 20L50.5 23L51.5 28L48 25L44.5 28L45.5 23L42 20L46.5 20Z"
        fill="currentColor"
        opacity="0.5"
      />
      <circle cx="16" cy="42" r="2" fill="currentColor" opacity="0.4" />
    </svg>
  );
}
