/**
 * BlackmirrorBackground — 纯黑 + LED 屏幕阵列（各自微光闪烁）
 */

const SCREENS = Array.from({ length: 24 }, (_, i) => ({
  x: 4 + (i % 8) * 12.5,
  y: 6 + Math.floor(i / 8) * 14,
  dur: `${2.6 + (i % 4) * 0.9}s`,
  delay: `${(i % 6) * 0.5}s`,
}));

export default function BlackmirrorBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-black" aria-hidden="true">
      {SCREENS.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-[3px] border border-white/[0.07]"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: '9%',
            height: '10%',
            background: 'rgba(74,144,217,0.05)',
            animation: `bm-led ${s.dur} linear ${s.delay} infinite`,
          }}
        >
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-sm"
            style={{
              width: '38%',
              height: '52%',
              background: 'rgba(255,255,255,0.06)',
              boxShadow: '0 0 12px rgba(74,144,217,0.15)',
            }}
          />
        </div>
      ))}
    </div>
  );
}
