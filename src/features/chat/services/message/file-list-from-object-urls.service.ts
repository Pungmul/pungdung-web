/**
 * 미리보기용 `blob:` Object URL에서 전송용 `FileList`를 만듭니다. (실패한 이미지 pending 재전송용)
 */
export async function fileListFromBlobObjectUrls(
  urls: readonly string[],
): Promise<FileList | null> {
  if (urls.length === 0) return null;
  const files: File[] = [];
  try {
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      if (typeof url !== "string" || !url.startsWith("blob:")) return null;
      const res = await fetch(url);
      if (!res.ok) return null;
      const blob = await res.blob();
      files.push(
        new File([blob], `retry-${i}.jpg`, {
          type: blob.type || "image/jpeg",
        }),
      );
    }
    const dt = new DataTransfer();
    for (const f of files) {
      dt.items.add(f);
    }
    return dt.files;
  } catch {
    return null;
  }
}
