/**
 * FolderSelector — 文件夹选择入口
 * 空状态时显示的大选择按钮
 */

export default function FolderSelector({ onSelect, loading, error }) {
  return (
    <div className="folder-selector">
      <div className="selector-content">
        {/* 装饰性光晕 */}
        <div className="selector-aura" />

        {/* 图标 */}
        <div className="selector-icon">
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
            {/* 光束示意 */}
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
        </div>

        {/* 文字 */}
        <h1 className="selector-title">光影艺术展</h1>
        <p className="selector-subtitle">
          Forest Light Exhibition
        </p>
        <p className="selector-desc">
          选择一个包含照片的文件夹，开启你的森林光影展览
        </p>

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
            rgba(201, 169, 110, 0.08) 0%,
            transparent 70%
          );
          pointer-events: none;
          animation: beamBreath 4s ease-in-out infinite;
        }

        .selector-icon {
          color: var(--color-gold);
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
          color: var(--color-gold-light);
          letter-spacing: 0.08em;
          margin-bottom: var(--space-sm);
        }

        .selector-subtitle {
          font-family: var(--font-display);
          font-size: 1rem;
          color: var(--color-gold-dim);
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
          background: rgba(201, 169, 110, 0.1);
          border: 1px solid rgba(201, 169, 110, 0.3);
          border-radius: 2px;
          color: var(--color-gold-light);
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
            rgba(232, 213, 163, 0.08) 50%,
            transparent 60%
          );
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }

        .selector-btn:hover:not(:disabled) {
          background: rgba(201, 169, 110, 0.18);
          border-color: rgba(201, 169, 110, 0.5);
          box-shadow: 0 0 30px rgba(201, 169, 110, 0.12);
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
          border-top-color: var(--color-gold);
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
