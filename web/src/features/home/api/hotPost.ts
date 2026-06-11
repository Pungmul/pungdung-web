import type { PostSummary } from "@/features/post";

export async function loadHotPostList(): Promise<PostSummary[]> {
  try {
    const proxyUrl = `/api/boards/hot-post?page=1&size=10`;

    const proxyResponse = await fetch(proxyUrl, {
      credentials: "include",
      cache: "no-cache",
    });

    if (!proxyResponse.ok) throw Error("서버 불안정" + proxyResponse.status);

    const data = await proxyResponse.json();
    const { list: hotPosts } = data;

    return hotPosts;
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    if (error instanceof Error) throw Error(error.message);
    else throw Error("알수 없는 에러");
  }
} 