# client

앱이 직접 사용하는 **SocketManager**와 그를 구성하는 협력 객체들입니다. Runtime·RPC·구독·probe·상태 스냅샷을 조립해 단일 진입점을 제공합니다.

## 역할

- 연결 생명주기(`connect` / `disconnect` / runtime fallback)
- 토픽 구독·리스너·grace-period 버퍼링
- inbound push 라우팅 및 연결 상태 동기화
- transport 건강 probe 및 복구 신호 발생

## 파일

| 파일 | 책임 |
|------|------|
| `socket-manager.ts` | **진입점** — public API (`connect`, `subscribe`, `sendMessage`, `disconnect`, 상태 조회) |
| `socket-connection.ts` | `SocketConnectionLifecycle` — runtime 생성·fallback·재연결·구독 resync |
| `socket-subscriptions.ts` | 토픽별 리스너·구독 상태·SUBSCRIBE/UNSUBSCRIBE orchestration |
| `socket-push-handler.ts` | Runtime push(`MESSAGE`, `CONNECTION_STATE` 등) 분기·복구 신호 |
| `socket-probe.ts` | `PING` 기반 transport/STOMP 건강 검사·inactivity probe |
| `connection-status-store.ts` | `SocketConnectionStatus` 단일 소스 + 변경 알림 |
| `socket-snapshot.ts` | `use-sync-external-store`용 연결·토픽 readiness 스냅샷 |
| `topic-buffer.ts` | grace period 동안 메시지 버퍼·지연 UNSUBSCRIBE |
| `socket-connection.test.ts` | 연결 생명주기 단위 테스트 |

## `SocketManager` 내부 구성

```text
SocketManager
├── ConnectionStatusStore      # phase / isConnected
├── SocketConnectionLifecycle  # runtime + connect retry
├── createSocketBridge (rpc)   # invoke / post
├── SocketSubscriptions        # topic listeners
├── TopicBuffer                # grace unsubscribe
├── SocketPushHandler          # inbound routing
├── SocketProbe                # health check
└── SocketSnapshotStore        # React 구독용 스냅샷
```

## Public API 요약

| 메서드 | 설명 |
|--------|------|
| `connect(config)` | STOMP 연결 (runtime fallback 포함) |
| `disconnect()` | 연결 종료·pending RPC reject |
| `subscribe(topic, cb)` | 구독 + 리스너 등록 |
| `sendMessage(topic, msg)` | 발행 |
| `getConnectionStatus()` | 현재 연결 상태 |
| `subscribeState(cb)` | 스냅샷 변경 구독 (React hooks용) |
| `onTransportFailure(cb)` | transport 오류·heartbeat lost 복구 훅 |
| `checkConnectionState(opts?)` | 수동 probe / 복구 트리거 |

## 의존 방향

- `protocol`, `rpc`, `runtime`, `stomp`(probe 상수·liveness) 참조
- React에 의존하지 않음 — UI는 `src/react`에서 연결
