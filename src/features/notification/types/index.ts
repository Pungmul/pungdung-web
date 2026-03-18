export interface NotificationData {
  title: string;
  body: string;
  receivedAt: Date;
}

export interface UnreadNotificationData extends NotificationData {
  logId: number;
}

