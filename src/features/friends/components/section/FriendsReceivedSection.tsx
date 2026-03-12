"use client";

import { useCallback } from "react";

import { Toast } from "@/shared/store";

import {
  useAcceptFriendRequestAction,
  useRejectFriendRequestAction,
} from "../../hooks/actions";
import { openFriendsPageUserProfile } from "../../lib";
import type { PendingReceivedFriendEntry } from "../../types";
import FriendAcceptButton from "../ui/FriendAcceptButton";
import FriendBox from "../ui/FriendBox";
import { FriendMenu } from "../ui/FriendMenu";
import FriendRejectButton from "../ui/FriendRejectButton";

type FriendsReceivedSectionProps = {
  pendingReceivedList: PendingReceivedFriendEntry[];
};

export function FriendsReceivedSection({
  pendingReceivedList,
}: FriendsReceivedSectionProps) {
  // 수락·거절 mutation (목록 섹션 한 곳에서만 조합)
  const { handleReceiveFriend, isPending: isAcceptPending } = useAcceptFriendRequestAction();
  const { handleRejectFriend, isPending: isRejectPending } =
    useRejectFriendRequestAction();

  const handleMenuReport = useCallback(() => {
    Toast.show({
      message: "신고 기능은 준비 중입니다.",
      type: "success",
    });
  }, []);

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xs font-normal uppercase tracking-[0.08em] text-grey-600">
        받은 요청
      </h2>
      {pendingReceivedList.length === 0 ? (
        <p className="py-8 text-center text-sm text-grey-500">
          새로운 친구 요청이 없습니다.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {pendingReceivedList.map((row) => (
            <FriendBox
              key={row.friendRequestId + "-received"}
              friend={row.user}
              className="max-md:px-1"
              onOpen={() => openFriendsPageUserProfile("received", row)}
              buttons={
                <>
                  <FriendAcceptButton
                    disabled={isAcceptPending}
                    onAccept={() => {
                      void handleReceiveFriend(row.friendRequestId);
                    }}
                  />
                  <FriendRejectButton
                    disabled={isRejectPending}
                    onReject={() => {
                      void handleRejectFriend(row.friendRequestId);
                    }}
                  />
                  <FriendMenu
                    items={[
                      {
                        label: "거절 후 차단",
                        handler: () => {
                          // 차단 API 생기면 decline 직후 연동
                          void handleRejectFriend(row.friendRequestId);
                        },
                      },
                      { label: "신고", handler: handleMenuReport },
                    ]}
                  />
                </>
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}
