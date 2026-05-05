"use client";
import React, { useEffect, useRef, useState } from "react";

import { throttle } from "lodash";

import getScrollableParent from "@/shared/lib/getScrollableParent";

import { SCROLL_RELEASE_DELAY_MS, SCROLL_THROTTLE_MS } from "../../constants";
import { CHAT_ROOM_Z_INDEX } from "../../constants/ui.constants";

const DateItem = ({ date, onClick }: { date: string; onClick?: () => void }) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const itemRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!itemRef.current) return;

    const scrollableParent = getScrollableParent(itemRef.current);
    if (!scrollableParent) return;

    let scrollReleaseTimeout: ReturnType<typeof setTimeout> | null = null;

    const scrollHandler = throttle(() => {
      setIsScrolling(true);

      if (scrollReleaseTimeout) clearTimeout(scrollReleaseTimeout);
      scrollReleaseTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, SCROLL_RELEASE_DELAY_MS);
    }, SCROLL_THROTTLE_MS);

    scrollableParent.addEventListener("scroll", scrollHandler);

    return () => {
      scrollableParent.removeEventListener("scroll", scrollHandler);
      if (scrollReleaseTimeout) clearTimeout(scrollReleaseTimeout);
    };
  }, []);

  return (
    <li
      className={`h-[24px] ${isScrolling ? "sticky top-0 bg-transparent" : ""}`}
      ref={itemRef}
      style={
        isScrolling ? { zIndex: CHAT_ROOM_Z_INDEX.stickyDate } : undefined
      }
    >
      <div className="h-full flex flex-row justify-center items-end">
        <button
          type="button"
          className="text-grey-500 bg-grey-100 px-[8px] h-full flex items-center rounded-[4px] leading-[13px] text-[11px] lg:text-[13px]"
          onClick={onClick}
        >
          {date}
        </button>
      </div>
    </li>
  );
};

export default React.memo(DateItem);

