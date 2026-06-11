import { queryOptions } from "@tanstack/react-query";

import { getMyInvitationCode, getMyPageInfo } from "../api/client";

/** 마이 페이지·채팅·바텀 탭 등이 공유하는 회원 조회 캐시 TTL. */
export const MY_PAGE_MEMBER_STALE_MS = 1000 * 60 * 5;

const myPageQueryKeys = {
  all: ["my-page"] as const,
  info: () => [...myPageQueryKeys.all, "info"] as const,
  invitationCode: () => [...myPageQueryKeys.all, "invitation-code"] as const,
};

export const myPageQueries = {
  all: () => ({
    queryKey: myPageQueryKeys.all,
  }),
  info: () =>
    queryOptions({
      queryKey: myPageQueryKeys.info(),
      queryFn: getMyPageInfo,
      staleTime: MY_PAGE_MEMBER_STALE_MS,
    }),
  invitationCode: () =>
    queryOptions({
      queryKey: myPageQueryKeys.invitationCode(),
      queryFn: getMyInvitationCode,
      staleTime: MY_PAGE_MEMBER_STALE_MS,
    }),
};
