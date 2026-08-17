import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ViewStoreProvider } from "@/shared/lib/view/view-store-provider";

import { ChatSendForm } from "./ChatSendForm";

describe("CHAT-010 | 채팅 - 빈 메시지 전송 차단", () => {
  afterEach(() => {
    cleanup();
  });

  it("메시지를 비운 채 보내기를 누름", async () => {
    // 1. 채팅방 입력창 진입
    // 2. 메시지를 비움
    // 3. [보내기] 클릭
    // 제품은 빈 메시지 validation 문구가 없다. 전송만 막는다
    const onSendMessage = vi.fn();
    render(
      <ViewStoreProvider initialView="mobile">
        <ChatSendForm
          onSendMessage={onSendMessage}
          onSendImage={vi.fn()}
        />
      </ViewStoreProvider>
    );

    const user = userEvent.setup({ delay: null });
    await user.click(screen.getByRole("button", { name: "보내기" }));

    expect(onSendMessage).not.toHaveBeenCalled();
    expect(screen.getByLabelText("메시지")).toHaveValue("");
  });

  it("공백만 입력하고 보내기를 누름", async () => {
    const user = userEvent.setup({ delay: null });
    const onSendMessage = vi.fn();
    render(
      <ViewStoreProvider initialView="mobile">
        <ChatSendForm
          onSendMessage={onSendMessage}
          onSendImage={vi.fn()}
        />
      </ViewStoreProvider>
    );

    await user.type(screen.getByLabelText("메시지"), "   ");
    await user.click(screen.getByRole("button", { name: "보내기" }));

    expect(onSendMessage).not.toHaveBeenCalled();
    expect(screen.getByLabelText("메시지")).toHaveValue("   ");
  });
});
