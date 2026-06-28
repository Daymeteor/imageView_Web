# 光影艺术展 — 设计文档

## 项目概述

基于 React 的照片展览 Web 应用，支持双主题切换：**森林光影**（复古森系）和 **赛博博物馆**（数字考古学）。

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
- 5 道动态光束（CSS skewX + mix-blend-mode: screen）
- 4 层环境光晕（radial-gradient）
- SVG 噪点纹理（feTurbulence）
- 玻璃拟态面板（backdrop-blur: 14px）

**字体**: Georgia / Noto Serif SC（衬线）

**动画**: beamFlow, beamBreath, twinkle, glowPulse（有机呼吸感）

---

### 赛博博物馆 (Cyber Museum)

**灵感来源**: Hermes Agent Dashboard (`http://127.0.0.1:9119/chat`)

**配色**:
| 角色 | 色值 | 说明 |
|------|------|------|
| 背景 | `#041c1c` | 深暗青蓝（非纯黑） |
| 强调色 | `#ffac02` | 琥珀金数字暖光 |
| 前景色 | `#ffffff` | 纯白文字 |

**特效**:
- Arc Border — 160° 渐变描边，2.23s 旋转动画
- Dither 纹理 — conic-gradient 2px 点阵
- 扫描线 — 水平光束周期扫描
- 玻璃拟态 — 大暗影 + 内浮雕高光（Hermes 风格）
- 3 层环境光晕（琥珀色为主 + 微弱青色）

**字体**: Courier Prime / Courier New（等宽衬线）

**动画**: gradient-stroke, scan-line, amber-pulse, spin-slow

---

## 技术架构

### 主题切换机制

```
App.jsx (theme state: 'landing' | 'forest' | 'cyber')
  ├── CSS 类切换: <div className={`app theme-${theme}`}>
  ├── body 类切换: document.body.classList.add('body-cyber')
  └── 条件渲染: isForest && <ParticleSystem />
```

- **CSS 变量驱动**: 组件通过 CSS 自定义属性获得颜色，不接收 theme prop
- **语义化 accent 变量**: `--color-accent`, `--color-accent-dim` 等，在 `:root`（森林）和 `.theme-cyber`（赛博）中分别定义
- **条件渲染**: 仅背景特效组件（ParticleSystem/CyberBackground）按主题切换

### 组件结构

| 组件 | 路径 | 主题感知 | 说明 |
|------|------|----------|------|
| App | `src/App.jsx` | ✅ 状态管理 | 主题状态 + 编排 |
| LandingPage | `src/components/LandingPage.jsx` | ✅ 数据定义 | 双主题卡片 |
| ParticleSystem | `src/components/ParticleSystem.jsx` | 森林专属 | Canvas 粒子 |
| LightBeam | `src/components/LightBeam.jsx` | 森林专属 | CSS 光束 |
| CyberBackground | `src/components/CyberBackground.jsx` | 赛博专属 | 光晕 + 纹理 + 扫描线 |
| NavigationBar | `src/components/NavigationBar.jsx` | 仅显示文本 | CSS 变量驱动 |
| FolderSelector | `src/components/FolderSelector.jsx` | ✅ theme prop | 空状态选择器 |
| ExhibitionHall | `src/components/ExhibitionHall.jsx` | ✅ theme prop | 瀑布流 + 模态框 |
| ImageCard | `src/components/ImageCard.jsx` | 否 | CSS 变量驱动 |
| PhotoDetail | `src/components/PhotoDetail.jsx` | 否 | CSS 变量 + EXIF |

### CSS 架构

```
styles/global.css      — :root 变量、主题覆盖、arc-border 工具类
styles/animations.css  — @keyframes（双主题共用）
各组件内 <style>       — 组件级样式，使用 var(--color-*) 变量
```

---

## 设计资产参考

### Hermes 设计系统提取

来源: `http://127.0.0.1:9119/chat` (Tailwind CSS v4.3.1 构建)

**Arc Border 技术**:
```css
@property --arc-angle {
  syntax: '<angle>';
  initial-value: 160deg;
  inherits: true;
}

.arc-border::before {
  background: linear-gradient(
    var(--arc-angle),
    transparent 0%, var(--arc-c0) 15%, var(--arc-c1) 20%,
    var(--arc-c2) 25%, transparent 35%, transparent 40%,
    var(--arc-c0) 55%, var(--arc-c1) 60%, var(--arc-c2) 65%,
    transparent 75%, transparent 80%, var(--arc-c0) 95%,
    var(--arc-c1) 100%
  );
  mask-composite: exclude;
}
```

**Hermes 阴影系统**:
- 大暗影: `0 12px 32px -8px rgba(0,0,0,0.6)`
- 内浮雕: `inset -1px -1px 0 0 rgba(0,0,0,0.5), inset 1px 1px 0 0 rgba(255,255,255,0.16)`

**Dither 纹理**:
```css
background: repeating-conic-gradient(
  currentColor 0% 25%,
  transparent 0% 50%
) 0 0 / 2px 2px;
```

---

## 未来计划

- [ ] 赛博主题的数据可视化（EXIF 时间线、地图）
- [ ] 键盘快捷键导航
- [ ] 图片搜索/过滤
- [ ] 自定义主题系统（用户自定义配色）
