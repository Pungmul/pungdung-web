export function formatJoinLogMessage(
  content: string,
  senderDisplayName: string,
): string {
  return `${senderDisplayName}님이 ${content.split("님")[0]!.trim()}님을 초대했습니다.`;
}
