"use client";

import { useLayoutEffect, useMemo, useRef } from "react";

import {
  createEntryReadSignCoord,
  createEntryReadSignGate,
  type EntryReadSignCoordRef,
  type EntryReadSignGate,
  resetEntryReadSignCoord,
} from "./entry-read-sign-coord";

export function useEntryReadSignRuntime(roomId: string): {
  coordRef: EntryReadSignCoordRef;
  gate: EntryReadSignGate;
} {
  const coordRef = useRef(createEntryReadSignCoord(roomId));
  const gate = useMemo(() => createEntryReadSignGate(coordRef), []);

  useLayoutEffect(() => {
    resetEntryReadSignCoord(coordRef, roomId);
  }, [roomId]);

  return { coordRef, gate };
}
