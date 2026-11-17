import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { boardQueries } from "../../queries";
import { useRefreshBoardPosts } from "./useRefreshBoardPosts";

const mocks = vi.hoisted(() => ({ fetchPostList: vi.fn() }));
vi.mock("../../api/client/fetch-post-list.api", () => ({ fetchPostList: mocks.fetchPostList }));

type Page = Awaited<ReturnType<typeof import("../../api/client/fetch-post-list.api").fetchPostList>>;
const post = (postId: number) => ({ postId, title: `가상 글 ${postId}`, content: "가상 내용", author: "가상 작성자", thumbnail: null, imageNum: 0, viewCount: 0, likedNum: 0, commentNum: 0, timeSincePosted: 0, timeSincePostedText: "방금" });
const createPage = (ids: number[], pageNum: number, total = 80): Page => ({ total, list: ids.map(post), pageNum, pageSize: 10, isFirstPage: pageNum === 1, isLastPage: pageNum * 10 >= total, hasPreviousPage: pageNum > 1, hasNextPage: pageNum * 10 < total, hotPost: null });
const key = boardQueries.postList(10).queryKey;

function setup(oldIds: number[]) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  client.setQueryData(key, { pages: [createPage(oldIds, 1)], pageParams: [1] });
  const wrapper = ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  return { client, ...renderHook(() => useRefreshBoardPosts(10), { wrapper }) };
}

beforeEach(() => { mocks.fetchPostList.mockReset(); });

describe("게시판 당겨서 새로고침", () => {
  it("새 글을 연결하면서 다음 페이지 경계를 채운다", async () => {
    const old = Array.from({ length: 10 }, (_, i) => 50 - i);
    const all = [53, 52, 51, ...old, 40, 39, 38, 37, 36, 35, 34];
    mocks.fetchPostList.mockImplementation(async (_boardId: number, pageNum: number) => createPage(all.slice((pageNum - 1) * 10, pageNum * 10), pageNum, 20));
    const { client, result } = setup(old);
    await act(() => result.current.refresh());
    const data = client.getQueryData<{ pages: Page[]; pageParams: number[] }>(key)!;
    expect(data.pages.flatMap((page) => page.list.map((item) => item.postId))).toEqual(all);
    expect(data.pageParams).toEqual([1, 2]);
  });

  it("기존 글보다 새 글이 30개를 넘으면 이전 목록을 버린다", async () => {
    const all = [...Array.from({ length: 31 }, (_, i) => 100 - i), 50, 49];
    mocks.fetchPostList.mockImplementation(async (_boardId: number, pageNum: number) => createPage(all.slice((pageNum - 1) * 10, pageNum * 10), pageNum, 35));
    const { client, result } = setup([50, 49]);
    await act(() => result.current.refresh());
    const data = client.getQueryData<{ pages: Page[] }>(key)!;
    expect(data.pages).toHaveLength(1);
    expect(data.pages[0]?.list.map((item) => item.postId)).toEqual(all.slice(0, 10));
  });

  it("요청이 실패하면 기존 목록을 유지한다", async () => {
    mocks.fetchPostList.mockRejectedValue(new Error("연결 실패"));
    const { client, result } = setup([50, 49]);
    await act(() => result.current.refresh());
    expect(client.getQueryData<{ pages: Page[] }>(key)?.pages[0]?.list.map((item) => item.postId)).toEqual([50, 49]);
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it("새로고침 중 세션 캐시가 지워지면 이전 목록을 다시 저장하지 않는다", async () => {
    let resolvePage: (page: Page) => void = () => {};
    mocks.fetchPostList.mockReturnValue(new Promise<Page>((resolve) => { resolvePage = resolve; }));
    const { client, result } = setup([50, 49]);
    let pending: Promise<void> = Promise.resolve();
    await act(async () => {
      pending = result.current.refresh();
      await Promise.resolve();
    });
    client.clear();
    await act(async () => {
      resolvePage(createPage([50, 49], 1, 2));
      await pending;
    });
    expect(client.getQueryData(key)).toBeUndefined();
  });
});
