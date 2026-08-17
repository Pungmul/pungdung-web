import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { wrapLightningBuildStep } from "./lightning-build-test-harness";
import { SelectLocationStep } from "./SelectLocationStep";

vi.mock("@/shared/components/ui", async (importOriginal) => {
  const actual = await importOriginal<
    typeof import("@/shared/components/ui")
  >();
  return {
    ...actual,
    LocationMapPicker: () => <div>지도</div>,
  };
});

describe("LGT-049 | 번개 생성 장소 - 장소 미선택", () => {
  afterEach(() => {
    cleanup();
  });

  it("장소를 고르지 않고 다음을 누름", async () => {
    // 1. 장소 선택 단계 진입
    // 2. 지도에서 장소를 고르지 않음
    // 3. [다음] 선택
    // Kakao Places SDK는 경계 mock
    const user = userEvent.setup({ delay: null });
    render(wrapLightningBuildStep(<SelectLocationStep />));

    await user.click(screen.getByRole("button", { name: "다음" }));

    expect(await screen.findByText("주소를 선택해주세요")).toBeVisible();
    expect(screen.getByRole("button", { name: "다음" })).toBeDisabled();
  });
});
