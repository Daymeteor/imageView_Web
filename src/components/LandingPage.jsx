import { motion } from 'framer-motion';

const themes = [
  {
    id: 'forest',
    title: '森林光影',
    subtitle: 'Forest Light',
    desc: '复古森系 · 光影艺术展',
    icon: '🌿',
    gradient: 'linear-gradient(135deg, #1a2e14, #0a1209)',
    accent: '#bf9b5e',
    glow: 'rgba(191, 155, 94, 0.15)',
  },
  {
    id: 'cyber',
    title: '赛博博物馆',
    subtitle: 'Cyber Museum',
    desc: '数字遗迹 · 琥珀暗房',
    icon: '◆',
    gradient: 'linear-gradient(135deg, #041c1c, #0a1f1f)',
    accent: '#ffac02',
    glow: 'rgba(255, 172, 2, 0.15)',
  },
  {
    id: 'constellation',
    title: '暗夜星座',
    subtitle: 'Constellation',
    desc: '星辰图谱 · 十二宫巡礼',
    icon: '✦',
    gradient: 'linear-gradient(135deg, #0d0d24, #060612)',
    accent: '#8899cc',
    glow: 'rgba(136, 153, 204, 0.12)',
  },
];

export default function LandingPage({ onEnter }) {
  return (
    <div className="landing">
      <div className="landing-bg" />

      <motion.div
        className="landing-content"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
      >
        <div className="landing-header">
          <div className="landing-divider" />
          <h1>光影艺术展</h1>
          <p>Light & Shadow Exhibition</p>
          <span className="landing-sub">选择一个主题进入</span>
        </div>

        <div className="landing-cards">
          {themes.map((t, i) => (
            <motion.div
              key={t.id}
              className="theme-card"
              style={{ '--accent': t.accent, '--glow': t.glow, '--gradient': t.gradient }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
              whileHover={{ y: -8, scale: 1.02, boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 60px ${t.glow}` }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onEnter(t.id)}
            >
              <div className="theme-bg" />
              <div className="theme-content">
                <span className="theme-icon">{t.icon}</span>
                <h2 className="theme-title">{t.title}</h2>
                <p className="theme-sub">{t.subtitle}</p>
                <p className="theme-desc">{t.desc}</p>
                <span className="theme-enter">
                  进入
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <style>{`
        .landing {
          position: fixed; inset: 0; z-index: 200;
          display: flex; align-items: center; justify-content: center;
          background: #060806;
          overflow: hidden;
        }

        .landing-bg {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse at 30% 20%, rgba(191,155,94,.04) 0%, transparent 55%),
            radial-gradient(ellipse at 70% 60%, rgba(0,229,255,.03) 0%, transparent 55%),
            radial-gradient(ellipse at 50% 80%, rgba(90,125,74,.04) 0%, transparent 50%);
          pointer-events: none;
        }

        .landing-content {
          position: relative; text-align: center;
          max-width: 700px; width: 90%;
        }

        .landing-header { margin-bottom: 48px; }
        .landing-header h1 {
          font-family: var(--font-display); font-size: 2.4rem; font-weight: 400;
          color: var(--color-gold-pale); letter-spacing: .12em;
        }
        .landing-header p {
          font-size: .9rem; color: var(--color-text-muted);
          letter-spacing: .16em; text-transform: uppercase; margin-top: 6px;
        }
        .landing-sub {
          display: inline-block; margin-top: 18px;
          font-size: .75rem; color: var(--color-text-muted);
          letter-spacing: .08em; opacity: .6;
        }
        .landing-divider {
          width: 50px; height: 1px; margin: 0 auto 24px;
          background: linear-gradient(90deg, transparent, var(--color-gold), transparent);
        }

        .landing-cards { display: flex; gap: 24px; justify-content: center; flex-wrap: wrap; }

        .theme-card {
          position: relative; width: 280px; padding: 40px 28px 32px;
          border-radius: 14px; cursor: pointer;
          border: 1px solid rgba(255,255,255,.06);
          overflow: hidden;
          transition: border-color .35s, box-shadow .35s;
        }

        .theme-card:hover { border-color: rgba(255,255,255,.1); }

        .theme-bg {
          position: absolute; inset: 0;
          background: var(--gradient); opacity: .85;
          transition: opacity .35s;
        }

        .theme-card:hover .theme-bg { opacity: 1; }

        .theme-content { position: relative; z-index: 1; }

        .theme-icon { font-size: 2.8rem; display: block; margin-bottom: 14px; }

        .theme-title {
          font-family: var(--font-display); font-size: 1.6rem; font-weight: 400;
          color: #e8e0d0; letter-spacing: .08em; margin-bottom: 4px;
        }

        .theme-sub {
          font-size: .78rem; color: rgba(255,255,255,.4);
          letter-spacing: .1em; text-transform: uppercase; margin-bottom: 12px;
        }

        .theme-desc {
          font-size: .8rem; color: rgba(255,255,255,.35);
          letter-spacing: .04em; margin-bottom: 22px;
        }

        .theme-enter {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: .78rem; color: var(--accent, #bf9b5e);
          letter-spacing: .06em;
          padding: 6px 20px; border-radius: 20px;
          border: 1px solid var(--accent, #bf9b5e);
          opacity: .7; transition: opacity .25s, background .25s;
        }

        .theme-card:hover .theme-enter {
          opacity: 1; background: rgba(255,255,255,.04);
        }

        @media(max-width:640px){
          .landing-cards { flex-direction: column; align-items: center; }
          .theme-card { width: 100%; max-width: 320px; }
        }
      `}</style>
    </div>
  );
}
