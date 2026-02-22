import { describe, expect, it } from "vitest";

import { validatePromotionPosterFileBeforeUpload } from "./promotion-poster-file";

describe("validatePromotionPosterFileBeforeUpload", () => {
  it("rejects GIF by mime", () => {
    const file = new File([], "a.gif", { type: "image/gif" });
    Object.defineProperty(file, "size", { value: 100 });
    const r = validatePromotionPosterFileBeforeUpload(file);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.title).toBe("지원하지 않는 형식");
  });

  it("rejects SVG by mime", () => {
    const file = new File([], "a.svg", { type: "image/svg+xml" });
    Object.defineProperty(file, "size", { value: 100 });
    const r = validatePromotionPosterFileBeforeUpload(file);
    expect(r.ok).toBe(false);
  });

  it("accepts JPEG under size limit", () => {
    const file = new File([], "a.jpg", { type: "image/jpeg" });
    Object.defineProperty(file, "size", { value: 1024 });
    expect(validatePromotionPosterFileBeforeUpload(file)).toEqual({ ok: true });
  });

  it("rejects oversize file", () => {
    const file = new File([], "a.jpg", { type: "image/jpeg" });
    Object.defineProperty(file, "size", { value: 6 * 1024 * 1024 });
    const r = validatePromotionPosterFileBeforeUpload(file);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.title).toBe("파일 크기 제한");
  });
});
