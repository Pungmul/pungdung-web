import { describe, expect, it } from "vitest";

import type { FriendsLoadData } from "../types";

import {
  deriveFriendsPageTabCounts,
  shouldShowFriendsPageInitialSpinner,
} from "./friends-page-display";

const emptyLoad: FriendsLoadData = {
  acceptedFriendList: [],
  pendingSentList: [],
  pendingReceivedList: [],
};

describe("deriveFriendsPageTabCounts", () => {
  it("각 탭별 행 개수를 반환한다", () => {
    const lists: FriendsLoadData = {
      acceptedFriendList: [
        {
          friendRequestId: 1,
          user: {
            userId: 1,
            username: "a@x.com",
            name: "A",
            profileImage: {
              id: 1,
              originalFilename: "a.jpg",
              convertedFileName: "a.webp",
              fullFilePath: "https://x/a.webp",
              fileType: "image/webp",
              fileSize: 1,
              createdAt: "2026-01-01T00:00:00.000Z",
            },
          },
        },
      ],
      pendingSentList: [
        {
          friendRequestId: 2,
          user: {
            userId: 2,
            username: "b@x.com",
            name: "B",
            profileImage: {
              id: 1,
              originalFilename: "a.jpg",
              convertedFileName: "a.webp",
              fullFilePath: "https://x/a.webp",
              fileType: "image/webp",
              fileSize: 1,
              createdAt: "2026-01-01T00:00:00.000Z",
            },
          },
        },
        {
          friendRequestId: 3,
          user: {
            userId: 3,
            username: "c@x.com",
            name: "C",
            profileImage: {
              id: 1,
              originalFilename: "a.jpg",
              convertedFileName: "a.webp",
              fullFilePath: "https://x/a.webp",
              fileType: "image/webp",
              fileSize: 1,
              createdAt: "2026-01-01T00:00:00.000Z",
            },
          },
        },
      ],
      pendingReceivedList: [],
    };

    expect(deriveFriendsPageTabCounts(lists)).toEqual({
      friends: 1,
      sent: 2,
      received: 0,
    });
  });

  it("빈 목록이면 모두 0", () => {
    expect(deriveFriendsPageTabCounts(emptyLoad)).toEqual({
      friends: 0,
      sent: 0,
      received: 0,
    });
  });
});

describe("shouldShowFriendsPageInitialSpinner", () => {
  it("페치 중이고 데이터가 아직 없을 때만 true", () => {
    expect(shouldShowFriendsPageInitialSpinner(true, undefined)).toBe(true);
  });

  it("데이터가 있으면 페치 중이어도 false", () => {
    expect(shouldShowFriendsPageInitialSpinner(true, emptyLoad)).toBe(false);
  });

  it("페치가 끝났으면 false", () => {
    expect(shouldShowFriendsPageInitialSpinner(false, undefined)).toBe(false);
  });
});
