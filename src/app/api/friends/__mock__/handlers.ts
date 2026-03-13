import { http, HttpResponse } from "msw";

const envelope = <T>(response: T, isSuccess = true) => ({
  code: isSuccess ? "SUCCESS" : "ERROR",
  message: isSuccess ? "ok" : "fail",
  response,
  isSuccess,
});

const mockProfileImage = {
  id: 1,
  originalFilename: "a.png",
  convertedFileName: "a.webp",
  fullFilePath: "https://example.com/a.webp",
  fileType: "image/webp",
  fileSize: 100,
  createdAt: "2026-01-01T00:00:00.000Z",
};

const mockUser = {
  userId: 42,
  username: "testuser",
  name: "테스트",
  profileImage: mockProfileImage,
};

/** 친구 검색·로드·변경 API용 envelope 응답 (pathname 매칭) */
export const friendsApiHandlers = [
  http.get(
    ({ request }) => new URL(request.url).pathname === "/api/friends/search",
    ({ request }) => {
      const keyword = new URL(request.url).searchParams.get("keyword") ?? "";
      const body = envelope([
        {
          user: mockUser,
          friendRequestInfo: {
            friendRequestId: null,
            friendStatus: "NONE",
          },
        },
      ]);
      return keyword === "" ? HttpResponse.json(envelope([])) : HttpResponse.json(body);
    }
  ),

  http.get(
    ({ request }) => new URL(request.url).pathname === "/api/friends/load",
    () =>
      HttpResponse.json(
        envelope({
          acceptedFriendList: [],
          pendingReceivedList: [],
          pendingSentList: [],
        })
      )
  ),

  http.post(
    ({ request }) => new URL(request.url).pathname === "/api/friends/add",
    () => HttpResponse.json(envelope(null))
  ),

  http.post(
    ({ request }) => new URL(request.url).pathname === "/api/friends/accept",
    () => HttpResponse.json(envelope(null))
  ),

  http.post(
    ({ request }) => new URL(request.url).pathname === "/api/friends/decline",
    () => HttpResponse.json(envelope(null))
  ),
];
