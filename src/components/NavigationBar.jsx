/**
 * NavigationBar — 顶部导航栏
 * 毛玻璃背景，显示文件夹名、图片数量、切换按钮
 */

export default function NavigationBar({ folderName, imageCount, onSwitchFolder }) {
  if (!folderName) return null;

  return (
    <nav className="nav-bar">
      <div className="nav-inner">
        {/* 左侧标识 */}
        <div className="nav-brand">
          <span className="brand-dot" />
          <span className="brand-text">光影艺术展</span>
        </div>

        {/* 中间信息 */}
        <div className="nav-info">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
          <span className="info-folder">{folderName}</span>
          <span className="info-separator">·</span>
          <span className="info-count">{imageCount} 张照片</span>
        </div>

        {/* 右侧操作 */}
        <button className="nav-btn" onClick={onSwitchFolder}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </svg>
          切换文件夹
        </button>
      </div>

      <style>{`
        .nav-bar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 50;
          animation: navSlideIn 0.6s ease both;
        }

        .nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-md) var(--space-xl);
          margin: var(--space-md) var(--space-lg);
          background: rgba(13, 27, 14, 0.75);
          backdrop-filter: blur(16px) saturate(1.4);
          -webkit-backdrop-filter: blur(16px) saturate(1.4);
          border: 1px solid rgba(201, 169, 110, 0.12);
          border-radius: 40px;
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
        }

        .nav-brand {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .brand-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--color-gold);
          animation: twinkle 3s ease-in-out infinite;
        }

        .brand-text {
          font-family: var(--font-display);
          font-size: 0.9rem;
          color: var(--color-gold-light);
          letter-spacing: 0.06em;
        }

        .nav-info {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          color: var(--color-text-secondary);
          font-size: 0.82rem;
        }

        .info-folder {
          color: var(--color-text-primary);
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .info-separator {
          color: var(--color-text-muted);
        }

        .nav-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 18px;
          border-radius: 20px;
          border: 1px solid rgba(201, 169, 110, 0.2);
          color: var(--color-gold);
          font-size: 0.82rem;
          transition: all var(--transition-medium);
          background: transparent;
        }

        .nav-btn:hover {
          background: rgba(201, 169, 110, 0.1);
          border-color: rgba(201, 169, 110, 0.35);
        }

        @media (max-width: 640px) {
          .nav-inner {
            flex-direction: column;
            gap: var(--space-sm);
            border-radius: 20px;
            padding: var(--space-md);
          }
          .nav-info {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
}
