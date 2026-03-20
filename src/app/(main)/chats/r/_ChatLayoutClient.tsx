"use client";

import dynamic from "next/dynamic";

import { QueryErrorResetBoundary } from "@tanstack/react-query";

import { ErrorBoundary, Suspense } from "@suspensive/react";

import {
  SelectFriendModalProvider,
} from "@/features/chat";

import { ChatRoomPanelSkeleton } from "@/features/chat/components/section/ChatRoomPanel";


export const SelectFriendModal = dynamic(
  () => import("@/features/chat/store/select-friend-modal.context").then((module) => ({
    default: module.SelectFriendModal,
  })),
  { ssr: false, loading: () => null }
);

const ChatRoomPanelAsync = dynamic(
  () => import("@/features/chat/components/section/ChatRoomPanel").then((module) => ({
    default: module.default,
  })),
  { ssr: false, loading: () => <ChatRoomPanelSkeleton /> }
);

const ChatRoomPanelErrorFallbackAsync = dynamic(
  () => import("@/features/chat/components/section/ChatRoomPanel").then((module) => ({
    default: module.ChatRoomPanelErrorFallback,
  })),
  { ssr: false }
);

export function ChatLayoutClient({ children }: { children: React.ReactNode }) {
  return (
    <SelectFriendModalProvider>
      <div className="relative block md:flex md:flex-row w-full flex-grow">
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
        {children}
        <SelectFriendModal />
      </div>
    </SelectFriendModalProvider>
  );
}
