"use client";

import { useEffect } from "react";

import type { EntryReadSignCoordRef } from "./entry-read-sign-coord";
import {
  hasEntryReadSignHandled,
  hasPostEntryReadSignPublished,
  markEntryReadSignHandled,
  markPostEntryReadSignPublished,
} from "./entry-read-sign-coord";
import { POST_ENTRY_READ_SIGN_STABILIZE_MS } from "../../../constants";
import { logReadSignDebug } from "../../../lib/read-receipt/read-sign-debug-log";
import { resolveLatestNumericMessageIdFromList } from "../../../services";
import type { ReadSignFn } from "../../../socket/read-sign.types";
import type { Message, PendingMessage } from "../../../types";

type UsePostEntryReadSignParams = {
  isEntrySnapshotCaptured: boolean;
  messageList: readonly (Message | PendingMessage)[];
  readSign: ReadSignFn;
  coordRef: EntryReadSignCoordRef;
};

/**
 * 진입 스냅샷 확정 후 room 진입당 1회 readSign.
 * 스냅샷 전 readSign은 room query 읽음 위치를 오염시킨다.
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

    const timeoutId = setTimeout(() => {
      if (hasPostEntryReadSignPublished(coordRef)) {
        return;
      }

      if (hasEntryReadSignHandled(coordRef)) {
        logReadSignDebug("post_entry.skipped", {
          roomId: coordRef.current.roomId,
          reason: "read_sign_already_handled",
        });
        markPostEntryReadSignPublished(coordRef);
        return;
      }

      const latestMessageId =
        resolveLatestNumericMessageIdFromList(messageList);

      if (latestMessageId === null) {
        logReadSignDebug("post_entry.skipped", {
          roomId: coordRef.current.roomId,
          reason: "missing_target_message_id",
          messageCount: messageList.length,
        });
        return;
      }

      markPostEntryReadSignPublished(coordRef);
      markEntryReadSignHandled(coordRef);
      logReadSignDebug("post_entry.publish", {
        roomId: coordRef.current.roomId,
        latestMessageId,
        messageCount: messageList.length,
      });
      readSign({ upToMessageId: latestMessageId, source: "post-entry" });
    }, POST_ENTRY_READ_SIGN_STABILIZE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isEntrySnapshotCaptured, messageList, readSign, coordRef]);
}
