# 光影艺术展 — 设计文档

## 项目概述

基于 React 的照片展览 Web 应用，支持三主题切换：**森林光影**（复古森系）、**赛博博物馆**（数字考古学）、**暗夜星座**（星辰图谱）。

---

## 主题设计

### 森林光影 (Forest Light)

**灵感来源**: 日本森林美学 × 当代暗调画廊

**配色**:
| 角色 | 色值 | 说明 |
|------|------|------|
| 背景 | `#060a06` | 墨色森林基底 |
| 强调色 | `#bf9b5e` | 穿林光束金 |
| 辅助色 | `#5a7d4a` | 苔色 |
| 辅助色 | `#6b7b6a` | 薄明水色 |

**特效**:
- Canvas 粒子系统（萤火虫光尘，80 颗粒子）
- 5 道动态光束（CSS skewX + mix-blend-mode: screen，GSAP quickTo 鼠标跟踪 + ScrollTrigger scrub 视差）
- 4 层环境光晕（radial-gradient）
- SVG 噪点纹理（feTurbulence）
- 玻璃拟态面板（backdrop-blur: 14px）
- 卡片入场 `back.out(1.7)` 有机回弹，`stagger: 0.06`

**字体**: Georgia / Noto Serif SC（衬线）

**动画**: beamFlow, beamBreath, twinkle, glowPulse（有机呼吸感），GSAP timeline 标题序列

---

### 赛博博物馆 (Cyber Museum)

**灵感来源**: Hermes Agent Dashboard

**配色**:
| 角色 | 色值 | 说明 |
|------|------|------|
| 背景 | `#041c1c` | 深暗青蓝（非纯黑） |
| 强调色 | `#ffac02` | 琥珀金数字暖光 |
| 前景色 | `#ffffff` | 纯白文字 |

**特效**:
- Arc Border — 160° 渐变描边，2.23s 旋转动画
- Dither 纹理 — conic-gradient 2px 点阵（GSAP steps 微闪）
- 扫描线 — GSAP timeline 变速脉冲
- 12 颗数字粒子光点 — GSAP 随机漂浮
- 3 层琥珀光晕 — `sine.inOut` 呼吸（6/8/10s 交错相位）
- 玻璃拟态 — 大暗影 + 内浮雕高光（Hermes 风格）
- 卡片入场 `power3.inOut` 利落，`stagger: 0.03`

**字体**: Courier Prime / Courier New（等宽衬线）

**动画**: gradient-stroke, scan-line, amber-pulse, spin-slow

---

### 暗夜星座 (Constellation)

**灵感来源**: 黄道十二宫 × 深空星野 × 暗色极简

**配色**:
| 角色 | 色值 | 说明 |
|------|------|------|
| 背景 | `#060612` | 深空靛蓝 |
| 强调色 | `#8899cc` | 月光银蓝 |
| 前景色 | `#e0e4f0` | 冷白 |
| 辅助色 | `#556688` | 星尘灰蓝 |

**特效**:
- Canvas 星野 — 500 颗随机星点，独立闪烁相位
- SVG 星座 — 基于实际天文星位简化的 12 宫星图，重心居中
- 过渡动画 — `back.out(1.5)` 星点逐个浮现
- 星点脉动 — `sine.inOut` 呼吸效果
- 背景跟随前景 — `prominent` 属性联动，`scale: 1 → 1.6`
- 欢迎页 — 大面积暗空留白 + 底部星座信息栏
- 30s 自动切换星座（排除当前，不重复）

**字体**: Georgia / Noto Serif SC（衬线）

**数据**: `src/data/zodiac.js` — 12 星座归一化星图数据（共享于 ConstellationBackground 和 ExhibitionHall）

**欢迎页交互**:
```
进入 → 巨型星图欢迎页（背景星座放大 1.6x）
  ├─ 点击标题 "星空图谱" → 切换画廊模式（星图收起）
  ├─ 点击欢迎页空白 → 进入画廊
  ├─ 点击 ✦ 按钮 → 切换星座（背景联动）
  └─ 画廊模式点击标题 → 返回欢迎页
```

---

## GSAP 动画引擎

### 安装
```
npm install gsap @gsap/react
```

### 注册
`App.jsx` 全局注册: `gsap.registerPlugin(ScrollTrigger, useGSAP)`

### 关键模式

| 组件 | GSAP 用法 | 说明 |
|------|-----------|------|
| LightBeam | `gsap.quickTo()` | 鼠标跟踪，替代 rAF 轮询 |
| LightBeam | `ScrollTrigger` + `scrub: 0.5` | 滚动视差 |
| ExhibitionHall | `gsap.timeline()` | 标题分割线 → 标题 → 副标题序列 |
| ExhibitionHall | `ScrollTrigger.batch()` | 缩略图 + 详情区批量滚动入场 |
| ImageCard | `gsap.to()` | hover 抬起 + click 回弹 |
| PhotoDetail | `gsap.to()` | 图片 hover 放大 |
| CyberBackground | `gsap.timeline()` | 扫描线变速脉冲 |
| CyberBackground | `gsap.to()` + `yoyo:true` | 光晕呼吸 + 粒子漂浮 |
| ConstellationBackground | `gsap.fromTo()` + `stagger` | 星座星点逐个浮现 |
| ConstellationBackground | `gsap.to()` + `sine.inOut` | 星点脉动呼吸 |
| ConstellationBackground | `gsap.to()` + `power3.out` | prominent 联动缩放 |

