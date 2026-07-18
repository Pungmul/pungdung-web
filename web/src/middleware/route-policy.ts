import { isPublicBoardId } from "@/core/policy/public-board";

export type GuestRoutePolicy = "public" | "induction" | "member-only";

const isPublicBoardRoute = (pathname: string): boolean => {
  const match = /^\/board\/(\d+)\/?$/.exec(pathname);
  return match !== null && isPublicBoardId(match[1]!);
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
    return "member-only";
  }

  if (
    pathname === "/board/main" ||
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
