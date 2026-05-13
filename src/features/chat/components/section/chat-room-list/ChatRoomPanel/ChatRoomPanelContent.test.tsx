import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ChatRoomListItem } from "../../../../types";

import ChatRoomPanelContent from "./ChatRoomPanelContent";

const chatRoomListIndexedDBMock = vi.hoisted(() => ({
  useChatRoomListIndexedDB: vi.fn(),
}));

vi.mock("../../../../hooks/state", () => ({
  useChatRoomListIndexedDB: chatRoomListIndexedDBMock.useChatRoomListIndexedDB,
}));

vi.mock("../../../../store/select-friend-modal.context", () => ({
  useSelectFriendModal: () => ({
    openModalToSelectFriend: vi.fn(),
  }),
}));

vi.mock("./ChatRoomPanelList", () => ({
  default: ({ rooms }: { rooms: ChatRoomListItem[] }) => (
    <ul>
      {rooms.map((room) => (
        <li key={room.chatRoomUUID}>{room.roomName}</li>
      ))}
    </ul>
  ),
}));

vi.mock("./ChatRoomPanelSkeleton", () => ({
  CHAT_ROOM_PANEL_CLASS_NAME: "chat-room-panel",
  ChatRoomPanelSkeleton: () => <div data-testid="chat-room-panel-skeleton" />,
}));

const room = (overrides: Partial<ChatRoomListItem> = {}): ChatRoomListItem => ({
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
  roomName: "서버 방",
  profileImageUrl: null,
  group: false,
  ...overrides,
});

describe("ChatRoomPanelContent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("chat list 렌더링에 IndexedDB-first rooms를 사용한다", () => {
    chatRoomListIndexedDBMock.useChatRoomListIndexedDB.mockReturnValue({
      rooms: [room({ roomName: "로컬 방" })],
      hydrated: true,
      isLoading: false,
      isFetching: false,
    });

    render(<ChatRoomPanelContent />);

    expect(screen.getByText("로컬 방")).toBeInTheDocument();
    expect(screen.queryByText("서버 방")).not.toBeInTheDocument();
  });

  it("IndexedDB-first room list가 로딩 중이면 목록 skeleton을 렌더링한다", () => {
    chatRoomListIndexedDBMock.useChatRoomListIndexedDB.mockReturnValue({
      rooms: [],
      hydrated: false,
      isLoading: true,
      isFetching: false,
    });

    render(<ChatRoomPanelContent />);

    expect(screen.getByTestId("chat-room-panel-skeleton")).toBeInTheDocument();
  });
});
