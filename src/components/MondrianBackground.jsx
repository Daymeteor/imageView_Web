import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * MondrianBackground — 蒙德里安背景
 * - 几何网格构图， thick black lines
 * - 红/白/蓝/黄 色块填充
 * - 微妙的色块呼吸动画与位置偏移
 * - 纯 CSS/Tailwind 实现，无 Canvas
 */
export default function MondrianBackground() {
  const containerRef = useRef(null);

  // 色块呼吸动画 + 位置偏移
  useGSAP(() => {
    // 红色色块呼吸
    gsap.to('.mbg-block-red', {
      scale: 1.03,
      duration: 4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    // 蓝色色块呼吸（错开相位）
    gsap.to('.mbg-block-blue', {
      scale: 1.02,
      duration: 5,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 1.5,
    });

    // 黄色色块呼吸
    gsap.to('.mbg-block-yellow', {
      scale: 1.04,
      duration: 6,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 0.8,
    });

    // 白色色块微妙位移
    gsap.to('.mbg-block-white', {
      x: 2,
      y: -2,
      duration: 7,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      stagger: {
        each: 1.2,
        from: 'random',
      },
    });

    // 网格线微妙透明度变化
    gsap.to('.mbg-grid-line', {
      opacity: 0.85,
      duration: 3,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      stagger: {
        each: 0.5,
        from: 'random',
      },
    });
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      style={{ backgroundColor: '#F8F9FA' }}
    >
      {/* === 主网格构图层 === */}
      <div className="absolute inset-0 flex">
        {/* 左侧大列 */}
        <div className="relative flex flex-col" style={{ width: '38%', borderRight: '3px solid #111111' }}>
          {/* 左上白色块 */}
          <div
            className="mbg-block-white relative"
            style={{ height: '35%', borderBottom: '3px solid #111111', backgroundColor: '#F8F9FA' }}
          />
          {/* 左中红色块 */}
          <div
            className="mbg-block-red relative"
            style={{ height: '45%', borderBottom: '3px solid #111111', backgroundColor: '#E63946' }}
          />
          {/* 左下白色块 */}
          <div
            className="mbg-block-white relative"
            style={{ height: '20%', backgroundColor: '#F8F9FA' }}
          />
        </div>

        {/* 右侧区域 */}
        <div className="relative flex-1 flex flex-col">
          {/* 右上区域 */}
          <div className="relative flex" style={{ height: '55%', borderBottom: '3px solid #111111' }}>
            {/* 右上左：蓝色块 */}
            <div
              className="mbg-block-blue relative"
              style={{ width: '45%', borderRight: '3px solid #111111', backgroundColor: '#1D3557' }}
            />
            {/* 右上右：白色块 */}
            <div
              className="mbg-block-white relative flex-1"
              style={{ backgroundColor: '#F8F9FA' }}
            />
          </div>

          {/* 右下区域 */}
          <div className="relative flex flex-1">
            {/* 右下左：白色块 */}
            <div
              className="mbg-block-white relative"
              style={{ width: '55%', borderRight: '3px solid #111111', backgroundColor: '#F8F9FA' }}
            />
            {/* 右下右：黄色块 */}
            <div
              className="mbg-block-yellow relative flex-1"
              style={{ backgroundColor: '#FFD60A' }}
            />
          </div>
        </div>
      </div>

      {/* === 额外装饰线条层 === */}
      {/* 水平装饰线 */}
      <div
        className="mbg-grid-line absolute"
        style={{
          top: '22%',
          left: '38%',
          right: 0,
          height: '2px',
          backgroundColor: '#111111',
          opacity: 0.7,
        }}
      />
      <div
        className="mbg-grid-line absolute"
        style={{
          top: '72%',
          left: 0,
          width: '38%',
          height: '2px',
          backgroundColor: '#111111',
          opacity: 0.7,
        }}
      />

      {/* 垂直装饰线 */}
      <div
        className="mbg-grid-line absolute"
        style={{
          top: 0,
          left: '18%',
          width: '2px',
          height: '35%',
          backgroundColor: '#111111',
          opacity: 0.5,
        }}
      />
      <div
        className="mbg-grid-line absolute"
        style={{
          bottom: 0,
          right: '25%',
          width: '2px',
          height: '45%',
          backgroundColor: '#111111',
          opacity: 0.5,
        }}
      />

      {/* === 小装饰色块 === */}
      {/* 小红色方块 */}
      <div
        className="mbg-block-red absolute"
        style={{
          top: '8%',
          right: '8%',
          width: '48px',
          height: '48px',
          backgroundColor: '#E63946',
          border: '2px solid #111111',
        }}
      />

      {/* 小蓝色方块 */}
      <div
        className="mbg-block-blue absolute"
        style={{
          bottom: '12%',
          left: '8%',
          width: '36px',
          height: '36px',
          backgroundColor: '#1D3557',
          border: '2px solid #111111',
        }}
      />

      {/* 小黄色长方形 */}
      <div
        className="mbg-block-yellow absolute"
        style={{
          top: '62%',
          left: '28%',
          width: '60px',
          height: '24px',
          backgroundColor: '#FFD60A',
          border: '2px solid #111111',
        }}
      />

      {/* === 细网格纹理覆盖 === */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(90deg, #111111 0px, #111111 1px, transparent 1px),
            linear-gradient(0deg, #111111 0px, #111111 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* === 微妙渐变覆盖，增加深度 === */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 80% 20%, rgba(230, 57, 70, 0.04) 0%, transparent 50%),
            radial-gradient(ellipse at 20% 80%, rgba(29, 53, 87, 0.04) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
