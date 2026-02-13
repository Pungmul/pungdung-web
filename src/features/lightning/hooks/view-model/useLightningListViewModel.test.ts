import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { LightningMeeting } from "../../types";

import { useLightningListViewModel } from "./useLightningListViewModel";

const makeItem = (id: number): LightningMeeting =>
  ({ id } as unknown as LightningMeeting);

const whole = [makeItem(1), makeItem(2)];
const school = [makeItem(2)];

describe("useLightningListViewModel", () => {
  it("초기 target은 '전체'이고 wholeLightningList를 반환한다", () => {
    const { result } = renderHook(() =>
      useLightningListViewModel({ wholeLightningList: whole, schoolLightningList: school })
    );
    expect(result.current.target).toBe("전체");
    expect(result.current.lightningList).toBe(whole);
  });

  it("target을 '우리학교'로 바꾸면 schoolLightningList를 반환한다", () => {
    const { result } = renderHook(() =>
      useLightningListViewModel({ wholeLightningList: whole, schoolLightningList: school })
    );
    act(() => result.current.setTarget("우리학교"));
    expect(result.current.target).toBe("우리학교");
    expect(result.current.lightningList).toBe(school);
  });

  it("다시 '전체'로 바꾸면 wholeLightningList를 반환한다", () => {
    const { result } = renderHook(() =>
      useLightningListViewModel({ wholeLightningList: whole, schoolLightningList: school })
    );
    act(() => result.current.setTarget("우리학교"));
    act(() => result.current.setTarget("전체"));
    expect(result.current.lightningList).toBe(whole);
  });
});
