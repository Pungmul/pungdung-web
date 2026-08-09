export type BoardRscLoadErrorKind = "contract" | "http" | "unknown";

export type RscLoadResult<T> =
  | { ok: true; data: T }
  | { ok: false; errorKind: BoardRscLoadErrorKind };
