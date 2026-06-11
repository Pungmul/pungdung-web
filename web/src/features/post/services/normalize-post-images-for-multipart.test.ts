import { describe, expect, it } from "vitest";

import { normalizePostImagesForMultipart } from "./normalize-post-images-for-multipart";

describe("normalizePostImagesForMultipart", () => {
  it("blob만 있으면 id와 url 키를 넣지 않는다", () => {
    const blob = new Blob();
    const result = normalizePostImagesForMultipart([{ blob }]);

    expect(result).toHaveLength(1);
    expect("id" in result[0]!).toBe(false);
    expect("url" in result[0]!).toBe(false);
    expect(result[0]!.blob).toBe(blob);
  });

  it("id·url이 주어지면 출력에 반영한다", () => {
    const blob = new Blob();
    const result = normalizePostImagesForMultipart([
      { blob, id: 7, url: "https://x" },
    ]);

    expect(result[0]).toEqual({ blob, id: 7, url: "https://x" });
  });
});
