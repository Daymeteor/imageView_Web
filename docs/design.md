# 光影艺术展 — 设计文档

## 项目概述

基于 React + Vite 的本地照片展览 Web 应用。用户选择本地文件夹（照片不上传），以主题画廊的形式浏览：缩略图墙 → 作品详情（EXIF）→ 大图查看；纪念册主题则为独立的翻书阅读流。当前共 **10 个主题**，全部共享同一套设计 Token 架构。

- 技术栈：React 19 · Vite · Tailwind CSS v4 · GSAP (ScrollTrigger) · framer-motion · Radix Dialog · exifreader
- 入口：`src/App.jsx`（主题路由：URL `?theme=<id>`，`?demo=1` 加载示例图）
- 主题数据源：`src/data/themeConfig.js`（9 个主题的全部文案/渐变色/accent/深浅色标记）

---

## 设计系统架构

`:root` 定义默认主题（森林光影）的全部 Token，每个主题一个 CSS 文件，通过 `.theme-<id>` 作用域覆写变量，组件只消费语义化变量，实现"换主题 = 换变量"：

```css
:root               /* 基底色 / 金色系 / 苔色系 / 文字层级 / 卡片 / 玻璃 / 动效曲线 / 字体 */
.theme-darkroom     /* 同构覆写：--color-accent* 、--color-text-* 、--card-* 、--glass-* 、--font-* */
```

语义化别名是主题适配的关键，组件内一律使用：

| 变量 | 用途 |
|------|------|
| `--color-accent` / `-light` / `-pale` / `-dim` / `-subtle` | 强调色全梯队 |
| `--color-accent-card-border(-hover)` | 卡片描边 |
| `--color-accent-glass-bg` / `-glass-border` | 玻璃面板 |
| `--color-accent-shadow(-hover)` | 发光投影 |
| `--color-text-primary/secondary/muted` | 文字层级（深浅主题各自定义） |
| `--card-radius` / `--card-shadow(-hover)` | 卡片形态（孟菲斯硬投影、蒙德里安直角等） |
| `--font-display` / `--font-body` | 每主题字体 |

全局氛围层：`body::before` 环境光晕（每主题可覆写）、`body::after` SVG 噪点（feTurbulence，浅主题下调透明度）。

---

## 字体系统

Google Fonts 按需加载（`index.html`），中西文分工：拉丁字用风格化字体，中文回落 `Noto Serif SC` / 系统黑体。

| 用途 | 字体 | 使用主题 |
|------|------|----------|
| 优雅衬线展示 | Cormorant Garamond + Noto Serif SC | 森林 / 星座 / 动漫 / 赛博 / 纪念册（默认） |
| 正文 | Manrope | 大多数主题 |
| 打字机等宽 | Courier Prime | 赛博（馆藏编号/展签落款）、暗房（正文/数据） |
| 波普粗黑 | Archivo Black | 孟菲斯 / 蒙德里安 / 漫波普 |
| 几何无衬线 | Jost（Futura 血统） | 包豪斯 |
| 窄体海报 | Oswald | 暗房（标题） |

---

## 九主题一览

