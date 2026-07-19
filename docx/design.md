# 光影艺术展 · 设计文档

## 项目概述

单页 React 图片画廊应用，支持多个视觉主题切换。每个主题为同一套功能（文件夹选择、图片画廊、详情展示、模态框）提供不同的视觉氛围。

当前已完成的主题：

| 主题 | ID | 风格 | 核心视觉 |
|------|----|------|----------|
| 森林光影 | `forest` | 复古森系暗调画廊 | 金色光束、粒子、玻璃拟态 |
| 赛博博物馆 | `cyber` | 琥珀/青蓝数字暗房 | 扫描线、Dither、霓虹光晕 |
| 暗夜星座 | `constellation` | 深空星图 | Canvas 星空、SVG 星座连线 |
| 漫影剧场 | `anime` | 动漫/二次元霓虹 | 樱花飘落、满月、霓虹粉蓝 |
| 蒙德里安 | `mondrian` | 几何秩序/原色画廊 | 粗黑网格、红蓝黄白块 |
| 孟菲斯 | `memphis` | 80s 波普几何 | 高饱和色块、波浪、圆点、三角 |
| 包豪斯 | `bauhaus` | 功能主义/瑞士海报 | 几何构成、网格、海报感 |
| 漫波普 | `animepop` | 动漫波普/速度线 | 红蓝白大色块、网点纸、集中线 |

---

## 主题系统架构

### 配置层：`src/data/themeConfig.js`

所有主题共享同一套数据结构，包含：

- `id`：主题标识
- `title` / `subtitle` / `desc`：展示文案
- `icon`：LandingPage 入口图标
- `gradient` / `accent` / `glow`：LandingPage 卡片视觉
- `selectTitle` / `selectDesc`：空状态文案
- `headerTitle` / `headerSub` / `footer`：展览大厅文案

新增主题只需在 `THEMES` 数组中追加一条配置，并补充对应的 CSS 主题文件与背景组件。

### 样式层：`src/styles/themes/*.css`

每个主题通过 CSS 自定义属性覆盖全局 token：

- `--color-bg-*`：背景色阶
- `--color-gold-*` / `--color-moss-*`：语义化色系
- `--color-accent-*`：强调色及玻璃/边框/阴影派生
- `--color-text-*`：文字层级
- `--glass-*` / `--card-*`：玻璃拟态与卡片参数
- `--font-*`：字体族

主题通过父级 class `.theme-{id}` 挂载到 `App.jsx` 根节点，实现一次性全局切换。

### 组件层：`src/components/*Background.jsx`

每个主题拥有独立的背景组件，负责：

- 背景画布/渐变/几何构成
- Canvas 粒子/花瓣/速度线等动态效果
- GSAP 驱动的呼吸、位移、旋转动画

背景组件在 `App.jsx` 中通过 `React.lazy` 按主题懒加载，各自拆分为独立 chunk，避免首屏加载所有主题代码。

---

## 新主题实现总结

### 蒙德里安（Mondrian）

**关键词**：粗黑线网格、原色块、绝对平面、秩序感

- 背景为白色/浅灰画布，粗黑线切分画面
- 红 `#E63946`、蓝 `#1D3557`、黄 `#FFD60A`、白 `#F8F9FA` 四色块
- 网格线 subtle 透明度呼吸动画
- 色块轻微缩放/位移，像 living poster
- 卡片采用直角、硬边、2px 黑框

实现文件：
- `src/components/MondrianBackground.jsx`
- `src/styles/themes/mondrian.css`

### 孟菲斯（Memphis）

**关键词**：80s/90s、波浪、圆点、三角、高饱和、playful

- 纯白/浅灰基底 + 红 `#FF2E63`、蓝 `#00D4FF`、黄 `#FFE600`
- 散布的几何装饰：大三角、圆环、波浪线、小圆点
- Canvas 绘制动态点阵纹理
- GSAP 驱动形状漂浮、旋转、缩放
- 卡片粗黑边框 + 硬阴影

实现文件：
- `src/components/MemphisBackground.jsx`
- `src/styles/themes/memphis.css`

### 包豪斯（Bauhaus）

**关键词**：功能主义、几何、瑞士网格、海报感

- 浅灰/米白基底
- 红 `#E63946`、深蓝 `#1D3557`、黑 `#111111` 几何块
- 不对称网格布局，像海报构图
- 几何块位移动画（keyframes 定义在 CSS）
- 瑞士排版网格底纹
- 卡片直角、细边框、克制阴影

实现文件：
- `src/components/BauhausBackground.jsx`
- `src/styles/themes/bauhaus.css`

### 漫波普（Anime Pop）

**关键词**：动漫波普、速度线、网点纸、红蓝白、对话框

