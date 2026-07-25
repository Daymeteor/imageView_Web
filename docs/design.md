# 光影艺术展 — 设计文档

> 本文档用途：①总结当前 10 个主题的艺术风格与交互方式；②记录设计机制与踩过的坑，保证后续改动思路同步；③给未来的主题/交互提供素材库。
> 读法：新主题动工前先读「设计原则沉淀」和「交互范式」，选风格时翻「未来素材与想法参考」。

---

## 项目概述

基于 React + Vite 的本地照片展览 Web 应用。用户选择本地文件夹（照片不上传），以主题化的方式阅读照片。当前共 **10 个主题**，分属 **3 种交互范式**（见下），全部共享同一套设计 Token 架构。

- 技术栈：React 19 · Vite · Tailwind CSS v4 · GSAP (ScrollTrigger) · framer-motion · Radix Dialog · exifreader
- 入口：`src/App.jsx`（主题路由：URL `?theme=<id>`，`?demo=1` 加载示例图）
- 主题数据源：`src/data/themeConfig.js`（文案/渐变/accent/`scheme` 深浅标记）

---

## 设计系统架构

`:root` 定义默认主题（森林光影）的全部 Token，每个主题一个 CSS 文件，通过 `.theme-<id>` 作用域覆写变量，组件只消费语义化变量——**换主题 = 换变量**。

语义化别名（组件内一律使用这些，不直接写死颜色）：

| 变量 | 用途 |
|------|------|
| `--color-accent` / `-light` / `-pale` / `-dim` / `-subtle` | 强调色全梯队 |
| `--color-accent-card-border(-hover)` / `-glass-bg` / `-glass-border` / `-shadow(-hover)` | 卡片/玻璃/投影 |
| `--color-text-primary/secondary/muted` | 文字层级（深浅主题各自定义） |
| `--card-radius` / `--card-shadow(-hover)` | 卡片形态（孟菲斯硬投影、蒙德里安直角等） |
| `--font-display` / `--font-body` | 每主题字体 |

全局氛围层：`body::before` 环境光晕（每主题可覆写）、`body::after` SVG 噪点（浅主题下调透明度）。

**弹窗注意**：Radix Dialog portal 挂在 body 下，丢失 `.theme-<id>` 祖先。`PhotoModal` 接收 `theme` prop 并把 `theme-<id>` 挂在 `DialogContent` 上，主题样式才能生效。

---

## 字体系统

Google Fonts 按需加载（`index.html`）。分工原则：**拉丁字用风格化字体，中文回落 `Noto Serif SC` / 系统黑体；拟声词/标题需要日文字形时用 `M PLUS 1p`**。

| 用途 | 字体 | 使用主题 |
|------|------|----------|
| 优雅衬线展示 | Cormorant Garamond + Noto Serif SC | 森林 / 星座 / 动漫 / 赛博 / 纪念册 |
| 正文 | Manrope | 大多数主题 |
| 打字机等宽 | Courier Prime | 赛博（馆藏编号/展签落款）、暗房（正文/数据） |
| 波普粗黑 | Archivo Black | 孟菲斯 / 蒙德里安 |
| 几何无衬线 | Jost（Futura 血统） | 包豪斯 |
| 窄体海报 | Oswald | 暗房（标题） |
| 日文极黑 Gothic | M PLUS 1p (900) | 漫波普（标题/拟声词） |

---

## 十主题总览：风格 × 交互

### 交互范式（3 种阅读流 + 1 通用弹层）

| 范式 | 组件 | 交互 | 使用主题 |
|------|------|------|----------|
| **画廊流** | `ExhibitionHall` | 滚动纵览缩略图墙 → 作品详情（EXIF）→ 点图弹大图 | 森林 / 赛博 / 星座 / 动漫 / 蒙德里安 / 孟菲斯 / 包豪斯 / 暗房 |
| **翻书流** | `BookReader` | 合上的书 → 点击翻开 → 左右点击/←/→ 3D 翻页 → 末页合上 | 纪念册 |
| **漫画流** | `MangaReader` | 封面 → 分镜页逐格登场 → 左右点击/←/→ 斜切翻页 → つづく | 漫波普 |
| **通用弹层** | `PhotoModal` | 大图查看，方向键/按钮切换、旋转 | 全部（挂 `theme-<id>` 继承主题样式） |

