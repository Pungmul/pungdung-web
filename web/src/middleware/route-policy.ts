export type GuestRoutePolicy = "public" | "induction" | "member-only";

const PUBLIC_BOARD_IDS = new Set(["1", "3", "4", "5", "6"]);

const isPublicBoardRoute = (pathname: string): boolean => {
  const match = /^\/board\/(\d+)\/?$/.exec(pathname);
  return match !== null && PUBLIC_BOARD_IDS.has(match[1]!);
};

export function getGuestRoutePolicy(
  pathname: string,
  search: string = ""
): GuestRoutePolicy {
  const promotionTab = new URLSearchParams(search).get("tab");

  if (
    pathname === "/board/promote/l" &&
    promotionTab !== null &&
    promotionTab !== "promotion-list"
  ) {
    return "induction";
  }

  if (
    pathname === "/board/main" ||
    pathname === "/board/hot-post" ||
    pathname === "/board/promote" ||
    pathname === "/board/promote/l" ||
    (/^\/board\/promote\/d\/[^/]+\/?$/.test(pathname)) ||
    pathname.startsWith("/board/d/") ||
    isPublicBoardRoute(pathname)
  ) {
    return "public";
  }

  if (
    pathname === "/home" ||
    pathname.startsWith("/lightning") ||
    pathname.startsWith("/chats") ||
    pathname.startsWith("/my-page") ||
    pathname === "/notification"
  ) {
    return "induction";
  }

  return "member-only";
}

export function toInternalNext(pathname: string, search: string): string {
  return `${pathname}${search}`;
}
