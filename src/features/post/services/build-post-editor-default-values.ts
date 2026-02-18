import { mapPostImagesToPostFormFiles } from "./map-post-form-images";
import type { PostEditorFormDetailSnapshot } from "../types";
import type { PostEditorFormValues } from "../types/schemas";

export function buildPostEditorDefaultValues(
  snapshot: PostEditorFormDetailSnapshot
): PostEditorFormValues {
  return {
    title: snapshot.postTitle,
    content: snapshot.postContent,
    imageFiles: mapPostImagesToPostFormFiles(snapshot.postImageList),
    anonymity: snapshot.postAuthor === "Anonymous",
  };
}
