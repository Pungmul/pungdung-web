export const exitChat = async (roomId: string): Promise<void> => {
  const response = await fetch(`/api/chats/${roomId}/exit`, {
    credentials: "include",
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("채팅방 나가기에 실패했습니다.");
  }
};
