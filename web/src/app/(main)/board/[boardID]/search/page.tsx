import { notFound } from "next/navigation";

import {
  findBoardSummaryByRouteId,
  getBoardRscMetadataTitle,
  prefetchBoardInfoList,
} from "@/features/board";

import { SearchResultPage } from "./_SearchResultPage";

type SearchPageProps = {
  params: Promise<{ boardID: string }>;
  searchParams: Promise<{ keyword?: string }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: SearchPageProps) {
  const { keyword } = await searchParams;
  const { boardID } = await params;
  const trimmedKeyword = keyword?.trim();
  if (!trimmedKeyword) {
    return { title: await getBoardRscMetadataTitle(boardID) };
  }

  try {
    const boardList = await prefetchBoardInfoList();
    const boardName =
      findBoardSummaryByRouteId(boardList, boardID)?.name ||
      "알 수 없는 게시판";
    return {
      title: `풍덩 | ${boardName} - "${trimmedKeyword}" 검색 결과`,
    };
  } catch {
    return { title: "풍덩 | 게시판" };
  }
}

export default async function SearchPage({
  params,
  searchParams,
}: SearchPageProps) {
  const { boardID } = await params;
  const { keyword } = await searchParams;

  if (!keyword) {
    return notFound();
  }

  return <SearchResultPage boardID={Number(boardID)} keyword={keyword} />;
}
