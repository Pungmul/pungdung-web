import { ClubInfo } from "../types";

import { ClubName, clubToClubIdMap } from "../constant";

/** 마이페이지 등 `groupName`만 있을 때 Select value(`clubId`)로 환산한다. */
export const mapGroupNameToClubId = (
  groupName: ClubName | undefined,
  clubList?: ClubInfo[]
): number | null | undefined => {
  if (groupName == null) {
    return undefined;
  }
  if (groupName === "없음") {
    return null;
  }
  const fromList = clubList?.find((c) => c.groupName === groupName)?.clubId;
  if (fromList != null) {
    return fromList;
  }
  return clubToClubIdMap[groupName as Exclude<ClubName, "없음">] ?? undefined;
};

export const mapClubToClubId = (
  clubList: ClubInfo[],
  club: ClubName
): number | null => {
  if (club === "없음") {
    return null;
  }

  return clubList?.find((c) => c.groupName === club)?.clubId ?? null;
};

export const mapClubToSchoolName = (
  clubList: ClubInfo[],
  club: ClubName
): string => {
  if (club === "없음") {
    return "없음";
  }

  return clubList?.find((c) => c.groupName === club)?.school ?? "없음";
};
