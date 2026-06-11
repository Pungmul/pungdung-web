import { notFound } from "next/navigation";

import { prefetchBoardInfoList } from "@/features/board";

import { SearchResultPage } from "./_SearchResultPage";

type SearchPageProps = {
  params: Promise<{ boardID: string }>;
  searchParams: Promise<{ keyword?: string }>;
};

export async function generateMetadata({ params, searchParams }: SearchPageProps) {
  const { keyword } = await searchParams;
  const { boardID } = await params;
  const boardList = await prefetchBoardInfoList();
  const boardName =
    boardList.find((board) => board.id === Number(boardID))?.name ||
    "알 수 없는 게시판";
  const title = keyword?.trim()
    ? `풍덩 | ${boardName} - "${keyword.trim()}" 검색 결과`
    : `풍덩 | ${boardName}`;
  return { title };
}

export default async function SearchPage({ params, searchParams }: SearchPageProps) {
  const { boardID } = await params;
  const { keyword } = await searchParams;

  if (!keyword) {
    return notFound();
  }

  return <SearchResultPage boardID={Number(boardID)} keyword={keyword} />;
}
