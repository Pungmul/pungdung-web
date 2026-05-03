export function formatMessageTime(time: Date): string {
  const hours = time.getHours();
  const minutes = time.getMinutes();

  if (hours === 0) {
    return "오전 12:00";
  }

  if (hours < 12) {
    return `오전 ${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  }

  if (hours === 12) {
    return "오후 12:00";
  }

  return `오후 ${(hours - 12).toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}
