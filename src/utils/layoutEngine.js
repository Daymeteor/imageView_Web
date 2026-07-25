/**
 * layoutEngine — 比例感知布局引擎
 * 从漫波普版式库（MangaReader）提炼的通用范式：
 * 一切排布先读照片宽高比，再决定容器尺寸——让容器适应照片，而不是裁照片适应容器。
 */

/** 照片宽高比（无尺寸信息时按 1 处理） */
export const imgRatio = (img) =>
  img.width && img.height ? img.width / img.height : 1;

/**
 * fitContain — 在容器内完整放下整张图（不裁切）
 * @param {number} cw 容器宽
 * @param {number} ch 容器高
 * @param {number} r 照片宽高比
 * @returns {{width: number, height: number}} 与容器同单位的图片尺寸
 */
export function fitContain(cw, ch, r) {
  let w = cw;
  let h = cw / r;
  if (h > ch) {
    h = ch;
    w = ch * r;
  }
  return { width: w, height: h };
}

/**
 * fitRowPercent — 单行比例排布（百分比坐标系，源自 MangaReader）
 * 高度充满、每块宽度 = 高度% × 片比 ÷ 容器比，整行超宽则等比缩放居中
 * @param {number[]} ratios 本行照片宽高比
 * @param {number} A 容器宽高比（W/H）
 * @param {number} gap 间距（宽度 %）
 * @returns {Array<{left: number, top: number, width: number, height: number}>} 容器百分比
 */
export function fitRowPercent(ratios, A, gap = 2) {
  let h = 100;
  let ws = ratios.map((r) => (h * r) / A);
  const gapTotal = gap * (ratios.length - 1);
  let total = ws.reduce((a, b) => a + b, 0) + gapTotal;
  if (total > 100) {
    const s = 100 / total;
    ws = ws.map((w) => w * s);
    h *= s;
    total = 100;
  }
  let x = (100 - total) / 2;
  const top = (100 - h) / 2;
  return ratios.map((_, i) => {
    const rect = { left: x, top, width: ws[i], height: h };
    x += ws[i] + gap;
    return rect;
  });
}

/**
 * fitRowPx — 单行比例排布（像素单位）
 * @param {number[]} ratios 本行照片宽高比
 * @param {number} containerW 可用宽度 px
 * @param {number} rowH 目标行高 px
 * @param {number} gap 间距 px
 * @returns {{widths: number[], height: number, scale: number}} 每块宽 / 实际行高 / 缩放系数
 */
export function fitRowPx(ratios, containerW, rowH, gap = 8) {
  let ws = ratios.map((r) => rowH * r);
  const total = ws.reduce((a, b) => a + b, 0) + gap * (ratios.length - 1);
  const scale = total > containerW ? containerW / total : 1;
  return { widths: ws.map((w) => w * scale), height: rowH * scale, scale };
}

/**
 * packRows — 贪心分行（justified 布局）
 * 按顺序把照片装进若干行，每行片比之和尽量接近一行容量（A）
 * @param {number[]} ratios 全部照片宽高比
 * @param {number} A 一行容量（≈ 容器宽高比）
 * @param {number} maxPerRow 每行最多几张
 * @returns {number[][]} 每行的照片下标组
 */
export function packRows(ratios, A, maxPerRow = 4) {
  const rows = [];
  let row = [];
  let sum = 0;
  ratios.forEach((r, i) => {
    // 行内已有照片且放不下下一张（容量超标或超数）→ 开新行
    if (row.length > 0 && (sum + r > A * 1.15 || row.length >= maxPerRow)) {
      rows.push(row);
      row = [];
      sum = 0;
    }
    row.push(i);
    sum += r;
  });
  if (row.length) rows.push(row);
  return rows;
}
