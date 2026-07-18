import { describe, expect, it } from "vitest";

import { getGuestRoutePolicy, toInternalNext } from "./route-policy";

describe("getGuestRoutePolicy", () => {
  it("임시 공개 게시판과 홍보 경로만 공개 열람으로 분류한다", () => {
    expect(getGuestRoutePolicy("/board/1")).toBe("public");
    expect(getGuestRoutePolicy("/board/6")).toBe("public");
    expect(getGuestRoutePolicy("/board/main")).toBe("public");
    expect(getGuestRoutePolicy("/board/promote/l", "?tab=promotion-list")).toBe(
      "public"
    );
    expect(getGuestRoutePolicy("/board/promote/l", "?tab=my-performance")).toBe(
      "induction"
    );
    expect(getGuestRoutePolicy("/board/promote/d/public-key")).toBe("public");
    expect(getGuestRoutePolicy("/board/promote/d/public-key/survey")).toBe(
      "member-only"
    );
    expect(getGuestRoutePolicy("/board/2")).toBe("member-only");
    expect(getGuestRoutePolicy("/board/1/search")).toBe("member-only");
  });

  it("홈·번개·채팅·마이페이지·알림을 로그인 유도 화면으로 분류한다", () => {
    expect(getGuestRoutePolicy("/home")).toBe("induction");
    expect(getGuestRoutePolicy("/lightning/build")).toBe("induction");
    expect(getGuestRoutePolicy("/chats/r/inbox")).toBe("induction");
    expect(getGuestRoutePolicy("/my-page/edit")).toBe("induction");
    expect(getGuestRoutePolicy("/notification")).toBe("induction");
  });

  it("로그인 복귀 경로에 현재 검색 문자열을 보존한다", () => {
    expect(toInternalNext("/board/p", "?boardId=1")).toBe(
      "/board/p?boardId=1"
    );
  });
});
