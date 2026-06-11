import type { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import * as chatApi from "../../../api";
import { chatQueries } from "../../../queries";
import type { ChatRoomListItem } from "../../../types/chat-room.types";

import { useChatNotification } from "./useChatNotification";

const room = (unread: number | null): ChatRoomListItem => ({
  chatRoomUUID: "r1",
  isMuted: false,
  lastMessageTime: null,
  lastMessageContent: null,
  unreadCount: unread,
  senderId: null,
  senderName: null,
  receiverId: null,
  receiverName: null,
  chatRoomMemberIds: [],
  chatRoomMemberNames: [],
  roomName: "n",
  profileImageUrl: null,
  group: false,
});

describe("useChatNotification", () => {
  beforeEach(() => {
    vi.spyOn(chatApi, "loadChatRoomList").mockResolvedValue([]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const clientWithRoomListCache = (rooms: ChatRoomListItem[]) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false, refetchOnMount: false, refetchOnWindowFocus: false },
      },
    });
    const listKey = chatQueries.roomList().queryKey;
    queryClient.setQueryDefaults(listKey, {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    });
    queryClient.setQueryData(listKey, rooms);
    return queryClient;
  };

  it("방 목록 unread 합산과 배지 텍스트를 계산한다", async () => {
    const queryClient = clientWithRoomListCache([
      room(3),
      room(null),
      room(50),
    ]);

    const wrapper = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useChatNotification(), { wrapper });

    await waitFor(() => {
      expect(result.current.totalUnreadCount).toBe(53);
      expect(result.current.hasUnreadMessages).toBe(true);
      expect(result.current.shouldShowBadge).toBe(true);
      expect(result.current.badgeText).toBe("53");
    });
  });

  it("합계가 100 초과면 badgeText는 99+", async () => {
    const queryClient = clientWithRoomListCache([room(100), room(5)]);

    const wrapper = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useChatNotification(), { wrapper });

    await waitFor(() => {
      expect(result.current.badgeText).toBe("99+");
    });
  });

  it("데이터가 없으면 배지를 숨긴다", async () => {
    const queryClient = clientWithRoomListCache([]);

    const wrapper = ({ children }: PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useChatNotification(), { wrapper });

    await waitFor(() => {
      expect(result.current.totalUnreadCount).toBe(0);
      expect(result.current.shouldShowBadge).toBe(false);
    });
  });
});
