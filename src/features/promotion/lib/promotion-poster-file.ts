export const PROMOTION_POSTER_IMAGE_ACCEPT =
  "image/jpeg,image/png,image/webp,image/bmp,image/tiff,image/avif,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.bmp,.tif,.tiff,.avif,.heic,.heif";

export const MAX_PROMOTION_POSTER_FILE_BYTES = 5 * 1024 * 1024;

const ALLOWED_PROMOTION_POSTER_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/bmp",
  "image/tiff",
  "image/avif",
  "image/heic",
  "image/heif",
]);

const ALLOWED_PROMOTION_POSTER_EXTENSIONS =
  /\.(jpe?g|png|webp|bmp|tiff?|avif|heic|heif)$/i;

const FORBIDDEN_PROMOTION_POSTER_EXTENSIONS = /\.(gif|svg|svgz)$/i;

function isForbiddenPromotionPosterImageFile(file: File): boolean {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();

  return (
    type === "image/gif" ||
    type === "image/svg+xml" ||
    FORBIDDEN_PROMOTION_POSTER_EXTENSIONS.test(name)
  );
}

function isAllowedPromotionPosterImageFile(file: File): boolean {
  const type = file.type.toLowerCase();

  if (ALLOWED_PROMOTION_POSTER_MIME_TYPES.has(type)) {
    return true;
  }

  return ALLOWED_PROMOTION_POSTER_EXTENSIONS.test(file.name);
}

export function validatePromotionPosterFileBeforeUpload(
  file: File
): { ok: true } | { ok: false; title: string; message: string } {
  if (isForbiddenPromotionPosterImageFile(file)) {
    return {
      ok: false,
      title: "지원하지 않는 형식",
      message:
        "SVG, GIF 파일은 업로드할 수 없습니다. JPG, PNG, WEBP 등 래스터 이미지를 선택해 주세요.",
    };
  }

  if (!isAllowedPromotionPosterImageFile(file)) {
    return {
      ok: false,
      title: "지원하지 않는 형식",
      message: "JPG, PNG, WEBP 등 지원되는 이미지 파일만 업로드할 수 있습니다.",
    };
  }

  if (file.size > MAX_PROMOTION_POSTER_FILE_BYTES) {
    const maxMegabytes = MAX_PROMOTION_POSTER_FILE_BYTES / (1024 * 1024);

    return {
      ok: false,
      title: "파일 크기 제한",
      message: `포스터 이미지는 ${maxMegabytes}MB 이하만 업로드할 수 있습니다.`,
    };
  }

  return { ok: true };
}
