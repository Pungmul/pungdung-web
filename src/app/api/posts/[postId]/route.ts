import { fetchWithRefresh, proxyFailureError } from "@/core/api/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
    if (!postId) {
      return new Response("postId가 없습니다.", { status: 400 });
    }
    const postIdNumber = parseInt(postId);
    if (isNaN(postIdNumber)) {
      return new Response("postId는 숫자여야 합니다.", { status: 400 });
    }
    const proxyUrl = `${process.env.BASE_URL}/api/posts/${postIdNumber}`;

    if (!proxyUrl) {
      return new Response("프록시 URL이 없습니다.", { status: 500 });
    }

    const proxyResponse = await fetchWithRefresh(proxyUrl);

    if (!proxyResponse.ok) throw Error("서버 불안정" + proxyResponse.status);

    const { response } = await proxyResponse.json();

    return Response.json({ response }, { status: 200 });
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;

    if (!postId) {
      return new Response("postId가 없습니다.", { status: 400 });
    }
    const postIdNumber = parseInt(postId);
    if (isNaN(postIdNumber)) {
      return new Response("postId는 숫자여야 합니다.", { status: 400 });
    }
    const proxyUrl = `${process.env.BASE_URL}/api/posts/${postIdNumber}`;

    const formData = await req.formData();

    if (!proxyUrl) {
      return new Response("프록시 URL이 없습니다.", { status: 500 });
    }

    const proxyResponse = await fetchWithRefresh(proxyUrl, {
      method: "PATCH",
      body: formData,
    });

    if (!proxyResponse.ok) throw Error("서버 불안정" + proxyResponse.status);

    const { response } = await proxyResponse.json();
    return Response.json({ response }, { status: 200 });
  } catch (error) {
    console.error("프록시 처리 중 에러:", error);
    return proxyFailureError(error);
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;

    const proxyUrl = `${process.env.BASE_URL}/api/posts/${postId}`;

    const response = await fetchWithRefresh(proxyUrl, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(errorText);
      throw Error("서버 불안정" + response.status + errorText);
    }

    return Response.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return proxyFailureError(error);
  }
}
