import { okEnvelope } from "../envelope";

const now = "2027-12-01T00:00:00.000Z";

export const e2eFriendProfileImage = {
  id: 1,
  originalFilename: "friend.png",
  convertedFileName: "friend.png",
  fullFilePath: "/favicon.ico",
  fileType: "image/png",
  fileSize: 1,
  createdAt: now,
};

export const e2eFriendUser = {
  userId: 21,
  username: "friend-user",
  name: "친구유저",
  clubName: "풍물패",
  profileImage: e2eFriendProfileImage,
};

export const e2ePendingUser = {
  userId: 22,
  username: "pending-user",
  name: "요청유저",
  clubName: "풍물패",
  profileImage: e2eFriendProfileImage,
};

export const e2eSelfSearchUser = {
  userId: 1,
  username: "e2e-user",
  name: "E2E User",
  clubName: "풍물패",
  profileImage: e2eFriendProfileImage,
};

export const emptyFriendsLoadResponse = okEnvelope({
  acceptedFriendList: [],
  pendingReceivedList: [],
  pendingSentList: [],
});

export const friendsLoadWithAcceptedResponse = okEnvelope({
  acceptedFriendList: [
    {
      friendRequestId: 301,
      friendStatus: "ACCEPTED",
      simpleUserDTO: e2eFriendUser,
      isRequestSentByUser: false,
    },
  ],
  pendingReceivedList: [],
  pendingSentList: [],
});

export const friendsLoadWithIncomingResponse = okEnvelope({
  acceptedFriendList: [],
  pendingReceivedList: [
    {
      friendRequestId: 302,
      friendStatus: "RECEIVE",
      simpleUserDTO: e2ePendingUser,
      isRequestSentByUser: false,
    },
  ],
  pendingSentList: [],
});

export function friendsSearchResponse(
  user: typeof e2eFriendUser,
  friendStatus = "NONE"
) {
  return okEnvelope([
    {
      user,
      friendRequestInfo: {
        friendRequestId: friendStatus === "NONE" ? null : 310,
        friendStatus,
      },
    },
  ]);
}
