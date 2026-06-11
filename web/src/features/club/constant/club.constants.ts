export const CLUB_NAMES = [
  "어흥",
  "떼",
  "하날다래",
  "악반",
  "푸른소래",
  "산틀",
  "없음",
] as const;

export type ClubName = (typeof CLUB_NAMES)[number];

export const SCHOOL_NAMES = [
  "상명대",
  "연대",
  "이화여대",
  "홍대",
  "고대",
  "없음",
] as const;

export type SchoolName = (typeof SCHOOL_NAMES)[number];

export const clubToSchoolNameMap: Record<Exclude<ClubName, "없음">, SchoolName> = {
  어흥: "상명대",
  떼: "연대",
  하날다래: "이화여대",
  악반: "홍대",
  푸른소래: "고대",
  산틀: "홍대",
} as const;

export const clubToClubIdMap: Record<Exclude<ClubName, "없음">, number> = {
  어흥: 1,
  떼: 2,
  하날다래: 3,
  악반: 4,
  푸른소래: 5,
  산틀: 6,
} as const;

export const NO_CLUB_VALUE = "no-club";