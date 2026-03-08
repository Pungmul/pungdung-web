import { User } from "@/features/user";

import { UserLastReadMessageId } from "../types";
import {
  ChatRoomUserMaps,
  UserImageMap,
  UserLastReadMessageIdMap,
  UserNameMap,
} from "../types";

/**
 * 유저 리스트에서 마지막 읽은 메시지 ID 맵을 생성합니다.
 *
 * @param userList - 채팅방 유저 리스트
 * @param userInitReadList - 유저별 마지막 읽은 메시지 ID 리스트
 * @returns username을 key로 하는 lastReadMessageId 맵
 *
 * @example
 * const map = createUserLastReadMessageIdMap(userList, userInitReadList);
 * // { "user1": 123, "user2": null }
 */
export const createUserLastReadMessageIdMap = (
  userList: User[],
  userInitReadList: UserLastReadMessageId[],
): UserLastReadMessageIdMap => {
  return userList.reduce((acc, user) => {
    acc[user.username] =
      userInitReadList.find((item) => item.userId === user.userId)
        ?.lastReadMessageId ?? null;
    return acc;
  }, {} as UserLastReadMessageIdMap);
};

/**
 * 유저 리스트에서 프로필 이미지 맵을 생성합니다.
 *
 * @param userList - 채팅방 유저 리스트
 * @returns username을 key로 하는 프로필 이미지 URL 맵
 *
 * @example
 * const map = createUserImageMap(userList);
 * // { "user1": "https://...", "user2": "" }
 */
export const createUserImageMap = (userList: User[]): UserImageMap => {
  return userList.reduce((acc, user) => {
    acc[user.username] = user.profileImage?.fullFilePath || "";
    return acc;
  }, {} as UserImageMap);
};

/**
 * 유저 리스트에서 이름 맵을 생성합니다.
 *
 * @param userList - 채팅방 유저 리스트
 * @returns username을 key로 하는 이름 맵
 *
 * @example
 * const map = createUserNameMap(userList);
 * // { "user1": "홍길동", "user2": "김철수" }
 */
export const createUserNameMap = (userList: User[]): UserNameMap => {
  return userList.reduce((acc, user) => {
    acc[user.username] = user.name || "";
    return acc;
  }, {} as UserNameMap);
};

/**
 * 채팅방 데이터에서 모든 유저 관련 맵을 한 번에 생성합니다.
 *
 * @param userList - 채팅방 유저 리스트
 * @param userInitReadList - 유저별 마지막 읽은 메시지 ID 리스트
 * @returns 유저 관련 모든 맵을 포함한 객체
 *
 * @example
 * const maps = createChatRoomUserMaps(userList, userInitReadList);
 * // { userLastReadMessageIdMap, userImageMap, userNameMap }
 */
export const createChatRoomUserMaps = (
  userList: User[],
  userInitReadList: UserLastReadMessageId[],
): ChatRoomUserMaps => {
  return {
    userLastReadMessageIdMap: createUserLastReadMessageIdMap(
      userList,
      userInitReadList,
    ),
    userImageMap: createUserImageMap(userList),
    userNameMap: createUserNameMap(userList),
  };
};
