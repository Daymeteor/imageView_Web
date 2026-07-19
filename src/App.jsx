import { useState, useEffect, useCallback } from 'react';
import useFolderReader from './hooks/useFolderReader';
import ParticleSystem from './components/ParticleSystem';
import LightBeam from './components/LightBeam';
import CyberBackground from './components/CyberBackground';
import ConstellationBackground from './components/ConstellationBackground';
import AnimeBackground from './components/AnimeBackground';
import NavigationBar from './components/NavigationBar';
import FolderSelector from './components/FolderSelector';
import ExhibitionHall from './components/ExhibitionHall';
import LandingPage from './components/LandingPage';
import { getTheme } from './data/themeConfig';
import './styles/global.css';
import './styles/animations.css';
import './styles/themes/forest.css';
import './styles/themes/cyber.css';
import './styles/themes/constellation.css';
import './styles/themes/anime.css';

// GSAP 插件注册（全局一次性）
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function App() {
  const [theme, setTheme] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('theme');
    return ['forest', 'cyber', 'constellation', 'anime'].includes(t) ? t : 'landing';
  });
  const [zodiacIdx, setZodiacIdx] = useState(() => Math.floor(Math.random() * 12));
  const [constViewMode, setConstViewMode] = useState('star'); // 'star' | 'gallery'
  const { images, folderName, loading, error, selectFolder, loadDemo, cleanup } = useFolderReader();

  useEffect(() => () => cleanup(), [cleanup]);

  // Demo 模式：URL 包含 ?demo=1 时自动加载示例图片
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('demo') === '1' && images.length === 0) {
      loadDemo();
    }
  }, [loadDemo, images.length]);

  const enterTheme = useCallback((t) => setTheme(t), []);
  const backToLanding = useCallback(() => setTheme('landing'), []);
  const switchFolder = useCallback(() => selectFolder(), [selectFolder]);

  const hasImages = images.length > 0;
  const isForest = theme === 'forest';
  const isCyber = theme === 'cyber';
  const isConstellation = theme === 'constellation';
  const isAnime = theme === 'anime';

  // 星座主题：30s 自动切换星座
  useEffect(() => {
    if (!isConstellation) return;
    const t = setInterval(() => setZodiacIdx(i => (i + Math.ceil(Math.random() * 11)) % 12), 30000);
    return () => clearInterval(t);
  }, [isConstellation]);

  // 非 landing 主题时给 body 添加 body-accent 类，用于环境光覆盖
  useEffect(() => {
    if (theme !== 'landing') document.body.classList.add('body-accent');
    return () => {
      document.body.classList.remove('body-accent');
    };
  }, [theme]);

  // Landing page
  if (theme === 'landing') {
    return <LandingPage onEnter={enterTheme} />;
  }

  const themeTitle = getTheme(theme).title;

  return (
    <div className={`app theme-${theme} min-h-screen bg-[var(--color-bg-deep)]`}>
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
      {/* 动漫主题背景 */}
      {isAnime && <AnimeBackground />}

      {/* 导航栏 */}
      <NavigationBar
        folderName={isForest || isConstellation || isAnime ? folderName : ''}
        imageCount={images.length}
        onSwitchFolder={switchFolder}
        onBack={backToLanding}
        themeName={themeTitle}
      />

      {/* 文件夹选择器 */}
      {!hasImages && !loading && (
        <FolderSelector onSelect={selectFolder} loading={loading} error={error} theme={theme} />
      )}

      {/* 加载遮罩 */}
      {loading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--color-bg-deep)]">
          <div className="text-center">
            <div className="mx-auto mb-6 h-10 w-10 rounded-full border-2 border-[color-mix(in_oklab,var(--color-accent)_15%,transparent)] border-t-[var(--color-accent)] animate-spin" />
            <p className="text-sm tracking-widest text-[var(--color-text-secondary)]">
              {isForest ? '正在读取照片...' : isCyber ? '正在读取数据...' : isConstellation ? '正在绘制星图...' : '正在渲染场景...'}
            </p>
          </div>
        </div>
      )}

      {/* 展览大厅 */}
      {hasImages && (
        <ExhibitionHall
          images={images}
          theme={theme}
          zodiacIdx={zodiacIdx}
          onZodiacChange={setZodiacIdx}
          viewMode={constViewMode}
          onViewModeChange={setConstViewMode}
        />
      )}
    </div>
  );
}