| # | 主题 | id | 概念 | Accent | 深浅 |
|---|------|----|------|--------|------|
| 01 | 森林光影 | `forest` | 日本森林美学 × 暗调画廊 | 光束金 `#bf9b5e` | 深 |
| 02 | 赛博博物馆 | `cyber` | 夜之城美术馆：数字遗迹馆藏，射灯 + 墙签 + RELIC 编号（向 CP2077 色彩与《疾速追杀》运镜学习） | 铜琥珀 `#e8a33d` | 深 |
| 03 | 暗夜星座 | `constellation` | 星辰图谱 · 十二宫巡礼（30s 自动轮换，星图/画廊双视图） | 星蓝 `#8899cc` | 深 |
| 04 | 漫影剧场 | `anime` | 次元跃迁 · 樱花霓虹 | 樱粉 `#ff6b9d` | 深 |
| 05 | 蒙德里安 | `mondrian` | De Stijl 原色构成，硬边直角 + 原色块背景 | 红 `#E63946` | 浅 |
| 06 | 孟菲斯 | `memphis` | 80s 波普几何，粗黑描边 + 硬偏移投影 | 品红 `#FF2E63` | 浅 |
| 07 | 包豪斯 | `bauhaus` | 功能主义几何海报，瑞士排版 | 红 `#E63946` | 浅 |
| 08 | 漫波普 | `animepop` | 次元拼贴 · 速度线 | 红 `#FF1A1A` | 浅 |
| 09 | 暗房 | `darkroom` | 红色安全灯下的胶片暗房，**显影交互** | 安全灯红 `#e8452c` | 深 |
| 10 | 纪念册 | `album` | 一本会翻页的书：镂空封面 + 拍立得内页 + 3D 翻页（参考 FLIPIN） | 烫金 `#c9a86a` | 深 |

浅主题的 Landing 卡片由 `themeConfig.scheme: 'light'` 驱动：深墨文字 + 白色柔光遮罩（深主题为白字 + 暗色遮罩）。

---

## 赛博博物馆（第 2 主题，已重做）— 签名设计

定位：**夜之城美术馆**——不是身处赛博空间，而是收藏赛博的博物馆。色彩纪律向 Cyberpunk 2077 学习，运镜语言向《疾速追杀》学习（缓慢、有重量、偶发的精确）。

**色彩**
- 基底沥青夜黑 `#0b0d12`（弃用翠绿底）
- 主 accent 铜琥珀 `#e8a33d`（CP2077 招牌黄 `#FCEE0A` 的降饱和版）——展签与射灯
- 全息青 `#59c2d8` 只做发丝线与微尘（面积 < 5%）
- 品红 `#ff2a6d` 仅作背景右侧"窗外夜之城"的呼吸反光

**字体**：衬线负责凝视（标题/展签用 Cormorant + Noto Serif SC），等宽负责档案（馆藏编号、EXIF 落款用 Courier Prime）。

**签名元素**
- `RELIC-01` 馆藏编号：缩略图左上角等宽细字，hover 时点亮
- 博物馆墙签：EXIF 面板改为双线细框 + `数字影像 · 馆藏` 等宽标注
- 展品射灯：详情图顶部琥珀光锥渐变

**动画语言（赛博专属）**
| 动效 | 触发 | 说明 |
|------|------|------|
| 全息鉴定 | hover 缩略图 | HUD 角框亮起 + 扫描带掠过 + 编号点亮（`cyber-scan`） |
| 全息成像 | 图片入视口 | 0.7s RGB 色散闪烁后定格（`cyber-materialize`，复用 `develop-in` 机制，离开再进入重新触发） |
| 标题对焦 | 展头入场 | 失焦 blur(10px) + 0.42em 字距 → 1.4s 对焦清晰（expo.out） |
| 展签打印 | 详情入视口 | 墙签文字逐行从左滑出（GSAP batch，stagger 0.08） |
| 霓虹雨痕 | 背景常驻 | 青/品红双色雨，只下在右侧品红窗光区（`cyber-rain`） |
| 车灯扫过 | 每 14s | 宽软暖光带横穿展厅（GSAP timeline） |
| 卡片入场 | 滚动 | 1.15s 长 expo 推近（重量感，区别于其他主题的回弹） |

---

## 暗房主题（第 9 主题）— 签名设计

定位：整个应用里最"元"的主题——看照片的应用，界面即摄影暗房。

**视觉**
- 基底近黑 `#0a0505`，主色安全灯红 `#e8452c`，辅助相纸乳白 `#e8ddd0`
- 标题 Oswald 窄体（胶片海报字），正文/数据 Courier Prime（冲洗记录仪器感）
- `DarkroomBackground.jsx`：安全灯呼吸红光 + 放大机光锥 + 显影盘微光 + 暗角，刻意安静，把视线让给照片

