"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { Toast } from "@/shared/store";

import { createPersonalChatRoom } from "../api";

type OpenPersonalChatOptions = {
  /** 라우팅 직전에 호출 (예: 프로필 모달 닫기) */
  onBeforeNavigate?: () => void;
};

/** 1:1 채팅방 생성 후 `/chats/r/...` 로 이동 — 프로필 모달·친구 목록 등에서 공통 사용 */
export function useOpenPersonalChatNavigation() {
  const router = useRouter();
  const [isPending, setPending] = useState(false);

  const openPersonalChat = useCallback(
    async (receiverName: string, options?: OpenPersonalChatOptions) => {
      setPending(true);
      try {
        const res = await createPersonalChatRoom({ receiverName });
        const roomUUID = (res as { roomUUID?: string })?.roomUUID;
        if (roomUUID) {
          options?.onBeforeNavigate?.();
          router.push(`/chats/r/${roomUUID}`);
        } else {
          Toast.show({ message: "채팅방을 열 수 없습니다.", type: "error" });
        }
      } catch {
        Toast.show({ message: "채팅방을 열 수 없습니다.", type: "error" });
      } finally {
        setPending(false);
      }
    },
    [router]
  );

  return { openPersonalChat, isPending };
}
