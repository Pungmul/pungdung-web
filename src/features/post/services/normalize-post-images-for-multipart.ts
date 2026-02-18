import type {
  PostImageFile,
  PostImageMultipartSource,
} from "../types";

/** `exactOptionalPropertyTypes` 호환 형태로 정규화한다. */
export function normalizePostImagesForMultipart(
  imageFiles: ReadonlyArray<PostImageMultipartSource>
): PostImageFile[] {
  return imageFiles.map((f) => {
    const out: PostImageFile = { blob: f.blob };
    if (f.id !== undefined) {
      out.id = f.id;
    }
    if (f.url !== undefined) {
      out.url = f.url;
    }
    return out;
  });
}
