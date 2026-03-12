"use client";

import { openFriendsPageUserProfile } from "../../lib";
import type { PendingSentFriendEntry } from "../../types";
import FriendBox from "../ui/FriendBox";

type FriendsSentSectionProps = {
  pendingSentList: PendingSentFriendEntry[];
};

export function FriendsSentSection({
  pendingSentList,
}: FriendsSentSectionProps) {
  //보낸 요청 취소 로직 아직 개발되지 않음
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-xs font-normal uppercase tracking-[0.08em] text-grey-600">
        보낸 요청
      </h2>
      {pendingSentList.length === 0 ? (
        <p className="py-8 text-center text-sm text-grey-500">
          보낸 요청이 없습니다.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {pendingSentList.map((row) => (
            <FriendBox
              key={row.friendRequestId + "-sent"}
              className="rounded-xl bg-background max-md:px-1"
              friend={row.user}
              onOpen={() => openFriendsPageUserProfile("sent", row)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
