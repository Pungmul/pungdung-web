"use client";

import { useRef, useState } from "react";
import { use } from "react";
import { useParams, useRouter } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

import { AnimatePresence } from "framer-motion";

import { useSocketConnection } from "@/core/socket";

import {
  ChatDrawer,
  chatQueries,
  ChatRoomHeader,
  ChatRoomTimelinePanel,
  InviteUserModal,
  useChatRoomTitle,
  useChatRoomUserMaps,
  useExitChatRoom,
  useRoomReadSocket,
  useSyncChatRoomFocusOnRoomId,
} from "@/features/chat";
import { myPageQueries } from "@/features/my-page";
import { UserProfileCardModalHost } from "@/features/user";

import { useBodyScrollLock, useViewportHeightVar } from "@/shared/hooks";


type ChatRoomPageProps = {
  decodedUsernamePromise: Promise<string | undefined>;
};

export function ChatRoomPage({ decodedUsernamePromise }: ChatRoomPageProps) {
  const { roomId } = useParams();
  const router = useRouter();
  const decodedUsername = use(decodedUsernamePromise);
  const { data: myInfo } = useQuery(myPageQueries.info());
  const myUsername =
    decodedUsername ?? myInfo?.username ?? "";

  const isConnected = useSocketConnection();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [inviteUserModalOpen, setInviteUserModalOpen] = useState(false);

  const { readSign } = useRoomReadSocket(roomId as string);
  const { exitChatRoom } = useExitChatRoom({ roomId: roomId as string });

  useSyncChatRoomFocusOnRoomId(roomId as string);
  useBodyScrollLock(true);

  const mainRef = useRef<HTMLElement>(null);
  useViewportHeightVar(mainRef);

  const { data: chatRoomData } = useQuery(
    chatQueries.room(roomId as string),
  );

  const { title } = useChatRoomTitle({ chatRoomData });
  const { userList } = useChatRoomUserMaps({ chatRoomData });

  const memberCount = chatRoomData?.userInfoList.length
    ? chatRoomData?.userInfoList.length - 1
    : 0;


  return (
    <AnimatePresence mode="wait">
      <main
        ref={mainRef}
        className="relative h-full min-h-0 overflow-hidden bg-background max-md:h-[var(--app-height,100dvh)]"
      >
        <div className="h-full min-h-0 grid grid-rows-[auto_minmax(0,1fr)_auto]">
          <ChatRoomHeader
            title={title}
            memberCount={memberCount}
            onBack={() => router.push("/chats/r/inbox")}
            onOpenDrawer={() => setDrawerOpen(true)}
          />

          <ChatRoomTimelinePanel
            roomId={roomId as string}
            {...(myUsername ? { myInfo: { username: myUsername } } : {})}
            readSign={readSign}
            isConnected={isConnected}
          />
        </div>

        <UserProfileCardModalHost />

        <ChatDrawer
          drawerOpen={drawerOpen}
          onExitChat={exitChatRoom}
          userList={userList}
          onClose={() => setDrawerOpen(false)}
          onInviteUser={() => setInviteUserModalOpen(true)}
        />
        <InviteUserModal
          roomId={roomId as string}
          currentUsernames={userList.map((user) => user.username)}
          isGroupRoom={chatRoomData?.chatRoomInfo.group ?? false}
          myUsername={myUsername}
          isOpen={inviteUserModalOpen}
          onClose={() => {
            setInviteUserModalOpen(false);
          }}
        />
      </main>
    </AnimatePresence>
  );
}
