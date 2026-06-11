import { describe, expect, it } from "vitest";

import type { LightningMeeting } from "../types";

import { filterLightningList } from "./filter-lightning-list";

const makeItem = (id: number): LightningMeeting =>
  ({ id } as unknown as LightningMeeting);

const whole = [makeItem(1), makeItem(2), makeItem(3)];
const school = [makeItem(2), makeItem(3)];

describe("filterLightningList", () => {
  it("전체를 선택하면 wholeLightningList를 반환한다", () => {
    expect(filterLightningList("전체", whole, school)).toBe(whole);
  });

  it("우리학교를 선택하면 schoolLightningList를 반환한다", () => {
    expect(filterLightningList("우리학교", whole, school)).toBe(school);
  });

  it("빈 목록도 처리한다", () => {
    expect(filterLightningList("우리학교", whole, [])).toEqual([]);
    expect(filterLightningList("전체", [], school)).toEqual([]);
  });
});
