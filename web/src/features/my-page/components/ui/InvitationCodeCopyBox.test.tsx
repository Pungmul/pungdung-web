import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Toast } from "@/shared";

import { InvitationCodeCopyBox } from "./InvitationCodeCopyBox";

describe("InvitationCodeCopyBox", () => {
  const writeText = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(Toast, "show").mockImplementation(() => {});
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("초대코드를 클릭하면 클립보드에 복사하고 성공 토스트를 띄운다", async () => {
    writeText.mockResolvedValue(undefined);

    render(<InvitationCodeCopyBox code="123456" />);

    await userEvent.click(screen.getByRole("button", { name: "초대코드 123456 복사" }));

    expect(writeText).toHaveBeenCalledWith("123456");
    expect(Toast.show).toHaveBeenCalledWith({
      message: "초대코드가 복사되었습니다.",
    });
  });

  it("클립보드 복사 실패 시 에러 토스트를 띄운다", async () => {
    writeText.mockRejectedValue(new Error("clipboard failed"));

    render(<InvitationCodeCopyBox code="123456" />);

    await userEvent.click(screen.getByRole("button", { name: "초대코드 123456 복사" }));

    expect(Toast.show).toHaveBeenCalledWith({
      message: "초대코드 복사에 실패했습니다.",
      type: "error",
    });
  });
});
