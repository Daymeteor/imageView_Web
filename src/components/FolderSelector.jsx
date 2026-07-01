/**
 * FolderSelector — 文件夹选择入口
 * 空状态时显示的大选择按钮
 */

import { getTheme } from '../data/themeConfig';

export default function FolderSelector({ onSelect, loading, error, theme = 'forest' }) {
  const t = getTheme(theme);
  const isCyber = theme === 'cyber';
  const isConstellation = theme === 'constellation';

  return (
    <div className="folder-selector">
      <div className="selector-content">
        {/* 装饰性光晕 */}
        <div className="selector-aura" />

        {/* 图标 */}
        <div className="selector-icon">
          {isConstellation ? (
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
              <polygon points="32,32 34,24 38,26 36,32" fill="currentColor" opacity="0.15" className="icon-draw" />
            </svg>
          ) : isCyber ? (
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* 六边形数据节点 */}
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
                className="icon-draw"
              />
              <circle cx="32" cy="32" r="4" stroke="currentColor" strokeWidth="1" fill="none" />
              <line x1="32" y1="28" x2="32" y2="8" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
              <line x1="32" y1="36" x2="32" y2="58" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
              <line x1="28" y1="32" x2="8" y2="22" stroke="currentColor" strokeWidth="0.3" opacity="0.25" />
              <line x1="36" y1="32" x2="56" y2="22" stroke="currentColor" strokeWidth="0.3" opacity="0.25" />
            </svg>
          ) : (
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
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
                className="icon-draw"
              />
              <line
                x1="56" y1="18" x2="32" y2="42"
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.4"
              />
              <line
                x1="50" y1="16" x2="30" y2="38"
                stroke="currentColor"
                strokeWidth="0.3"
                opacity="0.25"
              />
            </svg>
          )}
        </div>

        {/* 文字 */}
        <h1 className="selector-title">{t.selectTitle}</h1>
        <p className="selector-subtitle">{t.selectSubtitle}</p>
        <p className="selector-desc">{t.selectDesc}</p>

        {/* 选择按钮 */}
        <button
          className="selector-btn"
          onClick={onSelect}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="btn-spinner" />
              读取中...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 3V17M3 10H17"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              选择文件夹
            </>
          )}
        </button>

        {/* 错误提示 */}
        {error && (
          <p className="selector-error">{error}</p>
        )}

        {/* 提示 */}
        <p className="selector-hint">
          支持 JPG / PNG / WebP / GIF / AVIF 格式
          <br />
          需要 Chrome 86+ 或 Edge 86+
        </p>
      </div>

      <style>{`
        .folder-selector {
          position: fixed;
          inset: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-bg-deep);
        }

        .selector-content {
          text-align: center;
          position: relative;
          padding: var(--space-3xl);
          animation: fadeInUp 0.8s ease both;
        }

        .selector-aura {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            color-mix(in oklab, var(--color-accent) 8%, transparent) 0%,
            transparent 70%
          );
          pointer-events: none;
          animation: beamBreath 4s ease-in-out infinite;
        }

        .selector-icon {
          color: var(--color-accent);
          margin-bottom: var(--space-xl);
          animation: glowPulse 4s ease-in-out infinite;
        }

        .icon-draw {
          animation: dash 3s ease-in-out infinite;
        }

        @keyframes dash {
          0% { stroke-dashoffset: 200; }
          50% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -200; }
        }

        .selector-title {
          font-family: var(--font-display);
          font-size: 2.5rem;
          font-weight: 400;
          color: var(--color-accent-light);
          letter-spacing: 0.08em;
          margin-bottom: var(--space-sm);
        }

        .selector-subtitle {
          font-family: var(--font-display);
          font-size: 1rem;
          color: var(--color-accent-dim);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: var(--space-xl);
        }

        .selector-desc {
          font-size: 0.95rem;
          color: var(--color-text-secondary);
          margin-bottom: var(--space-2xl);
          max-width: 360px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.6;
        }

        .selector-btn {
          display: inline-flex;
          align-items: center;
          gap: var(--space-sm);
          padding: 14px 36px;
          background: color-mix(in oklab, var(--color-accent) 10%, transparent);
          border: 1px solid color-mix(in oklab, var(--color-accent) 30%, transparent);
          border-radius: 2px;
          color: var(--color-accent-light);
          font-size: 0.95rem;
          letter-spacing: 0.06em;
          transition: all var(--transition-medium);
          position: relative;
          overflow: hidden;
        }

        .selector-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            transparent 40%,
            color-mix(in oklab, var(--color-accent-pale) 8%, transparent) 50%,
            transparent 60%
          );
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }

        .selector-btn:hover:not(:disabled) {
          background: color-mix(in oklab, var(--color-accent) 18%, transparent);
          border-color: color-mix(in oklab, var(--color-accent) 50%, transparent);
          box-shadow: 0 0 30px color-mix(in oklab, var(--color-accent) 12%, transparent);
        }

        .selector-btn:hover::before {
          transform: translateX(100%);
        }

        .selector-btn:disabled {
          opacity: 0.6;
          cursor: wait;
        }

        .btn-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top-color: var(--color-accent);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .selector-error {
          margin-top: var(--space-lg);
          color: #c96e6e;
          font-size: 0.9rem;
        }

        .selector-hint {
          margin-top: var(--space-2xl);
          font-size: 0.78rem;
          color: var(--color-text-muted);
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}
