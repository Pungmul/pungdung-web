"use client";

import { useEffect, useId, useState } from "react";

import {
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

import { JoinedFriendsList } from "./JoinedFriendsList";
import type { PromotionJoinedFriend } from "../../../../types";

interface JoinedFriendsSheetProps {
  friends: PromotionJoinedFriend[];
  children?: ReactNode;
  friendList?: ReactNode;
}

const MAX_VISIBLE_FRIEND_COUNT = 3;
const FRIEND_ROW_HEIGHT_PX = 64;

export function JoinedFriendsSheet({
  friends,
  children,
  friendList,
}: JoinedFriendsSheetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const friendListId = useId();
  const friendCount = friends.length;
  const visibleFriendCount = Math.min(friendCount, MAX_VISIBLE_FRIEND_COUNT);
  const friendListHeight = visibleFriendCount * FRIEND_ROW_HEIGHT_PX;

  useEffect(() => {
    if (!isExpanded) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsExpanded(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isExpanded]);

  if (friendCount === 0) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      <AnimatePresence>
        {isExpanded ? (
          <motion.button
            type="button"
            aria-label="친구 목록 닫기"
            className="fixed inset-0 z-40 cursor-default bg-black/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={() => setIsExpanded(false)}
          />
        ) : null}
      </AnimatePresence>
      <motion.div
        layout
        className={`relative z-50 overflow-hidden bg-background pt-2 rounded-t-[24px] ${isExpanded ? "shadow-up-md" : ""}`}
      >
        <button
          type="button"
          aria-expanded={isExpanded}
          aria-controls={friendListId}
          className="flex w-full items-center justify-between px-[24px] py-3 text-left text-[15px] text-grey-600"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          <span className="text-grey-400 text-sm">{friendCount}명의 친구들이 이 공연 관람을 신청했어요</span>
          <AnimatePresence initial={false} mode="wait">
            <motion.span
              key={isExpanded ? "expanded" : "collapsed"}
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 2 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
            >
              {isExpanded ? (
                <ChevronDownIcon aria-hidden className="size-5 text-grey-400" />
              ) : (
                <ChevronRightIcon aria-hidden className="size-5 text-grey-400" />
              )}
            </motion.span>
          </AnimatePresence>
        </button>
        <AnimatePresence initial={false}>
          {isExpanded ? (
            <motion.div
              className="overflow-hidden rounded-sm px-3"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: friendListHeight, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
            >
              <section
                id={friendListId}
                aria-label="공연 관람 신청 친구 목록"
                className="max-h-full overflow-y-auto rounded-sm bg-grey-200"
              >
                {friendList ?? <JoinedFriendsList friends={friends} />}
              </section>
            </motion.div>
          ) : null}
        </AnimatePresence>
        {children}
      </motion.div>
    </div>
  );
}
