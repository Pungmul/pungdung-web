export const inviteUser = async (
  roomId: string,
  data: { newUsernameList: string[] }
): Promise<void> => {
  const response = await fetch(`/api/chats/${roomId}/invites`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("사용자 초대에 실패했습니다.");
  }
};
