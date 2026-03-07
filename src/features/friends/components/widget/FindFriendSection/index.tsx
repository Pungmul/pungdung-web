"use client";

import {
  Suspense,
  useCallback,
  useLayoutEffect,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { FindFriendMobileOverlay } from "./FindFriendMobileOverlay";
import { FindFriendModal } from "./FindFriendModal";
import FindFriendPanel from "./FindFriendPanel";

const MD_MIN_WIDTH = "(min-width: 768px)";

export { default } from "./FindFriendPanel";
export { default as FindFriendSection } from "./FindFriendPanel";
export type { FindFriendShellProps } from "./types";

/**
 * @deprecated 라우트 `/my-page/friends/find` + parallel `@modal` 인터셉트를 사용하세요.
 * (모바일 바텀시트 + 쿼리 `findFriend` 동기화 UI — 레거시)
 */
export function ResponsiveFindFriend() {
  return (
    <Suspense fallback={null}>
      <ResponsiveFindFriendInner />
    </Suspense>
  );
}

function ResponsiveFindFriendInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFindFriend = searchParams.get("findFriend") === "true";

  const [isDesktop, setIsDesktop] = useState(false);

  useLayoutEffect(() => {
    const mql = window.matchMedia(MD_MIN_WIDTH);
    setIsDesktop(mql.matches);

    const onChange = () => setIsDesktop(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const onCloseFindFriend = useCallback(() => {
    router.back();
  }, [router]);

  const shellProps = {
    isOpen: isFindFriend,
    onClose: onCloseFindFriend,
    children: <FindFriendPanel />,
  };

  if (isDesktop) {
    return <FindFriendModal {...shellProps} />;
  }

  return <FindFriendMobileOverlay {...shellProps} />;
}

