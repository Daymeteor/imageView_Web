/**
 * BauhausBackground — 包豪斯风格背景
 * - 几何色块构成（红、蓝、白、黑）
 * - 不对称网格布局
 * - 微妙的几何动画（旋转、位移）
 * - 瑞士国际主义排版网格感
 */
export default function BauhausBackground() {
  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      style={{ background: '#F1FAEE' }}
    >
      {/* 左上角大红色方块 — 主视觉锚点 */}
      <div
        className="absolute bbg-geo"
        style={{
          top: 0,
          left: 0,
          width: 'clamp(180px, 22vw, 320px)',
          height: 'clamp(180px, 22vw, 320px)',
          background: '#E63946',
          animation: 'bbgShift1 18s ease-in-out infinite',
        }}
      />

      {/* 右上角深蓝色矩形 */}
      <div
        className="absolute bbg-geo"
        style={{
          top: 0,
          right: 0,
          width: 'clamp(120px, 16vw, 240px)',
          height: 'clamp(200px, 30vh, 400px)',
          background: '#1D3557',
          animation: 'bbgShift2 22s ease-in-out infinite',
        }}
      />

      {/* 左下角黑色细条 */}
      <div
        className="absolute bbg-geo"
        style={{
          bottom: 0,
          left: 0,
          width: 'clamp(200px, 35vw, 480px)',
          height: 'clamp(40px, 6vh, 80px)',
          background: '#111111',
          animation: 'bbgShift3 20s ease-in-out infinite',
        }}
      />

      {/* 右下角白色方块带红边 */}
      <div
        className="absolute bbg-geo"
        style={{
          bottom: '8vh',
          right: '6vw',
          width: 'clamp(80px, 10vw, 160px)',
          height: 'clamp(80px, 10vw, 160px)',
          background: '#F1FAEE',
          border: '3px solid #E63946',
          animation: 'bbgRotate1 24s ease-in-out infinite',
        }}
      />

      {/* 中部蓝色横条 */}
      <div
        className="absolute bbg-geo"
        style={{
          top: '45%',
          left: '30%',
          width: 'clamp(100px, 18vw, 280px)',
          height: 'clamp(16px, 2.5vh, 32px)',
          background: '#1D3557',
          animation: 'bbgShift4 16s ease-in-out infinite',
        }}
      />

      {/* 中部红色小方块 */}
      <div
        className="absolute bbg-geo"
        style={{
          top: '55%',
          left: '55%',
          width: 'clamp(40px, 5vw, 80px)',
          height: 'clamp(40px, 5vw, 80px)',
          background: '#E63946',
          animation: 'bbgRotate2 20s ease-in-out infinite',
        }}
      />

      {/* 右侧黑色竖条 */}
      <div
        className="absolute bbg-geo"
        style={{
          top: '20%',
          right: '12%',
          width: 'clamp(8px, 1.2vw, 18px)',
          height: 'clamp(100px, 20vh, 280px)',
          background: '#111111',
          animation: 'bbgShift5 19s ease-in-out infinite',
        }}
      />

      {/* 左下角蓝色小方块 */}
      <div
        className="absolute bbg-geo"
        style={{
          bottom: '18vh',
          left: '8vw',
          width: 'clamp(50px, 6vw, 100px)',
          height: 'clamp(50px, 6vw, 100px)',
          background: '#1D3557',
          animation: 'bbgRotate3 26s ease-in-out infinite',
        }}
      />

      {/* 顶部细红线 */}
      <div
        className="absolute bbg-geo"
        style={{
          top: '12vh',
          left: '25%',
          width: 'clamp(60px, 10vw, 150px)',
          height: '2px',
          background: '#E63946',
          animation: 'bbgShift6 14s ease-in-out infinite',
        }}
      />

      {/* 网格底纹 — 瑞士排版网格感 */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(#111111 1px, transparent 1px), linear-gradient(90deg, #111111 1px, transparent 1px)',
          backgroundSize: 'clamp(40px, 6vw, 80px) clamp(40px, 6vw, 80px)',
        }}
      />

      {/* 对角线装饰 — 动态建筑感 */}
      <div
        className="absolute bbg-geo opacity-10"
        style={{
          top: '30%',
          left: '-10%',
          width: '140%',
          height: '1px',
          background: '#1D3557',
          transform: 'rotate(-12deg)',
          animation: 'bbgShift7 28s ease-in-out infinite',
        }}
      />
      <div
        className="absolute bbg-geo opacity-8"
        style={{
          top: '60%',
          left: '-10%',
          width: '140%',
          height: '1px',
          background: '#E63946',
          transform: 'rotate(8deg)',
          animation: 'bbgShift8 24s ease-in-out infinite',
        }}
      />

      {/* 圆形几何 — 包豪斯经典元素 */}
      <div
        className="absolute bbg-geo rounded-full"
        style={{
          top: '15%',
          left: '45%',
          width: 'clamp(30px, 4vw, 60px)',
          height: 'clamp(30px, 4vw, 60px)',
          background: '#1D3557',
          opacity: 0.15,
          animation: 'bbgPulse 10s ease-in-out infinite',
        }}
      />
      <div
        className="absolute bbg-geo rounded-full"
        style={{
          bottom: '25%',
          right: '25%',
          width: 'clamp(20px, 3vw, 50px)',
          height: 'clamp(20px, 3vw, 50px)',
          border: '2px solid #E63946',
          opacity: 0.2,
          animation: 'bbgPulse 14s ease-in-out infinite 2s',
        }}
      />

      {/* 微妙的颗粒纹理 */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
