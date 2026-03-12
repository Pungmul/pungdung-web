import { describe, expect, it } from "vitest";

import { friendsLoadResponseSchema } from "../../api/client/dto.schema";

import { mapFriendsLoadDtoToDomain } from "./map-friends-load-dto";

describe("mapFriendsLoadDtoToDomain", () => {
  it("simpleUserDTO·isRequestSentByUser null 을 도메인 user 로 매핑한다", () => {
    const raw = {
      acceptedFriendList: [
        {
          friendRequestId: 9,
          friendStatus: "ACCEPTED",
          simpleUserDTO: {
            userId: 2,
            username: "dbsgh123030@gmail.com",
            name: "강윤호",
            clubName: null,
            profileImage: {
              id: 1,
              originalFilename: "anonymous_image.jpg",
              convertedFileName: "admin/x.jpg",
              fullFilePath: "https://example.com/x.jpg",
              fileType: "image/jpeg",
              fileSize: 2966,
              createdAt: "2026-05-06T15:30:53",
            },
          },
          isRequestSentByUser: null,
        },
      ],
      pendingSentList: [
        {
          friendRequestId: 10,
          friendStatus: "PENDING",
          simpleUserDTO: {
            userId: 1,
            username: "betaUsername01@example.com",
            name: "홍길동",
            clubName: "패명",
            profileImage: {
              id: 1,
              originalFilename: "anonymous_image.jpg",
              convertedFileName: "admin/y.jpg",
              fullFilePath: "https://example.com/y.jpg",
              fileType: "image/jpeg",
              fileSize: 2966,
              createdAt: "2026-05-06T15:30:53",
            },
          },
          isRequestSentByUser: true,
        },
      ],
      pendingReceivedList: [],
    };

    const parsed = friendsLoadResponseSchema.parse(raw);
    const domain = mapFriendsLoadDtoToDomain(parsed);

    expect(domain.acceptedFriendList[0]).toMatchObject({
      friendRequestId: 9,
      user: {
        userId: 2,
        name: "강윤호",
        clubName: null,
      },
    });
    expect(domain.pendingSentList[0]).toMatchObject({
      friendRequestId: 10,
      user: {
        userId: 1,
        clubName: "패명",
      },
    });
    expect(domain.pendingReceivedList).toEqual([]);
  });
});
