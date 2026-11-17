import { describe, expect, it } from "vitest";

import { mergeRefreshedBoardPosts, toBoardPostData, type BoardPostData } from "./merge-refreshed-board-posts";

type Page = BoardPostData["pages"][number];
const post = (postId: number) => ({ postId, title: `가상 글 ${postId}`, content: "가상 내용", author: "가상 작성자", thumbnail: null, imageNum: 0, viewCount: 0, likedNum: 0, commentNum: 0, timeSincePosted: 0, timeSincePostedText: "방금" });
const page = (ids: number[], pageNum = 1): Page => ({
  total: 100, list: ids.map(post), pageNum, pageSize: 10,
  isFirstPage: pageNum === 1, isLastPage: false,
  hasPreviousPage: pageNum > 1, hasNextPage: true, hotPost: null,
});
const previous = (...ids: number[]): BoardPostData => ({ pages: [page(ids)], pageParams: [1] });
const range = (n: number) => Array.from({ length: n }, (_, i) => 1000 - i);

describe("새로고침 목록 병합", () => {
  it("30개 이내의 새 글은 기존 목록과 중복 없이 연결한다", () => {
    const fresh = [...range(30), 50, 49];
    const result = mergeRefreshedBoardPosts([page(fresh)], previous(50, 49, 48));
    expect(result.matched).toBe(true);
    expect(result.posts.map((item) => item.postId)).toEqual([...fresh, 48]);
  });

  it("새 글이 30개를 초과하거나 연결점을 찾지 못하면 첫 페이지만 사용한다", () => {
    const first = page(range(10));
    const later = page([...range(31).slice(10), 50], 2);
    expect(mergeRefreshedBoardPosts([first, later], previous(50, 49))).toEqual({ posts: first.list, matched: false });
    expect(mergeRefreshedBoardPosts([first], previous(50, 49))).toEqual({ posts: first.list, matched: false });
  });

  it("기존 첫 글이 같아도 새로 받아온 글 내용을 우선한다", () => {
    const old = previous(50, 49);
    const fresh = page([50, 49]);
    fresh.list[0]!.title = "새 내용";
    expect(mergeRefreshedBoardPosts([fresh], old).posts[0]?.title).toBe("새 내용");
  });

  it("페이지와 다음 페이지 번호를 다시 맞춘다", () => {
    const first = page(range(10));
    const result = toBoardPostData(first, range(23).map(post));
    expect(result.pageParams).toEqual([1, 2, 3]);
    expect(result.pages.map((item) => item.list.length)).toEqual([10, 10, 3]);
    expect(result.pages[2]?.hasNextPage).toBe(true);
  });
});
