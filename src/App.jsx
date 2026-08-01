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
import './styles/themes/interstellar.css';
import './styles/themes/grandbudapest.css';
import './styles/themes/monument.css';
import './styles/themes/bladerunner.css';
import './styles/themes/shanhaijing.css';
import './styles/themes/eva.css';
import './styles/themes/kurosawa.css';
import './styles/themes/littleprince.css';
import './styles/themes/ldr.css';
import './styles/themes/journey.css';
import './styles/themes/nineteen84.css';
import './styles/themes/cthulhu.css';
import './styles/themes/vaporwave.css';
import './styles/themes/got.css';
import './styles/themes/akira.css';
import './styles/themes/ghibli.css';
import './styles/themes/wabisabi.css';
import './styles/themes/dune.css';
import './styles/themes/blackmirror.css';
import './styles/themes/witcher.css';
import './styles/themes/dragonraja.css';
import './styles/themes/threebody.css';
import './styles/themes/deanting.css';
import './styles/themes/haizi.css';

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
const InterstellarBackground = lazy(() => import('./components/InterstellarBackground'));
const GrandbudapestBackground = lazy(() => import('./components/GrandbudapestBackground'));
const MonumentBackground = lazy(() => import('./components/MonumentBackground'));
const BladerunnerBackground = lazy(() => import('./components/BladerunnerBackground'));
const ShanhaijingBackground = lazy(() => import('./components/ShanhaijingBackground'));
const EvaBackground = lazy(() => import('./components/EvaBackground'));
const KurosawaBackground = lazy(() => import('./components/KurosawaBackground'));
const LittleprinceBackground = lazy(() => import('./components/LittleprinceBackground'));
const LdrBackground = lazy(() => import('./components/LdrBackground'));
const JourneyBackground = lazy(() => import('./components/JourneyBackground'));
const Nineteen84Background = lazy(() => import('./components/Nineteen84Background'));
const CthulhuBackground = lazy(() => import('./components/CthulhuBackground'));
const VaporwaveBackground = lazy(() => import('./components/VaporwaveBackground'));
const GotBackground = lazy(() => import('./components/GotBackground'));
const AkiraBackground = lazy(() => import('./components/AkiraBackground'));
const InterstellarReader = lazy(() => import('./components/InterstellarReader'));
const GrandbudapestReader = lazy(() => import('./components/GrandbudapestReader'));
const MonumentReader = lazy(() => import('./components/MonumentReader'));
const BladerunnerReader = lazy(() => import('./components/BladerunnerReader'));
const ShanhaijingReader = lazy(() => import('./components/ShanhaijingReader'));
const EvaReader = lazy(() => import('./components/EvaReader'));
const KurosawaReader = lazy(() => import('./components/KurosawaReader'));
const LittleprinceReader = lazy(() => import('./components/LittleprinceReader'));
const LdrReader = lazy(() => import('./components/LdrReader'));
const JourneyReader = lazy(() => import('./components/JourneyReader'));
const Nineteen84Reader = lazy(() => import('./components/Nineteen84Reader'));
const CthulhuReader = lazy(() => import('./components/CthulhuReader'));
const VaporwaveReader = lazy(() => import('./components/VaporwaveReader'));
const GotReader = lazy(() => import('./components/GotReader'));
const AkiraReader = lazy(() => import('./components/AkiraReader'));
const GhibliBackground = lazy(() => import('./components/GhibliBackground'));
const WabisabiBackground = lazy(() => import('./components/WabisabiBackground'));
const DuneBackground = lazy(() => import('./components/DuneBackground'));
const BlackmirrorBackground = lazy(() => import('./components/BlackmirrorBackground'));
const GhibliReader = lazy(() => import('./components/GhibliReader'));
const WabisabiReader = lazy(() => import('./components/WabisabiReader'));
const DuneReader = lazy(() => import('./components/DuneReader'));
const BlackmirrorReader = lazy(() => import('./components/BlackmirrorReader'));
const WitcherBackground = lazy(() => import('./components/WitcherBackground'));
const DragonrajaBackground = lazy(() => import('./components/DragonrajaBackground'));
const ThreebodyBackground = lazy(() => import('./components/ThreebodyBackground'));
const DeantingBackground = lazy(() => import('./components/DeantingBackground'));
const HaiziBackground = lazy(() => import('./components/HaiziBackground'));
const WitcherReader = lazy(() => import('./components/WitcherReader'));
const DragonrajaReader = lazy(() => import('./components/DragonrajaReader'));
const ThreebodyReader = lazy(() => import('./components/ThreebodyReader'));
const DeantingReader = lazy(() => import('./components/DeantingReader'));
const HaiziReader = lazy(() => import('./components/HaiziReader'));

