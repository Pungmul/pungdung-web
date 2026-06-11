import { describe, expect, it } from "vitest";

import {
  friendsLoadResponseSchema,
  friendsSearchResponseSchema,
  friendMutationVoidResponseSchema,
} from "./dto.schema";

const profileImage = {
  id: 1,
  originalFilename: "a",
  convertedFileName: "b",
  fullFilePath: "/p",
  fileType: "jpg",
  fileSize: 1,
  createdAt: "2026-01-01",
};

describe("friends dto.schema", () => {
  it("parses search response array", () => {
    const parsed = friendsSearchResponseSchema.safeParse([
      {
        user: {
          userId: 1,
          username: "u",
          name: "n",
          profileImage,
        },
        friendRequestInfo: { friendRequestId: null, friendStatus: "NONE" },
      },
    ]);
    expect(parsed.success).toBe(true);
  });

  it("parses load response shape", () => {
    const parsed = friendsLoadResponseSchema.safeParse({
      acceptedFriendList: [],
      pendingReceivedList: [],
      pendingSentList: [],
    });
    expect(parsed.success).toBe(true);
  });

  it("isRequestSentByUser 가 null 인 행을 허용한다", () => {
    const parsed = friendsLoadResponseSchema.safeParse({
      acceptedFriendList: [
        {
          friendRequestId: 1,
          friendStatus: "ACCEPTED",
          simpleUserDTO: {
            userId: 1,
            username: "a@b.com",
            name: "테스트",
            profileImage: {
              id: 1,
              originalFilename: "a",
              convertedFileName: "b",
              fullFilePath: "/p",
              fileType: "jpg",
              fileSize: 1,
              createdAt: "2026-01-01",
            },
          },
          isRequestSentByUser: null,
        },
      ],
      pendingReceivedList: [],
      pendingSentList: [],
    });
    expect(parsed.success).toBe(true);
  });

  it("normalizes mutation void response", () => {
    expect(friendMutationVoidResponseSchema.parse(null)).toBe(undefined);
    expect(friendMutationVoidResponseSchema.parse({ x: 1 })).toBe(undefined);
  });
});
