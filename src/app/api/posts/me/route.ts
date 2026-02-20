import type { NextRequest } from "next/server";

import {
  createValidatedUpstreamResponse,
  fetchWithRefresh,
  proxyFailureError,
} from "@/core/api/server";

export const dynamic = "force-dynamic";

function resolveRequestedPage(params: URLSearchParams): number {
  const raw = params.get("page");
  const n = raw !== null ? Number(raw) : NaN;
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

function resolveRequestedSize(params: URLSearchParams): number {
  const raw = params.get("size");
  const n = raw !== null ? Number(raw) : NaN;
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 10;
}

export async function GET(request: NextRequest) {
  try {
    const page = resolveRequestedPage(request.nextUrl.searchParams);
    const size = resolveRequestedSize(request.nextUrl.searchParams);
    const proxyUrl = `${process.env.BASE_URL}/api/posts/user?page=${page}&size=${size}`;

    const proxyResponse = await fetchWithRefresh(proxyUrl);

    return createValidatedUpstreamResponse(proxyResponse, {
      transformEnvelopeResponse: (inner) => {
        if (
          inner !== null &&
          typeof inner === "object" &&
          "userPosts" in inner &&
          (inner as { userPosts: unknown }).userPosts !== undefined
        ) {
          return (inner as { userPosts: unknown }).userPosts;
        }
        return inner;
      },
    });
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}
