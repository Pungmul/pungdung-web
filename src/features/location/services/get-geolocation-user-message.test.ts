import { describe, expect, it } from "vitest";

import { getGeolocationUserMessage } from "./get-geolocation-user-message";

describe("getGeolocationUserMessage", () => {
  it("code 1·2·3일 때 안내 문구를 반환하고, 그 외는 null이다", () => {
    expect(
      getGeolocationUserMessage({
        code: 1,
        message: "User denied Geolocation",
      })
    ).toContain("거부");

    expect(
      getGeolocationUserMessage({
        code: 2,
        message: "Position update is unavailable",
      })
    ).toContain("기기/OS 위치 설정");

    expect(
      getGeolocationUserMessage({
        code: 3,
        message: "Timeout",
      })
    ).toContain("시간");

    expect(getGeolocationUserMessage({ code: 99, message: "" })).toBeNull();
    expect(getGeolocationUserMessage(new Error("x"))).toBeNull();
    expect(getGeolocationUserMessage(null)).toBeNull();
  });
});
