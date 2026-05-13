import type { ReadReceiptAvatar } from "../../types/read-receipt.types";

export function readReceiptAvatarUserIdsKey(
  avatars: readonly ReadReceiptAvatar[]
): string {
  return avatars.map((avatar) => avatar.userId).join(",");
}
