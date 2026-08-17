import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ChatRoomBox } from "./ChatRoomBox";
import type { ChatRoomListItem } from "../../../types";

vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt?: string; src?: string }) => (
    <img alt={alt ?? ""} src={typeof src === "string" ? src : ""} />
  ),
}));

function room(overrides: Partial<ChatRoomListItem> = {}): ChatRoomListItem {
  return {
    chatRoomUUID: "room-1",
    isMuted: false,
    lastMessageTime: "2026-09-14T00:00:00.000Z",
    lastMessageContent: "안녕",
    unreadCount: 0,
    senderId: 1,
    senderName: "나",
    receiverId: 2,
    receiverName: "상대",
    chatRoomMemberIds: [1, 2],
    chatRoomMemberNames: ["나", "상대"],
    roomName: "로컬 방",
    profileImageUrl: "https://example.com/avatar.png",
    group: false,
    ...overrides,
  };
}

describe("CHAT-055 | 채팅방 목록 - 로컬 이름/프로필 반영", () => {
  afterEach(() => {
    cleanup();
  });

  it("변경한 로컬 이름과 프로필 이미지가 목록에 표시됨", () => {
    // 2. 채팅방 목록에서 대상 방 확인
    // 4. 채팅방 헤더의 로컬 정보도 목록과 일치함
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    render(
      <QueryClientProvider client={queryClient}>
        <ChatRoomBox room={room()} />
      </QueryClientProvider>
    );

    expect(screen.getByText("로컬 방")).toBeVisible();
    expect(
      screen.getByRole("img", { name: "로컬 방의 프로필 이미지" })
    ).toHaveAttribute("src", "https://example.com/avatar.png");
  });
});
