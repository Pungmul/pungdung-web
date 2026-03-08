import { sortChatRoomByDate } from "../../lib";
import { ChatRoomListItemDto } from "../../types";

export const loadChatRoomList = async (): Promise<ChatRoomListItemDto[]> => {
  try {
    // 서버/클라이언트 환경에 따라 URL 분기
    const proxyUrl = `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/chats/roomlist`;

    const response = await fetch(proxyUrl, {
      credentials: "include",
    });

    if (!response.ok) throw Error("서버 불안정" + response.status);

    const { list: data } = await response.json();

    return sortChatRoomByDate(data);
  } catch (e) {
    throw e;
  }
};
