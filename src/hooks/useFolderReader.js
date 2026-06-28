import { useState, useCallback, useRef } from 'react';
import { isImageFile, createImageURL, revokeAllImageURLs } from '../utils/imageHelpers';

/**
 * useFolderReader — 封装 File System Access API
 * 返回：选择文件夹的方法、图片列表、加载状态、错误信息
 */
export default function useFolderReader() {
  const [images, setImages] = useState([]);
  const [folderName, setFolderName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const urlsRef = useRef([]);

  /**
   * 递归读取目录中的所有图片文件
   */
  const readDirectoryEntries = useCallback(async (dirHandle, maxFiles = 500) => {
    const files = [];

    for await (const entry of dirHandle.values()) {
      if (files.length >= maxFiles) break;

      if (entry.kind === 'file' && isImageFile(entry.name)) {
        files.push(entry);
      } else if (entry.kind === 'directory') {
        const subFiles = await readDirectoryEntries(entry, maxFiles - files.length);
        files.push(...subFiles);
      }
    }

    return files;
  }, []);

  /**
   * 打开文件夹选择器并读取图片
   */
  const selectFolder = useCallback(async () => {
    // 检查浏览器支持
    if (!window.showDirectoryPicker) {
      setError('你的浏览器不支持 File System Access API，请使用 Chrome 或 Edge 最新版。');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 释放之前的 URL
      revokeAllImageURLs(urlsRef.current);
      urlsRef.current = [];

      const dirHandle = await window.showDirectoryPicker({ mode: 'read' });
      const fileHandles = await readDirectoryEntries(dirHandle);

      if (fileHandles.length === 0) {
        setError('该文件夹中没有找到图片文件。');
        setImages([]);
        setFolderName(dirHandle.name);
        setLoading(false);
        return;
      }

      // 读取文件并生成 URL
      const imageList = await Promise.all(
        fileHandles.map(async (handle) => {
          const file = await handle.getFile();
          const url = createImageURL(file);
          urlsRef.current.push(url);

          return {
            id: crypto.randomUUID(),
            name: handle.name,
            url,
            width: 0,   // 后续通过图片加载获取
            height: 0,
            file,
          };
        })
      );

      // 获取图片尺寸
      const sizedImages = await Promise.all(
        imageList.map((img) => {
          return new Promise((resolve) => {
            const image = new Image();
            image.onload = () => {
              resolve({ ...img, width: image.naturalWidth, height: image.naturalHeight });
            };
            image.onerror = () => resolve(img);
            image.src = img.url;
          });
        })
      );

      setImages(sizedImages);
      setFolderName(dirHandle.name);
      setError(null);
    } catch (err) {
      if (err.name === 'AbortError') {
        // 用户取消了选择
        setError(null);
      } else {
        console.error('读取文件夹失败:', err);
        setError('读取文件夹失败: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [readDirectoryEntries]);

  /**
   * 清除所有图片
   */
  const clearImages = useCallback(() => {
    revokeAllImageURLs(urlsRef.current);
    urlsRef.current = [];
    setImages([]);
    setFolderName('');
    setError(null);
  }, []);

  // 组件卸载时释放 URL
  const cleanup = useCallback(() => {
    revokeAllImageURLs(urlsRef.current);
    urlsRef.current = [];
  }, []);

  return {
    images,
    folderName,
    loading,
    error,
    selectFolder,
    clearImages,
    cleanup,
  };
}
