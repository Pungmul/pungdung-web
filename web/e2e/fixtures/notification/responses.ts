import { okEnvelope } from "../envelope";

export const E2E_NOTIFICATION_ID = 801;
export const E2E_NOTIFICATION_TITLE = "E2E 채팅 알림";
export const E2E_PREVIOUS_NOTIFICATION_TITLE = "E2E 이전 알림";

export const notificationListItem = {
  id: E2E_NOTIFICATION_ID,
  title: E2E_NOTIFICATION_TITLE,
  body: "새 메시지가 도착했습니다.",
  type: "POST",
  relatedId: "45",
  isRead: false,
  sentAt: "2027-12-01T00:00:00.000Z",
  domainType: "POST",
};

export const previousNotificationListItem = {
  id: 802,
  title: E2E_PREVIOUS_NOTIFICATION_TITLE,
  body: "이미 확인한 알림입니다.",
  type: "POST",
  relatedId: "46",
  isRead: true,
  sentAt: "2027-11-01T00:00:00.000Z",
  domainType: "POST",
};

export const notificationListResponse = okEnvelope([
  notificationListItem,
  previousNotificationListItem,
]);

export const emptyNotificationListResponse = okEnvelope([]);
