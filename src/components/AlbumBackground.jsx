/**
 * AlbumBackground — 纪念册桌面氛围
 * 深夜书桌：顶部一盏暖台灯 + 木质纹理 + 暗角
 * 安静衬托，主角是那本书
 */
export default function AlbumBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* 台灯光 — 顶部中央的暖光池 */}
      <div
        className="absolute left-1/2 top-[-10%] h-[70vh] w-[80vw] -translate-x-1/2 animate-glow-breathe"
        style={{
          background: 'radial-gradient(ellipse, rgba(201,168,106,0.08) 0%, transparent 55%)',
          animationDuration: '9s',
        }}
      />

      {/* 木质桌面纹理 — 极浅的横向木纹 */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          background:
            'repeating-linear-gradient(180deg, rgba(201,168,106,0.02) 0 2px, transparent 2px 90px), repeating-linear-gradient(90deg, rgba(0,0,0,0.08) 0 1px, transparent 1px 240px)',
        }}
      />

      {/* 两侧暗角 — 视线收拢到书上 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 45%, transparent 50%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </div>
  );
}
