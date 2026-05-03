/** 진입 스냅샷에 쓸 room info가 서버 fetch까지 끝났는지 판별한다. */
export function isRoomInfoReadyForEntrySnapshot(params: {
  isSuccess: boolean;
  isFetching: boolean;
}): boolean {
  return params.isSuccess && !params.isFetching;
}