**签名交互 — 显影（Developing）**
- 所有照片（缩略图 / 详情图 / 大图弹窗）初始为红色负片态：
  `filter: sepia(0.9) hue-rotate(-32deg) saturate(2.4) brightness(0.5) contrast(1.05)`
- 进入视口后延迟 350ms 加 `.develop-in`，2.4s 内显影为彩色（`useInView` hook + `cubic-bezier(0.22,0.1,0.13,1)`）
- **离开视口后重置，再次进入重新显影**（`useInView(threshold, once=false)`）
- 大图弹窗每次打开/切换也重新显影（弹窗 portal 挂在 body 下，靠 `DialogContent` 上的 `theme-<id>` class 继承主题样式）
- 延迟 350ms 是关键：保证红色负片态先于显影渲染一帧，否则首帧同帧加类会跳过显影过程

**胶片语言**
- 缩略图上下两条片孔带（`.thumb .group::before/::after`，radial-gradient 循环齿孔）
- 左上角红色帧编号 `01/02/…`（Courier Prime + 红光晕，`.frame-no`，其他主题下 `hidden`）
- 卡片直角（`--card-radius: 2px`），悬停信息条上移避让片孔带

---

## 纪念册（第 10 主题）— 签名设计

定位：**一本会翻页的书**（参考 [FLIPIN](https://flipin.pages.dev/) 的翻书交互）。不走瀑布流画廊，是独立的书本阅读流——`BookReader.jsx` 替代 `ExhibitionHall`。

**流程**：选文件夹 → 合上的书（镂空封面）→ 点击翻开 → 左右翻页 → 末页「完」→ 级联合上。

**封面**
- 镂空窗口露出第一张照片（FLIPIN 签名式处理）+ 窗口下方 "baigao" 烫金/墨字签名
- 6 色可选（明黄/橙红/草绿/天蓝/紫罗兰/玫红，高明度鲜明系），浅色封面签名自动切换深色（`light` 标记）

**内页**
- 米白道林纸（`#f5efe2`），书脊侧内阴影区分左右页
- 每页一张照片：拍立得白边（微倾斜 ±0.6°）+ 斜体文件名 + 页码
- 扉页题记（纪念册 + 文件夹名 + 日期 + baigao），末页「完 + 合上书本」

**翻页机制（纯 CSS 3D）**
- 数据模型：`leaves = [封面, ...照片叶(正反两页), 封底]`，`k` = 已翻叶数
- 叶：右半册绝对定位，`transform-origin: left center`，`.flipped { rotateY(-180deg) }`，`backface-visibility: hidden` 双面
- 点击右半页前翻 / 左半页后翻 + 键盘 ←/→；翻动中的叶临时提升 z-index
- 合上（k=0）/ 读完（k=total）时书体 `translateX(∓25%)` 把半册滑到视觉中心
- 「合上书本」按 60ms/叶级联回翻，封面最后合上
- 桌面氛围 `AlbumBackground.jsx`：暖台灯 + 木纹 + 暗角

**大图**：点击拍立得复用 `PhotoModal`（弹窗挂 `theme-album` 继承主题样式）。

---

## 页面结构

### Landing（`LandingPage.jsx`）
- 一页展示全部 10 张主题卡（lg 3 列网格，移动端 1 列，超高自然滚动）
- 页头：菱形分隔装饰 + Cormorant 大标题 + 斜体英文副标；页底隐私提示
- 卡片：编号（01–09）+ accent 着色图标 + 标题/副标/描述 +「进入 →」CTA；hover 上浮 + 顶部光晕 + 边框发光；framer-motion 交错入场
- 布局为 `overflow-y-auto` + `my-auto`：超高时自然滚动，不裁剪内容

### 文件夹选择（`FolderSelector.jsx`）
- 每主题独立 SVG 图标（暗房为胶片框 + 齿孔），呼吸光晕 + 扫光按钮（圆角走 `--card-radius`）

### 展览大厅（`ExhibitionHall.jsx`）
- 展头：菱形分隔线 + 大标题 + 斜体英文副标（GSAP 入场编排）
- 分区标签（横版/竖版）：菱形点 + 张数 + 延伸细线的编辑排版
- 缩略图按横/竖分组 masonry；`useImagePreloader` 分块预载 + conic-gradient 进度环
- ScrollTrigger.batch 滚动入场（赛博/星座用 inOut 快速节奏，其余 back.out 有机回弹）

### 作品详情（`PhotoDetail.jsx`）
- 锚点条：大号序号 + 竖分隔线 + 文件名（font-display）
- EXIF 面板：「标签定宽 + 点状引线 + 值」两栏，玻璃拟态

### 大图弹窗（`PhotoModal.jsx`）
- Radix Dialog，spring 方向性切换、旋转控制、键盘 ←/→；caption 用 font-display
- 接收 `theme` prop 并在 DialogContent 上挂 `theme-<id>`，保证 portal 内主题样式生效

### 缩略图卡（`ImageCard.jsx`）
- GSAP hover 上浮/回弹；hover 揭示底部渐变 + 文件名 + accent 渐变条 + 流光扫过
- 暗房主题下叠加显影/齿孔/帧编号（全部由 `.theme-darkroom` 作用域 CSS 驱动，其他主题零影响）

---

## 动效体系

| 层 | 技术 | 用途 |
|----|------|------|
| 页面入场 | framer-motion | Landing 卡片交错、弹窗 spring 切换 |
| 滚入场 | GSAP ScrollTrigger.batch | 缩略图/详情分批入场（`once: true`） |
| 微交互 | GSAP quickTo / contextSafe | 卡片 hover、光束鼠标跟踪 |
| 氛围 | CSS keyframes | 呼吸光晕、流光、虚线描边、噪点 |

缓动统一走 Token：`--ease-out-expo: cubic-bezier(0.19,1,0.22,1)`、`--ease-out-quint: cubic-bezier(0.22,0.1,0.13,1)`。

---

## 组件 / 文件地图

```
src/
├── App.jsx                      # 主题路由 + 背景懒加载 + 加载遮罩
├── data/themeConfig.js          # 9 主题数据源（含 scheme 深浅标记）
├── styles/
│   ├── global.css               # Token 定义 + Tailwind 注册 + 全局工具类
│   ├── animations.css           # 关键帧
│   └── themes/<id>.css          # 每主题变量覆写（共 9 个）
├── components/
│   ├── LandingPage.jsx          # 主题选择（3×3 卡片）
│   ├── FolderSelector.jsx       # 空状态 + 9 个主题 SVG 图标
│   ├── NavigationBar.jsx        # 毛玻璃药丸导航
│   ├── ExhibitionHall.jsx       # 画廊编排（GSAP）
│   ├── BookReader.jsx           # 纪念册翻书阅读器（仅 album 主题）
│   ├── ImageCard.jsx            # 缩略图（hover 揭示 + 暗房显影）
│   ├── PhotoDetail.jsx          # 详情 + EXIF（暗房显影）
│   ├── PhotoModal.jsx           # 大图弹窗（暗房显影）
│   ├── ConstellationWelcome.jsx # 星座星图欢迎页
│   ├── FABGroup.jsx             # 回顶/返回 FAB
│   ├── <Theme>Background.jsx    # 10 个主题背景（懒加载）
│   └── ui/dialog.jsx            # Radix Dialog 原语
├── hooks/
│   ├── useFolderReader.js       # File System Access API 读文件夹
│   ├── useImagePreloader.js     # 分块预载
│   ├── useExifData.js           # EXIF 解析
│   ├── useInView.js             # 入视口（once 可配，显影用）
│   └── useParallax.js
└── utils/imageHelpers.js        # 文件名转标题等
```

## 工具

- `all-themes-test.cjs`：Playwright 截图脚本，需 dev server（5173）运行，输出 landing + 10 主题画廊图到项目根目录
- `npm run lint`：oxlint（注意：native binding 损坏时需重装 node_modules）
- `npm run build` / `npm run dev` / `npm run preview`
