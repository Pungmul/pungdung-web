import { describe, expect, it } from "vitest";

import { friendsSearchResponseSchema } from "../../api/client/dto.schema";

import { mapFriendsSearchResponseDtoToFriendStatuses } from "./map-friends-search-response-dto";

describe("mapFriendsSearchResponseDtoToFriendStatuses", () => {
  it("검색 행을 FriendStatus 로 매핑한다", () => {
    const raw = [
      {
        user: {
          userId: 7,
          username: "search@example.com",
          name: "검색",
          profileImage: {
            id: 1,
            originalFilename: "a.jpg",
            convertedFileName: "a.webp",
            fullFilePath: "https://example.com/a.webp",
            fileType: "image/webp",
            fileSize: 1,
            createdAt: "2026-01-01T00:00:00.000Z",
          },
        },
        friendRequestInfo: {
          friendRequestId: 3,
          friendStatus: "PENDING",
        },
      },
    ];
    const parsed = friendsSearchResponseSchema.parse(raw);
    const list = mapFriendsSearchResponseDtoToFriendStatuses(parsed);

    expect(list).toHaveLength(1);
    expect(list[0]?.user.userId).toBe(7);
    expect(list[0]?.friendRequestInfo.friendRequestId).toBe(3);
    expect(list[0]?.friendRequestInfo.friendStatus).toBe("PENDING");
  });
});
