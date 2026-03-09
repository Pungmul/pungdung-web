"use client";

import { useMemo } from "react";

import { User } from "@/features/user";

import {
  createUserImageMap,
  createUserLastReadMessageIdMap,
  createUserNameMap,
} from "../services";
import { ChatRoomDto } from "../types";
import {
  UserImageMap,
  UserLastReadMessageIdMap,
  UserNameMap,
} from "../types";

interface UseChatRoomUserMapsParams {
  chatRoomData: ChatRoomDto | undefined;
}

interface UseChatRoomUserMapsReturn {
  userList: User[];
  userLastReadMessageIdMap: UserLastReadMessageIdMap;
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
 * const {
 *   userList,
 *   userLastReadMessageIdMap,
 *   userImageMap,
 *   userNameMap
 * } = useChatRoomUserMaps({ chatRoomData });
 */
export const useChatRoomUserMaps = ({
  chatRoomData,
}: UseChatRoomUserMapsParams): UseChatRoomUserMapsReturn => {
  // 유저 리스트 정렬 (이름순)
  const userList = useMemo(() => {
    return (
      chatRoomData?.userInfoList.sort((a, b) => a.name.localeCompare(b.name)) ||
      []
    );
  }, [chatRoomData?.userInfoList]);

  // 유저별 마지막 읽은 메시지 ID 맵
  const userLastReadMessageIdMap = useMemo(() => {
    if (!chatRoomData) return {};
    return createUserLastReadMessageIdMap(
      userList,
      chatRoomData.userInitReadList,
    );
  }, [userList, chatRoomData?.userInitReadList]);

  // 유저별 프로필 이미지 맵
  const userImageMap = useMemo(() => {
    return createUserImageMap(userList);
  }, [userList]);

  // 유저별 이름 맵
  const userNameMap = useMemo(() => {
    return createUserNameMap(userList);
  }, [userList]);

  return {
    userList,
    userLastReadMessageIdMap,
    userImageMap,
    userNameMap,
  };
};
