import dayjs from "dayjs";
import { describe, expect, it } from "vitest";

import {
  chatLightningPanelStatusLabel,
  formatChatLightningLocation,
  formatChatLightningTimeLabel,
  resolveChatLightningPanelPhase,
} from "./chat-lightning-panel-display";

const meetingDay = "2026-12-03T13:30:00";

describe("formatChatLightningLocation", () => {
  it("건물과 상세를 한 칸으로 잇는다", () => {
    expect(
      formatChatLightningLocation("상명대 중앙교수회관", "지하 소강당"),
    ).toBe("상명대 중앙교수회관 지하 소강당");
  });

  it("빈 값은 뺀다", () => {
    expect(formatChatLightningLocation("회관", "  ")).toBe("회관");
  });
});

describe("formatChatLightningTimeLabel", () => {
  it("시작 시각이 없으면 미정이다", () => {
    expect(formatChatLightningTimeLabel(null)).toBe("미정");
  });

  it("시와 분 뒤에 부터를 붙인다", () => {
    expect(formatChatLightningTimeLabel(meetingDay)).toBe("13시 30분 부터");
  });
});

describe("resolveChatLightningPanelPhase", () => {
  const schedule = {
    startTime: meetingDay,
    endTime: "2026-12-03T16:00:00",
    recruitmentEndTime: "2026-12-03T12:00:00",
  };

  it("시작 시각 이후이고 같은 날이면 진행 중이다", () => {
    expect(
      resolveChatLightningPanelPhase(schedule, dayjs("2026-12-03T14:00:00")),
    ).toBe("ongoing");
  });

  it("같은 날이어도 시작 전이면 예정이다", () => {
    expect(
      resolveChatLightningPanelPhase(schedule, dayjs("2026-12-03T13:00:00")),
    ).toBe("upcoming");
  });

  it("종료 시각이 지나면 지난 번개다", () => {
    expect(
      resolveChatLightningPanelPhase(schedule, dayjs("2026-12-03T16:01:00")),
    ).toBe("past");
  });

  it("시작 시각이 없으면 모집 마감일 당일은 진행 중이다", () => {
    expect(
      resolveChatLightningPanelPhase(
        {
          startTime: null,
          endTime: null,
          recruitmentEndTime: "2026-12-03T18:00:00",
        },
        dayjs("2026-12-03T09:00:00"),
      ),
    ).toBe("ongoing");
  });

  it("시작 시각만 있고 다음 날이면 지난 번개다", () => {
    expect(
      resolveChatLightningPanelPhase(
        {
          startTime: meetingDay,
          endTime: null,
          recruitmentEndTime: "2026-12-03T12:00:00",
        },
        dayjs("2026-12-04T00:01:00"),
      ),
    ).toBe("past");
  });

  it("모임 전날은 예정이다", () => {
    expect(
      resolveChatLightningPanelPhase(schedule, dayjs("2026-12-02T20:00:00")),
    ).toBe("upcoming");
  });

  it("종료가 다음 날이면 그날 새벽까지 진행 중이다", () => {
    expect(
      resolveChatLightningPanelPhase(
        {
          startTime: meetingDay,
          endTime: "2026-12-04T01:00:00",
          recruitmentEndTime: "2026-12-03T12:00:00",
        },
        dayjs("2026-12-04T00:30:00"),
      ),
    ).toBe("ongoing");
  });
});

describe("chatLightningPanelStatusLabel", () => {
  it("지난 번개와 참여중인 번개를 구분한다", () => {
    expect(chatLightningPanelStatusLabel("past")).toBe("지난 번개");
    expect(chatLightningPanelStatusLabel("ongoing")).toBe("참여중인 번개");
    expect(chatLightningPanelStatusLabel("upcoming")).toBe("참여중인 번개");
  });
});
