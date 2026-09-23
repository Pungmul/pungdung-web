import dayjs, { type Dayjs } from "dayjs";

export type ChatLightningPanelPhase = "upcoming" | "ongoing" | "past";

type ChatLightningSchedule = {
  startTime: string | null;
  endTime: string | null;
  recruitmentEndTime: string;
};

export function formatChatLightningLocation(
  buildingName: string,
  locationDetail: string,
) {
  return [buildingName, locationDetail]
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
    .join(" ");
}

export function formatChatLightningTimeLabel(startTime: string | null) {
  if (!startTime) return "미정";

  const parsed = dayjs(startTime);
  if (!parsed.isValid()) return "미정";

  return `${parsed.hour()}시 ${parsed.minute()}분 부터`;
}

export function resolveChatLightningPanelPhase(
  schedule: ChatLightningSchedule,
  now: Dayjs = dayjs(),
): ChatLightningPanelPhase {
  const anchor = dayjs(schedule.startTime ?? schedule.recruitmentEndTime);
  if (!anchor.isValid()) return "upcoming";

  if (schedule.endTime) {
    const end = dayjs(schedule.endTime);
    if (end.isValid() && now.isAfter(end)) return "past";
  } else if (now.isAfter(anchor.endOf("day"))) {
    return "past";
  }

  if (!now.isSame(anchor, "day")) {
    return now.isBefore(anchor) ? "upcoming" : "ongoing";
  }

  if (schedule.startTime && now.isBefore(anchor)) return "upcoming";

  return "ongoing";
}

export function chatLightningPanelStatusLabel(phase: ChatLightningPanelPhase) {
  return phase === "past" ? "지난 번개" : "참여중인 번개";
}
