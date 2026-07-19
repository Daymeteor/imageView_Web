/**
 * Hermes 设计系统 — 工具函数
 * 基于 shadcn/ui 的 cn() 模式：clsx + tailwind-merge
 */

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并 Tailwind 工具类，自动处理冲突类名
 * @param  {...(string | undefined | null | false)} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * 格式化数字为固定宽度字符串
 * @param {number} num
 * @param {number} width
 * @returns {string}
 */
export function pad(num, width = 2) {
  return String(num).padStart(width, '0');
}

/**
 * 从文件名生成友好标题
 * @param {string} filename
 * @returns {string}
 */
export function formatFilename(filename) {
  return filename
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]/g, ' ')
    .trim();
}
