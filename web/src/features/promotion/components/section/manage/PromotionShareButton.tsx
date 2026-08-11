"use client";

import { useCallback } from "react";

import { ShareIcon } from "@heroicons/react/24/outline";

import { Toast } from "@/shared/store";

export function PromotionShareButton() {
  const handleCopyLink = useCallback(async () => {
    // 현재 상세 path만 복사
    // query, hash 제외
    const shareUrl = `${window.location.origin}${window.location.pathname}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      Toast.show({ message: "링크가 복사되었습니다." });
    } catch {
      Toast.show({
        message: "링크 복사에 실패했습니다.",
        type: "error",
      });
    }
  }, []);

  return (
    <button
      type="button"
      className="flex size-8 p-1.5 items-center justify-center"
      aria-label="공유"
      onClick={handleCopyLink}
    >
      <ShareIcon className="size-full" />
    </button>
  );
}
