"use client";

import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { ChevronRightIcon } from "@heroicons/react/24/outline";

import {
  boardQueries,
  flattenInfinitePages,
  resolveFreeBoardHref,
  useDebouncedFetchNextPage,
} from "@/features/board";
import type { PostSummaryWithCategory } from "@/features/post";
import { PostWithCategoryNameList } from "@/features/post";

import { LinkChipButton,ListEmptyView } from "@/shared/components";

export function MyPostListPage() {
  const infinite = useSuspenseInfiniteQuery(boardQueries.myPostList());
  const posts = flattenInfinitePages<PostSummaryWithCategory>(infinite.data);
  const { loadMore } = useDebouncedFetchNextPage({
    fetchNextPage: infinite.fetchNextPage,
    hasNextPage: infinite.hasNextPage,
    isFetchingNextPage: infinite.isFetchingNextPage,
  });

  return (
      <PostWithCategoryNameList
        posts={posts}
        isLoading={infinite.isFetchingNextPage}
        hasNextPage={infinite.hasNextPage}
        onLoadMore={loadMore}
        ListEmptyComponent={<MyPostListEmpty />}
      />
  );
}

function MyPostListEmpty() {
  const { data: boards } = useSuspenseQuery(boardQueries.list());
  const freeBoardHref = resolveFreeBoardHref(boards);

  return (
    <ListEmptyView
      message="내 작성글이 없어요."
      action={
        <LinkChipButton
          href={freeBoardHref}
          filled
          className="inline-flex items-center gap-1"
        >
          자유 게시판으로
          <span className="size-4 flex items-center justify-center flex-shrink-0">
            <ChevronRightIcon className="size-full" />
          </span>
        </LinkChipButton>
      }
    />
  );
}