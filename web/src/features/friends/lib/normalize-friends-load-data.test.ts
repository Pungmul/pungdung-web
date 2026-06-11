import { describe, expect, it } from "vitest";

import {
  EMPTY_FRIENDS_LOAD,
  normalizeFriendsLoadData,
} from "./normalize-friends-load-data";

describe("normalizeFriendsLoadData", () => {
  it("undefined·null 은 빈 목록", () => {
    expect(normalizeFriendsLoadData(undefined)).toEqual(EMPTY_FRIENDS_LOAD);
    expect(normalizeFriendsLoadData(null)).toEqual(EMPTY_FRIENDS_LOAD);
  });

  it("누락 필드는 빈 배열로 채운다", () => {
    expect(normalizeFriendsLoadData({ acceptedFriendList: [] })).toEqual({
      acceptedFriendList: [],
      pendingReceivedList: [],
      pendingSentList: [],
    });
  });
});
