"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import { QueryErrorResetBoundary } from "@tanstack/react-query";

import { ErrorBoundary, Suspense } from "@suspensive/react";

import {
  ChatRoomPanelSkeleton,
  SelectFriendModalProvider,
} from "@/features/chat";

import { Responsive } from "@/shared/components/Responsive";


export const SelectFriendModal = dynamic(
  () => import("@/features/chat/store/select-friend-modal.context").then((module) => ({
    default: module.SelectFriendModal,
  })),
  { ssr: false, loading: () => null }
);

const ChatRoomPanelAsync = dynamic(
  () => import("@/features/chat/components/section/chat-room-list/ChatRoomPanel").then((module) => ({
    default: module.default,
  })),
  { ssr: false, loading: () => <ChatRoomPanelSkeleton /> }
);

const ChatRoomPanelErrorFallbackAsync = dynamic(
  () => import("@/features/chat/components/section/chat-room-list/ChatRoomPanel").then((module) => ({
    default: module.ChatRoomPanelErrorFallback,
  })),
  { ssr: false }
);

export function ChatLayoutClient({ children }: { children: React.ReactNode }) {
  const { roomId } = useParams<{ roomId?: string }>();
  const shouldShowPanelOnMobile = !roomId;

  const chatRoomPanel = (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallback={(props) => (
            <ChatRoomPanelErrorFallbackAsync
              {...props}
              onRetry={() => {
                reset();
                props.reset();
              }}
            />
          )}
        >
          <Suspense fallback={<ChatRoomPanelSkeleton />}>
            <ChatRoomPanelAsync key="chat-panel" />
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );

  return (
    <SelectFriendModalProvider>
      <Responsive
        mobile={
          shouldShowPanelOnMobile ? (
            <div className="relative block w-full flex-grow">
              {chatRoomPanel}
              <SelectFriendModal />
            </div>
          ) : (
            <div id="chat-room-slot" className="flex min-h-0 w-full flex-1 flex-col">
              {children}
              <SelectFriendModal />
            </div>
          )
        }
        desktop={
          <div className="relative w-full flex-grow md:flex md:flex-row">
            {chatRoomPanel}
            {children}
            <SelectFriendModal />
          </div>
        }
      />
    </SelectFriendModalProvider>
  );
}
