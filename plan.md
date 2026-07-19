# 光影艺术展 · 专业设计重构计划

## 项目背景

本项目是一个单页 React 图片画廊应用，支持三种视觉主题：

- **森林光影** — 复古森系暗调画廊
- **赛博博物馆** — 琥珀/青蓝数字暗房
- **暗夜星座** — 深空星图与十二宫巡礼

原始实现已经具备精致的视觉效果（GSAP 滚动动画、Canvas 粒子/星空、玻璃拟态 UI、EXIF 元数据展示），但代码组织偏"手搓"：大量样式写在 JSX 的 `<style>` 标签内，缺少现代设计系统与组件原语。

## 重构目标

1. 引入 2026 年主流设计栈（Tailwind CSS v4 + shadcn/ui 原语）。
2. 将分散的内联样式迁移为可维护的 Tailwind 工具类 + 全局设计 Token。
3. 在保留原有视觉氛围的前提下，提升专业设计感（排版、间距、hover 状态、玻璃拟态）。
4. 保证所有既有功能完整可用：主题切换、文件夹选择、图片预加载、画廊滚动动画、详情展示、模态框、键盘导航。

## 参考项目

本次重构参考了 GitHub 上当前最热门的设计与组件项目（均已下载到 `D:/CODE/` 供本地参考）：

