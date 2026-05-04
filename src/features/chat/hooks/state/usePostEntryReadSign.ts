"use client";

import { useEffect } from "react";

import type { EntryReadSignCoordRef } from "./entry-read-sign-coord";
import {
  hasEntryReadSignHandled,
  hasPostEntryReadSignPublished,
  markEntryReadSignHandled,
  markPostEntryReadSignPublished,
} from "./entry-read-sign-coord";
import { resolveLatestNumericMessageIdFromList } from "../../services/resolve-latest-numeric-message-id-from-list.service";
import type { ReadSignFn } from "../../socket/read-sign.types";
import type { Message, PendingMessage } from "../../types";

type UsePostEntryReadSignParams = {
  isEntrySnapshotCaptured: boolean;
  messageList: readonly (Message | PendingMessage)[];
  readSign: ReadSignFn;
  coordRef: EntryReadSignCoordRef;
};

/**
 * 진입 스냅샷 확정 후 room 진입당 1회 readSign한다.
 * 스냅샷 전 readSign이 room query 읽음 위치를 오염시키는 타이밍 버그를 방지한다.
 */
export function usePostEntryReadSign({
  isEntrySnapshotCaptured,
  messageList,
  readSign,
  coordRef,
}: UsePostEntryReadSignParams): void {
  useEffect(() => {
    if (!isEntrySnapshotCaptured) {
      return;
    }

    if (hasPostEntryReadSignPublished(coordRef)) {
      return;
    }

    if (hasEntryReadSignHandled(coordRef)) {
      markPostEntryReadSignPublished(coordRef);
      return;
    }

    markPostEntryReadSignPublished(coordRef);

    const latestMessageId = resolveLatestNumericMessageIdFromList(messageList);
    markEntryReadSignHandled(coordRef);
    if (latestMessageId !== null) {
      readSign({ upToMessageId: latestMessageId });
      return;
    }

    readSign();
  }, [isEntrySnapshotCaptured, messageList, readSign, coordRef]);
}
