"use client";

import { useMemo } from "react";

import { User } from "@/features/user";

import { createUserImageMap, createUserNameMap } from "../../services";
import { UserImageMap, UserNameMap } from "../../types";
import type { ChatRoom } from "../../types/chat-room.types";

interface UseChatRoomUserMapsParams {
  chatRoomData: ChatRoom | undefined;
}

interface UseChatRoomUserMapsReturn {
  userList: User[];
  userImageMap: UserImageMap;
  userNameMap: UserNameMap;
}

/**
 * 채팅방 데이터에서 유저 관련 맵들을 생성하는 훅
 *
 * @param params - 채팅방 데이터를 포함한 파라미터
 * @returns 정렬된 유저 리스트와 각종 유저 맵들
 *
 * @example
 * const { userList, userImageMap, userNameMap } = useChatRoomUserMaps({
 *   chatRoomData,
 * });
 */
export const useChatRoomUserMaps = ({
  chatRoomData,
}: UseChatRoomUserMapsParams): UseChatRoomUserMapsReturn => {
  const userList = useMemo(() => {
    return (
      chatRoomData?.userInfoList.sort((a, b) => a.name.localeCompare(b.name)) ||
      []
    );
  }, [chatRoomData?.userInfoList]);

  const userImageMap = useMemo(() => {
    return createUserImageMap(userList);
  }, [userList]);

  const userNameMap = useMemo(() => {
    return createUserNameMap(userList);
  }, [userList]);

  return {
    userList,
    userImageMap,
    userNameMap,
  };
};
