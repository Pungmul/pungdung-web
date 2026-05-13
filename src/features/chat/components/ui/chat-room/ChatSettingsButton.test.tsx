import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ChatSettingsButton } from "./ChatSettingsButton";

describe("ChatSettingsButton", () => {
  it("설정 진입 버튼만 렌더링하고 클릭 핸들러를 호출한다", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<ChatSettingsButton onClick={onClick} />);

    await user.click(screen.getByRole("button", { name: "채팅방 설정 열기" }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByRole("button", { name: /채팅방 알림/ })
    ).not.toBeInTheDocument();
  });
});
