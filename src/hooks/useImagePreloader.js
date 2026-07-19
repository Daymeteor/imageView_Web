import { useState, useEffect, useRef } from 'react';

/**
 * useImagePreloader — 分块预加载图片到浏览器缓存
 * 防止一次性加载大量图片导致 OOM
 * @param {Array} images — 图片列表 [{url, ...}]
 * @param {number} concurrency — 每批并发数（默认 6）
 * @returns {{ preloaded: boolean, preloadCount: number, total: number }}
 */
export default function useImagePreloader(images, concurrency = 6) {
  const [preloadCount, setPreloadCount] = useState(0);
  const total = images.length;
  const preloaded = total > 0 && preloadCount >= total;

  useEffect(() => {
    setPreloadCount(0);
    if (!images.length) return;

    let cancelled = false;
    const urls = images.map((img) => img.url);
    const loaders = [];
    let idx = 0;
    let active = 0;

    const loadNext = () => {
      while (active < concurrency && idx < urls.length && !cancelled) {
        const url = urls[idx++];
        active++;
        const img = new Image();
        loaders.push(img);
        img.onload = img.onerror = () => {
          active--;
          if (!cancelled) {
            setPreloadCount((c) => c + 1);
            loadNext();
          }
        };
        img.src = url;
      }
    };

    loadNext();

    return () => {
      cancelled = true;
      // 终止未完成的图片请求
      loaders.forEach((img) => {
        img.onload = img.onerror = null;
        img.src = '';
      });
    };
  }, [images, concurrency]);

  return { preloaded, preloadCount, total };
}
