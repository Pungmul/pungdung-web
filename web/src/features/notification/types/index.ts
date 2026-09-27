export interface NotificationData {
  title: string;
  body: string;
  receivedAt: Date;
}

export interface NotificationListItem extends NotificationData {
  logId: number;
  // 이동 경로를 만들 수 없으면 null
  href: string | null;
  isRead: boolean;
  linkType: string | null;
}