| 项目 | 用途 | 学习点 |
|------|------|--------|
| [shadcn/ui](https://github.com/shadcn-ui/ui) | React 组件分发范式 | Radix + Tailwind 的 copy-paste 组件模式、`cn()` 工具函数 |
| [Magic UI](https://github.com/magicuidesign/magicui) | Landing Page 动效 | 流光 shimmer、边框光晕、卡片 hover 效果 |
| [Radix UI Primitives](https://github.com/radix-ui/primitives) | 无障碍原语 | Dialog 的焦点捕获、ARIA、键盘处理 |
| [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) | CSS 框架 | v4 CSS-first 配置、`@theme` 注册自定义 Token |

## 技术栈变化

### 新增依赖

```json
{
  "dependencies": {
    "@radix-ui/react-dialog": "^1.1.19",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.6.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.3.3",
    "tailwindcss": "^4.3.3"
  }
}
```

### 核心设计决策

| 决策 | 说明 |
|------|------|
| **Tailwind CSS v4** | 采用 CSS-first 配置，`@import "tailwindcss"` + `@theme` 注册项目 Token。 |
| **保留 CSS 自定义属性** | 三主题系统继续以 CSS 变量为单一事实来源，Tailwind 通过 `bg-[var(--color-bg-deep)]` 等方式引用。 |
| **shadcn/ui Dialog 原语** | 复制 Radix Dialog 组件替换自定义 Modal，获得内置焦点捕获、ESC 关闭、ARIA 支持。 |
| **cn() 工具函数** | `clsx` + `tailwind-merge`，用于动态类名合并与冲突解决。 |
| **无 TypeScript 转换** | 保持 JSX，降低重构风险，专注设计与架构。 |
| **保留 GSAP + Framer Motion** | 不替换现有动画引擎，它们是项目的核心视觉资产。 |

## 文件结构变化

### 新增

- `src/lib/utils.js` — `cn()`、`pad()`、`formatFilename()` 工具函数
- `src/components/ui/dialog.jsx` — shadcn/ui 风格 Dialog 原语
- `src/styles/themes/forest.css` — 森林主题微调
- `src/styles/themes/cyber.css` — 赛博主题覆盖
- `src/styles/themes/constellation.css` — 星座主题覆盖
- `public/demo/` — 8 张示例图片，用于 Demo/测试模式

### 重写/迁移

| 文件 | 变化 |
|------|------|
| `vite.config.js` | 添加 `@tailwindcss/vite` 插件、`@` 路径别名 |
| `src/styles/global.css` | 改为 Tailwind v4 入口，保留 design tokens，新增 glass/accent-card/text-gradient 工具类 |
| `src/styles/animations.css` | 整合关键帧与动画工具类 |
| `src/App.jsx` | 移除内联 `<style>`，导入主题文件，支持 `?demo=1&theme=xxx` 测试入口 |
| `src/components/LandingPage.jsx` | Tailwind 化，增强卡片 hover 光晕与边框效果 |
| `src/components/NavigationBar.jsx` | Tailwind 化，优化玻璃拟态与间距 |
| `src/components/FolderSelector.jsx` | Tailwind 化，提升文字对比度与按钮扫光效果 |
| `src/components/ImageCard.jsx` | Tailwind 化，增强 shimmer 与 hover 状态 |
| `src/components/PhotoDetail.jsx` | Tailwind 化，优化信息面板排版 |
| `src/components/ExhibitionHall.jsx` | Tailwind 化，保留 GSAP ScrollTrigger 逻辑 |
| `src/components/PhotoModal.jsx` | 接入 shadcn/ui Dialog，保留旋转、键盘导航、图片切换动画 |
| `src/components/FABGroup.jsx` | Tailwind 化 |
| `src/components/CyberBackground.jsx` | 静态样式 Tailwind 化，仅保留动态粒子定位 |
| `src/components/ConstellationBackground.jsx` | 静态样式 Tailwind 化，仅保留动态 SVG 定位 |
| `src/components/ConstellationWelcome.jsx` | Tailwind 化 |
| `src/hooks/useFolderReader.js` | 新增 `loadDemo()` 方法，支持从 `public/demo/` 自动加载示例图片 |

### 保留未改动

- `src/components/ParticleSystem.jsx`
- `src/components/LightBeam.jsx`
- `src/hooks/useExifData.js`
- `src/hooks/useImagePreloader.js`
- `src/hooks/useParallax.js`
- `src/data/themeConfig.js`
- `src/data/zodiac.js`
- `src/utils/imageHelpers.js`

## 设计改进点

1. **Landing 页面**
   - 标题字号提升，增加顶部微光装饰。
   - 主题卡片增加 hover 边框光晕、顶部渐变线、内部光晕层。
   - 图标 hover 时放大，进入按钮箭头微动。

2. **FolderSelector**
   - 图标外圈增加发光效果。
   - 副标题颜色从 `accent-dim` 提升为 `accent`，增强可读性。
   - 按钮边框与背景对比度提高，hover 扫光更明显。

3. **Gallery**
   - 图片卡片 hover 时底部出现主题色渐变条。
   - 分类标签增加圆点标识，排版更紧凑。
   - 详情区标题增加底部分隔线，EXIF 行间距更合理。

4. **Modal**
   - 使用 Radix Dialog 原语，焦点管理更可靠。
   - 图片切换增加方向感知的滑入动画。
   - 控制按钮使用一致的玻璃拟态样式。

## 新增主题：漫影剧场（Anime Theater）

为项目新增第四个专题页面「漫影剧场」，与森林/赛博/星座并列。

### 设计概念

- **主题名称**：漫影剧场 / Anime Theater
- **副标题**：次元跃迁 · 霓虹幻梦
- **视觉方向**：二次元夜空、樱花飘落、巨大满月、霓虹粉/电光蓝、漫画网点纸与速度线
- **色彩**：
  - 背景：深紫蓝夜空 `#0a0912`
  - 主强调：霓虹粉 `#ff6b9d`
  - 辅助：电光蓝 `#00d4ff`、柔紫 `#9d7bff`

### 新增/修改文件

- `src/data/themeConfig.js` — 添加 `anime` 主题配置
- `src/styles/themes/anime.css` — 动漫主题 Token 与工具类
- `src/components/AnimeBackground.jsx` — 樱花飘落 Canvas、月亮、霓虹光晕、网点纸、速度线、漂浮光点
- `src/components/FolderSelector.jsx` — 为 anime 主题增加樱花 SVG 图标
- `src/App.jsx` — 导入 anime 主题、渲染 `AnimeBackground`、URL 参数支持 `theme=anime`

### 访问方式

```
http://localhost:5173/?demo=1&theme=anime
```

## 修复记录

### 1. 页面未居中

**原因**：`src/styles/global.css` 中的全局重置写了 `* { margin: 0; padding: 0; }`，这些规则处于未分层（unlayered）样式，优先级高于 Tailwind utilities 层，导致 `mx-auto`、`px-4` 等工具类被覆盖失效。

**修复**：
- 移除 `* { margin: 0; padding: 0; }`，仅保留 `box-sizing: border-box`。
- Tailwind v4 自带的 preflight 已负责 margin/padding 重置。
- 在 `@theme` 中补充 `--spacing: 0.25rem`，确保 `px-*` 等工具类计算正确。

### 2. 模态框图片背景纯色底 + 旋转被裁剪

**原因**：
- 图片外层容器使用了 `bg-[var(--color-bg-surface)]`，在图片后形成一块纯色底。
- 图片外层容器使用了 `overflow-hidden`，旋转后的图片四角被裁剪。
- `DialogContent` 默认定位为 `fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`，与自定义居中样式冲突，导致模态框内容偏位。

**修复**：
- 移除图片容器的背景色与 `overflow-hidden`。
- 图片容器改为 `75vw × 85vh` 的 flex 居中区域，图片使用 `object-contain`，旋转后不裁剪。
- 将 `src/components/ui/dialog.jsx` 中 `DialogContent` 的默认定位改为 `fixed inset-0 flex items-center justify-center`，确保模态内容真正居中。

### 3. 星空图谱背景星座连线/星点消失

**原因**：重构 `ConstellationBackground.jsx` 时把最外层容器设为 `-z-[1]`，导致 SVG 星座被 `body` 的深色背景覆盖；`CyberBackground.jsx` 也有同样隐患。

**修复**：
- 将星座背景与赛博背景的 `z-index` 从 `-z-[1]` 改为 `z-0`，使其位于 `body` 背景之上、内容之下。
- 保持 GSAP 入场/脉动/ prominent 缩放动画不变。

## 测试与验证

### Demo 模式

URL 参数支持快速进入指定主题并加载示例图片：

```
http://localhost:5173/?demo=1&theme=forest
http://localhost:5173/?demo=1&theme=cyber
http://localhost:5173/?demo=1&theme=constellation
```

### 验证清单

- [x] `npm run build` 成功构建
- [x] `npm run dev` 正常启动
- [x] Landing 页面三个主题卡片显示与 hover 动画正常
- [x] 森林/赛博/星座主题的 FolderSelector 显示正常
- [x] Demo 模式自动加载示例图片
- [x] 画廊网格布局与 GSAP 滚动入场动画正常
- [x] 点击缩略图滚动到详情区正常
- [x] 详情区 EXIF 信息面板显示正常
- [x] 点击图片打开模态框，旋转、上一张/下一张、ESC 关闭正常
- [x] 星座主题星图/画廊切换正常
- [x] 导航栏返回主题、切换文件夹功能正常
- [x] FAB 回到顶部/回到上一位置功能正常
- [x] 响应式布局在桌面端正常

## 已知事项

- `oxlint` 在本地因原生绑定问题无法运行（`dlopen` 段错误），与本次代码改动无关。
- 生产构建提示 JS chunk 大于 500KB，建议未来对大型依赖（如 GSAP + Framer Motion）进行按需加载或 code splitting，但本次重构以保持功能稳定为优先。

## 下一步建议

1. 添加 `prefers-reduced-motion` 媒体查询，为运动敏感用户提供减弱动画模式。
2. 对移动端画廊进行更细致的响应式优化（当前已在关键断点做了适配）。
3. 考虑引入 `zustand` 或 React Context 管理跨组件状态，进一步解耦。
4. 为图片增加 lazy loading 占位图的 skeleton 效果。

---

重构完成时间：2026-07-19
