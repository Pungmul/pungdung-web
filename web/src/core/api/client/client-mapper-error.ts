export class ClientMapperError extends Error {
  readonly name = "ClientMapperError";

  /** 어떤 API/응답을 매핑하다가 실패했는지 (디버그·로깅용) */
  readonly context: string;

  /** 원래 던져진 값(매퍼 내부 오류 등) */
  readonly failureCause?: unknown;

  constructor(params: { message: string; context: string; cause?: unknown }) {
    super(params.message);
    this.context = params.context;
    this.failureCause = params.cause;
  }
}

export function isClientMapperError(
  value: unknown
): value is ClientMapperError {
  return value instanceof ClientMapperError;
}
