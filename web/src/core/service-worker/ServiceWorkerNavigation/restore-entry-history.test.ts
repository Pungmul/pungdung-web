import { describe, expect, it } from "vitest";

import { readServiceWorkerEntry } from "./restore-entry-history";
import { SERVICE_WORKER_ENTRY_PARAM } from "../navigation-contract";

describe("알림 콜드 스타트 진입 표시", () => {
  it.each(["invalid", "[]", '["//evil.test"]', '["/home","/home"]', '["/board/d/30"]']) (
    "잘못된 진입 표시 %s는 무시한다", (parents) => {
      const url = new URL("https://app.test/board/d/30");
      url.searchParams.set(SERVICE_WORKER_ENTRY_PARAM, parents);
      expect(readServiceWorkerEntry(url)).toBeNull();
    }
  );
});
