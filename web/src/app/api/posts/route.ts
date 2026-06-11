import { revalidateTag } from "next/cache";

import {
  createValidatedUpstreamResponse,
  fetchWithRefresh,
  proxyFailureError,
} from "@/core/api/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const boardId = searchParams.get("boardId");

    const formData = await req.formData();

    const proxyUrl = `${process.env.BASE_URL}/api/posts?categoryId=${boardId}`;

    const proxyResponse = await fetchWithRefresh(proxyUrl, {
      method: "POST",
      body: formData,
    });

    if (proxyResponse.ok && boardId) {
      revalidateTag("board");
      revalidateTag(`${boardId}`);
    }

    return createValidatedUpstreamResponse(proxyResponse);
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}

export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return Response.json(
        {
          code: "INVALID_REQUEST",
          message: "postId가 없습니다.",
          response: null,
          isSuccess: false,
        },
        { status: 400 }
      );
    }
    const postIdNumber = parseInt(postId, 10);
    if (Number.isNaN(postIdNumber)) {
      return Response.json(
        {
          code: "INVALID_REQUEST",
          message: "postId는 숫자여야 합니다.",
          response: null,
          isSuccess: false,
        },
        { status: 400 }
      );
    }
    const proxyUrl = `${process.env.BASE_URL}/api/posts/${postIdNumber}`;

    const formData = await req.formData();

    const proxyResponse = await fetchWithRefresh(proxyUrl, {
      method: "PATCH",
      body: formData,
    });

    return createValidatedUpstreamResponse(proxyResponse);
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}
