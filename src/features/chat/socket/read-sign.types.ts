export type ReadSignOptions = {
  /** 방금 수신·확인한 메시지 ID. 서버 read가 한 박자 늦을 때 보정에 사용 */
  upToMessageId?: number | string | null;
  /** dev: readSign 호출 경로 (`NEXT_PUBLIC_CHAT_READ_SIGN_DEBUG` 또는 non-prod) */
  source?: string;
};

export type ReadSignFn = (options?: ReadSignOptions) => void;
