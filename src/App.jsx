import { useState, useEffect, useCallback } from 'react';
import useFolderReader from './hooks/useFolderReader';
import useParallax from './hooks/useParallax';
import useScrollParallax from './hooks/useScrollParallax';
import ParticleSystem from './components/ParticleSystem';
import LightBeam from './components/LightBeam';
import CyberBackground from './components/CyberBackground';
import NavigationBar from './components/NavigationBar';
import FolderSelector from './components/FolderSelector';
import ExhibitionHall from './components/ExhibitionHall';
import LandingPage from './components/LandingPage';
import './styles/global.css';
import './styles/animations.css';

export default function App() {
  const [theme, setTheme] = useState('landing'); // 'landing' | 'forest' | 'cyber'
  const { images, folderName, loading, error, selectFolder, cleanup } = useFolderReader();
  const mouseRef = useParallax();
  const scrollData = useScrollParallax();
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.3 });

  useEffect(() => {
    let rafId;
    const poll = () => {
      if (mouseRef.current) setMousePos({ x: mouseRef.current.x, y: mouseRef.current.y });
      rafId = requestAnimationFrame(poll);
    };
    rafId = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(rafId);
  }, [mouseRef]);

  useEffect(() => () => cleanup(), [cleanup]);

  const enterTheme = useCallback((t) => setTheme(t), []);
  const backToLanding = useCallback(() => setTheme('landing'), []);
  const switchFolder = useCallback(() => selectFolder(), [selectFolder]);

  const hasImages = images.length > 0;
  const isForest = theme === 'forest';
  const isCyber = theme === 'cyber';

  // 赛博主题时给 body 添加 class（控制 body::before/::after）
  useEffect(() => {
    if (isCyber) {
      document.body.classList.add('body-cyber');
      return () => document.body.classList.remove('body-cyber');
    }
  }, [isCyber]);

  // Landing page
  if (theme === 'landing') {
    return <LandingPage onEnter={enterTheme} />;
  }

  // Theme pages
  return (
    <div className={`app theme-${theme}`}>
      {/* 森林主题背景 */}
      {isForest && (
        <>
          <ParticleSystem />
          <LightBeam mouseX={mousePos.x} mouseY={mousePos.y} scrollProgress={scrollData.progress} />
        </>
      )}

      {/* 赛博主题背景 */}
      {isCyber && <CyberBackground />}

      {/* 导航栏 */}
      <NavigationBar
        folderName={isForest ? folderName : ''}
        imageCount={images.length}
        onSwitchFolder={switchFolder}
        onBack={backToLanding}
        themeName={isForest ? '森林光影' : '赛博博物馆'}
      />

      {/* 文件夹选择器（森林主题） */}
      {isForest && !hasImages && !loading && (
        <FolderSelector onSelect={selectFolder} loading={loading} error={error} />
      )}

      {/* 加载 */}
      {isForest && loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-ring" />
            <p className="loading-text">正在读取照片...</p>
          </div>
        </div>
      )}

      {/* 森林主题展览 */}
      {isForest && hasImages && <ExhibitionHall images={images} />}

      {/* 赛博主题 — 完整展览 */}
      {isCyber && !hasImages && !loading && (
        <FolderSelector onSelect={selectFolder} loading={loading} error={error} theme="cyber" />
      )}
      {isCyber && loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-ring loading-ring--amber" />
            <p className="loading-text">正在读取数据...</p>
          </div>
        </div>
      )}
      {isCyber && hasImages && <ExhibitionHall images={images} theme="cyber" />}

      <style>{`
        .app { min-height: 100vh; }
        .app.theme-forest { background: var(--color-bg-deep); }
        .app.theme-cyber { background: #060810; }

        .loading-overlay {
          position: fixed; inset: 0; z-index: 100;
          display: flex; align-items: center; justify-content: center;
          background: var(--color-bg-deep);
        }
        .loading-content { text-align: center; }
        .loading-ring {
          width: 40px; height: 40px; margin: 0 auto var(--space-lg);
          border: 2px solid color-mix(in oklab, var(--color-accent) 15%, transparent); border-top-color: var(--color-accent);
          border-radius: 50%; animation: spin 1s linear infinite;
        }
        .loading-ring--amber {
          border-color: rgba(255,172,2,.15); border-top-color: #ffac02;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .loading-text { color: var(--color-text-secondary); font-size: .9rem; letter-spacing: .04em; }

        .cyber-bg {
          position: fixed; inset: 0; pointer-events: none; z-index: -1;
          background:
            radial-gradient(ellipse at 20% 10%, rgba(0,229,255,.04) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(128,0,255,.04) 0%, transparent 50%);
        }

        .theme-placeholder {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          min-height: 100vh; text-align: center;
        }
        .theme-placeholder h2 {
          font-family: var(--font-display); font-size: 2rem; font-weight: 400;
          color: #00e5ff; letter-spacing: .08em; margin-bottom: 12px;
        }
        .theme-placeholder p {
          font-size: .9rem; color: rgba(255,255,255,.3); letter-spacing: .1em;
        }
      `}</style>
    </div>
  );
}
