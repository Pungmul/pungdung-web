import type { ClubInfo } from "@/features/club";

export function resolveSchoolNameFromGroupName(
  groupName: string | undefined,
  clubList: ClubInfo[]
): string | null {
  if (groupName == null || groupName === "" || groupName === "없음") {
    return null;
  }

  const school = clubList.find((club) => club.groupName === groupName)?.school;
  if (school == null || school === "" || school === "없음") {
    return null;
  }

  return school;
}
