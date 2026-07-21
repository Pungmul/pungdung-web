import { resolveClientApiBody } from "@/core/api/client/resolve-client-api-body";

import { getGuestRoutePolicy, type GuestRoutePolicy } from "./route-policy";

import {
  boardDataDtoSchema,
  briefBoardInfoListDtoSchema,
} from "@/features/board/api/client";
import { postDetailResponseDtoSchema } from "@/features/post/api/client";

const boardRoutePattern = /^\/board\/(\d+)\/?$/;
const postDetailRoutePattern = /^\/board\/d\/(\d+)\/?$/;

function getApiUrl(path: string): string | null {
  const baseUrl = process.env.BASE_URL;
  return baseUrl ? new URL(path, baseUrl).toString() : null;
}

async function fetchApiResponse<T>(
  path: string,
  responseSchema: Parameters<typeof resolveClientApiBody<T>>[3]
): Promise<T | null> {
  const url = getApiUrl(path);
  if (!url) return null;

  try {
    const response = await fetch(url, { cache: "no-store" });
    const raw = await response.json().catch(() => null);
    return resolveClientApiBody(raw, response.ok, response.status, responseSchema);
  } catch {
    return null;
  }
}

/** API의 공개 여부를 확인할 수 없으면 게스트 접근을 허용하지 않는다. */
async function isPublicBoard(boardId: number): Promise<boolean> {
  const boardList = await fetchApiResponse(
    "/api/boards",
    briefBoardInfoListDtoSchema
  );
  return boardList?.some(
    (board) => String(board.id) === String(boardId) && board.isPublic
  ) ?? false;
}

async function isPublicPostBoard(postId: number): Promise<boolean> {
  const post = await fetchApiResponse(
    `/api/posts/${postId}`,
    postDetailResponseDtoSchema
  );
  if (post?.categoryId === null || post?.categoryId === undefined) return false;

  const boardData = await fetchApiResponse(
    `/api/boards/${post.categoryId}`,
    boardDataDtoSchema
  );
  return boardData?.boardInfo.isPublic ?? false;
}

export async function resolveGuestRoutePolicy(
  pathname: string,
  search: string = ""
): Promise<GuestRoutePolicy> {
  const boardMatch = boardRoutePattern.exec(pathname);
  if (boardMatch) {
    return (await isPublicBoard(Number(boardMatch[1])))
      ? "public"
      : "member-only";
  }

  const postMatch = postDetailRoutePattern.exec(pathname);
  if (postMatch) {
    return (await isPublicPostBoard(Number(postMatch[1])))
      ? "public"
      : "member-only";
  }

  return getGuestRoutePolicy(pathname, search);
}
