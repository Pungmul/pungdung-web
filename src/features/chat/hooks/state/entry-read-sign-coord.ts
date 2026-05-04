import type { MutableRefObject } from "react";

/**
 * ## STATE MACHINE — entry readSign coordination
 *
 * Room 진입 시 readSign 발화 순서·중복을 coord ref 한 곳에서 조율한다.
 * React state가 아닌 mutable ref 플래그이므로, 전이는 아래 helper를 통해서만 일어난다.
 *
 * ### Flags (per room entry, reset on roomId change via `resetEntryReadSignCoord`)
 *
 * | Flag | Meaning |
 * | --- | --- |
 * | `roomId` | 현재 coord가 대상으로 하는 채팅방. room 전환 시 전체 reset. |
 * | `snapshotCaptured` | 진입 시점 읽음 위치·미읽음 여부 스냅샷 확정됨. readSign gate 전제. |
 * | `readSignHandled` | 이번 room 진입에서 readSign이 **한 번이라도** 발화됨 (어떤 경로든). |
 * | `postEntryPublished` | `usePostEntryReadSign` effect가 post-entry 경로를 **처리 완료**함 (실제 readSign 호출 여부와 무관). |
 *
 * ### Transition table
 *
 * | From | Event | Guard | Action | To |
 * | --- | --- | --- | --- | --- |
 * | initial | room enter / roomId change | — | `resetEntryReadSignCoord` | all flags false |
 * | initial | entry snapshot captured | room query stable + messages exist + roomId match | `markEntrySnapshotCaptured` | `snapshotCaptured=true` |
 * | snapshotCaptured | post-entry effect runs | `!postEntryPublished` && `!readSignHandled` | publish readSign + `markEntryReadSignHandled` + `markPostEntryReadSignPublished` | handled + postEntry done |
 * | snapshotCaptured | post-entry effect runs | `!postEntryPublished` && `readSignHandled` (socket/gated 선행) | `markPostEntryReadSignPublished` only | postEntry done, no duplicate readSign |
 * | snapshotCaptured | gated user action / socket append | `gate.canPublishReadSign(roomId)` | `markReadSignHandled` + readSign | `readSignHandled=true` |
 * | any | mutate flag | `roomId !== coord.roomId` | no-op (guard) | unchanged |
 *
 * ### Gate invariant (`createEntryReadSignGate`)
 *
 * `canPublishReadSign(roomId)` === roomId match **AND** `snapshotCaptured`.
 * 스냅샷 전 readSign은 room query 읽음 위치를 오염시키므로 반드시 차단한다.
 *
 * ### Consumer mapping
 *
 * | Hook / module | Coord interaction | Emit condition |
 * | --- | --- | --- |
 * | `useEntryReadSnapshot` | `markEntrySnapshotCaptured` | room query 안정 + messageList 존재 + roomId 일치 |
 * | `usePostEntryReadSign` | `hasPostEntryReadSignPublished`, `hasEntryReadSignHandled`, `markPostEntryReadSignPublished`, `markEntryReadSignHandled` | snapshot 후 1회; socket/gated가 선행 handled면 readSign 생략 |
 * | `useGatedReadSign` | `gate.canPublishReadSign` + `markReadSignHandled` | snapshot 후 사용자 액션(전송 등) readSign |
 * | `useChatRoomSocketMessages` | 동일 gate (runtime stable `gate` 주입) | 실시간 수신 시 gate 통과 |
 * | `useEntryReadSignRuntime` | `createEntryReadSignCoord`, `resetEntryReadSignCoord`, stable `gate` 제공 | roomId 변경 시 coord reset |
 * | `useChatRoomForegroundReconciliation` | **coord 미사용 (예외)** | gap REST 보정 후 bare `readSign()` — 백그라운드·reconnect 경로 |
 *
 * ### Cross-consumer invariants
 *
 * 1. readSign은 `snapshotCaptured` 전에 발화되면 안 된다 (gate 또는 snapshot hook 선행).
 * 2. `postEntryPublished`는 post-entry effect 중복 실행을 막는 idempotency 플래그다.
 * 3. `readSignHandled`가 true이면 post-entry는 readSign을 다시 호출하지 않는다.
 * 4. foreground reconciliation readSign은 coord 밖 — 진입 스냅샷·gate와 독립 (P3 gate 통합 백로그).
 */

export type EntryReadSignCoord = {
  roomId: string;
  snapshotCaptured: boolean;
  readSignHandled: boolean;
  postEntryPublished: boolean;
};

export type EntryReadSignCoordRef = MutableRefObject<EntryReadSignCoord>;

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

/** Room 전환 시 전체 플래그를 initial 상태로 되돌린다. */
export function resetEntryReadSignCoord(
  coordRef: EntryReadSignCoordRef,
  roomId: string
): void {
  coordRef.current = createEntryReadSignCoord(roomId);
}

/** Gate 전제: snapshot 확정 후에만 readSign 경로가 열린다. roomId 불일치 시 no-op. */
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

/** post-entry·gated·socket 중 어느 경로든 readSign 발화 시 true. */
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

/** usePostEntryReadSign effect idempotency — 실제 readSign 호출 여부와 무관. */
export function markPostEntryReadSignPublished(
  coordRef: EntryReadSignCoordRef
): void {
  coordRef.current.postEntryPublished = true;
}

/** snapshotCaptured && roomId match. useEntryReadSignRuntime의 stable gate와 동일 로직. */
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
