"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";

import { cn } from "@/shared";

import type { ReadReceiptAvatar } from "../../../types/read-receipt.types";

const AVATAR_SIZE_PX = 16;
const AVATAR_OVERLAP_PX = 6;
const AVATAR_STEP_PX = AVATAR_SIZE_PX - AVATAR_OVERLAP_PX;
const ENTER_ANIMATION_MS = 500;
const MAX_VISIBLE_AVATARS = 5;

export type ReadReceiptAvatarAlign = "left" | "right";

type ReadReceiptAvatarsProps = {
  participants: readonly ReadReceiptAvatar[];
  align: ReadReceiptAvatarAlign;
  isVisible: boolean;
};

function buildParticipantUserIdsKey(
  participants: readonly ReadReceiptAvatar[]
): string {
  return participants.map((participant) => participant.userId).join(",");
}

export function ReadReceiptAvatars({
  participants,
  align,
  isVisible,
}: ReadReceiptAvatarsProps) {
  const displayOrderRef = useRef<number[]>([]);
  const isFirstMountRef = useRef(true);
  const [displayOrder, setDisplayOrder] = useState<number[]>([]);
  const [enteringUserIds, setEnteringUserIds] = useState<Set<number>>(
    () => new Set()
  );

  const participantUserIdsKey = buildParticipantUserIdsKey(participants);

  useLayoutEffect(() => {
    const currentUserIds = participants.map((participant) => participant.userId);

    if (currentUserIds.length === 0) {
      displayOrderRef.current = [];
      setDisplayOrder([]);
      setEnteringUserIds(new Set());
      isFirstMountRef.current = true;
      return;
    }

    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      displayOrderRef.current = currentUserIds;
      setDisplayOrder(currentUserIds);
      setEnteringUserIds(new Set(currentUserIds));
      return;
    }

    const prevOrder = displayOrderRef.current;
    const newUserIds = currentUserIds.filter((userId) => !prevOrder.includes(userId));
    const nextOrder = [
      ...prevOrder.filter((userId) => currentUserIds.includes(userId)),
      ...newUserIds,
    ];

    displayOrderRef.current = nextOrder;
    setDisplayOrder(nextOrder);
    setEnteringUserIds(new Set(newUserIds));
  }, [participantUserIdsKey, participants]);

  useEffect(() => {
    if (enteringUserIds.size === 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setEnteringUserIds(new Set());
    }, ENTER_ANIMATION_MS);

    return () => window.clearTimeout(timer);
  }, [enteringUserIds]);

  if (!isVisible && displayOrder.length === 0) {
    return null;
  }

  const participantsById = new Map(
    participants.map((participant) => [participant.userId, participant])
  );
  const visibleUserIds = displayOrder.slice(0, MAX_VISIBLE_AVATARS);
  const overflowCount = Math.max(displayOrder.length - MAX_VISIBLE_AVATARS, 0);
  const slotCount = visibleUserIds.length + (overflowCount > 0 ? 1 : 0);
  const stackWidth =
    AVATAR_SIZE_PX + Math.max(slotCount - 1, 0) * AVATAR_STEP_PX;
  const enableStackShift = align === "right";

  const resolveOffsetPx = (index: number) =>
    align === "right"
      ? (slotCount - 1 - index) * AVATAR_STEP_PX
      : index * AVATAR_STEP_PX;

  return (
    <div
      className="relative"
      style={{ width: stackWidth, height: AVATAR_SIZE_PX }}
      aria-label={
        isVisible && displayOrder.length > 0
          ? `읽음 ${displayOrder.length}명`
          : undefined
      }
    >
      {visibleUserIds.map((userId, index) => {
        const participant = participantsById.get(userId);
        if (!participant) {
          return null;
        }

        const offsetPx = resolveOffsetPx(index);
        const isEntering = isVisible && enteringUserIds.has(userId);
        const transformOrigin =
          align === "right" ? "bottom right" : "bottom left";

        return (
          <div
            key={userId}
            className={cn(
              "absolute bottom-0 size-5 overflow-hidden rounded-full border border-background bg-grey-200",
              enableStackShift &&
              !isEntering &&
              "transition-[right,left] duration-500 ease-out",
              isEntering && "animate-read-receipt-scale-in",
              !isVisible && "opacity-0"
            )}
            style={{
              ...(align === "right" ? { right: offsetPx } : { left: offsetPx }),
              transformOrigin,
            }}
            title={participant.displayName}
          >
            {participant.imageUrl ? (
              <Image
                src={participant.imageUrl}
                alt={participant.displayName}
                fill
                className="object-cover"
                sizes="20px"
              />
            ) : null}
          </div>
        );
      })}
      {overflowCount > 0 ? (
        <div
          className={cn(
            "absolute bottom-0 flex items-center justify-center rounded-full border border-background bg-grey-200 px-1 py-0.5 text-[10px] font-medium leading-none text-grey-600",
            enableStackShift && "transition-[right,left] duration-500 ease-out",
            !isVisible && "opacity-0"
          )}
          style={{
            ...(align === "right"
              ? { right: resolveOffsetPx(visibleUserIds.length) }
              : { left: resolveOffsetPx(visibleUserIds.length) }),
            transformOrigin: align === "right" ? "bottom right" : "bottom left",
          }}
          title={`외 ${overflowCount}명`}
        >
          +{overflowCount}
        </div>
      ) : null}
    </div>
  );
}
