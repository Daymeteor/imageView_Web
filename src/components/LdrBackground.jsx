/**
 * LdrBackground — 三屏三画风（写实CG/2D动画/定格）+ 片头剪影 + 扫描线
 */

export default function LdrBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <rect width="1440" height="900" fill="#0d0d14" />

        {/* 三块巨屏：三种画风 */}
        {/* 左屏：写实 CG（蓝调景深） */}
        <g style={{ animation: 'ldr-flicker 9s linear infinite' }}>
          <rect x="90" y="180" width="360" height="220" fill="#0D47A1" opacity="0.35" stroke="rgba(74,144,217,0.5)" strokeWidth="2" />
          <circle cx="270" cy="290" r="56" fill="#4a90d9" opacity="0.4" />
          <rect x="90" y="180" width="360" height="220" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <text x="270" y="426" textAnchor="middle" fill="#6fabe8" fontSize="15" letterSpacing="6" fontFamily="Archivo Black, sans-serif">CG UNIT</text>
        </g>
        {/* 中屏：2D 动画（红调扁平） */}
        <g style={{ animation: 'ldr-flicker 11s linear -3s infinite' }}>
          <rect x="540" y="180" width="360" height="220" fill="#8B0000" opacity="0.32" stroke="rgba(239,83,80,0.5)" strokeWidth="2" />
          <polygon points="720,240 770,340 670,340" fill="#D32F2F" opacity="0.5" />
          <rect x="540" y="180" width="360" height="220" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <text x="720" y="426" textAnchor="middle" fill="#ef5350" fontSize="15" letterSpacing="6" fontFamily="Archivo Black, sans-serif">2D UNIT</text>
        </g>
        {/* 右屏：定格动画（银灰颗粒） */}
        <g style={{ animation: 'ldr-flicker 13s linear -6s infinite' }}>
          <rect x="990" y="180" width="360" height="220" fill="#37474F" opacity="0.4" stroke="rgba(176,190,197,0.5)" strokeWidth="2" />
          <rect x="1120" y="250" width="60" height="90" fill="#B0BEC5" opacity="0.45" />
          <rect x="990" y="180" width="360" height="220" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <text x="1170" y="426" textAnchor="middle" fill="#B0BEC5" fontSize="15" letterSpacing="6" fontFamily="Archivo Black, sans-serif">STOP-MO</text>
        </g>

        {/* 底部放映厅光带 */}
        <rect y="640" width="1440" height="4" fill="#D32F2F" opacity="0.4" />
        <rect y="648" width="1440" height="2" fill="rgba(255,255,255,0.12)" />

        {/* 扫描线 */}
        <rect x="0" y="0" width="1440" height="3" fill="rgba(255,255,255,0.06)" style={{ animation: 'ldr-scan 7s linear infinite' }} />
      </svg>
    </div>
  );
}
