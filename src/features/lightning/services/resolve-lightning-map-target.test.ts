import { describe, expect, it } from "vitest";

import type { LightningMeeting } from "../types";

import {
  createLightningLookup,
  getLightningIdAtIndex,
  resolveLightningMapTargetById,
} from "./resolve-lightning-map-target";

const makeLightning = (
  id: number,
  latitude: number,
  longitude: number
): LightningMeeting =>
  ({
    id,
    latitude,
    longitude,
  } as LightningMeeting);

const lightningList = [
  makeLightning(1, 37.1, 127.1),
  makeLightning(2, 37.2, 127.2),
  makeLightning(3, 37.3, 127.3),
];

describe("resolveLightningMapTarget", () => {
  it("번개 id로 위치와 현재 인덱스를 반환한다", () => {
    const lookup = createLightningLookup(lightningList);

    expect(resolveLightningMapTargetById(lookup, 2)).toEqual({
      id: 2,
      index: 1,
      location: {
        latitude: 37.2,
        longitude: 127.2,
      },
    });
  });

  it("목록 순서가 바뀌어도 id 기준으로 현재 인덱스를 찾는다", () => {
    const reordered = [lightningList[2]!, lightningList[0]!, lightningList[1]!];
    const lookup = createLightningLookup(reordered);

    expect(resolveLightningMapTargetById(lookup, 2)).toEqual({
      id: 2,
      index: 2,
      location: {
        latitude: 37.2,
        longitude: 127.2,
      },
    });
  });

  it("없는 id이면 null을 반환한다", () => {
    const lookup = createLightningLookup(lightningList);

    expect(resolveLightningMapTargetById(lookup, 999)).toBeNull();
  });

  it("인덱스에 해당하는 번개 id를 반환한다", () => {
    expect(getLightningIdAtIndex(lightningList, 1)).toBe(2);
  });

  it("인덱스에 해당하는 번개가 없으면 null을 반환한다", () => {
    expect(getLightningIdAtIndex(lightningList, 10)).toBeNull();
  });
});
