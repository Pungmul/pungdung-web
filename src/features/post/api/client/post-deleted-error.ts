/** 게시글 상세 API가 200 + 삭제 껍데기로 응답할 때 던진다. */
export class PostDeletedError extends Error {
  override readonly name = "PostDeletedError";

  constructor(readonly postId: number) {
    super("삭제되었거나 볼 수 없는 게시글입니다.");
  }
}

export function isPostDeletedError(e: unknown): e is PostDeletedError {
  return e instanceof PostDeletedError;
}
