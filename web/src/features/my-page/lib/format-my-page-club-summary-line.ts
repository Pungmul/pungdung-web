/**
 * 프로필 섹션의 동아리 표시 규칙을 UI에서 분리해 재사용/테스트 가능하게 유지한다.
 */
type FormatMyPageClubSummaryLineInput = {
  groupName: string | undefined;
  clubAge: number | undefined;
};

export function formatMyPageClubSummaryLine({
  groupName,
  clubAge,
}: FormatMyPageClubSummaryLineInput): string {
  const base = groupName ?? "";
  if (!clubAge) {
    return base;
  }

  return `${base} (${clubAge})`;
}
