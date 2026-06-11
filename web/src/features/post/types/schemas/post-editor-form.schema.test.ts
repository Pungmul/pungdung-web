import { describe, expect, it } from "vitest";

import {
  POST_EDITOR_MAX_IMAGE_COUNT,
  POST_EDITOR_MAX_SINGLE_IMAGE_BYTES,
} from "../../constants";
import {
  emptyPostEditorFormValues,
  postEditorFormValuesSchema,
} from "./post-editor-form.schema";

function makeHugeBlob(bytes: number) {
  return new Blob([new Uint8Array(bytes)]);
}

describe("postEditorFormValuesSchema", () => {
  it("기본 유효 입력을 통과시킨다", () => {
    const parsed = postEditorFormValuesSchema.safeParse({
      ...emptyPostEditorFormValues,
      title: "제목",
      content: "본문",
    });
    expect(parsed.success).toBe(true);
  });

  it("이미지 개수가 최대 초과면 실패한다", () => {
    const imageFiles = Array.from(
      { length: POST_EDITOR_MAX_IMAGE_COUNT + 1 },
      () => ({
        id: -1 as number,
        blob: makeHugeBlob(1),
      })
    );

    const parsed = postEditorFormValuesSchema.safeParse({
      ...emptyPostEditorFormValues,
      title: "t",
      content: "c",
      imageFiles,
    });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues.some((i) => i.path[0] === "imageFiles")).toBe(
        true
      );
    }
  });

  it("신규 첨부(id=-1)가 단일 이미지 상한 초과면 실패한다", () => {
    const blob = makeHugeBlob(POST_EDITOR_MAX_SINGLE_IMAGE_BYTES + 1);

    const parsed = postEditorFormValuesSchema.safeParse({
      ...emptyPostEditorFormValues,
      title: "t",
      content: "c",
      imageFiles: [{ id: -1, blob }],
    });

    expect(parsed.success).toBe(false);
  });

  it("기존 이미지(id가 -1이 아님)는 blob 크기 제한 검사 대상에서 제외한다", () => {
    const blob = makeHugeBlob(POST_EDITOR_MAX_SINGLE_IMAGE_BYTES + 1);

    const parsed = postEditorFormValuesSchema.safeParse({
      ...emptyPostEditorFormValues,
      title: "t",
      content: "c",
      imageFiles: [{ id: 10, blob }],
    });

    expect(parsed.success).toBe(true);
  });
});
