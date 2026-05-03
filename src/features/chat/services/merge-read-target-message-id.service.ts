export function mergeReadTargetMessageId(
  current: number | null,
  next: number,
): number {
  return current === null ? next : Math.max(current, next);
}
