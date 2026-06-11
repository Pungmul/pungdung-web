function isSameOriginUrl(url: string): boolean {
  try {
    return new URL(url, window.location.href).origin === window.location.origin;
  } catch {
    return false;
  }
}

function buildImageFetchUrl(imageUrl: string): string {
  if (isSameOriginUrl(imageUrl)) {
    return imageUrl;
  }

  const params = new URLSearchParams({
    url: imageUrl,
    w: "3840",
    q: "100",
  });

  return `/_next/image?${params.toString()}`;
}

function resolveFilename(filename: string, mimeType: string): string {
  if (filename.includes(".")) {
    return filename;
  }

  const extension = mimeType.split("/")[1]?.replace("jpeg", "jpg") ?? "jpg";
  return `${filename}.${extension}`;
}

function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

async function fetchImageBlob(imageUrl: string): Promise<Blob> {
  const response = await fetch(buildImageFetchUrl(imageUrl));

  if (!response.ok) {
    throw new Error(`Image fetch failed: ${response.status}`);
  }

  return response.blob();
}

async function downloadBlob(blob: Blob, filename: string): Promise<void> {
  const objectUrl = URL.createObjectURL(blob);

  try {
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = filename;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function shareImageFile(blob: Blob, filename: string): Promise<boolean> {
  if (!navigator.share || !navigator.canShare) {
    return false;
  }

  const file = new File([blob], filename, {
    type: blob.type || "image/jpeg",
  });

  if (!navigator.canShare({ files: [file] })) {
    return false;
  }

  await navigator.share({ files: [file] });
  return true;
}

export async function downloadRemoteImage(params: {
  url: string;
  filename: string;
}): Promise<void> {
  const blob = await fetchImageBlob(params.url);
  const filename = resolveFilename(params.filename, blob.type);

  if (isIOS()) {
    const shared = await shareImageFile(blob, filename);
    if (shared) {
      return;
    }
  }

  await downloadBlob(blob, filename);
}

export const downloadRemoteImageUtils = {
  buildImageFetchUrl,
  isSameOriginUrl,
  resolveFilename,
};
