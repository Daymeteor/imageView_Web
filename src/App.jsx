import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useFolderReader from './hooks/useFolderReader';
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
import './styles/themes/mondrian.css';
import './styles/themes/memphis.css';
import './styles/themes/anime-pop.css';
import './styles/themes/bauhaus.css';
import './styles/themes/darkroom.css';
import './styles/themes/album.css';
import './styles/themes/seaside.css';
import './styles/themes/pixel.css';
import './styles/themes/spirited.css';
import './styles/themes/nightcity.css';
import './styles/themes/rdr.css';
import './styles/themes/potter.css';

// GSAP 插件注册（全局一次性）
gsap.registerPlugin(ScrollTrigger);

// 懒加载非首屏背景组件，减少主包体积
const ParticleSystem = lazy(() => import('./components/ParticleSystem'));
const LightBeam = lazy(() => import('./components/LightBeam'));
const CyberBackground = lazy(() => import('./components/CyberBackground'));
const ConstellationBackground = lazy(() => import('./components/ConstellationBackground'));
const AnimeBackground = lazy(() => import('./components/AnimeBackground'));
const MondrianBackground = lazy(() => import('./components/MondrianBackground'));
const MemphisBackground = lazy(() => import('./components/MemphisBackground'));
const AnimePopBackground = lazy(() => import('./components/AnimePopBackground'));
const BauhausBackground = lazy(() => import('./components/BauhausBackground'));
const DarkroomBackground = lazy(() => import('./components/DarkroomBackground'));
const AlbumBackground = lazy(() => import('./components/AlbumBackground'));
const BookReader = lazy(() => import('./components/BookReader'));
const MangaReader = lazy(() => import('./components/MangaReader'));
const SeasideBackground = lazy(() => import('./components/SeasideBackground'));
const SeasideReader = lazy(() => import('./components/SeasideReader'));
const PixelBackground = lazy(() => import('./components/PixelBackground'));
const SpiritedBackground = lazy(() => import('./components/SpiritedBackground'));
const NightcityBackground = lazy(() => import('./components/NightcityBackground'));
const RdrBackground = lazy(() => import('./components/RdrBackground'));
const PotterBackground = lazy(() => import('./components/PotterBackground'));
const PixelReader = lazy(() => import('./components/PixelReader'));
const SpiritedReader = lazy(() => import('./components/SpiritedReader'));
const NightcityReader = lazy(() => import('./components/NightcityReader'));
const RdrReader = lazy(() => import('./components/RdrReader'));
const PotterReader = lazy(() => import('./components/PotterReader'));

const VALID_THEMES = ['forest', 'cyber', 'constellation', 'anime', 'mondrian', 'memphis', 'animepop', 'bauhaus', 'darkroom', 'album', 'seaside', 'pixel', 'spirited', 'nightcity', 'rdr', 'potter'];

export default function App() {
  const [theme, setTheme] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('theme');
    return VALID_THEMES.includes(t) ? t : 'landing';
  });
  const [zodiacIdx, setZodiacIdx] = useState(() => Math.floor(Math.random() * 12));
  const [constViewMode, setConstViewMode] = useState('star'); // 'star' | 'gallery'
  const { images, folderName, loading, error, selectFolder, loadDemo, cleanup } = useFolderReader();

  useEffect(() => cleanup, [cleanup]);

  // Demo 模式：URL 包含 ?demo=1 时自动加载示例图片
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('demo') === '1' && images.length === 0) {
      loadDemo();
    }
  }, [loadDemo, images.length]);

  const enterTheme = useCallback((t) => setTheme(t), []);
  const backToLanding = useCallback(() => setTheme('landing'), []);

  const hasImages = images.length > 0;
  const isForest = theme === 'forest';
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
  const showFolderName = isForest || isConstellation || isAnime || isMondrian || isMemphis || isAnimePop || isBauhaus || isDarkroom || isAlbum || isSeaside || isPixel || isSpirited || isNightcity || isRdr || isPotter;

  const loadingText = isForest
    ? '正在读取照片...'
    : isCyber
    ? '正在调取馆藏...'
    : isConstellation
    ? '正在绘制星图...'
    : isDarkroom
    ? '正在冲洗照片...'
    : isAlbum
    ? '正在装订书页...'
    : isSeaside
    ? '正在等潮汐...'
    : isPixel
    ? '正在生成区块...'
    : isSpirited
    ? '正在点亮灯笼...'
    : isNightcity
    ? '正在接入神经...'
    : isRdr
    ? '正在冲洗老照片...'
    : isPotter
    ? '正在施魔法...'
    : '正在渲染场景...';

  return (
    <div className={`app theme-${theme} min-h-screen bg-[var(--color-bg-deep)]`}>
      {/* 主题背景（懒加载） */}
      <Suspense fallback={null}>
        {isForest && (
          <>
            <ParticleSystem />
            <LightBeam />
          </>
        )}
        {isCyber && <CyberBackground />}
        {isConstellation && <ConstellationBackground zodiacIdx={zodiacIdx} prominent={constViewMode === 'star'} />}
        {isAnime && <AnimeBackground />}
        {isMondrian && <MondrianBackground />}
        {isMemphis && <MemphisBackground />}
        {isAnimePop && <AnimePopBackground />}
        {isBauhaus && <BauhausBackground />}
        {isDarkroom && <DarkroomBackground />}
        {isAlbum && <AlbumBackground />}
        {isSeaside && <SeasideBackground />}
        {isPixel && <PixelBackground />}
        {isSpirited && <SpiritedBackground />}
        {isNightcity && <NightcityBackground />}
        {isRdr && <RdrBackground />}
        {isPotter && <PotterBackground />}
      </Suspense>

      {/* 导航栏 */}
      <NavigationBar
        folderName={showFolderName ? folderName : ''}
        imageCount={images.length}
        onSwitchFolder={selectFolder}
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
            <p className="text-sm tracking-widest text-[var(--color-text-secondary)]">{loadingText}</p>
          </div>
        </div>
      )}

      {/* 展览大厅 / 纪念册翻书 / 连载漫画 */}
      {hasImages && (
        isAlbum ? (
          <Suspense fallback={null}>
            <BookReader images={images} theme={theme} folderName={folderName} />
          </Suspense>
        ) : isAnimePop ? (
          <Suspense fallback={null}>
            <MangaReader images={images} theme={theme} folderName={folderName} />
          </Suspense>
        ) : isSeaside ? (
          <Suspense fallback={null}>
            <SeasideReader images={images} theme={theme} />
          </Suspense>
        ) : isPixel ? (
          <Suspense fallback={null}>
            <PixelReader images={images} theme={theme} />
          </Suspense>
        ) : isSpirited ? (
          <Suspense fallback={null}>
            <SpiritedReader images={images} theme={theme} folderName={folderName} />
          </Suspense>
        ) : isNightcity ? (
          <Suspense fallback={null}>
            <NightcityReader images={images} theme={theme} folderName={folderName} />
          </Suspense>
        ) : isRdr ? (
          <Suspense fallback={null}>
            <RdrReader images={images} theme={theme} />
          </Suspense>
        ) : isPotter ? (
          <Suspense fallback={null}>
            <PotterReader images={images} theme={theme} />
          </Suspense>
        ) : (
          <ExhibitionHall
            images={images}
            theme={theme}
            zodiacIdx={zodiacIdx}
            onZodiacChange={setZodiacIdx}
            viewMode={constViewMode}
            onViewModeChange={setConstViewMode}
          />
        )
      )}
    </div>
  );
}
