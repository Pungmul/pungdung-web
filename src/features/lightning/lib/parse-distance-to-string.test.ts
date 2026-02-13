import { describe, expect, it } from "vitest";

import { parseDistanceToString } from "./parse-distance-to-string";

describe("parseDistanceToString", () => {
  it("1000m 미만이면 'm' 단위로 내림한다", () => {
    expect(parseDistanceToString(0)).toBe("0m");
    expect(parseDistanceToString(999.78)).toBe("999m");
    expect(parseDistanceToString(500)).toBe("500m");
  });

  it("1000m 이상이면 'km' 단위로 소수 둘째자리까지 표기한다", () => {
    expect(parseDistanceToString(1000)).toBe("1.00km");
    expect(parseDistanceToString(10005)).toBe("10.01km");
    expect(parseDistanceToString(11003)).toBe("11.00km");
  });

  it("경계값 1000m는 km 단위로 표기된다", () => {
    expect(parseDistanceToString(1000)).toBe("1.00km");
  });
});