- 纯白画布 + 动漫红 `#FF1A1A`、钴蓝 `#0055FF`
- Canvas 绘制从中心向外辐射的速度线
- 星芒/爆炸线装饰、漫画对话框、网点纸纹理
- 对角大色块、斜条纹装饰
- 最贴合原始“红白蓝 + 动漫纯色 + 色块拼接”诉求

实现文件：
- `src/components/AnimePopBackground.jsx`
- `src/styles/themes/anime-pop.css`

---

## LandingPage 入口设计

### 布局

- 响应式 Grid：`1 列 → 2 列 → 4 列`
- 每个主题卡片统一尺寸，`min-h-[380px]`，内容底部对齐
- 描述文字限制 3 行（`line-clamp-3`），避免不同文案撑出不同高度

### 动画节奏

- 容器入场：`staggerChildren: 0.12`，`delayChildren: 0.2`
- 单卡片入场：`duration: 0.8`，ease `[0.19, 1, 0.22, 1]`
- 悬停：`y: -10`，`scale: 1.02`，`duration: 0.35`
- 所有卡片共享同一套 `variants` 与 `whileHover`，节奏一致

### 可读性处理

浅色主题（蒙德里安、孟菲斯、包豪斯、漫波普）背景偏白，而文字为白色/米白。解决方案：

- 卡片底部增加 `bg-gradient-to-t from-black/75 via-black/30 to-transparent` 遮罩
- 保证标题、描述、按钮在所有主题下均可读
- 悬停时顶部光晕与边框发光层叠加，不依赖文字颜色

---

## 性能与工程优化

### 1. 背景组件懒加载

`App.jsx` 将所有背景组件改为 `React.lazy + Suspense`，按当前主题动态加载：

- 主包不再包含未使用主题的代码
- 每个背景组件拆分为独立 chunk（2–7 kB gzip）
- 首屏只加载 LandingPage 与核心功能

### 2. ScrollTrigger 正确清理

`ExhibitionHall` 中 `ScrollTrigger.batch` 返回的实例在 `useGSAP` 清理函数中统一 `kill()`，避免：

- 主题切换后旧 batch 仍在监听
- 重复动画与内存泄漏

### 3. 图片资源管理

- `URL.revokeObjectURL` 仅释放 `blob:` 链接，避免误伤 `/demo/*` 路径
- `useImagePreloader` 清理时取消未完成图片请求
- `useFolderReader` 在重新选择文件夹或组件卸载时释放旧 URL

### 4. GSAP 使用规范

- 移除 `gsap.registerPlugin(useGSAP)` 错误调用（`useGSAP` 是 React hook，不是插件）
- `ImageCard` / `PhotoDetail` 使用 `contextSafe` 包裹动画，确保卸载时自动清理

### 5. EXIF 读取修复

`useExifData` 原使用 `doneRef` 导致切换图片后不再读取。改为按 `image.id` 追踪，每次新图片都会重新读取 EXIF。

### 6. 事件监听去重

`LightBeam` 原本独立监听 `mousemove`，与 `useParallax` 重复。改为复用 `useParallax` 返回的鼠标归一化坐标，减少全局事件监听数量。

### 7. 代码复用

- 删除 `lib/utils.js` 中与 `utils/imageHelpers.js` 重复的 `formatFilename`
- `PhotoDetail` / `PhotoModal` 统一使用 `fileNameToTitle`

---

## 已知限制与后续方向

### 当前限制

1. **主包体积**：React、framer-motion、gsap 等依赖集中在主 chunk，仍有 660 kB（gzip 218 kB）。如需进一步拆分，可考虑：
   - 按路由/主题拆分流式加载核心组件
   - 使用 GSAP 的 tree-shaking 替代全量导入
2. **浅色主题通用性**：`mondrian` / `memphis` / `bauhaus` / `animepop` 的文字颜色在部分 UI（如导航栏、文件夹选择器）仍依赖 `--color-text-primary` 为深色。若未来继续增加浅色主题，建议引入 `data-theme-mode="light|dark"` 以便组件针对性调整。
3. **动画可访问性**：目前未针对 `prefers-reduced-motion` 做统一降级。后续可在 `global.css` 中统一禁用非必要动画。

### 后续可探索方向

- 更多艺术主题：浮世绘、蒸汽波、极简黑白、印象派油画
- 主题切换过渡动画
- 图片瀑布流布局按主题差异化
- 键盘导航与屏幕阅读器优化
- PWA 离线缓存与图片懒加载策略

---

## 参考

- Tailwind CSS v4 主题系统：https://tailwindcss.com/docs/theme
- GSAP + React：`@gsap/react` 的 `useGSAP` hook
- Radix UI Dialog：模态框可访问性基座
- 原始提案参考网站：`https://ae-ai-motion-lhs.com/`（当时无法访问，最终方案基于文本描述与经典设计风格实现）
