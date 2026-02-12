import { QueryClient } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { LightningMeeting, UserParticipationData } from "../types";

import { applyLightningListSocketPayload } from "./apply-lightning-list-socket-payload";
import {
  deleteUserParticipationStatusCache,
  updateUserParticipationStatusCache,
} from "./participation-status-cache";
import {
  updateSchoolLightningListCache,
  updateWholeLightningListCache,
} from "./lightning-data-cache";

vi.mock("./lightning-data-cache", () => ({
  updateWholeLightningListCache: vi.fn(),
  updateSchoolLightningListCache: vi.fn(),
}));

vi.mock("./participation-status-cache", () => ({
  updateUserParticipationStatusCache: vi.fn(),
  deleteUserParticipationStatusCache: vi.fn(),
}));

const mockQC = {} as QueryClient;

beforeEach(() => {
  vi.clearAllMocks();
});
const makeItem = (id: number): LightningMeeting =>
  ({ id } as unknown as LightningMeeting);

describe("applyLightningListSocketPayload", () => {
  it("scope가 whole이면 updateWholeLightningListCache를 호출한다", () => {
    applyLightningListSocketPayload(mockQC, [], "whole", undefined);
    expect(updateWholeLightningListCache).toHaveBeenCalledWith(mockQC, []);
    expect(updateSchoolLightningListCache).not.toHaveBeenCalled();
  });

  it("scope가 school이면 updateSchoolLightningListCache를 호출한다", () => {
    applyLightningListSocketPayload(mockQC, [], "school", undefined);
    expect(updateSchoolLightningListCache).toHaveBeenCalledWith(mockQC, []);
    expect(updateWholeLightningListCache).not.toHaveBeenCalled();
  });

  it("참여 중이지 않으면 participation 캐시를 건드리지 않는다", () => {
    const nonParticipant: UserParticipationData = {
      participant: false,
      isOrganizer: null,
      lightningMeeting: null,
      chatRoomUUID: null,
    };
    applyLightningListSocketPayload(
      mockQC,
      [makeItem(1)],
      "whole",
      nonParticipant
    );
    expect(updateUserParticipationStatusCache).not.toHaveBeenCalled();
    expect(deleteUserParticipationStatusCache).not.toHaveBeenCalled();
  });

  it("참여 중이고 본인 모임 id가 목록에 있으면 캐시를 갱신한다", () => {
    const meeting = makeItem(42);
    const participant: UserParticipationData = {
      participant: true,
      isOrganizer: false,
      lightningMeeting: makeItem(42),
      chatRoomUUID: null,
    };
    applyLightningListSocketPayload(mockQC, [meeting], "whole", participant);
    expect(updateUserParticipationStatusCache).toHaveBeenCalledWith(
      mockQC,
      meeting
    );
    expect(deleteUserParticipationStatusCache).not.toHaveBeenCalled();
  });

  it("참여 중이지만 본인 모임 id가 목록에 없으면 캐시를 제거한다", () => {
    const participant: UserParticipationData = {
      participant: true,
      isOrganizer: false,
      lightningMeeting: makeItem(99),
      chatRoomUUID: null,
    };
    applyLightningListSocketPayload(
      mockQC,
      [makeItem(1), makeItem(2)],
      "whole",
      participant
    );
    expect(deleteUserParticipationStatusCache).toHaveBeenCalledWith(mockQC);
    expect(updateUserParticipationStatusCache).not.toHaveBeenCalled();
  });
});
