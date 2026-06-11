function toOptionalText(value: string | undefined): string | undefined {
  if (value == null) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function formatDetailCell(
  isLoading: boolean,
  value: string | undefined,
): string {
  if (isLoading) {
    return "불러오는 중…";
  }
  return toOptionalText(value) ?? "-";
}

export function formatSchoolClubLine(
  isLoading: boolean,
  school: string | undefined,
  groupName: string | undefined,
): string {
  if (isLoading) {
    return "불러오는 중…";
  }

  const schoolText = toOptionalText(school);
  const groupNameText = toOptionalText(groupName);
  const merged = [schoolText, groupNameText].filter(
    (item): item is string => item != null,
  );

  if (merged.length === 0) {
    return "-";
  }

  return merged.join(" · ");
}
