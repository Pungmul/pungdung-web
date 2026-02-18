import { appendImageFilesToFormData } from "./append-image-files-to-form-data";
import type { BuildUpdatePostFormDataInput } from "../types";

export const buildUpdatePostFormData = ({
  title,
  content,
  anonymity,
  imageFiles,
  prevImageIdList,
}: BuildUpdatePostFormDataInput) => {
  const formData = new FormData();
  const addedImageFiles = imageFiles.filter((file) => file.id === -1);
  const deleteImageIdList = prevImageIdList.filter(
    (id) => !imageFiles.some((file) => file.id === id)
  );

  appendImageFilesToFormData(formData, addedImageFiles);
  formData.append(
    "postData",
    new Blob(
      [JSON.stringify({ title, text: content, anonymity, deleteImageIdList })],
      {
        type: "application/json",
      }
    )
  );

  return formData;
};
