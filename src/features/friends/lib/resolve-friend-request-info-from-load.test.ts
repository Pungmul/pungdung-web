import { describe, expect, it } from "vitest";

import type { FriendsLoadData } from "../types";
import {
  buildFriendRequestInfoByUserIdMap,
  resolveFriendRequestInfoFromFriendsLoad,
} from "./resolve-friend-request-info-from-load";

const baseUser = (userId: number) => ({
  userId,
  username: `u${userId}`,
  name: `User ${userId}`,
  profileImage: {
    fullFilePath: "/x.png",
    originalFilename: "x.png",
  },
});

describe("resolveFriendRequestInfoFromFriendsLoad", () => {
  it("ACCEPTED가 있으면 그 행의 friendRequestId를 반환한다", () => {
    const load: FriendsLoadData = {
      acceptedFriendList: [{ friendRequestId: 10, user: baseUser(1) }],
      pendingReceivedList: [],
      pendingSentList: [],
    };
    expect(resolveFriendRequestInfoFromFriendsLoad(1, load)).toEqual({
      friendRequestId: 10,
      friendStatus: "ACCEPTED",
    });
  });

  it("RECEIVE가 있으면 받은 요청으로 반환한다", () => {
    const load: FriendsLoadData = {
      acceptedFriendList: [],
      pendingReceivedList: [{ friendRequestId: 20, user: baseUser(2) }],
      pendingSentList: [],
    };
    expect(resolveFriendRequestInfoFromFriendsLoad(2, load)).toEqual({
      friendRequestId: 20,
      friendStatus: "RECEIVE",
    });
  });

  it("SEND가 있으면 보낸 요청으로 반환한다", () => {
    const load: FriendsLoadData = {
      acceptedFriendList: [],
      pendingReceivedList: [],
      pendingSentList: [{ friendRequestId: 30, user: baseUser(3) }],
    };
    expect(resolveFriendRequestInfoFromFriendsLoad(3, load)).toEqual({
      friendRequestId: 30,
      friendStatus: "SEND",
    });
  });

  it("어느 목록에도 없으면 NONE이다", () => {
    const load: FriendsLoadData = {
      acceptedFriendList: [],
      pendingReceivedList: [],
      pendingSentList: [],
    };
    expect(resolveFriendRequestInfoFromFriendsLoad(99, load)).toEqual({
      friendRequestId: null,
      friendStatus: "NONE",
    });
  });
});

describe("buildFriendRequestInfoByUserIdMap", () => {
  it("resolve와 동일한 값을 맵에서 조회할 수 있다", () => {
    const load: FriendsLoadData = {
      acceptedFriendList: [{ friendRequestId: 10, user: baseUser(1) }],
      pendingReceivedList: [{ friendRequestId: 20, user: baseUser(2) }],
      pendingSentList: [{ friendRequestId: 30, user: baseUser(3) }],
    };
    const map = buildFriendRequestInfoByUserIdMap(load);
    expect(map.get(1)).toEqual(
      resolveFriendRequestInfoFromFriendsLoad(1, load)
    );
    expect(map.get(2)).toEqual(
      resolveFriendRequestInfoFromFriendsLoad(2, load)
    );
    expect(map.get(3)).toEqual(
      resolveFriendRequestInfoFromFriendsLoad(3, load)
    );
    expect(map.get(99)).toBeUndefined();
  });
});
