import { describe, expect, it } from "vitest";

import { CLUB_NAMES, NO_CLUB_VALUE } from "@/features/club";

import { createClubFieldSchema } from "./club-field.schema";

describe("createClubFieldSchema", () => {
  it("동적 클럽 목록이 비어 있으면 기본 CLUB_NAMES를 허용한다", () => {
    const schema = createClubFieldSchema([]);

    const firstClub = CLUB_NAMES[0];
    expect(schema.safeParse(firstClub).success).toBe(true);
  });

  it("동적 클럽 목록이 있으면 해당 목록 값을 허용한다", () => {
    const schema = createClubFieldSchema(["테스트클럽A", "테스트클럽B"]);

    expect(schema.safeParse("테스트클럽A").success).toBe(true);
    expect(schema.safeParse("테스트클럽B").success).toBe(true);
  });

  it("NO_CLUB_VALUE와 '없음'은 항상 허용한다", () => {
    const schema = createClubFieldSchema(["임의클럽"]);

    expect(schema.safeParse(NO_CLUB_VALUE).success).toBe(true);
    expect(schema.safeParse("없음").success).toBe(true);
  });

  it("nullable/optional 스키마로 null과 undefined를 허용한다", () => {
    const schema = createClubFieldSchema(["임의클럽"]);

    expect(schema.safeParse(null).success).toBe(true);
    expect(schema.safeParse(undefined).success).toBe(true);
  });

  it("허용되지 않은 값은 실패한다", () => {
    const schema = createClubFieldSchema(["허용클럽"]);

    expect(schema.safeParse("미허용클럽").success).toBe(false);
  });
});
