import {
  POST_EDITOR_TARGET_COMPRESSED_IMAGE_BYTES,
} from "../constants";

import type { PostImageFile } from "../types";

export type CompressPostEditorImagesProgress = {
  current: number;
  total: number;
};

function blobFromCanvas(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("canvas.toBlob returned null"));
      },
      type,
      quality
    );
  });
}

async function compressRasterToJpegUnderMax(
  blob: Blob,
  maxBytes: number
): Promise<Blob> {
  if (blob.size <= maxBytes && blob.type === "image/jpeg") {
    return blob;
  }

  const bitmap = await createImageBitmap(blob);
  try {
    let width = bitmap.width;
    let height = bitmap.height;
    const maxDimension = 4096;
    const longest = Math.max(width, height);
    if (longest > maxDimension) {
      const scale = maxDimension / longest;
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return blob;
    }
    ctx.drawImage(bitmap, 0, 0, width, height);

    let best = await blobFromCanvas(canvas, "image/jpeg", 0.92);
    if (best.size <= maxBytes) {
      return best;
    }

    let low = 0.35;
    let high = 0.92;
    for (let i = 0; i < 12 && high - low > 0.02; i++) {
      const mid = (low + high) / 2;
      const next = await blobFromCanvas(canvas, "image/jpeg", mid);
      if (next.size > maxBytes) {
        high = mid;
      } else {
        low = mid;
        best = next;
      }
    }

    while (best.size > maxBytes && width > 240 && height > 240) {
      width = Math.round(width * 0.85);
      height = Math.round(height * 0.85);
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(bitmap, 0, 0, width, height);
      best = await blobFromCanvas(canvas, "image/jpeg", low);
    }

    return best;
  } finally {
    bitmap.close();
  }
}

/**
 * `id === -1`인 신규 첨부만 JPEG로 재압축한다. 서버 전송 직전에 호출한다.
 */
export async function compressPostEditorImages(
  imageFiles: ReadonlyArray<PostImageFile>,
  options?: {
    maxBytesPerFile?: number;
    onProgress?: (p: CompressPostEditorImagesProgress) => void;
  }
): Promise<PostImageFile[]> {
  const maxBytes = options?.maxBytesPerFile ?? POST_EDITOR_TARGET_COMPRESSED_IMAGE_BYTES;
  const pendingIndexes = imageFiles
    .map((f, i) => (f.id === -1 ? i : -1))
    .filter((i) => i >= 0);
  const total = pendingIndexes.length;
  let done = 0;

  const out = imageFiles.map((f) => ({ ...f }));

  for (const i of pendingIndexes) {
    const item = imageFiles[i]!;
    let nextBlob = item.blob;
    try {
      nextBlob = await compressRasterToJpegUnderMax(item.blob, maxBytes);
    } catch {
      nextBlob = item.blob;
    }

    out[i] = { ...item, blob: nextBlob };
    done++;
    options?.onProgress?.({ current: done, total });
  }

  return out;
}
