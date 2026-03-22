"use client";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { CheckIcon } from "@heroicons/react/24/outline";
import { XCircleIcon } from "@heroicons/react/24/solid";

import {
  type AcceptedFriendEntry,
  friendQueries,
} from "@/features/friends";
import { User } from "@/features/user";

import { Button, Modal, Spinner, Toast } from "@/shared";

import { createMultiChatRoom } from "../../api";
import { chatMutationOptions, chatQueries } from "../../queries";

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  currentUsernames: string[]; // 채팅방에 이미 있는 유저들의 username 리스트
  /** true면 기존 다인 방에 초대, false면 1대1 → 새 다인 방 생성 후 이동 */
  isGroupRoom: boolean;
  myUsername: string;
}

export default function InviteUserModal({
  isOpen,
  onClose,
  roomId,
  currentUsernames,
  isGroupRoom,
  myUsername,
}: InviteUserModalProps) {
  const router = useRouter();
  const { data: friends, isLoading } = useQuery(friendQueries.loadMyFriends());
  const { mutate: inviteUser, isPending } = useMutation(
    chatMutationOptions.inviteUser(),
  );
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isMultiCreatePending, setIsMultiCreatePending] = useState(false);
  const queryClient = useQueryClient();

  const inviteBusy = isPending || isMultiCreatePending;

  const handleRemoveUser = useCallback((user: User) => {
    setSelectedUsers((prev) =>
      prev.filter((u) => u.username !== user.username)
    );
  }, []);
  const handleToggleUser = useCallback((user: User) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u.username === user.username)
        ? prev.filter((u) => u.username !== user.username)
        : [...prev, user]
    );
  }, []);

  const handleClose = useCallback(() => {
    onClose();
    setSelectedUsers([]);
  }, [onClose]);

  const handleInvite = useCallback(() => {
    if (selectedUsers.length === 0) return;

    if (!isGroupRoom) {
      void (async () => {
        setIsMultiCreatePending(true);
        try {
          const others = currentUsernames.filter((u) => u !== myUsername);
          const invited = selectedUsers.map((user) => user.username);
          const receiverNameList = [...new Set([...others, ...invited])];

          const { roomUUID } = await createMultiChatRoom({ receiverNameList });

          setSelectedUsers([]);
          handleClose();
          Toast.show({
            message: "그룹 채팅방이 생성되었습니다.",
            type: "success",
          });
          await queryClient.invalidateQueries({
            queryKey: chatQueries.roomInfinite(roomUUID).queryKey,
          });
          await queryClient.invalidateQueries({
            queryKey: chatQueries.room(roomUUID).queryKey,
          });
          await queryClient.invalidateQueries({
            queryKey: chatQueries.roomList().queryKey,
          });
          router.replace(`/chats/r/${roomUUID}`);
        } catch (e) {
          Toast.show({
            message:
              e instanceof Error
                ? e.message
                : "그룹 채팅방을 만들지 못했습니다.",
            type: "error",
          });
        } finally {
          setIsMultiCreatePending(false);
        }
      })();
      return;
    }

    inviteUser(
      {
        roomId,
        data: { newUsernameList: selectedUsers.map((user) => user.username) },
      },
      {
        onSuccess: async (_, { roomId: targetRoomId }) => {
          setSelectedUsers([]);
          handleClose();
          Toast.show({
            message: "사용자 초대에 성공했습니다.",
            type: "success",
          });
          await queryClient.invalidateQueries({
            queryKey: chatQueries.roomInfinite(targetRoomId).queryKey,
          });
          await queryClient.invalidateQueries({
            queryKey: chatQueries.room(targetRoomId).queryKey,
          });
          await queryClient.invalidateQueries({
            queryKey: chatQueries.roomList().queryKey,
          });
        },
        onError: () => {
          Toast.show({ message: "사용자 초대에 실패했습니다.", type: "error" });
        },
      }
    );
  }, [
    roomId,
    selectedUsers,
    inviteUser,
    handleClose,
    queryClient,
    isGroupRoom,
    currentUsernames,
    myUsername,
    router,
  ]);

  // 모달이 닫힐 때 선택 초기화
  useEffect(() => {
    if (!isOpen) {
      setSelectedUsers([]);
    }
  }, [isOpen]);

  const acceptedFriends = friends?.acceptedFriendList || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="친구 초대">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="text-sm text-gray-500">초대할 친구를 선택하세요</div>
        </div>

        <div className="w-full h-96 overflow-y-auto border border-grey-200 rounded-md">
          {isLoading ? (
            <div className="flex flex-col flex-grow justify-center items-center h-full">
              <Spinner />
            </div>
          ) : acceptedFriends.length > 0 ? (
            <ul className="flex flex-col list-none">
              {acceptedFriends.map((friend: AcceptedFriendEntry) => {
                const isInRoom = currentUsernames.includes(
                  friend.user.username
                );
                const isSelected = selectedUsers.some(
                  (u) => u.username === friend.user.username
                );

                return (
                  <li key={friend.friendRequestId}>
                    <InviteFriendItem
                      friend={friend}
                      isInRoom={isInRoom}
                      isSelected={isSelected}
                      onToggle={handleToggleUser}
                    />
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-grey-500">친구가 없습니다</p>
            </div>
          )}
        </div>

        <div className="h-8 flex flex-row gap-2 overflow-x-auto">
          {selectedUsers.map((user) => (
            <div
              key={user.username}
              className="p-1 bg-grey-200 rounded-md flex flex-row items-center gap-2"
            >
              <div className="size-6 border-grey-400 relative rounded-md overflow-hidden">
                <Image
                  src={user.profileImage.fullFilePath}
                  alt="user"
                  fill
                  loading="lazy"
                />
              </div>
              <div className="text-sm text-grey-700">{user.name}</div>
              <span className="size-5 flex items-center justify-center cursor-pointer">
                <XCircleIcon
                  className="size-full text-grey-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveUser(user);
                  }}
                />
              </span>
            </div>
          ))}
        </div>
        <div className="flex flex-row gap-2 justify-between items-center">
          {selectedUsers.length > 0 && (
            <div className="text-sm text-grey-600">
              <span className="font-semibold text-primary"> {selectedUsers.length}</span> 명 선택됨
            </div>
          )}
          <div className="flex gap-2 justify-end flex-grow">
            <Button
              onClick={handleClose}
              disabled={inviteBusy}
              className="w-auto px-4 py-2 text-sm border bg-background text-grey-400 border-grey-300 rounded-md hover:bg-grey-100 disabled:bg-grey-200 disabled:text-grey-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              취소
            </Button>
            <Button
              onClick={handleInvite}
              disabled={selectedUsers.length === 0 || inviteBusy}
              className="w-auto px-4"
            >
              {inviteBusy ? "초대 중..." : "초대하기"}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

interface InviteFriendItemProps {
  friend: AcceptedFriendEntry;
  isInRoom: boolean;
  isSelected: boolean;
  onToggle: (user: User) => void;
}

const InviteFriendItem: React.FC<InviteFriendItemProps> = ({
  friend,
  isInRoom,
  isSelected,
  onToggle,
}) => {
  const user = friend.user;

  return (
    <div
      className={`flex h-16 py-1 px-4 flex-row items-center justify-between ${isInRoom
          ? "cursor-not-allowed opacity-80"
          : "hover:bg-grey-100 cursor-pointer"
        }`}
      onClick={() => !isInRoom && onToggle(user)}
      role="button"
      tabIndex={isInRoom ? -1 : 0}
      onKeyDown={(e) => {
        if (!isInRoom && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onToggle(user);
        }
      }}
    >
      <div className="flex flex-row items-center gap-4">
        <div className="w-12 h-12 bg-grey-200 relative rounded-full overflow-hidden">
          <Image
            src={user.profileImage.fullFilePath}
            alt={user.profileImage.originalFilename}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center">
          <div className="text-base font-semibold">{user.name}</div>
          <div className="text-xs text-grey-400">{user.username}</div>
        </div>
      </div>

      <div>
        {isInRoom ? (
          <div className="text-xs px-3 py-1.5 bg-grey-500 text-background rounded-md">
            참여 중
          </div>
        ) : (
          <div
            className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${isSelected
                ? "bg-blue-500 border-blue-500"
                : "border-grey-400 bg-background"
              }`}
          >
            {isSelected && (
              <span className="size-4 flex items-center justify-center">
                <CheckIcon className="size-full text-background" />
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
