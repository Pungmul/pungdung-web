import type { PropsWithChildren, ReactElement } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import * as chatApi from "../../api";
import { chatQueries } from "../../queries";
import type { ChatRoomListItem } from "../../types";

import { ChatSettingsButton } from "./ChatSettingsButton";

vi.mock("../../hooks/actions", () => ({
  useChatNotificationSettingAction: () => ({
    updateRoomNotification: vi.fn(),
    isUpdatingRoomNotification: false,
  }),
}));

function createRoom(overrides: Partial<ChatRoomListItem> = {}): ChatRoomListItem {
  return {
    chatRoomUUID: "room-1",
    isMuted: false,
    lastMessageTime: null,
    lastMessageContent: null,
    unreadCount: null,
    senderId: null,
    senderName: null,
    receiverId: null,
    receiverName: null,
    chatRoomMemberIds: [],
    chatRoomMemberNames: [],
    roomName: "room",
    profileImageUrl: null,
    group: false,
    ...overrides,
  };
}

function renderWithClient(ui: ReactElement, queryClient: QueryClient) {
  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return render(ui, { wrapper });
}

describe("ChatSettingsButton", () => {
  it("roomList 캐시에 방이 있으면 mute 아이콘 상태를 roomList에서 파생한다", () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    queryClient.setQueryData(chatQueries.roomList().queryKey, [
      createRoom({ chatRoomUUID: "room-1", isMuted: true }),
    ]);

    renderWithClient(<ChatSettingsButton roomId="room-1" />, queryClient);

    expect(screen.getByRole("button", { name: "채팅방 알림 켜기" })).toBeInTheDocument();
  });

  it("roomList 캐시에 방이 없으면 roomNotification fallback 쿼리 결과로 아이콘 상태를 정한다", async () => {
    vi.spyOn(chatApi, "loadChatRoomNotificationState").mockResolvedValue({ isMuted: true, globalEnabled: true });

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    queryClient.setQueryData(chatQueries.roomList().queryKey, [createRoom({ chatRoomUUID: "room-x" })]);

    renderWithClient(<ChatSettingsButton roomId="room-2" />, queryClient);

    expect(
      await screen.findByRole("button", { name: "채팅방 알림 켜기" })
    ).toBeInTheDocument();
    expect(chatApi.loadChatRoomNotificationState).toHaveBeenCalledWith("room-2");
  });
});
