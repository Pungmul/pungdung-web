import type { PostImageFile } from "../types";

import type { ImageObject } from "@/shared";

export const mapPostImagesToPostFormFiles = (
  imageList: ImageObject[]
): PostImageFile[] => {
  return imageList.map((file) => ({
    id: file.id,
    blob: new Blob([file.fullFilePath], { type: file.fileType || "image/jpeg" }),
    url: file.fullFilePath,
  }));
};

export const getPostImageIdList = (imageList: ImageObject[]) => {
  return imageList.map((file) => file.id);
};
