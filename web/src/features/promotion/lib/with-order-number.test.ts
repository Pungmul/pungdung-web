import { describe, expect, it } from "vitest";

import { withOrderNos } from "./with-order-number";
import type { PromotionDraftQuestion } from "../types";

describe("withOrderNos", () => {
  it("reassigns orderNo from 1 by array order", () => {
    const rows: PromotionDraftQuestion[] = [
      {
        clientTempId: "a",
        questionType: "TEXT",
        label: "1",
        required: false,
        orderNo: 99,
        settingsJson: "{}",
        options: [],
      },
      {
        clientTempId: "b",
        questionType: "TEXT",
        label: "2",
        required: false,
        orderNo: 1,
        settingsJson: "{}",
        options: [],
      },
    ];
    const out = withOrderNos(rows);
    expect(out[0]?.orderNo).toBe(1);
    expect(out[1]?.orderNo).toBe(2);
  });
});
