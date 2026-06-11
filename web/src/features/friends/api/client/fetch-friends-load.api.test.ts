import { beforeEach, describe, expect, it } from "vitest";

import { friendsApiHandlers } from "@/app/api/friends/__mock__/handlers";
import { server } from "@/test/msw-server";

import { fetchFriendsLoad } from "./fetch-friends-load.api";

describe("fetchFriendsLoad", () => {
  beforeEach(() => {
    server.resetHandlers();
    server.use(...friendsApiHandlers);
  });

  it("로드 응답을 도메인 모델로 반환한다", async () => {
    const data = await fetchFriendsLoad("");
    expect(data.acceptedFriendList).toEqual([]);
    expect(data.pendingReceivedList).toEqual([]);
    expect(data.pendingSentList).toEqual([]);
  });
});
