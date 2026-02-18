import { appendImageFilesToFormData } from "./append-image-files-to-form-data";
import type { BuildCreatePostFormDataInput } from "../types";

export const buildCreatePostFormData = ({
  title,
  content,
  anonymity,
  imageFiles,
}: BuildCreatePostFormDataInput) => {
  const formData = new FormData();

  appendImageFilesToFormData(formData, imageFiles);
  formData.append(
    "postData",
    new Blob([JSON.stringify({ title, text: content, anonymity })], {
      type: "application/json",
    })
  );

  return formData;
};
