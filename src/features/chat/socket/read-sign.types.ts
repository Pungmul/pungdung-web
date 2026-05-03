export type ReadSignOptions = {
  /** 방금 수신·확인한 메시지 ID. 서버 read가 한 박자 늦을 때 보정에 사용 */
  upToMessageId?: number | string | null;
};

export type ReadSignFn = (options?: ReadSignOptions) => void;
