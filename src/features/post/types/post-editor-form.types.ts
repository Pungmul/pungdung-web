import type { ImageObject } from "@/shared";

/** 상세·스냅샷에서 에디터 폼 기본값을 만들 때 쓰는 입력. */
export type PostEditorFormDetailSnapshot = {
  postTitle: string;
  postContent: string;
  postImageList: ImageObject[];
  postAuthor: string;
};

/** multipart 업로드에 실리는 이미지 한 줄. */
export interface PostImageFile {
  id?: number;
  blob: Blob;
  url?: string;
}

export interface BuildCreatePostFormDataInput {
  title: string;
  content: string;
  anonymity: boolean;
  imageFiles: PostImageFile[];
}

export interface BuildUpdatePostFormDataInput
  extends BuildCreatePostFormDataInput {
  prevImageIdList: number[];
}

/** `normalizePostImagesForMultipart` 입력 한 줄 (`exactOptionalPropertyTypes` 대응). */
export type PostImageMultipartSource = {
  blob: Blob;
  id?: number | undefined;
  url?: string | undefined;
};
