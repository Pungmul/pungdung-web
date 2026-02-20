import { getQueryClient } from "@/core";

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
export const revalidate = 900;

export default async function BoardMainPage() {
  const queryClient = getQueryClient();

  const boardList = await queryClient.fetchQuery({
    ...boardQueries.list(),
    queryFn: prefetchBoardInfoList,
  });

  const boardsForMain = filterBoardsForMainPage(boardList);

  return <BoardMainPageContent boardList={boardsForMain} />;
}
