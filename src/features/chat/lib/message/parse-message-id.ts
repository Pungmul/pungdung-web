export function toNumericMessageId(
  id: number | string | null | undefined
): number | null {
  if (id == null) {
    return null;
  }

  const numericId = typeof id === "number" ? id : Number(id);
  return Number.isFinite(numericId) ? numericId : null;
}

/** API chatlog 페이지는 최신→오래된 순이다. */
export function getOldestMessageIdInNewestFirstPage(
  messages: readonly { id: number | string }[]
): number | null {
  const oldest = messages.at(-1);
  return oldest ? toNumericMessageId(oldest.id) : null;
}
