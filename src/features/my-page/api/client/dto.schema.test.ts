import { describe, expect, it } from "vitest";

import { invitationCodeResponseSchema } from "./dto.schema";

describe("invitationCodeResponseSchema", () => {
  it("초대코드와 남은 사용 횟수를 검증한다", () => {
    const result = invitationCodeResponseSchema.safeParse({
      code: "123456",
      remainingUses: 2,
    });

    expect(result.success).toBe(true);
  });

  it("remainingUses가 숫자가 아니면 실패한다", () => {
    const result = invitationCodeResponseSchema.safeParse({
      code: "123456",
      remainingUses: "2",
    });

    expect(result.success).toBe(false);
  });
});
