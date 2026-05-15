"use client";

import { useMemo, useRef, useState } from "react";
import { use } from "react";
import { useParams, useRouter } from "next/navigation";

import { useQuery } from "@tanstack/react-query";

import { useSocketConnection } from "@pungdung/worker-socket-bridge/react";
import { AnimatePresence } from "framer-motion";

import {
  chatQueries,
  useChatRoomDisplayOverride,
  useChatRoomForegroundReconciliation,
  useChatRoomTitle,
  useChatRoomUserMaps,
  useExitChatRoom,
  useRoomReadSocket,
  useSyncChatRoomFocusOnRoomId,
} from "@/features/chat";
import type { ReadSignTimelineMessagesRef } from "@/features/chat/socket/useRoomReadSocket";
import { myPageQueries } from "@/features/my-page";

import { Conditional } from "@/shared";
import { useBodyScrollLock, useViewportHeightVar } from "@/shared/hooks";

import { ChatRoomMainScreen } from "./_ChatRoomMainScreen";
import { ChatRoomSettingScreen } from "./_ChatRoomSettingScreen";

type ChatRoomActiveScreen = "main" | "settings";

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

  const [activeScreen, setActiveScreen] =
    useState<ChatRoomActiveScreen>("main");

  const timelineMessagesRef = useRef<ReadSignTimelineMessagesRef["current"]>([]);
  const { readSign } = useRoomReadSocket(roomId as string, {
    timelineMessagesRef,
  });
  const { exitChatRoom } = useExitChatRoom({ roomId: roomId as string });

  useChatRoomForegroundReconciliation({
    roomId: roomId as string,
    readSign,
    isConnected,
    timelineMessagesRef,
  });
  useSyncChatRoomFocusOnRoomId(roomId as string);
  useBodyScrollLock(true);

  const mainRef = useRef<HTMLElement>(null);
  useViewportHeightVar(mainRef, {
    syncHtml: true,
    chatRoomLayout: true,
  });

  const { data: chatRoomData } = useQuery(
    chatQueries.room(roomId as string),
  );

  const { override } = useChatRoomDisplayOverride(roomId as string);
  const { title } = useChatRoomTitle({
    chatRoomData,
    ...(override?.roomName ? { roomNameOverride: override.roomName } : {}),
  });
  const { userList, userImageMap, userNameMap } = useChatRoomUserMaps({
    chatRoomData,
  });

  const memberCount = useMemo(() => chatRoomData?.userInfoList.length
    ? chatRoomData?.userInfoList.length - 1
    : 0, [chatRoomData?.userInfoList.length]);

  return (
    <AnimatePresence mode="wait">
      <main
        id="chat-room-main"
        ref={mainRef}
        className="relative h-full min-h-0 overflow-hidden bg-background max-md:h-[var(--app-height,100dvh)]"
      >
        <Conditional
          value={activeScreen}
          cases={{
            main: <ChatRoomMainScreen
              roomId={roomId as string}
              title={title}
              memberCount={memberCount}
              myUsername={myUsername}
              readSign={readSign}
              isConnected={isConnected}
              userList={userList}
              userImageMap={userImageMap}
              userNameMap={userNameMap}
              isGroupRoom={chatRoomData?.chatRoomInfo.group ?? false}
              onBack={() => router.push("/chats/r/inbox")}
              onExitChat={exitChatRoom}
              onOpenSettings={() => setActiveScreen("settings")}
              timelineMessagesRef={timelineMessagesRef}
            />,
            settings: <ChatRoomSettingScreen
              roomId={roomId as string}
              defaultRoomName={chatRoomData?.chatRoomInfo.roomName ?? ""}
              defaultProfileImageUrl={
                chatRoomData?.chatRoomInfo.profileImageUrl ?? null
              }
              onBack={() => setActiveScreen("main")}
            />,
          }}
          fallback={null}
        />
      </main>
    </AnimatePresence>
  );
}
