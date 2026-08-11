import { reportAppError } from "@/core/config/report-app-error";

import { prefetchBoardInfoList } from "./prefetch-board-info-list.api";
import { getBoardRscLoadErrorKind } from "../../lib/get-board-rsc-load-error-kind";
import type { BoardSummary, RscLoadResult } from "../../types";

const BOARD_RSC_REPORT_CONTEXT = {
  boundary: "rsc",
  feature: "board",
  endpoint: "/api/boards",
  method: "GET",
} as const;

export async function loadBoardInfoListResult(): Promise<
  RscLoadResult<BoardSummary[]>
> {
  try {
    const data = await prefetchBoardInfoList();
    return { ok: true, data };
  } catch (error) {
    reportAppError(error, BOARD_RSC_REPORT_CONTEXT);
    return {
      ok: false,
      errorKind: getBoardRscLoadErrorKind(error),
    };
  }
}
