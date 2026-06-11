/**
 * 친구 섹션 우측 보조 문구 분기를 순수 로직으로 분리해 중첩 삼항을 제거한다.
 */
type MyPageFriendsTrailingContentState =
  | { kind: "skeleton" }
  | { kind: "error" }
  | { kind: "pending-request"; pendingReceivedCount: number }
  | { kind: "none" };

type GetMyPageFriendsTrailingContentStateInput = {
  showSkeleton: boolean;
  isError: boolean;
  pendingReceivedCount: number;
};

export function getMyPageFriendsTrailingContentState({
  showSkeleton,
  isError,
  pendingReceivedCount,
}: GetMyPageFriendsTrailingContentStateInput): MyPageFriendsTrailingContentState {
  if (showSkeleton) {
    return { kind: "skeleton" };
  }

  if (isError) {
    return { kind: "error" };
  }

  if (pendingReceivedCount > 0) {
    return { kind: "pending-request", pendingReceivedCount };
  }

  return { kind: "none" };
}
