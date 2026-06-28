import { useState, useEffect, useCallback } from 'react';
import useFolderReader from './hooks/useFolderReader';
import useParallax from './hooks/useParallax';
import useScrollParallax from './hooks/useScrollParallax';
import ParticleSystem from './components/ParticleSystem';
import LightBeam from './components/LightBeam';
import NavigationBar from './components/NavigationBar';
import FolderSelector from './components/FolderSelector';
import ExhibitionHall from './components/ExhibitionHall';
import './styles/global.css';
import './styles/animations.css';

/**
 * App — 森之光 · 光影艺术展
 */
export default function App() {
  const { images, folderName, loading, error, selectFolder, cleanup } = useFolderReader();
  const mouseRef = useParallax();
  const scrollData = useScrollParallax();
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.3 });

  // 定期读取鼠标位置（低频轮询，不绑定 requestAnimationFrame 到 React state）
  useEffect(() => {
    let rafId;
    const poll = () => {
      if (mouseRef.current) {
        setMousePos({ x: mouseRef.current.x, y: mouseRef.current.y });
      }
      rafId = requestAnimationFrame(poll);
    };
    rafId = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(rafId);
  }, [mouseRef]);

  // 清理
  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  const handleSwitchFolder = useCallback(() => {
    selectFolder();
  }, [selectFolder]);

  const hasImages = images.length > 0;

  return (
    <div className="app">
      {/* 背景光影层 */}
      <ParticleSystem />
      <LightBeam mouseX={mousePos.x} mouseY={mousePos.y} scrollProgress={scrollData.progress} />

      {/* 导航栏 */}
      <NavigationBar
        folderName={folderName}
        imageCount={images.length}
        onSwitchFolder={handleSwitchFolder}
      />

      {/* 文件夹选择器 */}
      {!hasImages && !loading && (
        <FolderSelector onSelect={selectFolder} loading={loading} error={error} />
      )}

      {/* 加载状态 */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="loading-ring" />
            <p className="loading-text">正在读取照片...</p>
          </div>
        </div>
      )}

      {/* 展览大厅 */}
      {hasImages && <ExhibitionHall images={images} />}

      <style>{`
        .app { min-height: 100vh; background: var(--color-bg-deep); }

        .loading-overlay {
          position: fixed; inset: 0; z-index: 100;
          display: flex; align-items: center; justify-content: center;
          background: var(--color-bg-deep);
        }

        .loading-content { text-align: center; }

        .loading-ring {
          width: 40px; height: 40px;
          margin: 0 auto var(--space-lg);
          border: 2px solid rgba(191, 155, 94, 0.15);
          border-top-color: var(--color-gold);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .loading-text {
          color: var(--color-text-secondary);
          font-size: 0.9rem; letter-spacing: 0.04em;
        }
      `}</style>
    </div>
  );
}
