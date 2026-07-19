/**
 * 主题配置（共享数据源）
 * LandingPage / App / FolderSelector / ExhibitionHall 统一引用
 */
export const THEMES = [
  {
    id: 'forest',
    title: '森林光影',
    subtitle: 'Forest Light',
    desc: '复古森系 · 光影艺术展',
    icon: '🌿',
    gradient: 'linear-gradient(135deg, #1a2e14, #0a1209)',
    accent: '#bf9b5e',
    glow: 'rgba(191, 155, 94, 0.15)',
    selectTitle: '光影艺术展',
    selectSubtitle: 'Forest Light Exhibition',
    selectDesc: '选择一个包含照片的文件夹，开启你的森林光影展览',
    headerTitle: '森林光影集',
    headerSub: 'Forest Light Collection',
    footer: '— End of Exhibition —',
  },
  {
    id: 'cyber',
    title: '赛博博物馆',
    subtitle: 'Cyber Museum',
    desc: '数字遗迹 · 琥珀暗房',
    icon: '◆',
    gradient: 'linear-gradient(135deg, #041c1c, #0a1f1f)',
    accent: '#ffac02',
    glow: 'rgba(255, 172, 2, 0.15)',
    selectTitle: '赛博博物馆',
    selectSubtitle: 'Cyber Museum',
    selectDesc: '选择一个包含照片的文件夹，开启数字考古之旅',
    headerTitle: '赛博光影集',
    headerSub: 'Cyber Light Collection',
    footer: '— End of Transmission —',
  },
  {
    id: 'constellation',
    title: '暗夜星座',
    subtitle: 'Constellation',
    desc: '星辰图谱 · 十二宫巡礼',
    icon: '✦',
    gradient: 'linear-gradient(135deg, #0d0d24, #060612)',
    accent: '#8899cc',
    glow: 'rgba(136, 153, 204, 0.12)',
    selectTitle: '暗夜星座',
    selectSubtitle: 'Constellation Atlas',
    selectDesc: '选择一个包含照片的文件夹，在星空下展开你的图像星图',
    headerTitle: '星空图谱',
    headerSub: 'Constellation Atlas',
    footer: '— End of Star Map —',
  },
  {
    id: 'anime',
    title: '漫影剧场',
    subtitle: 'Anime Theater',
    desc: '次元跃迁 · 霓虹幻梦',
    icon: '✿',
    gradient: 'linear-gradient(135deg, #1a0a2e, #0d0a1a)',
    accent: '#ff6b9d',
    glow: 'rgba(255, 107, 157, 0.18)',
    selectTitle: '漫影剧场',
    selectSubtitle: 'Anime Theater',
    selectDesc: '选择一个包含照片的文件夹，进入次元画廊，让回忆在樱花与霓虹中放映',
    headerTitle: '次元画廊',
    headerSub: 'Anime Gallery',
    footer: '— End of Scene —',
  },
];

/** 按 id 查找主题 */
export function getTheme(id) {
  return THEMES.find(t => t.id === id) || THEMES[0];
}
