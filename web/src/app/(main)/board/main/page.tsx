import { cookies } from "next/headers";

import { getQueryClient } from "@/core";

import { hasAuthSessionCookie } from "@/features/auth";
import {
  BoardMainPageContent,
  boardQueries,
  filterBoardsForMainPage,
  prefetchBoardInfoList,
} from "@/features/board";

export const metadata = {
  title: "풍덩 | 게시판",
  description: "풍덩의 게시판 페이지 입니다.",
};

// ISR 설정: 15분마다 재생성
export const dynamic = "force-dynamic";

export default async function BoardMainPage() {
  const cookieStore = await cookies();
  const queryClient = getQueryClient();

  const boardList = await queryClient.fetchQuery({
    ...boardQueries.list(),
    queryFn: prefetchBoardInfoList,
  });

  const boardsForMain = filterBoardsForMainPage(boardList);
  const time = Date.now();

  return (
    <BoardMainPageContent
      boardList={boardsForMain}
      time={time}
      isGuest={
        !hasAuthSessionCookie(
          cookieStore.get("accessToken")?.value,
          cookieStore.get("refreshToken")?.value
        )
      }
    />
  );
}
