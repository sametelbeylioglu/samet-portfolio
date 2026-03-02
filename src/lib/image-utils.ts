"use client";

import { getSupabase } from "./supabase";

const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;
const QUALITY = 0.8;

function compressToBlob(
  file: File,
  maxW: number,
  maxH: number,
  q: number
): Promise<Blob> {
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

      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Blob conversion failed"))),
        "image/webp",
        q
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Gorsel yuklenemedi"));
    };

    img.src = url;
  });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export function compressImage(
  file: File,
  opts?: { maxWidth?: number; maxHeight?: number; quality?: number }
): Promise<string> {
  const maxW = opts?.maxWidth ?? MAX_WIDTH;
  const maxH = opts?.maxHeight ?? MAX_HEIGHT;
  const q = opts?.quality ?? QUALITY;

  return compressToBlob(file, maxW, maxH, q).then(blobToDataUrl);
}

export async function uploadImage(
  file: File,
  folder: string = "general",
  opts?: { maxWidth?: number; maxHeight?: number; quality?: number }
): Promise<string> {
  const maxW = opts?.maxWidth ?? MAX_WIDTH;
  const maxH = opts?.maxHeight ?? MAX_HEIGHT;
  const q = opts?.quality ?? QUALITY;

  const blob = await compressToBlob(file, maxW, maxH, q);

  const supabase = getSupabase();
  if (supabase) {
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.webp`;
    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName, blob, { contentType: "image/webp", upsert: true });

    if (!error && data) {
      const { data: urlData } = supabase.storage
        .from("images")
        .getPublicUrl(data.path);
      return urlData.publicUrl;
    }
    console.error("Storage upload error:", error?.message);
  }

  return blobToDataUrl(blob);
}
