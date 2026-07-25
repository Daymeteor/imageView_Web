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
  const isMondrian = theme === 'mondrian';
  const isMemphis = theme === 'memphis';
  const isAnimePop = theme === 'animepop';
  const isBauhaus = theme === 'bauhaus';
  const isDarkroom = theme === 'darkroom';
  const isAlbum = theme === 'album';
  const isSeaside = theme === 'seaside';
  const isPixel = theme === 'pixel';
  const isSpirited = theme === 'spirited';
  const isNightcity = theme === 'nightcity';
  const isRdr = theme === 'rdr';
  const isPotter = theme === 'potter';

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
            {isConstellation ? <ConstellationIcon />
              : isCyber ? <CyberIcon />
              : isAnime ? <AnimeIcon />
              : isMondrian ? <MondrianIcon />
              : isMemphis ? <MemphisIcon />
              : isAnimePop ? <AnimePopIcon />
              : isBauhaus ? <BauhausIcon />
              : isDarkroom ? <DarkroomIcon />
              : isAlbum ? <AlbumIcon />
              : isSeaside ? <SeasideIcon />
              : isPixel ? <PixelIcon />
              : isSpirited ? <SpiritedIcon />
              : isNightcity ? <NightcityIcon />
              : isRdr ? <RdrIcon />
              : isPotter ? <PotterIcon />
              : <ForestIcon />}
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
            'group relative z-10 inline-flex items-center gap-2 overflow-hidden rounded-[var(--card-radius)]',
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

function MondrianIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="6" width="24" height="24" fill="currentColor" opacity="0.9" />
      <rect x="34" y="6" width="24" height="14" fill="currentColor" opacity="0.4" />
      <rect x="34" y="24" width="24" height="34" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.8" />
      <rect x="6" y="34" width="24" height="24" fill="currentColor" opacity="0.6" />
      <line x1="32" y1="6" x2="32" y2="58" stroke="currentColor" strokeWidth="3" />
      <line x1="6" y1="32" x2="58" y2="32" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

function MemphisIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M42 12L50 28L34 28Z" fill="currentColor" opacity="0.8" />
      <path d="M12 44Q24 36 36 44T60 44" stroke="currentColor" strokeWidth="2" fill="none" />
      <rect x="44" y="42" width="10" height="10" fill="currentColor" opacity="0.6" transform="rotate(15 49 47)" />
    </svg>
  );
}

function AnimePopIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M32 8L36 24H52L40 34L44 50L32 40L20 50L24 34L12 24H28L32 8Z" fill="currentColor" opacity="0.9" />
      <circle cx="50" cy="14" r="4" fill="currentColor" opacity="0.6" />
      <path d="M8 48L16 52L8 56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M52 48L44 52L52 56" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function BauhausIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="44" cy="20" r="10" fill="currentColor" opacity="0.9" />
      <rect x="12" y="14" width="20" height="20" fill="currentColor" opacity="0.5" />
      <rect x="14" y="38" width="36" height="10" fill="currentColor" opacity="0.7" />
      <line x1="8" y1="56" x2="56" y2="56" stroke="currentColor" strokeWidth="2" opacity="0.8" />
    </svg>
  );
}

function DarkroomIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 胶片框 */}
      <rect x="10" y="14" width="44" height="36" stroke="currentColor" strokeWidth="1.5" fill="none" />
      {/* 齿孔 */}
      <rect x="14" y="18" width="5" height="4" fill="currentColor" opacity="0.6" />
      <rect x="23" y="18" width="5" height="4" fill="currentColor" opacity="0.6" />
      <rect x="32" y="18" width="5" height="4" fill="currentColor" opacity="0.6" />
      <rect x="41" y="18" width="5" height="4" fill="currentColor" opacity="0.6" />
      <rect x="14" y="42" width="5" height="4" fill="currentColor" opacity="0.6" />
      <rect x="23" y="42" width="5" height="4" fill="currentColor" opacity="0.6" />
      <rect x="32" y="42" width="5" height="4" fill="currentColor" opacity="0.6" />
      <rect x="41" y="42" width="5" height="4" fill="currentColor" opacity="0.6" />
      {/* 画幅内显影中的影像 */}
      <rect x="14" y="25" width="32" height="14" fill="currentColor" opacity="0.2" />
      <circle cx="26" cy="32" r="5" fill="currentColor" opacity="0.55" />
      <path d="M14 39L24 30L32 36L40 28L46 33V39H14Z" fill="currentColor" opacity="0.35" />
    </svg>
  );
}

function AlbumIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 摊开的书 */}
      <path
        d="M32 16C26 11 16 10 10 13V49C16 46 26 47 32 52C38 47 48 46 54 49V13C48 10 38 11 32 16Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="none"
      />
      {/* 书脊 */}
      <line x1="32" y1="16" x2="32" y2="52" stroke="currentColor" strokeWidth="1" opacity="0.6" />
      {/* 左页照片框 */}
      <rect x="15" y="19" width="12" height="14" fill="currentColor" opacity="0.3" />
      <circle cx="19" cy="24" r="2" fill="currentColor" opacity="0.55" />
      <path d="M15 31L20 26L24 29L27 25V33H15V31Z" fill="currentColor" opacity="0.5" />
      {/* 右页文字行 */}
      <line x1="37" y1="21" x2="49" y2="21" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="37" y1="26" x2="49" y2="26" stroke="currentColor" strokeWidth="1" opacity="0.35" />
      <line x1="37" y1="31" x2="46" y2="31" stroke="currentColor" strokeWidth="1" opacity="0.25" />
    </svg>
  );
}

function SeasideIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 落日与光芒 */}
      <circle cx="32" cy="26" r="10" fill="currentColor" opacity="0.85" />
      <line x1="32" y1="8" x2="32" y2="13" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      <line x1="14" y1="26" x2="19" y2="26" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      <line x1="45" y1="26" x2="50" y2="26" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      <line x1="19" y1="13" x2="22.5" y2="16.5" stroke="currentColor" strokeWidth="1.5" opacity="0.45" />
      <line x1="45" y1="13" x2="41.5" y2="16.5" stroke="currentColor" strokeWidth="1.5" opacity="0.45" />
      {/* 海平线 */}
      <line x1="8" y1="36" x2="56" y2="36" stroke="currentColor" strokeWidth="1.5" />
      {/* 海浪 */}
      <path d="M10 44Q16 40 22 44T34 44T46 44T58 44" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.7" />
      <path d="M14 51Q20 47 26 51T38 51T50 51" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.45" />
    </svg>
  );
}

function PixelIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 草地方块 */}
      <rect x="10" y="26" width="44" height="28" fill="currentColor" opacity="0.85" />
      <rect x="10" y="26" width="44" height="10" fill="currentColor" opacity="0.5" />
      <rect x="18" y="40" width="8" height="8" fill="currentColor" opacity="0.4" />
      <rect x="38" y="44" width="8" height="8" fill="currentColor" opacity="0.4" />
      {/* 像素云 */}
      <rect x="16" y="10" width="12" height="6" fill="currentColor" opacity="0.45" />
      <rect x="26" y="14" width="14" height="6" fill="currentColor" opacity="0.45" />
    </svg>
  );
}

function SpiritedIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 灯笼 */}
      <line x1="32" y1="6" x2="32" y2="14" stroke="currentColor" strokeWidth="1.5" />
      <ellipse cx="32" cy="30" rx="14" ry="16" fill="currentColor" opacity="0.85" />
      <line x1="22" y1="22" x2="42" y2="22" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="20" y1="30" x2="44" y2="30" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="22" y1="38" x2="42" y2="38" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <rect x="28" y="12" width="8" height="4" fill="currentColor" />
      <line x1="32" y1="46" x2="32" y2="56" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="32" cy="58" r="2" fill="currentColor" opacity="0.7" />
    </svg>
  );
}

function NightcityIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 记忆芯片 */}
      <rect x="16" y="16" width="32" height="32" rx="4" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <rect x="26" y="26" width="12" height="12" fill="currentColor" opacity="0.8" />
      <line x1="22" y1="16" x2="22" y2="8" stroke="currentColor" strokeWidth="1.5" />
      <line x1="32" y1="16" x2="32" y2="8" stroke="currentColor" strokeWidth="1.5" />
      <line x1="42" y1="16" x2="42" y2="8" stroke="currentColor" strokeWidth="1.5" />
      <line x1="22" y1="48" x2="22" y2="56" stroke="currentColor" strokeWidth="1.5" />
      <line x1="32" y1="48" x2="32" y2="56" stroke="currentColor" strokeWidth="1.5" />
      <line x1="42" y1="48" x2="42" y2="56" stroke="currentColor" strokeWidth="1.5" />
      <line x1="16" y1="26" x2="8" y2="26" stroke="currentColor" strokeWidth="1.5" />
      <line x1="16" y1="38" x2="8" y2="38" stroke="currentColor" strokeWidth="1.5" />
      <line x1="48" y1="26" x2="56" y2="26" stroke="currentColor" strokeWidth="1.5" />
      <line x1="48" y1="38" x2="56" y2="38" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function RdrIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 牛仔帽 */}
      <ellipse cx="32" cy="42" rx="24" ry="7" fill="currentColor" opacity="0.85" />
      <path d="M18 40C18 28 24 20 32 20C40 20 46 28 46 40" fill="currentColor" opacity="0.85" />
      <path d="M18 36Q32 42 46 36" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
      {/* 落日 */}
      <circle cx="48" cy="14" r="5" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

function PotterIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 魔杖与火花 */}
      <line x1="14" y1="50" x2="42" y2="22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M44 14L46 19L51 20L46 22L44 27L42 22L37 20L42 19Z" fill="currentColor" opacity="0.9" />
      <path d="M52 30L53.5 33.5L57 34L53.5 35.5L52 39L50.5 35.5L47 34L50.5 33.5Z" fill="currentColor" opacity="0.6" />
      <circle cx="20" cy="16" r="2" fill="currentColor" opacity="0.5" />
      <circle cx="30" cy="8" r="1.5" fill="currentColor" opacity="0.4" />
    </svg>
  );
}
