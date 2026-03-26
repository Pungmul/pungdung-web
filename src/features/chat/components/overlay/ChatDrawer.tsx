"use client";

import React, { useCallback } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";

import { AnimatePresence, motion, PanInfo, useAnimate } from "framer-motion";

import { buildUserProfileOpenPayload } from "@/features/friends";
import { myPageQueries } from "@/features/my-page";
import { Member, User, userProfileModalStore } from "@/features/user";

import { Header } from "@/shared/components";

import {
  ChatExitButton,
  ChatMemberList,
  ChatSettingsButton,
} from "../ui";

interface ChatDrawerProps {
  drawerOpen: boolean;
  onClose: () => void;
  onExitChat: () => void;
  userList: User[];
  onInviteUser: () => void;
  onOpenSettings: () => void;
}

/** 채팅방 `userInfoList`는 오래될 수 있어, 본인 모달에는 최신 `Member`로 덮어쓴다. */
function mergeMemberIntoUserForSelfModal(roomUser: User, member: Member): User {
  return {
    ...roomUser,
    username: member.username,
    name: member.name,
    profileImage: member.profile,
    clubName: member.clubName,
  } as User;
}

export const ChatDrawer = ({
  drawerOpen,
  onClose,
  onExitChat,
  userList,
  onInviteUser,
  onOpenSettings,
}: ChatDrawerProps) => {
  const { data: myInfo } = useSuspenseQuery(myPageQueries.info());

  const handleMemberProfileClick = useCallback(async (user: User) => {
    const me = myInfo;
    // 본인 정보가 없으면 모달을 우선 열지 않는다.
    if (!me) return;
    if (user.username === me.username) {
      userProfileModalStore.getState().open({
        user: mergeMemberIntoUserForSelfModal(user, me),
        relationship: "self",
      });
      return;
    }
    // 본인이 아니면 일반 프로필 모달을 연다.
    const payload = await buildUserProfileOpenPayload(user);
    userProfileModalStore.getState().open(payload);
  }, [myInfo]);


  // useAnimate 훅으로 애니메이션 제어
  const [containerScope, animateContainer] = useAnimate<HTMLDivElement>();
  const [backdropScope, animateBackdrop] = useAnimate<HTMLDivElement>();

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.x > 80 || info.velocity.x > 500) {
        onClose();
      } else {
        // 임계점 도달 실패 시 명시적으로 완전히 열린 상태로 애니메이션
        animateContainer(
          containerScope.current,
          { x: 0 },
          { duration: 0.3, ease: "easeOut" }
        );
        animateBackdrop(
          backdropScope.current,
          { opacity: 1 },
          { duration: 0.3, ease: "easeOut" }
        );
      }
    },
    [onClose, animateContainer, animateBackdrop, containerScope, backdropScope]
  );

  return (
    <AnimatePresence mode="sync">
      {drawerOpen && (
        <motion.div
          key={"chat-drawer-backdrop"}
          ref={backdropScope}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute top-0 left-0 w-full h-app z-10"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        />
      )}
      {drawerOpen && (
        <motion.div
          ref={containerScope}
          key={"chat-drawer"}
          drag="x"
          dragListener={true}
          dragDirectionLock
          dragElastic={0}
          onDragEnd={handleDragEnd}
          dragConstraints={{ left: 0 }}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute top-0 right-0 w-full max-w-[360px] md:max-w-[420px] h-full bg-background flex flex-col z-50"
          style={{ touchAction: "none" }}
        >
          <div style={{ touchAction: "none" }} className="w-full">
            <Header title={"상세 정보"} onLeftClick={onClose} />
          </div>
          <div className="flex flex-col flex-grow">
            <ChatMemberList
              userList={userList}
              currentUsername={myInfo?.username ?? ""}
              onInviteUser={onInviteUser}
              onMemberProfileClick={handleMemberProfileClick}
            />
            <ChatExitButton onClick={onExitChat} />
          </div>
          <ChatSettingsButton onClick={onOpenSettings} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(ChatDrawer);