### 移除了
- `useScrollParallax.js` — 替代为 ScrollTrigger scrub
- `useParallax.js` 的 rAF 轮询 — 替代为 `gsap.quickTo()`
- ImageCard/PhotoDetail 的 IntersectionObserver — 替代为 `ScrollTrigger.batch()`
- Framer-motion 标题入场 — 替代为 `gsap.timeline()`
- Framer-motion hover 效果 — 替代为 `gsap.to()`

---

## 技术架构

### 主题切换机制

```
App.jsx (theme state: 'landing' | 'forest' | 'cyber' | 'constellation')
  ├── CSS 类切换: <div className={`app theme-${theme}`}>
  ├── body 类切换: .body-cyber / .body-constellation
  └── 条件渲染: isForest && <ParticleSystem />
```

- **CSS 变量驱动**: 组件通过 CSS 自定义属性获得颜色
- **语义化 accent 变量**: 三套主题在 `:root` / `.theme-cyber` / `.theme-constellation` 中各自定义
- **星座状态提升**: `zodiacIdx` 和 `constViewMode` 在 App.jsx 管理，同时传递给背景和前景

### 组件结构

| 组件 | 路径 | 主题感知 | 说明 |
|------|------|----------|------|
| App | `src/App.jsx` | ✅ 状态管理 | 主题 + 星座状态 + GSAP 注册 |
| LandingPage | `src/components/LandingPage.jsx` | ✅ 数据定义 | 三主题卡片 |
| ParticleSystem | `src/components/ParticleSystem.jsx` | 森林专属 | Canvas 萤火虫粒子 |
| LightBeam | `src/components/LightBeam.jsx` | 森林专属 | GSAP quickTo 光束 |
| CyberBackground | `src/components/CyberBackground.jsx` | 赛博专属 | GSAP 光晕 + 扫描线 + 粒子 |
| ConstellationBackground | `src/components/ConstellationBackground.jsx` | 星座专属 | Canvas 星野 + SVG 星座 + prominent 联动 |
| NavigationBar | `src/components/NavigationBar.jsx` | 仅显示文本 | CSS 变量驱动 |
| FolderSelector | `src/components/FolderSelector.jsx` | ✅ theme prop | 空状态选择器（三套文案+图标） |
| ExhibitionHall | `src/components/ExhibitionHall.jsx` | ✅ theme prop | 瀑布流 + 模态框 + 星座欢迎页 |
| ImageCard | `src/components/ImageCard.jsx` | 否 | CSS 变量 + GSAP hover |
| PhotoDetail | `src/components/PhotoDetail.jsx` | 否 | CSS 变量 + EXIF + GSAP hover |

### 数据文件

| 文件 | 说明 |
|------|------|
| `src/data/zodiac.js` | 12 星座星图数据（0-100 归一化坐标），共享于 ConstellationBackground 和 ExhibitionHall |

### CSS 架构

```
styles/global.css      — :root 变量、三套主题覆盖、arc-border 工具类
styles/animations.css  — @keyframes（三主题共用 + Hermes 动画）
各组件内 <style>       — 组件级样式，使用 var(--color-*) 变量
```

---

## 交互功能

### 右下角浮动按钮（FAB）

- **↑ 回到顶部** — 常驻显示，平滑滚动到页顶
- **↶ 回到上一个位置** — 有点击跳转历史时出现，弹出栈顶位置返回

### 图片预加载

- 进入展览前 `new Image()` 遍历全部 URL 强制缓存
- 预加载进度显示（"正在缓存图片… 18/40"）
- 全部就绪后遮罩消失，开放交互

### 图片定位

- 文件名排序（`localeCompare` + 数字自然排序）
- 横版/竖版分组展示（各用 flex-wrap 行排）
- 缩略图、详情区、模态框三处统一顺序（`combined = [...landscape, ...portrait]`）
- UUID 唯一 ID 避免子目录同名冲突

---

## 设计资产参考

### Hermes 设计系统

来源: Hermes Agent Dashboard (Tailwind CSS v4.3.1)

- **配色**: 背景 `#041c1c`，强调色 `#ffac02`
- **Arc Border**: `@property --arc-angle` + `mask-composite: exclude`
- **阴影**: 大暗影 + 内浮雕 `inset 1px 1px 0 0 rgba(255,255,255,0.16)`
- **Dither**: `repeating-conic-gradient` 2px 点阵

### 黄道十二宫

基于实际天文星位简化，每个星座 6-10 颗主星 + 连线。数据详见 `src/data/zodiac.js`。

---

## 未来计划

- [ ] 星座主题的全屏星图模式
- [ ] 键盘快捷键导航
- [ ] 图片搜索/过滤
- [ ] 自定义主题系统
- [ ] 星座主题的 30s 自动轮播可暂停
