import { ClientApiError } from "@/core/api/client/client-api-error";
import { reportAppError } from "@/core/config/report-app-error";

// Route Handler는 envelope JSON을 유지
// throw 하지 않고 여기서만 리포트
export function reportRouteAppError(params: {
  status: number;
  code: string;
  message: string;
}): void {
  reportAppError(
    new ClientApiError({
      status: params.status,
      code: params.code,
      message: params.message,
    }),
    { boundary: "route" }
  );
}
