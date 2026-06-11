import type { FriendsPageProfileTab } from "../types";

export const FRIENDS_PAGE_TAB_ITEMS: {
  id: FriendsPageProfileTab;
  label: string;
}[] = [
  { id: "friends", label: "친구" },
  { id: "sent", label: "보낸 요청" },
  { id: "received", label: "받은 요청" },
];
