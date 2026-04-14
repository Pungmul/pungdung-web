"use client";

import { useCallback } from "react";

import { useRouter } from "next/navigation";

import {
  motion,
  type PanInfo,
  useDragControls,
} from "framer-motion";

import { BottomFixedButton, Header } from "@/shared";

import {
  GESTURE_THRESHOLD,
  GESTURE_VELOCITY_THRESHOLD,
} from "../../../constants";
import {
  useLightningDeleteAction,
  useLightningExitAction,
} from "../../../hooks/actions";
import type { UserParticipationData } from "../../../types";
import { LightningParticipantListSection } from "../../section/participant/LightningParticipantListSection";
import { LightningCard } from "../../ui/card/LightningCard";

type ParticipationDetailOverlayProps = {
  participationData: UserParticipationData & {
    lightningMeeting: NonNullable<UserParticipationData["lightningMeeting"]>;
  };
  onClose: () => void;
};

export function ParticipationDetailOverlay({
  participationData,
  onClose,
}: ParticipationDetailOverlayProps) {
  const router = useRouter();
  const dragControls = useDragControls();
  const meeting = participationData.lightningMeeting;
  const { currentPersonNum, organizerId } = meeting;
  const participantProfiles = participationData.participantProfiles;
  const meetingId = meeting.id;
  const isOrganizer = participationData.isOrganizer === true;
  const hasChatRoom = Boolean(participationData.chatRoomUUID);
  const { handleLeaveLightningMeeting } = useLightningExitAction(meetingId);
  const { handleDeleteLightningMeeting } = useLightningDeleteAction(meetingId);
  const handleLeaveAction = isOrganizer
    ? handleDeleteLightningMeeting
    : handleLeaveLightningMeeting;

  const handleMoveToChat = useCallback(() => {
    if (!participationData.chatRoomUUID) return;
    router.push(`/chats/r/${participationData.chatRoomUUID}`);
  }, [router, participationData.chatRoomUUID]);

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (
      info.offset.y > GESTURE_THRESHOLD ||
      info.velocity.y > GESTURE_VELOCITY_THRESHOLD
    ) {
      onClose();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-end bg-black/45"
      onClick={onClose}
    >
      <motion.section
        role="dialog"
        aria-modal="true"
        aria-label="참여중인 번개 상세"
        drag="y"
        dragListener={false}
        dragControls={dragControls}
        dragDirectionLock
        dragElastic={0.18}
        dragConstraints={{ top: 0, bottom: 0 }}
        onDragEnd={handleDragEnd}
        className="mx-auto flex h-dvh w-full max-w-[614px] flex-col overflow-hidden rounded-t-[16px] bg-background shadow-up-md"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="w-full cursor-grab touch-none py-[12px] active:cursor-grabbing"
          onPointerDown={(event) => dragControls.start(event)}
        >
          <div className="mx-auto h-[4px] w-[136px] rounded-full bg-grey-400" />
        </div>
        <Header title="번개 정보 확인" onLeftClick={onClose} />

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6">
          <div className="py-6">
            <LightningCard
              {...meeting}
              participantProfiles={participantProfiles}
              hideJoinButton
              isParticipated
            />
          </div>
          <LightningParticipantListSection
            meetingId={meeting.id}
            organizerId={organizerId}
            participantProfiles={participantProfiles}
            currentPersonNum={currentPersonNum}
            hasChatRoom={hasChatRoom}
            onMoveToChat={handleMoveToChat}
          />
        </div>

        <BottomFixedButton
          type="button"
          className="bg-primary text-background"
          onClick={handleLeaveAction}
        >
          {isOrganizer ? "번개 삭제" : "번개 나가기"}
        </BottomFixedButton>
      </motion.section>
    </motion.div>
  );
}
