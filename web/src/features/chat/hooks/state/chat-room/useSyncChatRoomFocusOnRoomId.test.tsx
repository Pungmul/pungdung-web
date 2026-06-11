import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { afterEach, describe, expect, it } from "vitest";

import { useSyncChatRoomFocusOnRoomId } from "./useSyncChatRoomFocusOnRoomId";
import { chatQueries } from "../../../queries";
import { useChatRoomStore } from "../../../store/chat-room.store";
import type { ChatRoomListItem } from "../../../types";

const createRoom = (
  overrides: Partial<ChatRoomListItem> = {},
): ChatRoomListItem => ({
  chatRoomUUID: "room-1",
  isMuted: false,
  lastMessageTime: null,
  lastMessageContent: null,
  unreadCount: 3,
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
});

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: PropsWithChildren) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useSyncChatRoomFocusOnRoomId", () => {
  afterEach(() => {
    useChatRoomStore.getState().setFocusingRoomId(null);
  });

  it("roomId를 focusingRoomId에 반영하고 해당 방 unreadCount를 초기화한다", () => {
    const queryClient = new QueryClient();
    const roomListKey = chatQueries.roomList().queryKey;

    queryClient.setQueryData(roomListKey, [
      createRoom({ chatRoomUUID: "room-1", unreadCount: 3 }),
      createRoom({ chatRoomUUID: "room-2", unreadCount: 5 }),
    ]);

    renderHook(() => useSyncChatRoomFocusOnRoomId("room-1"), {
      wrapper: createWrapper(queryClient),
    });

    const roomList = queryClient.getQueryData<ChatRoomListItem[]>(roomListKey);

    expect(useChatRoomStore.getState().focusingRoomId).toBe("room-1");
    expect(
      roomList?.find((room) => room.chatRoomUUID === "room-1")?.unreadCount,
    ).toBe(0);
    expect(
      roomList?.find((room) => room.chatRoomUUID === "room-2")?.unreadCount,
    ).toBe(5);
  });

  it("채팅방 화면에서 벗어나면 focusingRoomId를 비운다", () => {
    const queryClient = new QueryClient();

    const { unmount } = renderHook(
      () => useSyncChatRoomFocusOnRoomId("room-1"),
      { wrapper: createWrapper(queryClient) },
    );

    expect(useChatRoomStore.getState().focusingRoomId).toBe("room-1");

    unmount();

    expect(useChatRoomStore.getState().focusingRoomId).toBeNull();
  });

  it("cleanup이 늦게 실행되어도 이미 다른 방으로 바뀐 focus는 지우지 않는다", () => {
    const queryClient = new QueryClient();

    const { unmount } = renderHook(
      () => useSyncChatRoomFocusOnRoomId("room-1"),
      { wrapper: createWrapper(queryClient) },
    );

    useChatRoomStore.getState().setFocusingRoomId("room-2");
    unmount();

    expect(useChatRoomStore.getState().focusingRoomId).toBe("room-2");
  });
});
