import { describe, expect, it } from "vitest";

import { readPendingInvitationCode } from "./pending-invitation";

describe("readPendingInvitationCode", () => {
  it("6자리 숫자만 초대코드로 인정함", () => {
    expect(readPendingInvitationCode("123456")).toBe("123456");
  });

  it.each([undefined, "", "12345", "1234567", "abcdef"])(
    "형식이 아니면 빈 문자열, %s",
    (value) => {
      expect(readPendingInvitationCode(value)).toBe("");
    }
  );
});
