import { useState, useCallback, useMemo } from 'react';
import ImageCard from './ImageCard';
import PhotoDetail from './PhotoDetail';

export default function ExhibitionHall({ images }) {
  const [activeId, setActiveId] = useState(null);
  const [modalImg, setModalImg] = useState(null);
  const [modalReady, setModalReady] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [thumbRect, setThumbRect] = useState(null);

  const { landscape, portrait, flat } = useMemo(() => {
    const l = [], p = [], f = [];
    images.forEach((img, i) => {
      const r = (img.width && img.height) ? img.width / img.height : 1;
      const item = { ...img, idx: i };
      f.push(item); (r >= 1 ? l : p).push(item);
    });
    return { landscape: l, portrait: p, flat: f };
  }, [images]);

  // 缩略图点击 → 滚动到详情
  const toDetail = useCallback((img) => setActiveId(img.id), []);

  // 详情图点击 → 打开模态
  const openModal = useCallback((img, e) => {
    const idx = flat.findIndex(i => i.id === img.id);
    const rect = e.currentTarget.getBoundingClientRect();
    const vw = window.innerWidth, vh = window.innerHeight;
    const tw = Math.min(vw * 0.75, 1300), th = Math.min(vh * 0.9, 900);
    setThumbRect({
      fromScale: Math.min(rect.width / tw, rect.height / th),
      fromX: (rect.left + rect.width/2) - vw/2,
      fromY: (rect.top + rect.height/2) - vh/2, tw, th,
    });
    setModalImg(idx); setRotation(0); setModalReady(false);
    requestAnimationFrame(() => setModalReady(true));
  }, [flat]);

  const closeModal = useCallback(() => { setModalReady(false); setTimeout(() => setModalImg(null), 380); }, []);

  const go = useCallback((dir) => {
    setModalReady(false); setRotation(0);
    setTimeout(() => {
      setModalImg(i => { let n = i + dir; if (n < 0) n = flat.length - 1; if (n >= flat.length) n = 0; return n; });
      requestAnimationFrame(() => setModalReady(true));
    }, 220);
  }, [flat.length]);

  if (!images.length) return null;
  const sel = modalImg !== null ? flat[modalImg] : null;

  return (
    <div className="hall">
      <div className="hall-spacer" />
      <div className="hall-header">
        <div className="hall-divider" /><h2>森林光影集</h2><p>Forest Light Collection</p>
      </div>

      {/* 缩略图瀑布流 */}
      <div className="hall-grid">
        {landscape.length > 0 && (<>
          <div className="gl"><span className="gd gd-l" />横版 <em>{landscape.length}</em></div>
          <div className="masonry m-l">{landscape.map((img, i) => <ImageCard key={img.id} image={img} index={i} onClick={toDetail} />)}</div>
        </>)}
        {portrait.length > 0 && (<>
          <div className="gl gl-p"><span className="gd gd-p" />竖版 <em>{portrait.length}</em></div>
          <div className="masonry m-p">{portrait.map((img, i) => <ImageCard key={img.id} image={img} index={landscape.length + i} onClick={toDetail} />)}</div>
        </>)}
      </div>

      {/* 详情区 */}
      <div className="hall-detail">
        <div className="dl"><div className="dd" /><span>作品详情</span><div className="dd" /></div>
        {flat.map((img, i) => <PhotoDetail key={img.id} image={img} index={i} onImageClick={openModal} isActive={activeId === img.id} />)}
      </div>

      <div className="hall-foot"><p>— End of Exhibition —</p></div>

      {/* Unsplash 模态 */}
      {sel && (
        <div className={`modal${modalReady ? ' on' : ''}`} onClick={closeModal}>
          <div className="modal-area" onClick={e => e.stopPropagation()}>
            <div className="modal-rot">
              <button onClick={() => setRotation(r => r - 90)}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="15 18 9 12 15 6"/></svg></button>
              <button onClick={() => setRotation(0)} className="rst"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21.5 2v6h-6M2.5 22v-6h6M21.34 8a10 0 0 1-4.23 12.14M2.66 16A10 0 0 1 6.9 3.86"/></svg></button>
              <button onClick={() => setRotation(r => r + 90)}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="9 18 15 12 9 6"/></svg></button>
            </div>
            <div className="modal-wrap" style={{
              width: thumbRect?.tw || 800, height: thumbRect?.th || 700,
              transform: modalReady ? `translate(0,0) scale(1) rotate(${rotation}deg)` : `translate(${thumbRect?.fromX||0}px, ${thumbRect?.fromY||0}px) scale(${thumbRect?.fromScale||.3}) rotate(${rotation}deg)`,
            }}><img src={sel.url} alt="" draggable="false" /></div>
          </div>
          <div className="modal-name">{sel.name.replace(/\.[^.]+$/,'').replace(/[-_]/g,' ')}</div>
          <button className="modal-nav prev" onClick={e=>{e.stopPropagation();go(-1)}}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="15 18 9 12 15 6"/></svg></button>
          <button className="modal-nav next" onClick={e=>{e.stopPropagation();go(1)}}><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polyline points="9 18 15 12 9 6"/></svg></button>
          <button className="modal-x" onClick={closeModal}><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
      )}

      <style>{`
        .hall { position: relative; z-index: 10; min-height: 100vh; padding: 0 var(--space-lg); max-width: 1400px; margin: 0 auto; }
        .hall-spacer { height: 100px; }
        .hall-header { text-align: center; padding: var(--space-2xl) 0 var(--space-lg); animation: fadeInUp .8s ease both; }
        .hall-header h2 { font-family: var(--font-display); font-size: 1.8rem; font-weight: 400; color: var(--color-gold-light); letter-spacing: .08em; }
        .hall-header p { font-size: .85rem; color: var(--color-text-muted); letter-spacing: .12em; text-transform: uppercase; margin-top: var(--space-sm); }
        .hall-divider { width: 60px; height: 1px; background: linear-gradient(90deg, transparent, var(--color-gold), transparent); margin: 0 auto var(--space-lg); }
        .hall-grid { padding-bottom: var(--space-lg); }
        .gl { display: flex; align-items: center; gap: var(--space-sm); font-family: var(--font-display); font-size: .72rem; color: var(--color-gold-dim); letter-spacing: .06em; padding: var(--space-md) 0 var(--space-sm); }
        .gl em { font-style: normal; font-size: .64rem; color: var(--color-text-muted); }
        .gl-p { margin-top: var(--space-xl); padding-top: var(--space-lg); border-top: 1px solid rgba(191,155,94,.08); }
        .gd { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
        .gd-l { background: var(--color-gold); } .gd-p { background: var(--color-moss-light); }
        .masonry { column-gap: var(--space-md); padding: var(--space-sm) 0; }
        .m-l { column-count: 3; } .m-p { column-count: 4; }
        @media(max-width:1000px){ .m-l{column-count:2} .m-p{column-count:3} }
        @media(max-width:680px){ .m-l{column-count:1} .m-p{column-count:2} }
        @media(max-width:420px){ .m-p{column-count:1} }
        .hall-detail { padding-top: var(--space-2xl); }
        .dl { display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-md); font-family: var(--font-display); font-size: .78rem; color: var(--color-gold-dim); letter-spacing: .1em; text-transform: uppercase; }
        .dd { flex: 1; height: 1px; background: rgba(191,155,94,.15); }
        .hall-foot { text-align: center; padding: var(--space-2xl) 0 var(--space-3xl); font-family: var(--font-display); font-size: .85rem; color: var(--color-text-muted); letter-spacing: .1em; }

        .modal { position: fixed; inset: 0; z-index: 300; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(6,10,6,0); backdrop-filter: blur(0); -webkit-backdrop-filter: blur(0); transition: background .35s, backdrop-filter .35s; }
        .modal.on { background: rgba(6,10,6,.9); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); }
        .modal-area { display: flex; flex-direction: row; align-items: center; gap: 10px; }
        .modal-wrap { border-radius: 6px; box-shadow: 0 20px 60px rgba(0,0,0,.65); background: var(--color-bg-surface); overflow: hidden; transition: transform .38s cubic-bezier(.4,0,.2,1); will-change: transform; }
        .modal-wrap img { display: block; width: 100%; height: 100%; object-fit: contain; user-select: none; -webkit-user-drag: none; }
        .modal-name { margin-top: 10px; font-family: var(--font-display); font-size: .82rem; color: rgba(220,200,154,.65); letter-spacing: .04em; opacity: 0; transition: opacity .3s .15s; }
        .modal.on .modal-name { opacity: 1; }
        .modal-rot { display: flex; flex-direction: column; gap: 3px; flex-shrink: 0; }
        .modal-rot button { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 50%; border: 1px solid rgba(191,155,94,.18); background: rgba(14,22,15,.4); color: var(--color-gold-dim); cursor: pointer; transition: all .2s; }
        .modal-rot button:hover { background: rgba(20,31,21,.7); border-color: rgba(191,155,94,.35); color: var(--color-gold-light); }
        .modal-rot button.rst { width: 26px; height: 26px; border-style: dashed; margin: 2px 3px; }
        .modal-nav { position: fixed; top: 50%; transform: translateY(-50%); z-index: 301; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: rgba(14,22,15,.35); border: 1px solid rgba(191,155,94,.1); color: var(--color-gold-dim); cursor: pointer; transition: all .2s; opacity: 0; }
        .modal.on .modal-nav { opacity: 1; transition: opacity .3s .2s; }
        .modal-nav:hover { background: rgba(20,31,21,.7); border-color: rgba(191,155,94,.3); color: var(--color-gold-light); }
        .prev { left: 16px; } .next { right: 16px; }
        .modal-x { position: fixed; top: 14px; right: 14px; z-index: 302; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: rgba(14,22,15,.4); border: 1px solid rgba(191,155,94,.1); color: var(--color-gold-dim); cursor: pointer; transition: all .2s; }
        .modal-x:hover { background: rgba(20,31,21,.7); color: var(--color-gold-light); }
        @media(max-width:700px){ .modal-nav{width:38px;height:38px} .prev{left:6px} .next{right:6px} }
      `}</style>
    </div>
  );
}
