"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import {
  boardQueries,
  flattenInfinitePages,
  useDebouncedFetchNextPage,
} from "@/features/board";
import { PostBoxSkeleton, PostList } from "@/features/post";

import { ListEmptyView } from "@/shared/components";

const SEARCH_LIST_SIZE = 10;

export function SearchResultPage({
  boardID,
  keyword,
}: {
  boardID: number;
  keyword: string;
}) {
  const searchPostList = useInfiniteQuery(
    boardQueries.searchPostList(boardID, keyword || "", SEARCH_LIST_SIZE)
  );
  const posts = flattenInfinitePages(searchPostList.data);
  const { loadMore } = useDebouncedFetchNextPage({
    fetchNextPage: searchPostList.fetchNextPage,
    hasNextPage: Boolean(searchPostList.hasNextPage),
    isFetchingNextPage: searchPostList.isFetchingNextPage,
  });

  return (
    <main className="flex flex-col w-full bg-background h-full relative">
      <h1 className="px-6 text-xl font-bold text-grey-600 py-3">
        {`"${keyword}" 에 대한 검색 결과`}
      </h1>
      <section
        key="board-post-list-section"
        className="relative flex flex-col w-full bg-background flex-grow"
      >
        {!keyword || searchPostList.isLoading || !searchPostList.data ? (
          <PostBoxSkeleton length={8} />
        ) : (
          <>
            <PostList
              key="board-post-list"
              posts={posts}
              isLoading={searchPostList.isFetchingNextPage || false}
              hasNextPage={searchPostList.hasNextPage || false}
              onLoadMore={loadMore}
              ListEmptyComponent={
                <DefaultSearchListEmptyComponent keyword={keyword || ""} />
              }
            />
          </>
        )}
      </section>
    </main>
  );
}

function DefaultSearchListEmptyComponent({
  keyword,
}: {
  keyword: string;
}): React.ReactNode {
  return (
    <ListEmptyView message={`"${keyword}"에 대한 검색 결과가 없어요.`} />
  );
}
