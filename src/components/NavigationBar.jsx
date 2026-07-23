import { motion } from 'framer-motion';
import { ChevronLeft, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';

export default function NavigationBar({
  folderName,
  imageCount,
  onSwitchFolder,
  onBack,
  themeName,
}) {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50">
      <div
        className={cn(
          'glass mx-3 mt-3 flex items-center justify-between rounded-full px-4 py-2.5',
          'md:mx-auto md:mt-3 md:max-w-[960px] md:px-5 md:py-2.5'
        )}
      >
        <div className="flex items-center gap-3">
          <motion.button
            className={cn(
              'flex items-center gap-1 rounded-2xl border border-white/[0.08] bg-white/[0.03]',
              'px-3 py-1.5 text-[11px] tracking-[0.04em] text-[var(--color-text-secondary)]',
              'transition-colors hover:border-white/[0.18] hover:bg-white/[0.06] hover:text-[var(--color-text-primary)]'
            )}
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="返回主题选择"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>主题</span>
          </motion.button>

          <div className="hidden h-4 w-px bg-white/[0.08] sm:block" />

          <span className="font-display text-[15px] tracking-[0.1em] text-[var(--color-accent-pale)]">
            {themeName || '光影艺术展'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {folderName && (
            <>
              <span
                className="hidden max-w-[120px] truncate text-xs text-[var(--color-text-primary)] sm:inline-block md:max-w-[160px]"
                title={folderName}
              >
                {folderName}
              </span>
              <span className="hidden text-[var(--color-text-muted)] sm:inline">·</span>
              <span className="hidden text-xs text-[var(--color-text-secondary)] sm:inline">
                {imageCount} 张
              </span>
            </>
          )}

          {onSwitchFolder && (
            <motion.button
              className={cn(
                'flex items-center gap-1 rounded-2xl border border-[var(--color-accent-card-border)]',
                'bg-transparent px-3 py-1.5 text-[11px] text-[var(--color-accent-dim)]',
                'transition-colors hover:border-[var(--color-accent-card-border-hover)] hover:bg-[color-mix(in_oklab,var(--color-accent)_8%,transparent)] hover:text-[var(--color-accent)]'
              )}
              onClick={onSwitchFolder}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              aria-label="切换文件夹"
            >
              <RefreshCw className="h-3 w-3" />
              <span className="hidden sm:inline">切换</span>
            </motion.button>
          )}
        </div>
      </div>
    </nav>
  );
}
