/**
 * DarkroomBackground — 暗房氛围背景
 * 红色安全灯的呼吸光晕 + 放大机光锥 + 暗角
 * 刻意保持安静：暗房的主角是照片本身
 */
export default function DarkroomBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* 安全灯 — 右上角缓慢呼吸的红光 */}
      <div
        className="absolute -right-[10%] -top-[20%] h-[70vh] w-[60vw] animate-glow-breathe rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(232,69,44,0.09) 0%, transparent 60%)',
          animationDuration: '7s',
        }}
      />

      {/* 放大机光锥 — 从顶部中央落下的微弱红光 */}
      <div
        className="absolute left-1/2 top-0 h-[55vh] w-[46vw] -translate-x-1/2"
        style={{
          background:
            'linear-gradient(180deg, rgba(232,69,44,0.05) 0%, rgba(232,69,44,0.015) 55%, transparent 100%)',
          clipPath: 'polygon(42% 0, 58% 0, 100% 100%, 0% 100%)',
        }}
      />

      {/* 显影盘微光 — 左下角的一汪红 */}
      <div
        className="absolute -bottom-[15%] -left-[8%] h-[45vh] w-[40vw] rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(232,69,44,0.05) 0%, transparent 65%)',
        }}
      />

      {/* 暗角 — 把视线收拢到画面中心 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,0.5) 100%)',
        }}
      />
    </div>
  );
}
