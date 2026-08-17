import { okEnvelope } from "../envelope";

export const E2E_BOARD_ID = 1;
export const E2E_POST_ID = 501;
export const E2E_CREATED_POST_ID = 777;
export const E2E_POST_TITLE = "E2E 게시글 제목";
export const E2E_POST_CONTENT = "E2E 게시글 본문입니다.";
export const E2E_SEARCH_KEYWORD = "E2E";

export const e2ePostSummary = {
  postId: E2E_POST_ID,
  title: E2E_POST_TITLE,
  content: E2E_POST_CONTENT,
  thumbnail: null,
  imageNum: 0,
  viewCount: 3,
  likedNum: 1,
  commentNum: 0,
  timeSincePosted: 12,
  timeSincePostedText: "12분 전",
  createdAt: "2027-12-01T00:00:00.000Z",
  author: "익명",
  categoryName: "자유게시판",
};

function postListPage(list: Array<typeof e2ePostSummary>) {
  return {
    total: list.length,
    list,
    pageNum: 1,
    pageSize: 10,
    isFirstPage: true,
    isLastPage: true,
    hasPreviousPage: false,
    hasNextPage: false,
  };
}

export const e2eBoardInfo = {
  rootCategoryId: E2E_BOARD_ID,
  rootCategoryName: "자유게시판",
  childCategoryName: null,
  isPublic: true,
  childCategories: [] as Array<{
    id: number;
    parentId: number | null;
    name: string;
    description: string | null;
  }>,
};

export function boardDataResponse(
  list: Array<typeof e2ePostSummary> = [e2ePostSummary]
) {
  return okEnvelope({
    currentCategoryId: E2E_BOARD_ID,
    boardInfo: e2eBoardInfo,
    hotPost: {
      postId: E2E_POST_ID,
      title: E2E_POST_TITLE,
    },
    recentPostList: postListPage(list),
  });
}

export const hotPostListResponse = okEnvelope({
  total: 1,
  list: [e2ePostSummary],
  pageNum: 1,
  pageSize: 10,
});

export const searchPostListResponse = okEnvelope(postListPage([e2ePostSummary]));

export const emptySearchPostListResponse = okEnvelope(postListPage([]));

export const postDetailResponse = okEnvelope({
  postId: E2E_POST_ID,
  title: E2E_POST_TITLE,
  content: E2E_POST_CONTENT,
  thumbnail: null,
  imageNum: 0,
  viewCount: 3,
  likedNum: 1,
  commentNum: 0,
  timeSincePosted: 12,
  timeSincePostedText: "12분 전",
  author: "익명",
  authorUsername: null,
  imageList: [],
  isLiked: false,
  isWriter: true,
  categoryId: E2E_BOARD_ID,
});

export function createdPostDetailResponse(title: string, content: string) {
  return okEnvelope({
    ...postDetailResponse.response,
    postId: E2E_CREATED_POST_ID,
    title,
    content,
  });
}

export const createPostResponse = okEnvelope({
  postId: E2E_CREATED_POST_ID,
});

export const emptyCommentListResponse = okEnvelope([]);