const VALID_THEMES = ['forest', 'cyber', 'constellation', 'anime', 'mondrian', 'memphis', 'animepop', 'bauhaus', 'darkroom', 'album', 'seaside', 'pixel', 'spirited', 'nightcity', 'rdr', 'potter', 'interstellar', 'grandbudapest', 'monument', 'bladerunner', 'shanhaijing', 'eva', 'kurosawa', 'littleprince', 'ldr', 'journey', 'nineteen84', 'cthulhu', 'vaporwave', 'got', 'akira', 'ghibli', 'wabisabi', 'dune', 'blackmirror', 'witcher', 'dragonraja', 'threebody', 'deanting', 'haizi'];

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
  const isInterstellar = theme === 'interstellar';
  const isGrandbudapest = theme === 'grandbudapest';
  const isMonument = theme === 'monument';
  const isBladerunner = theme === 'bladerunner';
  const isShanhaijing = theme === 'shanhaijing';
  const isEva = theme === 'eva';
  const isKurosawa = theme === 'kurosawa';
  const isLittleprince = theme === 'littleprince';
  const isLdr = theme === 'ldr';
  const isJourney = theme === 'journey';
  const isNineteen84 = theme === 'nineteen84';
  const isCthulhu = theme === 'cthulhu';
  const isVaporwave = theme === 'vaporwave';
  const isGot = theme === 'got';
  const isAkira = theme === 'akira';
  const isGhibli = theme === 'ghibli';
  const isWabisabi = theme === 'wabisabi';
  const isDune = theme === 'dune';
  const isBlackmirror = theme === 'blackmirror';
  const isWitcher = theme === 'witcher';
  const isDragonraja = theme === 'dragonraja';
  const isThreebody = theme === 'threebody';
  const isDeanting = theme === 'deanting';
  const isHaizi = theme === 'haizi';

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
  const showFolderName = isForest || isConstellation || isAnime || isMondrian || isMemphis || isAnimePop || isBauhaus || isDarkroom || isAlbum || isSeaside || isPixel || isSpirited || isNightcity || isRdr || isPotter || isInterstellar || isGrandbudapest || isMonument || isBladerunner || isShanhaijing || isEva || isKurosawa || isLittleprince || isLdr || isJourney || isNineteen84 || isCthulhu || isVaporwave || isGot || isAkira || isGhibli || isWabisabi || isDune || isBlackmirror || isWitcher || isDragonraja || isThreebody || isDeanting || isHaizi;

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
    : isInterstellar
    ? '正在校准曲率...'
    : isGrandbudapest
    ? '正在登记入住...'
    : isMonument
    ? '正在重构几何...'
    : isBladerunner
    ? '正在扫描视网膜...'
    : isShanhaijing
    ? '正在展开手卷...'
    : isEva
    ? '正在同步A.T.力场...'
    : isKurosawa
    ? '正在研墨...'
    : isLittleprince
    ? '正在浇灌玫瑰...'
    : isLdr
    ? '正在装载选集...'
    : isJourney
    ? '正在等待风起...'
    : isNineteen84
    ? '正在校验思想...'
    : isCthulhu
    ? '正在聆听低语...'
    : isVaporwave
    ? '正在倒带...'
    : isGot
    ? '正在集结守夜人...'
    : isAkira
    ? '正在预热引擎...'
    : isGhibli
    ? '正在等风来...'
    : isWabisabi
    ? '正在扫枯山水...'
    : isDune
    ? '正在蒸馏香料...'
    : isBlackmirror
    ? '正在同步评分...'
    : isWitcher
    ? '正在磨刀...'
    : isDragonraja
    ? '正在唤醒龙血...'
    : isThreebody
    ? '正在监听宇宙...'
    : isDeanting
    ? '正在翻歌词本...'
    : isHaizi
    ? '正在等麦浪...'
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
        {isInterstellar && <InterstellarBackground />}
        {isGrandbudapest && <GrandbudapestBackground />}
        {isMonument && <MonumentBackground />}
        {isBladerunner && <BladerunnerBackground />}
        {isShanhaijing && <ShanhaijingBackground />}
        {isEva && <EvaBackground />}
        {isKurosawa && <KurosawaBackground />}
        {isLittleprince && <LittleprinceBackground />}
        {isLdr && <LdrBackground />}
        {isJourney && <JourneyBackground />}
        {isNineteen84 && <Nineteen84Background />}
        {isCthulhu && <CthulhuBackground />}
        {isVaporwave && <VaporwaveBackground />}
        {isGot && <GotBackground />}
        {isAkira && <AkiraBackground />}
        {isGhibli && <GhibliBackground />}
        {isWabisabi && <WabisabiBackground />}
        {isDune && <DuneBackground />}
        {isBlackmirror && <BlackmirrorBackground />}
        {isWitcher && <WitcherBackground />}
        {isDragonraja && <DragonrajaBackground />}
        {isThreebody && <ThreebodyBackground />}
        {isDeanting && <DeantingBackground />}
        {isHaizi && <HaiziBackground />}
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
        ) : isInterstellar ? (
          <Suspense fallback={null}>
            <InterstellarReader images={images} theme={theme} />
          </Suspense>
        ) : isGrandbudapest ? (
          <Suspense fallback={null}>
            <GrandbudapestReader images={images} theme={theme} />
          </Suspense>
        ) : isMonument ? (
          <Suspense fallback={null}>
            <MonumentReader images={images} theme={theme} />
          </Suspense>
        ) : isBladerunner ? (
          <Suspense fallback={null}>
            <BladerunnerReader images={images} theme={theme} />
          </Suspense>
        ) : isShanhaijing ? (
          <Suspense fallback={null}>
            <ShanhaijingReader images={images} theme={theme} folderName={folderName} />
          </Suspense>
        ) : isEva ? (
          <Suspense fallback={null}>
            <EvaReader images={images} theme={theme} />
          </Suspense>
        ) : isKurosawa ? (
          <Suspense fallback={null}>
            <KurosawaReader images={images} theme={theme} />
          </Suspense>
        ) : isLittleprince ? (
          <Suspense fallback={null}>
            <LittleprinceReader images={images} theme={theme} />
          </Suspense>
        ) : isLdr ? (
          <Suspense fallback={null}>
            <LdrReader images={images} theme={theme} folderName={folderName} />
          </Suspense>
        ) : isJourney ? (
          <Suspense fallback={null}>
            <JourneyReader images={images} theme={theme} />
          </Suspense>
        ) : isNineteen84 ? (
          <Suspense fallback={null}>
            <Nineteen84Reader images={images} theme={theme} />
          </Suspense>
        ) : isCthulhu ? (
          <Suspense fallback={null}>
            <CthulhuReader images={images} theme={theme} />
          </Suspense>
        ) : isVaporwave ? (
          <Suspense fallback={null}>
            <VaporwaveReader images={images} theme={theme} />
          </Suspense>
        ) : isGot ? (
          <Suspense fallback={null}>
            <GotReader images={images} theme={theme} />
          </Suspense>
        ) : isAkira ? (
          <Suspense fallback={null}>
            <AkiraReader images={images} theme={theme} />
          </Suspense>
        ) : isGhibli ? (
          <Suspense fallback={null}>
            <GhibliReader images={images} theme={theme} />
          </Suspense>
        ) : isWabisabi ? (
          <Suspense fallback={null}>
            <WabisabiReader images={images} theme={theme} />
          </Suspense>
        ) : isDune ? (
          <Suspense fallback={null}>
            <DuneReader images={images} theme={theme} />
          </Suspense>
        ) : isBlackmirror ? (
          <Suspense fallback={null}>
            <BlackmirrorReader images={images} theme={theme} />
          </Suspense>
        ) : isWitcher ? (
          <Suspense fallback={null}>
            <WitcherReader images={images} theme={theme} />
          </Suspense>
        ) : isDragonraja ? (
          <Suspense fallback={null}>
            <DragonrajaReader images={images} theme={theme} />
          </Suspense>
        ) : isThreebody ? (
          <Suspense fallback={null}>
            <ThreebodyReader images={images} theme={theme} />
          </Suspense>
        ) : isDeanting ? (
          <Suspense fallback={null}>
            <DeantingReader images={images} theme={theme} />
          </Suspense>
        ) : isHaizi ? (
          <Suspense fallback={null}>
            <HaiziReader images={images} theme={theme} />
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
