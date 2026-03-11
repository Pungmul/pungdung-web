"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { useSuspenseQuery } from "@tanstack/react-query";

import { AnimatePresence } from "framer-motion";

import { useSocketConnection } from "@/core/socket";

import {
  ChatDrawer,
  chatQueries,
  ChatRoomHeader,
  ChatRoomTimelinePanel,
  ChatSendForm,
  InviteUserModal,
  useChatRoomTitle,
  useChatRoomUserMaps,
  useExitChatRoom,
  useRoomReadSocket,
  useSyncChatRoomFocusOnRoomId,
} from "@/features/chat";
import { buildUserProfileOpenPayload } from "@/features/friends";
import { useSuspenseGetMyPageInfo } from "@/features/my-page";
import type { Member, User } from "@/features/user";

import { UserProfileCardModalHost } from "@/shared";
import { useBodyScrollLock } from "@/shared/hooks";
import { userProfileModalStore } from "@/shared/store";

/** 채팅방 `userInfoList`는 오래될 수 있어, 본인 모달에는 최신 `Member`로 덮어쓴다. */
function mergeMemberIntoUserForSelfModal(roomUser: User, member: Member): User {
  return {
    ...roomUser,
    username: member.username,
    name: member.name,
    profileImage: member.profile,
    clubName: member.clubName,
  } as User;
}

export function ChatRoomPage() {
  const { roomId } = useParams();
  const router = useRouter();
  const { data: myInfo } = useSuspenseGetMyPageInfo();
  const myInfoRef = React.useRef(myInfo);
  myInfoRef.current = myInfo;

  const isConnected = useSocketConnection();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [inviteUserModalOpen, setInviteUserModalOpen] = useState(false);

  const { readSign } = useRoomReadSocket(roomId as string);
  const { exitChatRoom } = useExitChatRoom({ roomId: roomId as string });

  useSyncChatRoomFocusOnRoomId(roomId as string);
  useBodyScrollLock(true);

  const { data: chatRoomData } = useSuspenseQuery(
    chatQueries.room(roomId as string),
  );

  const { title } = useChatRoomTitle({ chatRoomData });
  const { userList } = useChatRoomUserMaps({ chatRoomData });

  const memberCount = chatRoomData?.userInfoList.length ? chatRoomData?.userInfoList.length - 1 : 0;

  const handleMemberProfileClick = React.useCallback(async (user: User) => {
    const me = myInfoRef.current;
    if (user.username === me.username) {
      userProfileModalStore.getState().open({
        user: mergeMemberIntoUserForSelfModal(user, me),
        relationship: "self",
      });
      return;
    }
    const payload = await buildUserProfileOpenPayload(user);
    userProfileModalStore.getState().open(payload);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <div className="flex flex-col h-full bg-background relative overflow-y-auto overflow-x-hidden">
        <UserProfileCardModalHost />
        <ChatRoomHeader
          title={title}
          memberCount={memberCount}
          onBack={() => router.push("/chats/r/inbox")}
          onOpenDrawer={() => setDrawerOpen(true)}
        />
        <ChatRoomTimelinePanel
          roomId={roomId as string}
          myInfo={myInfo}
          readSign={readSign}
          isConnected={isConnected}
          renderSendForm={(handlers) => (
            <ChatSendForm
              onSendMessage={handlers.onSendMessage}
              onSendImage={handlers.onSendImage}
            />
          )}
        />
        <ChatDrawer
          drawerOpen={drawerOpen}
          onExitChat={exitChatRoom}
          userList={userList}
          onClose={() => setDrawerOpen(false)}
          onInviteUser={() => setInviteUserModalOpen(true)}
          onMemberProfileClick={handleMemberProfileClick}
        />
        <InviteUserModal
          roomId={roomId as string}
          currentUsernames={userList.map((user) => user.username)}
          isGroupRoom={chatRoomData?.chatRoomInfo.group ?? false}
          myUsername={myInfo.username}
          isOpen={inviteUserModalOpen}
          onClose={() => {
            setInviteUserModalOpen(false);
          }}
        />
      </div>
    </AnimatePresence>
  );
}