### 主题卡片

| # | 主题 | id | 艺术风格 | 签名交互 / 记忆点 |
|---|------|----|----------|-------------------|
| 01 | 森林光影 | `forest` | 日本森林美学 × 暗调画廊，金光束 + 粒子 | 光束鼠标跟踪（GSAP quickTo） |
| 02 | 赛博博物馆 | `cyber` | 夜之城美术馆：CP2077 色彩纪律（沥青黑+铜琥珀+品红窗光），《疾速追杀》运镜 | 全息鉴定 hover 扫描、全息成像闪烁、标题对焦、展签逐行打印、霓虹雨痕 |
| 03 | 暗夜星座 | `constellation` | 星辰图谱 · 十二宫巡礼 | 照片即星图，星座 30s 自动轮换，星图/画廊双视图 |
| 04 | 漫影剧场 | `anime` | 次元跃迁 · 樱花霓虹，暗夜粉月 | 樱花粒子 + 圆月氛围 |
| 05 | 蒙德里安 | `mondrian` | De Stijl 原色构成，硬边直角 + 原色块动画背景 | 背景色块游走 |
| 06 | 孟菲斯 | `memphis` | 80s 波普几何，粗黑描边 + 硬偏移投影 | 几何图形弹跳背景 |
| 07 | 包豪斯 | `bauhaus` | 功能主义几何海报，瑞士排版 + Jost | 几何形变动画背景 |
| 08 | 漫波普 | `animepop` | **Persona 5 血统**：墨黑 + P5 红 + 白字斜切，拟声词即图形 | 漫画流：版式库编排、抽帧 slam、慢放拟声词、斜切扫过翻页 |
| 09 | 暗房 | `darkroom` | 红色安全灯下的胶片暗房，Oswald + Courier | **显影**：照片从红色负片显影为彩色（每次入视口重新触发）；胶片齿孔 + 帧编号 |
| 10 | 纪念册 | `album` | 暖棕桌面 + 高明度封面 + 道林纸内页 | 翻书流：镂空封面（6 色可选）+ 拍立得内页 + 级联合上 |

---

## 各主题签名设计（机制详录）

### 赛博博物馆（第 2 主题，已重做）

定位：**夜之城美术馆**——不是身处赛博空间，而是收藏赛博的博物馆。色彩向 CP2077 学习，运镜向《疾速追杀》学习（缓慢、有重量、偶发的精确）。

- **色彩**：沥青夜黑 `#0b0d12`；铜琥珀 `#e8a33d`（CP2077 黄 `#FCEE0A` 降饱和）做展签/射灯；全息青 `#59c2d8` 只做发丝线（<5%）；品红 `#ff2a6d` 仅作背景右侧"窗外夜之城"反光
- **字体分工**：衬线负责凝视（标题/展签），等宽负责档案（RELIC 编号、EXIF 落款）
- **签名元素**：`RELIC-01` 馆藏编号（hover 点亮）；博物馆墙签（双线细框 + `数字影像 · 馆藏` 标注）；详情图顶部射灯光锥
- **动画**：全息鉴定（hover 出 HUD 角框 + 扫描带 `cyber-scan`）；全息成像（入视口 0.7s RGB 色散闪烁 `cyber-materialize`，复用 `develop-in` 机制）；标题对焦（blur 10px + 0.42em 字距 → 1.4s 清晰）；展签逐行打印（GSAP batch stagger）；霓虹雨痕（`cyber-rain`，只下在品红窗光区）；车灯扫过（14s 一次）；卡片入场 1.15s 长 expo 推近

### 漫波普（第 8 主题，已重做）

定位：**照片被连载成一部波普漫画**，Persona 5 美术血统。墨黑 `#0a0a0c` + P5 红 `#E60012` + 白字，明黄 `#FFD90C` 点缀。

