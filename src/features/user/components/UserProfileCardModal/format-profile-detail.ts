export function formatDetailCell(
  isPending: boolean,
  value: string | number | undefined | null
): string {
  if (isPending) return "…";
  if (value === "" || value == null) return "—";
  return String(value);
}

export function formatSchoolClubLine(
  isPending: boolean,
  school: string | undefined,
  groupName: string | undefined
): string {
  if (isPending) return "…";
  const parts = [school, groupName].filter(
    (s) => s != null && String(s).trim() !== ""
  );
  if (parts.length === 0) return "—";
  return parts.join(" · ");
}
