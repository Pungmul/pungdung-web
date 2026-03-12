import { User } from "@/features/user";

export function buildDisplayFriendSubtitle(friend: User): string | null {
  const hasClubName = Boolean(friend.clubName);
  const hasGroupName = Boolean(friend.groupName);
  if (hasClubName && hasGroupName) {
    return `${friend.clubName} · ${friend.groupName}`;
  }
  if (hasClubName) {
    return friend.clubName!;
  }
  if (hasGroupName) {
    return friend.groupName!;
  }

  return null;
}
