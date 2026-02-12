import { describe, expect, it } from "vitest";

import type { LightningMeeting } from "../types";

import { deriveDisplayLightningLists } from "./derive-display-lightning-lists";

const makeItem = (id: number, createdAt: string): LightningMeeting =>
  ({ id, createdAt } as unknown as LightningMeeting);

describe("deriveDisplayLightningLists", () => {
  it("data가 undefined이면 두 리스트 모두 빈 배열을 반환한다", () => {
    const result = deriveDisplayLightningLists(undefined);
    expect(result.wholeLightningList).toEqual([]);
    expect(result.schoolLightningList).toEqual([]);
  });

  it("schoolLightningList는 schoolLightningMeetings를 그대로 반환한다", () => {
    const school = [makeItem(10, "2026-01-01T00:00:00Z")];
    const result = deriveDisplayLightningLists({
      normalLightningMeetings: [],
      schoolLightningMeetings: school,
    });
    expect(result.schoolLightningList).toBe(school);
  });

  it("wholeLightningList는 normal + school을 합산한다", () => {
    const normal = [makeItem(1, "2026-01-01T00:00:00Z")];
    const school = [makeItem(2, "2026-01-02T00:00:00Z")];
    const result = deriveDisplayLightningLists({
      normalLightningMeetings: normal,
      schoolLightningMeetings: school,
    });
    expect(result.wholeLightningList).toHaveLength(2);
  });

  it("wholeLightningList는 최신순(createdAt desc)으로 정렬된다", () => {
    const older = makeItem(1, "2026-01-01T00:00:00Z");
    const newer = makeItem(2, "2026-01-03T00:00:00Z");
    const middle = makeItem(3, "2026-01-02T00:00:00Z");

    const result = deriveDisplayLightningLists({
      normalLightningMeetings: [older, newer],
      schoolLightningMeetings: [middle],
    });

    expect(result.wholeLightningList.map((m) => m.id)).toEqual([2, 3, 1]);
  });

  it("원본 배열을 변경하지 않는다", () => {
    const normal = [
      makeItem(1, "2026-01-02T00:00:00Z"),
      makeItem(2, "2026-01-01T00:00:00Z"),
    ];
    const originalOrder = normal.map((m) => m.id);

    deriveDisplayLightningLists({
      normalLightningMeetings: normal,
      schoolLightningMeetings: [],
    });

    expect(normal.map((m) => m.id)).toEqual(originalOrder);
  });
});
