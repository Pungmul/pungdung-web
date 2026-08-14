import { describe, expect, it } from "vitest";

import { resolveSchoolNameFromGroupName } from "./resolve-school-name-from-group";

const clubList = [
  { clubId: 1, school: "상명대", groupName: "어흥" },
  { clubId: 2, school: "없음", groupName: "없음" },
];

describe("resolveSchoolNameFromGroupName", () => {
  it("groupName으로 school을 찾는다", () => {
    expect(resolveSchoolNameFromGroupName("어흥", clubList)).toBe("상명대");
  });

  it("groupName이 없으면 null이다", () => {
    expect(resolveSchoolNameFromGroupName(undefined, clubList)).toBeNull();
  });

  it("없음이면 null이다", () => {
    expect(resolveSchoolNameFromGroupName("없음", clubList)).toBeNull();
  });

  it("목록에 없으면 null이다", () => {
    expect(resolveSchoolNameFromGroupName("떼", clubList)).toBeNull();
  });
});
