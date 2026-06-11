/**
 * `email-sign-up.schema` — `buildEmailSignUpSchema`(계정+개인정보 intersection)만 검증한다.
 * `account.schema` · `sign-up-personal.schema` 단위 테스트는 각 전용 파일을 본다.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

import { buildEmailSignUpSchema } from "./email-sign-up.schema";

const fetchEmailExists = vi.hoisted(() =>
  vi.fn(
    async (_data: { email: string }): Promise<{ isRegistered: boolean }> => ({
      isRegistered: false,
    })
  )
);

vi.mock("../../api/client", () => ({
  fetchEmailExists: (data: { email: string }) => fetchEmailExists(data),
}));

describe("buildEmailSignUpSchema", () => {
  beforeEach(() => {
    fetchEmailExists.mockReset();
    fetchEmailExists.mockResolvedValue({ isRegistered: false });
  });

  const fullSignUpSchema = () => buildEmailSignUpSchema([1]);

  const validPersonal = {
    name: "홍길동",
    nickname: undefined as string | undefined,
    club: 1 as const,
    clubAge: "21",
    tellNumber: "010-1234-5678",
    inviteCode: "123456",
  };

  const validAccount = {
    email: "newuser@example.com",
    password: "abcd1234!",
    confirmPassword: "abcd1234!",
  };

  it("계정·개인정보가 모두 유효하면 통과한다", async () => {
    const r = await fullSignUpSchema().safeParseAsync({
      ...validAccount,
      ...validPersonal,
    });
    expect(r.success).toBe(true);
  });

  it("계정 필드가 잘못되면 실패한다", async () => {
    const r = await fullSignUpSchema().safeParseAsync({
      ...validAccount,
      email: "not-an-email",
      ...validPersonal,
    });
    expect(r.success).toBe(false);
  });
});
