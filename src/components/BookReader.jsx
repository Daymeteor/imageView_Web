import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { getTheme } from '../data/themeConfig';
import { fileNameToTitle } from '../utils/imageHelpers';
import PhotoModal from './PhotoModal';

/** 封面可选色 — 鲜明高明度，自由搭配；light 标记浅色封面（签名用深色） */
const COVER_COLORS = [
  { id: 'yellow', name: '明黄', value: '#F2C94C', light: true },
  { id: 'coral', name: '橙红', value: '#F2573D', light: false },
  { id: 'green', name: '草绿', value: '#4FBF67', light: true },
  { id: 'sky', name: '天蓝', value: '#3A9BE8', light: true },
  { id: 'violet', name: '紫罗兰', value: '#8B5CF6', light: false },
  { id: 'pink', name: '玫红', value: '#EC4F8A', light: false },
];

/**
 * BookReader — 纪念册主题的翻书阅读器
 * 结构：封面(镂空窗口+baigao 签名) → 照片内页(拍立得) → 末页/封底
 * 点击右半页向前翻，左半页向后翻，支持键盘 ←/→
 */
export default function BookReader({ images, theme = 'album', folderName }) {
  const t = getTheme(theme);
  const bookRef = useRef(null);

  // 书页：封面 + 每页一张照片（front/back 两张一叶）+ 封底
  const leaves = useMemo(() => {
    const arr = [{ type: 'cover' }];
    for (let i = 0; i < images.length; i += 2) {
      arr.push({ type: 'photos', front: { img: images[i], idx: i }, back: images[i + 1] ? { img: images[i + 1], idx: i + 1 } : null });
    }
    arr.push({ type: 'back' });
    return arr;
  }, [images]);

  const total = leaves.length;
  const [k, setK] = useState(0); // 已翻过的叶数
  const [animLeaf, setAnimLeaf] = useState(null); // 正在翻动的叶（提层级用）
  const [coverColor, setCoverColor] = useState(COVER_COLORS[0].value);
  const isLightCover = COVER_COLORS.find((c) => c.value === coverColor)?.light;
  const [modalIdx, setModalIdx] = useState(null);
  const animTimer = useRef(null);

  const markAnim = useCallback((leafIdx) => {
    setAnimLeaf(leafIdx);
    clearTimeout(animTimer.current);
    animTimer.current = setTimeout(() => setAnimLeaf(null), 900);
  }, []);

  const next = useCallback(() => {
    setK((v) => {
      if (v >= total) return v;
      markAnim(v);
      return v + 1;
    });
  }, [total, markAnim]);

  const prev = useCallback(() => {
    setK((v) => {
      if (v <= 0) return v;
      markAnim(v - 1);
      return v - 1;
    });
  }, [markAnim]);

  const closeBook = useCallback(() => setK(0), []);

  useEffect(() => {
    const onKey = (e) => {
      if (modalIdx !== null) return; // 弹窗自行处理键盘
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, modalIdx]);

  useEffect(() => () => clearTimeout(animTimer.current), []);

  const closed = k === 0;
  const finished = k === total;

  // 点击书本：右半页前翻，左半页后翻；合上时点击封面即翻开
  const onStageClick = (e) => {
    if (e.target.closest('.ab-polaroid') || e.target.closest('button')) return;
    if (closed) { next(); return; }
    const rect = bookRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    if (finished || x < rect.width / 2) prev();
    else next();
  };

  const openPhoto = (e, idx) => {
    e.stopPropagation();
    setModalIdx(idx);
  };

  // ==================== 各书叶面 ====================
  const coverStyle = {
    background: `linear-gradient(135deg, ${coverColor} 0%, ${coverColor} 70%, rgba(0,0,0,0.35) 130%)`,
  };

  const renderCoverFront = () => (
    <div className="ab-cover" style={coverStyle}>
      <div className="ab-window">
        <img src={images[0]?.url} alt="封面" draggable="false" />
      </div>
      <div
        className="ab-signature"
        style={isLightCover ? { color: 'rgba(43,32,20,0.6)', textShadow: 'none' } : undefined}
      >
        baigao
      </div>
    </div>
  );

  const renderEndpaper = () => (
    <div className="ab-page ab-endpage">
      <h2>纪念册</h2>
      <div className="ab-rule" />
      <p>{folderName || t.headerSub}</p>
      <p style={{ marginTop: 8 }}>
        {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
      <p className="ab-sig">baigao</p>
    </div>
  );

  const renderPhotoPage = (slot, pageno) => {
    if (!slot) return <div className="ab-page" />;
    const { img, idx } = slot;
    return (
      <div className="ab-page">
        <div
          className="ab-polaroid"
          style={{ transform: `rotate(${idx % 2 === 0 ? -0.6 : 0.6}deg)` }}
          onClick={(e) => openPhoto(e, idx)}
          role="button"
          aria-label={`查看大图 ${img.name}`}
        >
          <img src={img.url} alt={img.name} draggable="false" />
        </div>
        <div className="ab-caption">{fileNameToTitle(img.name)}</div>
        <span className="ab-pageno">{String(pageno).padStart(2, '0')}</span>
      </div>
    );
  };

  const renderLastPage = () => (
    <div className="ab-page ab-endpage">
      <h2>完</h2>
      <div className="ab-rule" />
      <p>共 {images.length} 张</p>
      <p className="ab-sig">baigao</p>
      <button className="ab-close-btn" onClick={(e) => { e.stopPropagation(); closeBook(); }}>
        合上书本
      </button>
    </div>
  );

  const renderBackCover = () => <div className="ab-cover ab-cover-back" style={coverStyle} />;

  const faceContent = (leaf, side) => {
    if (leaf.type === 'cover') return side === 'front' ? renderCoverFront() : renderEndpaper();
    if (leaf.type === 'back') return side === 'front' ? renderLastPage() : renderBackCover();
    return side === 'front' ? renderPhotoPage(leaf.front, leaf.front.idx + 1) : renderPhotoPage(leaf.back, leaf.back ? leaf.back.idx + 1 : 0);
  };

  // ==================== 渲染 ====================
  return (
    <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 pb-12 pt-24">
      <div className="ab-stage" onClick={onStageClick}>
        <div
          ref={bookRef}
          className={`ab-book ${closed ? 'is-closed' : ''} ${finished ? 'is-finished' : ''}`}
        >
          {!closed && !finished && <div className="ab-spine" />}
          <div className="ab-book-shadow" />
          {leaves.map((leaf, i) => {
            const flipped = i < k;
            const zIndex = i === animLeaf ? total + 1 : flipped ? i + 1 : total - i;
            // 合上书本时，靠后的叶先回翻，封面最后合上（级联）
            const delay = flipped ? Math.max(0, (k - 1 - i) * 60) : 0;
            return (
              <div
                key={i}
                className={`ab-leaf ${flipped ? 'flipped' : ''}`}
                style={{ zIndex, transitionDelay: `${delay}ms` }}
              >
                <div className="ab-face ab-front cursor-pointer">{faceContent(leaf, 'front')}</div>
                <div className="ab-face ab-back cursor-pointer">{faceContent(leaf, 'back')}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 封面选色（合上时显示） */}
      {closed && (
        <div className="mt-10 flex items-center gap-3">
          {COVER_COLORS.map((c) => (
            <button
              key={c.id}
              className={`ab-swatch ${coverColor === c.value ? 'active' : ''}`}
              style={{ background: c.value }}
              onClick={() => setCoverColor(c.value)}
              aria-label={`封面颜色：${c.name}`}
              title={c.name}
            />
          ))}
        </div>
      )}

      {/* 提示 / 进度 */}
      <p className="mt-6 text-[11px] tracking-[0.24em] text-[var(--color-text-muted)]">
        {closed
          ? '点击封面翻开 · 可选封面色'
          : finished
          ? '点击封底返回'
          : `第 ${k} / ${total} 页 · 点击左右两侧翻页`}
      </p>

      {/* 大图弹窗（复用） */}
      <PhotoModal
        image={modalIdx !== null ? images[modalIdx] : null}
        images={images}
        theme={theme}
        onClose={() => setModalIdx(null)}
        onPrev={() => setModalIdx((i) => (i - 1 + images.length) % images.length)}
        onNext={() => setModalIdx((i) => (i + 1) % images.length)}
      />
    </div>
  );
}
