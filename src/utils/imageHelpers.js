/**
 * 图片工具函数
 * 管理图片 URL 的创建与释放
 */

const IMAGE_EXTENSIONS = new Set([
  'jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'bmp', 'svg', 'tiff', 'tif'
]);

/**
 * 判断文件是否为图片
 */
export function isImageFile(fileName) {
  const ext = fileName.split('.').pop()?.toLowerCase();
  return IMAGE_EXTENSIONS.has(ext);
}

/**
 * 为 File 对象创建本地预览 URL
 */
export function createImageURL(file) {
  return URL.createObjectURL(file);
}

/**
 * 释放图片 URL
 */
export function revokeImageURL(url) {
  URL.revokeObjectURL(url);
}

/**
 * 批量释放图片 URL
 */
export function revokeAllImageURLs(urls) {
  urls.forEach(url => URL.revokeObjectURL(url));
}

/**
 * 从文件名提取标题（去除扩展名，替换连字符/下划线为空格）
 */
export function fileNameToTitle(fileName) {
  const withoutExt = fileName.replace(/\.[^.]+$/, '');
  return withoutExt
    .replace(/[-_]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
