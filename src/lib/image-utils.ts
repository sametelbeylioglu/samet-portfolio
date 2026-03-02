"use client";

const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;
const QUALITY = 0.8;

export function compressImage(
  file: File,
  opts?: { maxWidth?: number; maxHeight?: number; quality?: number }
): Promise<string> {
  const maxW = opts?.maxWidth ?? MAX_WIDTH;
  const maxH = opts?.maxHeight ?? MAX_HEIGHT;
  const q = opts?.quality ?? QUALITY;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;
      if (width > maxW || height > maxH) {
        const ratio = Math.min(maxW / width, maxH / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas 2d context not available"));
      ctx.drawImage(img, 0, 0, width, height);

      const dataUrl = canvas.toDataURL("image/webp", q);
      resolve(dataUrl);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Görsel yüklenemedi"));
    };

    img.src = url;
  });
}
