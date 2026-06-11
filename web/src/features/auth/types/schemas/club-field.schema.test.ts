import { describe, expect, it } from "vitest";

import { createClubFieldSchema } from "./club-field.schema";

describe("createClubFieldSchema", () => {
  it("동적 클럽 목록이 비어 있으면 숫자 id는 허용하지 않는다", () => {
    const schema = createClubFieldSchema([]);

    expect(schema.safeParse(1).success).toBe(false);
    expect(schema.safeParse(null).success).toBe(true);
    expect(schema.safeParse(undefined).success).toBe(true);
  });

  it("동적 클럽 id 목록이 있으면 해당 id만 허용한다", () => {
    const schema = createClubFieldSchema([101, 102]);

    expect(schema.safeParse(101).success).toBe(true);
    expect(schema.safeParse(102).success).toBe(true);
    expect(schema.safeParse(1).success).toBe(false);
  });

  it("null은 소속 없음으로 허용한다", () => {
    const schema = createClubFieldSchema([999]);

    expect(schema.safeParse(null).success).toBe(true);
  });

  it("optional 스키마로 undefined를 허용한다", () => {
    const schema = createClubFieldSchema([999]);

    expect(schema.safeParse(undefined).success).toBe(true);
  });

  it("허용되지 않은 id는 실패한다", () => {
    const schema = createClubFieldSchema([7]);

    expect(schema.safeParse(99).success).toBe(false);
  });
});
