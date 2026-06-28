import { motion } from 'framer-motion';

export default function NavigationBar({ folderName, imageCount, onSwitchFolder, onBack, themeName }) {
  return (
    <nav className="nav-bar">
      <div className="nav-inner">
        <div className="nav-left">
          <motion.button className="nav-back" onClick={onBack} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="15 18 9 12 15 6"/></svg>
            <span>主题</span>
          </motion.button>
          <span className="nav-theme">{themeName || '光影艺术展'}</span>
        </div>

        <div className="nav-right">
          {folderName && (
            <>
              <span className="nav-folder">{folderName}</span>
              <span className="nav-sep">·</span>
              <span className="nav-count">{imageCount} 张</span>
            </>
          )}
          {onSwitchFolder && (
            <motion.button className="nav-switch" onClick={onSwitchFolder} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
              切换
            </motion.button>
          )}
        </div>
      </div>

      <style>{`
        .nav-bar { position: fixed; top: 0; left: 0; right: 0; z-index: 50; }
        .nav-inner {
          display: flex; align-items: center; justify-content: space-between;
          padding: 10px 20px; margin: 12px 20px;
          background: var(--glass-bg); backdrop-filter: blur(var(--glass-blur)) saturate(1.4);
          -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(1.4);
          border: 1px solid var(--glass-border); border-radius: 40px;
          max-width: 960px; margin-left: auto; margin-right: auto;
          box-shadow: var(--glass-shadow);
        }
        .nav-left, .nav-right { display: flex; align-items: center; gap: 12px; }
        .nav-back {
          display: flex; align-items: center; gap: 4px; padding: 5px 12px;
          border-radius: 16px; border: 1px solid rgba(255,255,255,.08);
          background: rgba(255,255,255,.03); color: var(--color-text-secondary);
          font-size: .72rem; letter-spacing: .04em; cursor: pointer;
          transition: all .2s;
        }
        .nav-back:hover { border-color: rgba(255,255,255,.15); color: var(--color-text-primary); }
        .nav-theme { font-family: var(--font-display); font-size: .85rem; color: var(--color-accent-pale); letter-spacing: .06em; }
        .nav-folder { font-size: .76rem; color: var(--color-text-primary); max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .nav-sep { color: var(--color-text-muted); }
        .nav-count { font-size: .72rem; color: var(--color-text-secondary); }
        .nav-switch { display: flex; align-items: center; gap: 4px; padding: 6px 14px; border-radius: 16px; border: 1px solid var(--color-accent-card-border); background: transparent; color: var(--color-accent-dim); font-size: .72rem; cursor: pointer; transition: all .2s; }
        .nav-switch:hover { border-color: var(--color-accent-card-border-hover); color: var(--color-accent); background: color-mix(in oklab, var(--color-accent) 6%, transparent); }
        @media(max-width:640px){
          .nav-inner { padding: 8px 14px; margin: 8px 10px; border-radius: 24px; }
          .nav-folder, .nav-sep, .nav-count { display: none; }
        }
      `}</style>
    </nav>
  );
}