**漫画流（`MangaReader.jsx`）**：封面（ISSUE #01）→ 分镜页 → つづく 结尾页；点格弹 PhotoModal；EXIF 详情区下线。

- **版式库**（7 种コマ割り，槽位为 16:9 容器百分比）：`splash` 单页冲击 / `duoH` 双格横排 / `duoV` 双横堆叠 / `L1R2` 左一右二 / `R1L2` 右一左二 / `T1B2` 上一下二 / `trioRow` 三竖连排
- **比例自适应选版**：取接下来 1–3 张，对每个可行版式按「照片比例 vs 槽位比例」的对数差打分选最优；同版式连续 +0.35 惩罚、三格页 −0.12 鼓励、单页 +0.1 抑制
- **格子**：每页阅读顺序首格 = clip-path 斜切演出格（红影错位，宽格/直格两种切法），其余矩形粗白框信息格（红硬投影 + ±0.8° 微倾）+ P5 式黑色斜签文件名
- **拟声词**：ドン!!/バン!!/ゴゴゴゴ… 每页一词，M PLUS 1p 900 + 白字黑边红影，慢放蓄力弹入（0.2→1.22→1，`circOut`）
- **抽帧 slam**：格子进场关键帧「1.55 倍顿一拍（32%）→ 急砸 1.06 → 归位」+ 落定 0.35s 白闪 + 屏幕微震
- **翻页**：红色斜切面板横扫（0.6s，skewX -12°）+ 白闪，250ms 处换页
- **背景**：红色斜切多边形缓摆 + 速度线（一条 `steps(48)` 抽帧漂移）+ 网点呼吸

### 暗房（第 9 主题）

定位：看照片的应用，界面即摄影暗房。安全灯红 `#e8452c` + 近黑 `#0a0505`；Oswald 标题 + Courier Prime 正文。

- **显影（签名交互）**：所有照片初始为红色负片态（`sepia(0.9) hue-rotate(-32deg) saturate(2.4) brightness(0.5)`），入视口 350ms 后加 `.develop-in`，2.4s 显影为彩色；**离开视口重置，再进入重新显影**（`useInView(threshold, false)` + 组件内 developed 状态）
- **350ms 延迟是关键**：保证红色负片态先渲染一帧，否则首帧同帧加类会跳过显影过程
- **胶片语言**：缩略图上下齿孔带（`::before/::after` radial-gradient 循环）、左上角红色帧编号（`.frame-no`，其他主题下 `hidden`，赛博复用为 RELIC 编号）
- 大图弹窗同样显影（每次打开/切换重置）

### 纪念册（第 10 主题）

定位：**一本会翻页的书**（参考 FLIPIN）。翻书流 `BookReader.jsx` 替代画廊。

- **封面**：镂空窗口露第一张照片 + "baigao" 签名；6 色高明度可选（明黄/橙红/草绿/天蓝/紫罗兰/玫红），浅色封面签名自动转深色（`light` 标记）
- **内页**：米白道林纸 `#f5efe2`，书脊侧内阴影；拍立得白边（±0.6°）+ 斜体文件名 + 页码；扉页题记 + 末页「完 + 合上书本」
- **翻页机制**：`leaves = [封面, ...照片叶(正反两页), 封底]`，`k` = 已翻叶数；叶右半册绝对定位、`transform-origin: left center`、`.flipped { rotateY(-180deg) }`、`backface-visibility: hidden`；翻动中的叶临时提升 z-index
- **居中技巧**：合上（k=0）/ 读完（k=total）时书体 `translateX(∓25%)` 把半册滑到视觉中心（书宽的一半是一页，居中只需移动 25%）
- **级联合上**：按 60ms/叶延迟回翻，封面最后合上

---

## 动效体系

| 层 | 技术 | 用途 |
|----|------|------|
| 页面入场 | framer-motion | Landing 卡片交错、弹窗 spring、漫画逐格 slam |
| 滚入场 | GSAP ScrollTrigger.batch | 缩略图/详情分批入场（`once: true`） |
| 微交互 | GSAP quickTo / contextSafe | 卡片 hover、光束鼠标跟踪 |
| 氛围 | CSS keyframes | 呼吸光晕、流光、雨痕、速度线、噪点 |

