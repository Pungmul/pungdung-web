/**
 * `sign-up-personal.schema` — 이메일/카카오 개인정보 object·refine·`createDynamicPersonalSchema`.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/club", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@/features/club")>();
  return {
    ...mod,
    clubListApi: vi.fn(),
  };
});

import { type ClubInfo, clubListApi } from "@/features/club";

import {
  buildPersonalSchema,
  createDynamicPersonalSchema,
} from "./sign-up-personal.schema";

const stubClubRow: ClubInfo = {
  clubId: 1,
  school: "테스트",
  groupName: "어흥",
};

function assertFieldError(
  path: PropertyKey[],
  partialMessage?: string
): (
  issues: readonly { path: readonly PropertyKey[]; message: string }[]
) => void {
  return (issues) => {
    const hit = issues.find(
      (i) =>
        i.path.length === path.length &&
        path.every((p, idx) => i.path[idx] === p)
    );
    expect(
      hit,
      `expected issue at path ${String(path.join("."))}`
    ).toBeDefined();
    if (partialMessage) {
      expect(hit!.message).toContain(partialMessage);
    }
  };
}

describe("buildPersonalSchema", () => {
  const schemaForList = () => buildPersonalSchema([1]);

  const valid = {
    name: "홍길동",
    nickname: undefined as string | undefined,
    club: null,
    clubAge: "21",
    tellNumber: "010-1234-5678",
    inviteCode: "123456",
  };

  it("유효한 값이면 통과한다", () => {
    expect(schemaForList().safeParse(valid).success).toBe(true);
  });

  it("club id가 허용 목록에 없으면 실패한다", () => {
    const s = buildPersonalSchema([2, 3]);
    expect(s.safeParse({ ...valid, club: 1 }).success).toBe(false);
  });

  it("동일한 club id 목록으로 빌드한 스키마는 club 미선택(undefined)을 거부한다", () => {
    const s = buildPersonalSchema([1]);
    const r = s.safeParse({ ...valid, club: undefined });
    expect(r.success).toBe(false);
  });

  it("club이 null이면 소속 없음 선택으로 통과한다", () => {
    const r = schemaForList().safeParse({ ...valid, club: null });
    expect(r.success).toBe(true);
  });

  it("club이 undefined이면 소속패 선택 오류가 club 경로에 잡힌다", () => {
    const r = schemaForList().safeParse({ ...valid, club: undefined });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(
        r.error.issues.some(
          (i) => i.path[0] === "club" && i.message.includes("소속패")
        )
      ).toBe(true);
    }
  });

  it("초대 코드가 비어 있으면 실패한다", () => {
    const r = schemaForList().safeParse({ ...valid, inviteCode: "" });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues.some((i) => i.path[0] === "inviteCode")).toBe(true);
    }
  });
  it("초대 코드가 6자리 숫자가 아니면 실패한다", () => {
    const r = schemaForList().safeParse({ ...valid, inviteCode: "12" });
    expect(r.success).toBe(false);
    if (!r.success) assertFieldError(["inviteCode"], "6자리")(r.error.issues);
  });
});

describe("createDynamicPersonalSchema", () => {
  beforeEach(() => {
    vi.mocked(clubListApi).mockReset();
    vi.mocked(clubListApi).mockResolvedValue([stubClubRow]);
  });

  const baseRow = {
    name: "홍길동",
    nickname: undefined as string | undefined,
    clubAge: "21",
    tellNumber: "010-1234-5678",
  };

  it("동적 스키마 생성 시 clubListApi를 호출한다", async () => {
    const schema = await createDynamicPersonalSchema();
    expect(
      schema.safeParse({
        ...baseRow,
        club: 1,
        inviteCode: "123456",
      }).success
    ).toBe(true);
    expect(clubListApi).toHaveBeenCalled();
  });

  it("동적 스키마도 초대 코드는 6자리 숫자여야 한다", async () => {
    const schema = await createDynamicPersonalSchema();
    const bad = schema.safeParse({
      ...baseRow,
      club: 1,
      inviteCode: "x",
    });
    expect(bad.success).toBe(false);
  });
});
