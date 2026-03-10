"use client";

import React, { useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";

import { createPersonalChatRoom } from "@/features/chat";
import {
  useAcceptFriendMutation,
  useRequestFriendMutation,
} from "@/features/friends";
import type { ProfileImage, User } from "@/features/user";

import { Toast } from "@/shared/store";
import { userProfileModalStore } from "@/shared/store/userProfileModal.store";

import { UserProfileCardModal } from "./UserProfileCardModal";

/**
 * 백엔드가 `profile`·`clubName`만 주고 `profileImage`·`name`이 비는 경우가 있어
 * 모달·친구 API에 넘기기 전에 `User` 형태로 맞춘다.
 */
function normalizeUserForProfileModal(user: User): User {
  const u = user as User & { profile?: ProfileImage | null; clubName?: string };
  const profileImage = u.profileImage ?? u.profile;
  const name =
    (typeof u.name === "string" && u.name.trim().length > 0
      ? u.name.trim()
      : typeof u.clubName === "string" && u.clubName.trim().length > 0
        ? u.clubName.trim()
        : u.username) || u.username;

  return {
    userId: u.userId,
    username: u.username,
    name,
    profileImage: profileImage ?? u.profileImage,
  } as User;
}

/** 친구·채팅 화면에서 프로필 모달(스토어 구독)을 한 번 마운트한다. */
export function UserProfileCardModalHost() {
  const isOpen = userProfileModalStore((s) => s.isOpen);
  const user = userProfileModalStore((s) => s.user);
  const relationship = userProfileModalStore((s) => s.relationship);
  const incomingFriendRequestId = userProfileModalStore((s) => s.incomingFriendRequestId);
  const close = userProfileModalStore((s) => s.close);

  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: requestFriend, isPending: isRequestPending } =
    useRequestFriendMutation();
  const { mutate: acceptFriend, isPending: isAcceptPending } =
    useAcceptFriendMutation();

  const [isChatPending, setChatPending] = React.useState(false);

  const modalUser = useMemo(
    () => (user ? normalizeUserForProfileModal(user) : null),
    [user],
  );

  const handleRequestFriend = useCallback(() => {
    if (!modalUser) return;
    requestFriend(modalUser.username, {
      onSuccess: (ok) => {
        if (ok) {
          Toast.show({ message: "친구 신청을 보냈습니다.", type: "success" });
          close();
          return;
        }
        Toast.show({ message: "친구 신청에 실패했습니다.", type: "error" });
      },
    });
  }, [modalUser, requestFriend, close]);

  const handleAccept = useCallback(() => {
    if (incomingFriendRequestId == null) return;
    acceptFriend(incomingFriendRequestId, {
      onSuccess: (ok) => {
        if (ok) {
          void queryClient.invalidateQueries({ queryKey: ["findFriends"] });
          Toast.show({ message: "친구 요청을 수락했습니다.", type: "success" });
          close();
          return;
        }
        Toast.show({ message: "수락에 실패했습니다.", type: "error" });
      },
    });
  }, [acceptFriend, incomingFriendRequestId, close, queryClient]);

  const handleOpenChat = useCallback(async () => {
    if (!modalUser) return;
    setChatPending(true);
    try {
      const res = await createPersonalChatRoom({
        receiverName: modalUser.username,
      });
      const roomUUID = (res as { roomUUID?: string })?.roomUUID;
      if (roomUUID) {
        close();
        router.push(`/chats/r/${roomUUID}`);
      } else {
        Toast.show({ message: "채팅방을 열 수 없습니다.", type: "error" });
      }
    } catch {
      Toast.show({ message: "채팅방을 열 수 없습니다.", type: "error" });
    } finally {
      setChatPending(false);
    }
  }, [modalUser, router, close]);

  const handleReport = useCallback(() => {
    Toast.show({
      message: "신고 기능은 준비 중입니다.",
      type: "success",
    });
  }, []);

  const handleBlock = useCallback(() => {
    Toast.show({
      message: "차단 기능은 준비 중입니다.",
      type: "success",
    });
  }, []);

  const handleOpenEditProfile = useCallback(() => {
    close();
    router.push("/my-page/edit");
  }, [close, router]);

  if (typeof document === "undefined" || !isOpen || !modalUser) {
    return null;
  }

  return createPortal(
    <UserProfileCardModal
      isOpen={isOpen}
      onClose={close}
      user={modalUser}
      relationship={relationship}
      onRequestFriend={handleRequestFriend}
      onAcceptIncomingRequest={handleAccept}
      onOpenPersonalChat={handleOpenChat}
      onOpenEditProfile={handleOpenEditProfile}
      onReport={handleReport}
      onBlock={handleBlock}
      isRequestPending={isRequestPending}
      isAcceptPending={isAcceptPending}
      isChatPending={isChatPending}
    />,
    document.body
  );
}