缓动统一走 Token：`--ease-out-expo: cubic-bezier(0.19,1,0.22,1)`、`--ease-out-quint: cubic-bezier(0.22,0.1,0.13,1)`。

**动效语言的两极纪律**：
- **慢而重**（赛博/暗房/纪念册）：1s+ 长 expo、近乎静默的背景、偶发的精确事件（车灯/显影）
- **快而炸**（漫波普）：入场总长 ≤1.2s、spring 过冲、抽帧（关键帧 hold + steps()）、白闪打击帧

**张力技巧**（漫波普验证有效）：抽帧 slam = 关键帧先 hold（如 scale 1.55 保持 32% 时长）再急砸到位；慢放蓄力 = `circOut` 快速冲出后缓停；每格落定配 0.3s 白闪。

---

## 页面结构与组件地图

### Landing（`LandingPage.jsx`）
- 一页展示全部 10 张主题卡（lg 3 列网格，超高自然滚动）；浅主题卡由 `scheme: 'light'` 驱动深墨文字 + 白色柔光遮罩
- 卡片：编号 01–10 + accent 着色图标 + 「进入 →」CTA；framer-motion 交错入场

### 通用组件
```
src/
├── App.jsx                      # 主题路由 + 阅读流分流 + 背景懒加载
├── data/themeConfig.js          # 10 主题数据源（含 scheme 深浅标记）
├── styles/
│   ├── global.css               # Token + Tailwind 注册 + 全局工具类
│   └── themes/<id>.css          # 每主题变量覆写 + 主题专属类（共 10 个）
├── components/
│   ├── LandingPage.jsx          # 主题选择
│   ├── FolderSelector.jsx       # 空状态 + 10 个主题 SVG 图标
│   ├── NavigationBar.jsx        # 毛玻璃药丸导航
│   ├── ExhibitionHall.jsx       # 画廊流（8 主题，GSAP 编排）
│   ├── BookReader.jsx           # 翻书流（纪念册）
│   ├── MangaReader.jsx          # 漫画流（漫波普）
│   ├── ImageCard.jsx            # 缩略图（hover 揭示 + 暗房显影/赛博 RELIC 共用 .frame-no）
│   ├── PhotoDetail.jsx          # 详情 + EXIF（暗房显影/赛博墙签）
│   ├── PhotoModal.jsx           # 大图弹窗（挂 theme-<id>）
│   ├── ConstellationWelcome.jsx # 星座星图欢迎页
│   ├── FABGroup.jsx             # 回顶/返回 FAB
│   ├── <Theme>Background.jsx    # 10 个主题背景（懒加载）
│   └── ui/dialog.jsx            # Radix Dialog 原语
└── hooks/
    ├── useFolderReader.js       # File System Access API 读文件夹
    ├── useImagePreloader.js     # 分块预载
    ├── useExifData.js           # EXIF 解析
    ├── useInView.js             # 入视口（once 可配，显影/成像用）
    └── useParallax.js
```

---

## 设计原则沉淀（后续改动必读）

1. **主题 = 色板 + 字体 + 一个签名交互**。色板/字体走 token 覆写（零组件改动），签名交互才允许写主题专属代码，且必须用 `.theme-<id>` 作用域隔离，不污染其他主题。
2. **每主题一个记忆点**：显影（暗房）、翻书（纪念册）、拟声词分镜（漫波普）、全息鉴定（赛博）。没有记忆点的主题就是换色皮（漫波普重做前的教训）。
3. **克制比堆料难**：背景是潜台词（暗房/赛博），主角永远是照片；动效再炸也要压在 1.2s 内。
4. **文艺感 = 衬线 + 落款**：标题衬线负责凝视，等宽/小字负责档案感。
5. **交互范式要错开**：新主题优先考虑不复用现有三种阅读流，或给旧范式换皮换节奏。

### 踩过的坑（别再踩）

