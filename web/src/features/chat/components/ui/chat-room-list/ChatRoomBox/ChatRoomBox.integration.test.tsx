import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ChatRoomBox } from "./index";
import type { ChatRoomListItem } from "../../../../types";

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
    type: "NORMAL",
    relatedId: null,
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
    expect(screen.getByText("0").parentElement).toHaveClass(
      "shrink-0",
      "opacity-0"
    );
    expect(
      screen.getByRole("img", { name: "로컬 방의 프로필 이미지" })
    ).toHaveAttribute("src", "https://example.com/avatar.png");
  });

  it("NORMAL 그룹 방은 태그 없이 인원 수만 보여 준다", () => {
    renderRoom(
      room({
        group: true,
        type: "NORMAL",
        chatRoomMemberIds: [1, 2, 3],
      })
    );

    expect(screen.queryByText("번개")).toBeNull();
    expect(screen.queryByText("공연")).toBeNull();
    expect(screen.getByText("3")).toBeVisible();
  });

  it("1:1 NORMAL 방은 태그와 인원 수를 숨긴다", () => {
    renderRoom(room({ group: false, type: "NORMAL" }));

    expect(screen.queryByText("번개")).toBeNull();
    expect(screen.queryByText("2")).toBeNull();
  });

  it("번개 방은 태그와 인원 수를 보여 준다", () => {
    renderRoom(
      room({
        type: "LIGHTNING",
        relatedId: 12,
        group: true,
        chatRoomMemberIds: Array.from({ length: 12 }, (_, index) => index + 1),
      })
    );

    const tag = screen.getByText("번개");
    expect(tag.parentElement).toHaveClass(
      "shrink-0",
      "bg-grey-100",
      "px-1",
      "py-0.5"
    );
    expect(tag).toHaveClass("text-[12px]", "text-grey-400");
    expect(screen.getByText("12")).toHaveClass(
      "shrink-0",
      "text-[12px]",
      "text-grey-500"
    );
  });

  it("공연 방은 태그와 인원 수를 보여 준다", () => {
    renderRoom(
      room({
        type: "PERFORMANCE",
        relatedId: "pk-8",
        group: true,
        roomName: "방 이름",
        chatRoomMemberIds: Array.from({ length: 8 }, (_, index) => index + 1),
      })
    );

    expect(screen.getByText("공연")).toBeVisible();
    expect(screen.getByText("8")).toBeVisible();
    expect(screen.getByText("방 이름")).toHaveClass("min-w-0", "truncate");
  });
});

function renderRoom(value: ChatRoomListItem) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <ChatRoomBox room={value} />
    </QueryClientProvider>
  );
}
