import { mapPostImagesToPostFormFiles } from "./map-post-form-images";
import type { PostEditorFormDetailSnapshot } from "../types";
import {
  emptyPostEditorFormValues,
  type PostEditorFormValues,
} from "../types/schemas";

/**
 * 상세에는 anonymity가 없다.
 * 예전 `postAuthor === "Anonymous"` 추론은 닉네임 전환 후 항상 false가 되어
 * 익명 체크박스를 사실상 무시했다. 작성 기본값과 동일하게 두고, 제출은 폼 체크박스 값을 따른다.
 */
export function buildPostEditorDefaultValues(
  snapshot: PostEditorFormDetailSnapshot
): PostEditorFormValues {
  return {
    title: snapshot.postTitle,
    content: snapshot.postContent,
    imageFiles: mapPostImagesToPostFormFiles(snapshot.postImageList),
    anonymity: emptyPostEditorFormValues.anonymity,
  };
}
