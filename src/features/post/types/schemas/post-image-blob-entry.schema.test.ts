import { describe, expect, it } from "vitest";

import { postImageBlobEntrySchema } from "./post-image-blob-entry.schema";

describe("postImageBlobEntrySchema", () => {
  it("blob이 Blob 인스턴스여야 한다", () => {
    const ok = postImageBlobEntrySchema.safeParse({ blob: new Blob() });
    expect(ok.success).toBe(true);
  });

  it("플레인 객체는 blob 검증에서 실패한다", () => {
    const fail = postImageBlobEntrySchema.safeParse({ blob: { size: 0 } });
    expect(fail.success).toBe(false);
  });

  it("선택적으로 id와 url을 받아들인다", () => {
    const blob = new Blob();
    const parsed = postImageBlobEntrySchema.safeParse({
      blob,
      id: 3,
      url: "https://example.com/img.png",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data).toEqual({ blob, id: 3, url: "https://example.com/img.png" });
    }
  });
});
