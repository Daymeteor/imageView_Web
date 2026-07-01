import { useState, useEffect, useCallback } from 'react';
import useFolderReader from './hooks/useFolderReader';
import ParticleSystem from './components/ParticleSystem';
import LightBeam from './components/LightBeam';
import CyberBackground from './components/CyberBackground';
import ConstellationBackground from './components/ConstellationBackground';
import NavigationBar from './components/NavigationBar';
import FolderSelector from './components/FolderSelector';
import ExhibitionHall from './components/ExhibitionHall';
import LandingPage from './components/LandingPage';
import { getTheme } from './data/themeConfig';
import './styles/global.css';
import './styles/animations.css';

// GSAP 插件注册（全局一次性）
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function App() {
  const [theme, setTheme] = useState('landing');
  const [zodiacIdx, setZodiacIdx] = useState(() => Math.floor(Math.random() * 12));
  const [constViewMode, setConstViewMode] = useState('star'); // 'star' | 'gallery'
  const { images, folderName, loading, error, selectFolder, cleanup } = useFolderReader();

  useEffect(() => () => cleanup(), [cleanup]);

  const enterTheme = useCallback((t) => setTheme(t), []);
  const backToLanding = useCallback(() => setTheme('landing'), []);
  const switchFolder = useCallback(() => selectFolder(), [selectFolder]);

  const hasImages = images.length > 0;
  const isForest = theme === 'forest';
  const isCyber = theme === 'cyber';
  const isConstellation = theme === 'constellation';

  // 星座主题：30s 自动切换星座
  useEffect(() => {
    if (!isConstellation) return;
    const t = setInterval(() => setZodiacIdx(i => (i + Math.ceil(Math.random() * 11)) % 12), 30000);
    return () => clearInterval(t);
  }, [isConstellation]);

  // 赛博/星座主题时给 body 添加 class
  useEffect(() => {
    if (isCyber) document.body.classList.add('body-cyber');
    if (isConstellation) document.body.classList.add('body-constellation');
    return () => {
      document.body.classList.remove('body-cyber', 'body-constellation');
    };
  }, [isCyber, isConstellation]);

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
          <LightBeam />
        </>
      )}

      {/* 赛博主题背景 */}
      {isCyber && <CyberBackground />}
      {/* 星座主题背景 */}
      {isConstellation && <ConstellationBackground zodiacIdx={zodiacIdx} prominent={constViewMode === 'star'} />}

      {/* 导航栏 */}
      <NavigationBar
        folderName={isForest || isConstellation ? folderName : ''}
        imageCount={images.length}
        onSwitchFolder={switchFolder}
        onBack={backToLanding}
        themeName={getTheme(theme).title}
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
            <div className="loading-ring" />
            <p className="loading-text">正在读取数据...</p>
          </div>
        </div>
      )}
      {isCyber && hasImages && <ExhibitionHall images={images} theme="cyber" />}

      {/* 星座主题 — 完整展览 */}
      {isConstellation && !hasImages && !loading && (
        <FolderSelector onSelect={selectFolder} loading={loading} error={error} theme="constellation" />
      )}
      {isConstellation && loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-ring" />
            <p className="loading-text">正在绘制星图...</p>
          </div>
        </div>
      )}
      {isConstellation && hasImages && <ExhibitionHall images={images} theme="constellation" zodiacIdx={zodiacIdx} onZodiacChange={setZodiacIdx} viewMode={constViewMode} onViewModeChange={setConstViewMode} />}

      <style>{`
        .app { min-height: 100vh; }
        .app.theme-forest { background: var(--color-bg-deep); }
        .app.theme-cyber { background: var(--color-bg-deep); }
        .app.theme-constellation { background: var(--color-bg-deep); }

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
        @keyframes spin { to { transform: rotate(360deg); } }
        .loading-text { color: var(--color-text-secondary); font-size: .9rem; letter-spacing: .04em; }

      `}</style>
    </div>
  );
}
