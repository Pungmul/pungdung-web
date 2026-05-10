import { describe, expect, it } from "vitest";

import {
  IMAGE_LAST_MESSAGE_PREVIEW,
  isImageLastMessagePreview,
} from "./image-last-message-preview";

describe("isImageLastMessagePreview", () => {
  it("이미지 관련 미리보기 문구를 포함하면 true를 반환한다", () => {
    expect(isImageLastMessagePreview(IMAGE_LAST_MESSAGE_PREVIEW)).toBe(true);
    expect(isImageLastMessagePreview("이미지")).toBe(true);
  });

  it("null·undefined·빈 문자열은 false를 반환한다", () => {
    expect(isImageLastMessagePreview(null)).toBe(false);
    expect(isImageLastMessagePreview(undefined)).toBe(false);
    expect(isImageLastMessagePreview("")).toBe(false);
  });

  it("이미지와 무관한 일반 텍스트는 false를 반환한다", () => {
    expect(isImageLastMessagePreview("hello")).toBe(false);
  });
});
