import {
  createValidatedUpstreamResponse,
  fetchWithRefresh,
  proxyFailureError,
} from "@/core/api/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;
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
    const proxyResponse = await fetchWithRefresh(proxyUrl);
    return createValidatedUpstreamResponse(proxyResponse);
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

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;

    const proxyUrl = `${process.env.BASE_URL}/api/posts/${postId}`;

    const proxyResponse = await fetchWithRefresh(proxyUrl, {
      method: "DELETE",
    });

    return createValidatedUpstreamResponse(proxyResponse);
  } catch (error) {
    console.error(error);
    return proxyFailureError(error);
  }
}
