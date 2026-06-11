"use client";

import { useState } from "react";

import {
  ChatDrawer,
  ChatRoomHeader,
  ChatRoomTimelinePanel,
  InviteUserModal,
} from "@/features/chat";
import { User, UserProfileCardModalHost } from "@/features/user";

import type { ReadSignFn } from "@/features/chat/socket/read-sign.types";
import type { ReadSignTimelineMessagesRef } from "@/features/chat/socket/useRoomReadSocket";

type ChatRoomMainScreenProps = {
  roomId: string;
  title: string;
  memberCount: number;
  myUsername: string;
  readSign: ReadSignFn;
  isConnected: boolean;
  userList: User[];
  userImageMap: Record<string, string | null>;
  userNameMap: Record<string, string | null>;
  isGroupRoom: boolean;
  onBack: () => void;
  onExitChat: () => void;
  onOpenSettings: () => void;
  timelineMessagesRef?: ReadSignTimelineMessagesRef;
};

export function ChatRoomMainScreen({
  roomId,
  title,
  memberCount,
  myUsername,
  readSign,
  isConnected,
  userList,
  userImageMap,
  userNameMap,
  isGroupRoom,
  onBack,
  onExitChat,
  onOpenSettings,
  timelineMessagesRef,
}: ChatRoomMainScreenProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [inviteUserModalOpen, setInviteUserModalOpen] = useState(false);

  return (
    <>
      <div className="h-full min-h-0 grid grid-rows-[auto_minmax(0,1fr)_auto]">
        <ChatRoomHeader
          title={title}
          memberCount={memberCount}
          onBack={onBack}
          onOpenDrawer={() => setDrawerOpen(true)}
        />

        <ChatRoomTimelinePanel
          roomId={roomId}
          {...(myUsername ? { myInfo: { username: myUsername } } : {})}
          {...(timelineMessagesRef ? { timelineMessagesRef } : {})}
          readSign={readSign}
          isConnected={isConnected}
          userList={userList}
          userImageMap={userImageMap}
          userNameMap={userNameMap}
        />
      </div>

      <UserProfileCardModalHost />

      <ChatDrawer
        drawerOpen={drawerOpen}
        onExitChat={onExitChat}
        userList={userList}
        onClose={() => setDrawerOpen(false)}
        onInviteUser={() => setInviteUserModalOpen(true)}
        onOpenSettings={() => {
          setDrawerOpen(false);
          onOpenSettings();
        }}
      />
      <InviteUserModal
        roomId={roomId}
        currentUsernames={userList.map((user) => user.username)}
        isGroupRoom={isGroupRoom}
        myUsername={myUsername}
        isOpen={inviteUserModalOpen}
        onClose={() => {
          setInviteUserModalOpen(false);
        }}
      />
    </>
  );
}
