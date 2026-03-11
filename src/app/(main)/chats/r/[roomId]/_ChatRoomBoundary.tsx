"use client";

import { useParams, useRouter } from "next/navigation";

import { QueryErrorResetBoundary, useQueryClient } from "@tanstack/react-query";

import type { ErrorBoundaryFallbackProps } from "@suspensive/react";
import { ErrorBoundary, Suspense } from "@suspensive/react";

import {
  chatQueries,
  ChatRoomHeader,
} from "@/features/chat";

import { Button, Spinner } from "@/shared";

import { ChatRoomListItemDto } from "@/features/chat/types";

function ChatRoomSuspenseFallback() {
  const params = useParams();
  const router = useRouter();

  const queryClient = useQueryClient();

  const roomId = params.roomId as string;

  const chatRooms = queryClient.getQueryData<
    ChatRoomListItemDto[]
  >(chatQueries.roomList().queryKey);
  const roomFromList = chatRooms?.find((r) => r.chatRoomUUID === roomId);

  if (!roomFromList) {
    return (
      <div className="flex justify-center items-center h-full bg-background">
        <Spinner size={36} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background">
      <ChatRoomHeader
        title={roomFromList.roomName}
        memberCount={roomFromList.chatRoomMemberIds?.length ?? 1}
        onBack={() => router.push("/chats/r/inbox")}
        onOpenDrawer={() => { }}
      />
      <div className="flex flex-1 justify-center items-center min-h-0">
        <Spinner size={36} />
      </div>
    </div>
  );
}

function ChatRoomErrorFallback({
  reset: resetBoundary,
}: ErrorBoundaryFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 px-[16px] text-center">
      <p className="text-grey-800 text-base leading-relaxed whitespace-pre-line">
        {"채팅방 정보를 불러오지 못했어요.\n다시 시도해 주세요."}
      </p>
      <Button type="button" onClick={resetBoundary}>
        다시 시도
      </Button>
    </div>
  );
}

export default function ChatRoomBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryErrorResetBoundary>
      {({ reset: resetQueries }) => (
        <ErrorBoundary
          onReset={resetQueries}
          fallback={ChatRoomErrorFallback}
        >
          <Suspense clientOnly fallback={<ChatRoomSuspenseFallback />}>
            {children}
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
