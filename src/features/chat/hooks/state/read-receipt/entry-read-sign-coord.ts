import type { RefObject } from "react";

export type EntryReadSignCoord = {
  roomId: string;
  snapshotCaptured: boolean;
  readSignHandled: boolean;
  postEntryPublished: boolean;
};

export type EntryReadSignCoordRef = RefObject<EntryReadSignCoord>;

export type EntryReadSignGate = {
  canPublishReadSign: (roomId: string) => boolean;
  markReadSignHandled: () => void;
};

export function createEntryReadSignCoord(roomId: string): EntryReadSignCoord {
  return {
    roomId,
    snapshotCaptured: false,
    readSignHandled: false,
    postEntryPublished: false,
  };
}

export function resetEntryReadSignCoord(
  coordRef: EntryReadSignCoordRef,
  roomId: string
): void {
  coordRef.current = createEntryReadSignCoord(roomId);
}

export function markEntrySnapshotCaptured(
  coordRef: EntryReadSignCoordRef,
  roomId: string
): void {
  if (!isEntryReadSignRoom(coordRef, roomId)) {
    return;
  }

  coordRef.current.snapshotCaptured = true;
}

export function hasEntryReadSignHandled(
  coordRef: EntryReadSignCoordRef
): boolean {
  return coordRef.current.readSignHandled;
}

export function markEntryReadSignHandled(
  coordRef: EntryReadSignCoordRef
): void {
  coordRef.current.readSignHandled = true;
}

export function hasPostEntryReadSignPublished(
  coordRef: EntryReadSignCoordRef
): boolean {
  return coordRef.current.postEntryPublished;
}

/** post-entry effect idempotency — 실제 readSign 호출 여부와 무관 */
export function markPostEntryReadSignPublished(
  coordRef: EntryReadSignCoordRef
): void {
  coordRef.current.postEntryPublished = true;
}
export function createEntryReadSignGate(
  coordRef: EntryReadSignCoordRef
): EntryReadSignGate {
  return {
    canPublishReadSign: (roomId) =>
      isEntryReadSignRoom(coordRef, roomId) &&
      coordRef.current.snapshotCaptured,
    markReadSignHandled: () => {
      markEntryReadSignHandled(coordRef);
    },
  };
}

function isEntryReadSignRoom(
  coordRef: EntryReadSignCoordRef,
  roomId: string
): boolean {
  return coordRef.current.roomId === roomId;
}
