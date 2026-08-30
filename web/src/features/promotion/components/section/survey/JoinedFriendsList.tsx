"use client";

import { useCallback } from "react";

import { useOpenPersonalChatNavigation } from "@/features/chat";
import {
  FriendBox,
  FriendMenu,
  FriendMessageButton,
  openFriendsPageUserProfile,
} from "@/features/friends";

import { Toast } from "@/shared/store";

import type { PromotionJoinedFriend } from "../../../types";

interface JoinedFriendsListProps {
  friends: PromotionJoinedFriend[];
}

export function JoinedFriendsList({ friends }: JoinedFriendsListProps) {
  const { openPersonalChat, isPending: isChatPending } =
    useOpenPersonalChatNavigation();

  const handleMenuDelete = useCallback(() => {
    Toast.show({
      message: "친구 삭제 기능은 준비 중입니다.",
      type: "warning",
    });
  }, []);

  const handleMenuBlock = useCallback(() => {
    Toast.show({
      message: "차단 기능은 준비 중입니다.",
      type: "warning",
    });
  }, []);

  const handleMenuReport = useCallback(() => {
    Toast.show({
      message: "신고 기능은 준비 중입니다.",
      type: "warning",
    });
  }, []);

  return (
    <div className="flex flex-col">
      {friends.map((friend) => (
        <FriendBox
          key={friend.userId}
          className="hover:bg-grey-100 max-md:px-1"
          friend={friend}
          onOpen={() =>
            openFriendsPageUserProfile("friends", {
              friendRequestId: friend.userId,
              user: friend,
            })
          }
          buttons={
            <>
              <FriendMessageButton
                disabled={isChatPending}
                label={isChatPending ? "이동 중…" : "메시지"}
                onClick={() => {
                  void openPersonalChat(friend.username);
                }}
              />
              <FriendMenu
                items={[
                  {
                    label: "친구 삭제",
                    handler: handleMenuDelete,
                    className: "text-red-400",
                  },
                  { label: "차단", handler: handleMenuBlock },
                  { label: "신고", handler: handleMenuReport },
                ]}
              />
            </>
          }
        />
      ))}
    </div>
  );
}
