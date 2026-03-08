"use server";

import { cookies } from "next/headers";

import { sortChatRoomByDate } from "../../lib";

export const fetchRoomListApi = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  if (!accessToken) throw new Error("Access token not found");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_LOCAL_URL}/api/chats/roomlist`,
    {
      headers: {
        Cookie: cookieStore.toString(),
      },
    }
  );

  if (!response.ok) throw Error("서버 불안정" + response.status);

  const { list: data } = await response.json();

  return sortChatRoomByDate(data);
};
