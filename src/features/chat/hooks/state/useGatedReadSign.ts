"use client";

import { useCallback } from "react";

import type {
  EntryReadSignCoordRef,
  EntryReadSignGate,
} from "./entry-read-sign-coord";
import { createEntryReadSignGate } from "./entry-read-sign-coord";
import type { ReadSignFn } from "../../socket/read-sign.types";

export type UseGatedReadSignParams = {
  roomId: string;
  readSign: ReadSignFn;
  coordRef: EntryReadSignCoordRef;
  /** Prefer stable gate from `useEntryReadSignRuntime` to avoid per-call allocation. */
  gate?: EntryReadSignGate;
};

export function useGatedReadSign({
  roomId,
  readSign,
  coordRef,
  gate: stableGate,
}: UseGatedReadSignParams): ReadSignFn {
  return useCallback<ReadSignFn>(
    (options) => {
      const entryReadSignGate = stableGate ?? createEntryReadSignGate(coordRef);
      if (!entryReadSignGate.canPublishReadSign(roomId)) {
        return;
      }
      entryReadSignGate.markReadSignHandled();
      readSign(options);
    },
    [coordRef, readSign, roomId, stableGate]
  );
}
