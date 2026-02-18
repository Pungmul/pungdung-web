/** 첨부 1장당 업로드 전(원본 선택) 최대 크기 */
export const POST_EDITOR_MAX_SINGLE_IMAGE_BYTES = 10 * 1024 * 1024;

/** 게시글당 최대 첨부 장수 */
export const POST_EDITOR_MAX_IMAGE_COUNT = 10;

/** multipart 전송 직전 압축 목표(장당 상한). JPEG 재인코딩 기준 */
export const POST_EDITOR_TARGET_COMPRESSED_IMAGE_BYTES = 2 * 1024 * 1024;
