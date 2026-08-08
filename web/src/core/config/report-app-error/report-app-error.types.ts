// api: 브라우저 HTTP 훅 (clientApiRequest)
// route: App Router route.ts
// section: feature section 로컬 경계
// rsc: 서버 컴포넌트 fetch
export type ReportAppErrorBoundary =
  | "api"
  | "route"
  | "section"
  | "segment"
  | "global"
  | "rsc";

export type ReportAppErrorContext = {
  boundary: ReportAppErrorBoundary;
  feature?: string;
  component?: string;
  endpoint?: string;
  method?: string;
};

export type AppErrorKind = "contract" | "mapper" | "http" | "unknown";

export type CriticalFlow = "signup" | "promotion_publish";

export type ZodIssueSummary = {
  path: string;
  code: string;
};

export type ClassifiedAppError =
  | { action: "drop" }
  | {
      action: "report";
      errorKind: AppErrorKind;
      criticalFlow?: CriticalFlow;
      extras: Record<string, unknown>;
    };

export type ReportedAppError = Extract<
  ClassifiedAppError,
  { action: "report" }
>;

export const SOCKET_CONTRACT_ERROR_NAME = "SocketContractError";
export const SOCKET_BROKER_ERROR_NAME = "SocketBrokerError";

export type SocketContractError = Error & {
  zodIssues?: ZodIssueSummary[];
};

export type SocketBrokerError = Error & {
  brokerReason?: string;
};
