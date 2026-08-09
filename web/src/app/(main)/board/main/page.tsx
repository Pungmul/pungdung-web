import { cookies } from "next/headers";

import { hasAuthSessionCookie } from "@/features/auth";
import {
  BoardMainPageContent,
  BoardMainPageLoadError,
  filterBoardsForMainPage,
  loadBoardInfoListResult,
} from "@/features/board";

export const metadata = {
  title: "풍덩 | 게시판",
  description: "풍덩의 게시판 페이지 입니다.",
};

export const dynamic = "force-dynamic";

export default async function BoardMainPage() {
  const cookieStore = await cookies();
  const result = await loadBoardInfoListResult();
  const isGuest = !hasAuthSessionCookie(
    cookieStore.get("accessToken")?.value,
    cookieStore.get("refreshToken")?.value
  );

  if (!result.ok) {
    return <BoardMainPageLoadError errorKind={result.errorKind} />;
  }

  return (
    <BoardMainPageContent
      boardList={filterBoardsForMainPage(result.data)}
      time={Date.now()}
      isGuest={isGuest}
    />
  );
}
