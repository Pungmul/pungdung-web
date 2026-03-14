import { lazy } from "react";
import { Metadata } from "next";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { Suspense } from "@suspensive/react";

import { getQueryClient } from "@/core";

import {
  chatQueries,
  ChatRoomBoxSkeleton,
  fetchRoomListApi,
  RoomContainer,
  SelectFriendModalProvider,
} from "@/features/chat";

export const metadata: Metadata = {
  title: "풍덩 | 채팅",
  description: "풍덩 채팅 페이지",
};

export const dynamic = "force-dynamic";

const ChatRoomList = lazy(
  () => import("@/features/chat/components/section/ChatRoomList")
);

const SelectFriendModal = lazy(() =>
  import("@/features/chat/store/select-friend-modal.context").then(
    (module) => ({
      default: module.SelectFriendModal,
    })
  )
);

function ChatLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative block md:flex md:flex-row w-full flex-grow">
      <Suspense fallback={<ChatRoomBoxSkeleton key={"room-skeleton"} />}>
        <ChatRoomList key="chat-list" />
      </Suspense>
      <RoomContainer>{children}</RoomContainer>
      <SelectFriendModal />
    </div>
  );
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    ...chatQueries.roomList(),
    queryFn: () => fetchRoomListApi(),
  });

  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <SelectFriendModalProvider>
        <ChatLayoutContent>{children}</ChatLayoutContent>
      </SelectFriendModalProvider>
    </HydrationBoundary>
  );
}
