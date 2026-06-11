import type { PostImageFile } from "../types";

/** 게시글 multipart `FormData`에 이미지 파일 필드를 붙인다. (services 내부 전용) */
export function appendImageFilesToFormData(
  formData: FormData,
  imageFiles: PostImageFile[]
): void {
  if (imageFiles.length === 0) {
    formData.append("files", new Blob());
    return;
  }

  imageFiles.forEach((file, index) => {
    const { blob } = file;
    const body =
      blob instanceof File
        ? blob
        : new File([blob], `post-image-${index}.jpg`, {
            type: blob.type || "image/jpeg",
          });
    formData.append("files", body);
  });
}
