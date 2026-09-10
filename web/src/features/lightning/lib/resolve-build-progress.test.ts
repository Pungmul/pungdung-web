import { describe, expect, it } from "vitest";

import { resolveBuildProgressPercent } from "./resolve-build-progress";

describe("resolveBuildProgressPercent", () => {
  it("첫 단계는 마지막 입력 단계보다 작다", () => {
    expect(resolveBuildProgressPercent("SelectType")).toBeLessThan(100);
  });

  it("SelectTarget은 아직 가득 차지 않는다", () => {
    expect(resolveBuildProgressPercent("SelectTarget")).toBe(80);
  });

  it("Summary와 Complete는 100이다", () => {
    expect(resolveBuildProgressPercent("Summary")).toBe(100);
    expect(resolveBuildProgressPercent("Complete")).toBe(100);
  });
});