- **Tailwind v4 `bg-[var(--x)]` 有歧义**（color vs image），按钮底色可能丢失 → 关键背景用 inline `style` 或 `bg-(--x)`。
- **Radix Portal 丢主题类** → `DialogContent` 手动挂 `theme-<id>`。
- **入视口动画首帧跳过** → 加 350ms 延迟让初始态先渲染（暗房显影）。
- **% 宽 % 高单位不等价**（容器非正方形时比例失真）→ 布局坐标系先固定容器 aspect-ratio，再按 `w% = h% × r / A` 换算（漫波普版式库）。
- **截图验证的坑**：`networkidle` 可能耗时过长错过瞬时动画 → `waitForSelector` + 短延时抓拍；点页面验证翻页要避开照片热区（照片点击 = 弹大图）。
- **非 CSS layer 的普通主题 CSS 优先级高于 Tailwind layer** → 主题覆写与 utility 冲突时主题 CSS 胜（`.mg-sfx` vs `static` 的教训：覆盖定位用 inline style）。

---

## 未来素材与想法参考

### 候选主题（按优先级/讨论热度）

| 主题 | 概念 | 交互设想 | 风险/备注 |
|------|------|----------|-----------|
| **水墨卷轴** | 宣纸底 + 水墨留白 + 印章红 | **横向滚动手卷**：照片如画心装裱，横向拖动，卷首题跋/卷尾落款（印章可盖"baigao"） | 横向滚动改动大；做俗了像旅游景区；留白分寸难 |
| **Riso 孔版印刷** | 套色不准的错位 + 颗粒 + 荧光油墨（粉/蓝/黄） | 照片做双色套印效果（duotone + 错位），滚动时套色微微"对不准"地浮动 | 与孟菲斯气质部分重叠；duotone 用 CSS filter/mix-blend 可实现 |
| **档案终端** | 绿磷光/琥珀终端，CRT 扫描线 | 照片以 ASCII 预览"解码"出真图，打字机逐行输出 EXIF | 与赛博等宽落款撞车，需差异化（赛博是博物馆，这是机房） |
| **Y2K Chrome** | 千禧年金属泡泡 + 镭射渐变 | 照片装金属相框，hover 液态金属反光 | 容易土酷失衡 |
| **拍立得桌面** | 软木板/桌面 + 照片散落 | **自由拼贴**：照片拍立得散落桌面，可拖拽 rearrange，胶带/图钉细节 | 拖拽交互工程量；与纪念册拍立得撞元素 |

### 交互模式库（未被使用的范式）

- **Webtoon 纵向卷轴**：一整条竖向长卷，照片全宽串联，照片间插过渡格（速度线/拟声词/「つづく」悬念），滚动即阅读——比漫画流更轻的改造
- **一镜到底横移展厅**：相机 dolly 沿走廊横移，照片挂在两侧墙上（transform translateZ/X 伪 3D），滚轮控制前进
- **时间线编排**：按 EXIF 拍摄日期把照片排成年月时间轴（"2024 春 → 2025 冬"），适合所有主题作为可选视图
- **拖拽跟手翻页**：纪念册升级项，指腹粘滞 + 松手惯性
- **环境音**：暗房倒水声/赛博雨声/纪念册翻页声（WebAudio，默认静音）

### 素材备忘

- 参考站：[FLIPIN](https://flipin.pages.dev/)（翻书 + 镂空封面 + 封面编辑器，已用于纪念册）
- 美术参考：Persona 5 UI（黑红斜切 + 拟声词，已用于漫波普）；Cyberpunk 2077（色彩纪律，已用于赛博）；《疾速追杀》（运镜节奏，已用于赛博）
- 签名约定：封面/扉页/末页统一落款 **baigao**（纪念册已实施）
- Google Fonts 已加载：Cormorant Garamond / Noto Serif SC / Manrope / Courier Prime / Archivo Black / Jost / Oswald / M PLUS 1p

---

## 工具

- `all-themes-test.cjs`：Playwright 截图脚本（需 dev server 5173），输出 landing + 10 主题画廊图到项目根目录（`all-*` 与 `verify-*` 已 gitignore）
- `npm run lint`：oxlint（native binding 损坏时需重装 node_modules）
- `npm run build` / `npm run dev` / `npm run preview`
