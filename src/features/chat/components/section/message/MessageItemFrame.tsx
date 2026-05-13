"use client";

import React from "react";

import DateItem from "./DateItem";
import { CHAT_MESSAGE_ITEM_DATA_ATTR } from "../../../constants/ui.constants";

interface MessageItemFrameProps {
  displayDate: string;
  dateKey: string;
  isSameDate: boolean;
  onDateClick: (dateKey: string) => void;
  dateRef: ((el: HTMLLIElement | null) => void) | undefined;
  className?: string;
  children: React.ReactNode;
}

export function MessageItemFrame({
  displayDate,
  dateKey,
  isSameDate,
  onDateClick,
  dateRef,
  className,
  children,
}: MessageItemFrameProps) {
  return (
    <React.Fragment>
      {!isSameDate ? (
        <DateItem date={displayDate} onClick={() => onDateClick(dateKey)} />
      ) : null}
      <li
        {...{ [CHAT_MESSAGE_ITEM_DATA_ATTR]: true }}
        className={className}
        ref={dateRef}
      >
        {children}
      </li>
    </React.Fragment>
  );
}
