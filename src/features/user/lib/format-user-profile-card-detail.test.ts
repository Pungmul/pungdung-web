import { describe, expect, it } from "vitest";

import {
  formatDetailCell,
  formatSchoolClubLine,
} from "./format-user-profile-card-detail";

describe("formatDetailCell", () => {
  it("로딩 중이면 플레이스홀더 문구를 반환한다", () => {
    expect(formatDetailCell(true, "홍길동")).toBe("불러오는 중…");
  });

  it("값이 undefined면 기본 대체값 '-'를 반환한다", () => {
    expect(formatDetailCell(false, undefined)).toBe("-");
  });

  it("값이 빈 문자열 또는 공백뿐이면 기본 대체값 '-'를 반환한다", () => {
    expect(formatDetailCell(false, "")).toBe("-");
    expect(formatDetailCell(false, "   ")).toBe("-");
  });

  it("일반 문자열은 trim 후 표시한다", () => {
    expect(formatDetailCell(false, "  프론트엔드 동아리  ")).toBe(
      "프론트엔드 동아리",
    );
  });
});

describe("formatSchoolClubLine", () => {
  it("로딩 중이면 플레이스홀더 문구를 반환한다", () => {
    expect(formatSchoolClubLine(true, "한빛대학교", "개발동아리")).toBe(
      "불러오는 중…",
    );
  });

  it("학교와 그룹명이 모두 없으면 기본 대체값 '-'를 반환한다", () => {
    expect(formatSchoolClubLine(false, undefined, undefined)).toBe("-");
  });

  it("학교만 있으면 학교명만 반환한다", () => {
    expect(formatSchoolClubLine(false, "한빛대학교", undefined)).toBe(
      "한빛대학교",
    );
  });

  it("그룹명만 있으면 그룹명만 반환한다", () => {
    expect(formatSchoolClubLine(false, undefined, "개발동아리")).toBe(
      "개발동아리",
    );
  });

  it("학교와 그룹명이 모두 있으면 ' · '로 연결한다", () => {
    expect(formatSchoolClubLine(false, "한빛대학교", "개발동아리")).toBe(
      "한빛대학교 · 개발동아리",
    );
  });

  it("학교/그룹명의 공백 전용 값은 없는 값으로 취급한다", () => {
    expect(formatSchoolClubLine(false, "  ", "개발동아리")).toBe("개발동아리");
    expect(formatSchoolClubLine(false, "한빛대학교", "   ")).toBe("한빛대학교");
    expect(formatSchoolClubLine(false, "   ", "   ")).toBe("-");
  });
});
