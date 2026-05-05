"use client";

import React, { useCallback } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";

import { AnimatePresence, motion, PanInfo, useAnimate } from "framer-motion";

import { myPageQueries } from "@/features/my-page";
import { User } from "@/features/user";

import { Header } from "@/shared/components";

import { CHAT_ROOM_Z_INDEX } from "../../constants/ui.constants";
import { useChatMemberProfileClick } from "../../hooks/actions";
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

export const ChatDrawer = ({
  drawerOpen,
  onClose,
  onExitChat,
  userList,
  onInviteUser,
  onOpenSettings,
}: ChatDrawerProps) => {
  const { data: myInfo } = useSuspenseQuery(myPageQueries.info());
  const { openChatMemberProfile } = useChatMemberProfileClick();

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
          className="absolute top-0 left-0 w-full h-app"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: CHAT_ROOM_Z_INDEX.drawerBackdrop,
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
          className="absolute top-0 right-0 w-full max-w-[360px] md:max-w-[420px] h-full bg-background flex flex-col touch-none"
          style={{
            zIndex: CHAT_ROOM_Z_INDEX.drawer,
          }}
        >
          <div style={{ touchAction: "none" }} className="w-full">
            <Header title={"상세 정보"} onLeftClick={onClose} />
          </div>
          <div className="flex flex-col flex-grow">
            <ChatMemberList
              userList={userList}
              currentUsername={myInfo?.username ?? ""}
              onInviteUser={onInviteUser}
              onMemberProfileClick={openChatMemberProfile}
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
