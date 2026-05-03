import type { Message } from "../types";

export function isSameMessageArray(a: Message[], b: Message[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    const left = a[i];
    const right = b[i];
    if (!left || !right) return false;
    if (String(left.id) !== String(right.id)) return false;
    if (left.createdAt !== right.createdAt) return false;
  }
  return true;
}
