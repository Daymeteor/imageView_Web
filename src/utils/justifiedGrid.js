/**
 * justifiedGrid.js — 等高行网格计算
 *
 * 算法：逐张加入图片，计算当前行高。
 * 行高 = 容器宽 / 累计宽高比之和。
 * 当行高落入可接受范围时收行；过高则继续加图，过低则回退一张。
 */

const TARGET = 320;     // 目标行高
const MIN = TARGET * 0.6;  // 最低行高
const MAX = TARGET * 1.5;  // 最高行高
const GAP = 14;            // 图片间距

export function buildJustifiedRows(images, containerWidth) {
  if (!images.length || containerWidth < 100) return [];

  const rows = [];
  let pending = [];
  let aspectSum = 0;

  for (const img of images) {
    const ratio = (img.width && img.height) ? img.width / img.height : 1.5;
    pending.push({ image: img, aspect: ratio });
    aspectSum += ratio;

    const availW = containerWidth - (pending.length - 1) * GAP;
    const rowH = availW / aspectSum;

    if (rowH <= MAX) {
      // 在可接受范围
      if (rowH >= MIN) {
        rows.push(commit(pending, containerWidth));
        pending = [];
        aspectSum = 0;
      }
      // 否则过高，继续加图
      continue;
    }

    // 过低：回退一张
    if (pending.length > 1) {
      const last = pending.pop();
      aspectSum -= last.aspect;
      rows.push(commit(pending, containerWidth));
      pending = [last];
      aspectSum = last.aspect;
    }
  }

  // 末行：直接收束
  if (pending.length) {
    rows.push(commit(pending, containerWidth));
  }

  return rows;
}

function commit(row, containerWidth) {
  const n = row.length;
  const availW = containerWidth - (n - 1) * GAP;
  const sum = row.reduce((s, it) => s + it.aspect, 0);
  const h = availW / sum;

  return row.map(it => ({
    image: it.image,
    w: Math.round(it.aspect * h),
    h: Math.round(h),
  }));
}
