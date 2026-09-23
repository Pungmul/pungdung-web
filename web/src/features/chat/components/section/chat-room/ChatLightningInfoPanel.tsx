"use client";

import { useQuery } from "@tanstack/react-query";

import { ChatLightningInfoPanelView } from "./ChatLightningInfoPanelView";
import {
  formatChatLightningLocation,
  formatChatLightningTimeLabel,
  resolveChatLightningPanelPhase,
} from "../../../lib/chat-room/chat-lightning-panel-display";

import { lightningQueries } from "@/features/lightning/queries";

type ChatLightningInfoPanelProps = {
  meetingId: number;
};

export function ChatLightningInfoPanel({
  meetingId,
}: ChatLightningInfoPanelProps) {
  const { data } = useQuery(lightningQueries.meeting(meetingId));

  if (!data) return null;

  return (
    <ChatLightningInfoPanelView
      phase={resolveChatLightningPanelPhase({
        startTime: data.startTime,
        endTime: data.endTime,
        recruitmentEndTime: data.recruitmentEndTime,
      })}
      title={data.meetingName}
      location={formatChatLightningLocation(
        data.buildingName,
        data.locationDetail,
      )}
      timeLabel={formatChatLightningTimeLabel(data.startTime)}
    />
  );
}
