import { NOTIFICATION_LINK_TYPE } from "../../lib/resolve-notification-href";
import type { NotificationListItem } from "../../types";

const body =
  "글 내용예시, 글 목록을 읽어올때는 적당히 한줄로 쭉읽어옵니다. 최대한 한줄로 표현하고 2줄이 끝입니다.";

function notification(
  overrides: Partial<NotificationListItem> &
    Pick<NotificationListItem, "logId" | "isRead" | "linkType">
): NotificationListItem {
  return {
    title: "알림 제목 예시입니다.",
    body,
    receivedAt: new Date(Date.now() - 2 * 60_000),
    href: "/lightning",
    ...overrides,
  };
}

export const unreadLightning = notification({
  logId: 1,
  isRead: false,
  linkType: NOTIFICATION_LINK_TYPE.lightningMeeting,
});

export const unreadPost = notification({
  logId: 2,
  isRead: false,
  linkType: NOTIFICATION_LINK_TYPE.post,
  href: "/board/d/45",
});

export const unreadPerformance = notification({
  logId: 4,
  isRead: false,
  linkType: NOTIFICATION_LINK_TYPE.performance,
  href: "/board/promote/d/pk-8",
  title: "내일 공연이 있습니다!",
  body: "'어게인 풍물' 공연이 09월 30일 18:00에 시작됩니다.",
});

export const previousLightning = notification({
  logId: 3,
  isRead: true,
  linkType: NOTIFICATION_LINK_TYPE.lightningMeeting,
  title: "이전 항목 제목입니다.",
  body: "이미 확인한 알림입니다.",
  receivedAt: new Date(new Date().getFullYear(), 8, 7),
});

export const withoutLink = notification({
  logId: 5,
  isRead: false,
  linkType: null,
  href: null,
  body: "",
});
