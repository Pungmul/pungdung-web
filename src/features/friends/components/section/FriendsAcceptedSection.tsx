"use client";

import { useCallback } from "react";

import { useOpenPersonalChatNavigation } from "@/features/chat";

import { Toast } from "@/shared/store";

import { openFriendsPageUserProfile } from "../../lib";
import type { AcceptedFriendEntry } from "../../types";
import FriendBox from "../ui/FriendBox";
import { FriendMenu } from "../ui/FriendMenu";
import FriendMessageButton from "../ui/FriendMessageButton";

type FriendsAcceptedSectionProps = {
  acceptedFriendList: AcceptedFriendEntry[];
};

export function FriendsAcceptedSection({
  acceptedFriendList,
}: FriendsAcceptedSectionProps) {
  // 1:1 채팅방 생성 후 이동
  const { openPersonalChat, isPending: isChatPending } =
    useOpenPersonalChatNavigation();

  // 케밥: 삭제·차단·신고 (API 붙으면 시그니처에 `User` 등 반영)
  const handleMenuDelete = useCallback(() => {
    Toast.show({
      message: "친구 삭제 기능은 준비 중입니다.",
      type: "success",
    });
  }, []);

  const handleMenuBlock = useCallback(() => {
    Toast.show({
      message: "차단 기능은 준비 중입니다.",
      type: "success",
    });
  }, []);

  const handleMenuReport = useCallback(() => {
    Toast.show({
      message: "신고 기능은 준비 중입니다.",
      type: "success",
    });
  }, []);

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xs font-normal uppercase tracking-[0.08em] text-grey-600">
        친구 목록
      </h2>
      {acceptedFriendList.length === 0 ? (
        <p className="py-8 text-center text-sm text-grey-500">
          아직 친구가 없습니다.
        </p>
      ) : (
        <div className="flex flex-col">
          {acceptedFriendList.map((row) => (
            <FriendBox
              key={row.friendRequestId + "-friends"}
              className="hover:bg-grey-100 max-md:px-1"
              friend={row.user}
              onOpen={() => openFriendsPageUserProfile("friends", row)}
              buttons={
                <>
                  <FriendMessageButton
                    disabled={isChatPending}
                    label={isChatPending ? "이동 중…" : "메시지"}
                    onClick={() => {
                      void openPersonalChat(row.user.username);
                    }}
                  />
                  <FriendMenu items={[
                    {
                      label: "친구 삭제",
                      handler: handleMenuDelete,
                      className: "text-red-400",
                    },
                    { label: "차단", handler: handleMenuBlock },
                    { label: "신고", handler: handleMenuReport },
                  ]} />
                </>
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}
