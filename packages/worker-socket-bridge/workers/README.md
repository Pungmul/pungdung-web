# workers

esbuild로 번들되어 앱 `public/`에 배포되는 **Worker 엔트리**입니다. 브라우저가 로드하는 실제 JS 파일의 소스입니다.

## 파일

| 파일 | 책임 |
|------|------|
| `socket-worker.ts` | **SharedWorker** 엔트리 — `connect` 이벤트로 `MessagePort` 수신 → hub 연결 |
| `dedicated-worker.ts` | **Dedicated Worker** 엔트리 — `createStompSession` + `postMessage` 루프 |
| `shared-stomp-hub.ts` | SharedWorker용 멀티 탭 STOMP hub — 토픽 fan-out·클라이언트별 큐 |
| `shared/worker-message-types.ts` | Worker 내부용 타입 re-export·hub 전용 큐 타입 |
| `shared/message-utils.ts` | Worker 간 공유 메시지 유틸 |

## 하위 모듈

| 폴더 | 설명 |
|------|------|
| `shared/` | Worker 전용 타입·유틸 (protocol re-export + hub 큐 구조) |

## 런타임 매핑

| Worker 파일 | Runtime mode | Transport |
|-------------|--------------|-----------|
| `socket-worker.js` | `shared` | `SharedWorkerTransport` |
| `dedicated-worker.js` | `dedicated` | `DedicatedWorkerTransport` |

## Dedicated Worker 메시지 루프

```text
main postMessage(CommandEnvelope)
  → dedicated-worker: PING이면 즉시 PONG + probe
  → 그 외 session.handleCommand
  → session emit → postMessage(ResponseEnvelope)
```

## Shared Worker

- 탭마다 `MessagePort` 연결
- STOMP 연결·토픽 구독은 hub에서 단일화
- inbound `MESSAGE`는 구독 중인 클라이언트 port로 fan-out

## 빌드

`scripts/build-workers.mjs`가 `socket-worker.ts`, `dedicated-worker.ts`를 번들합니다. `tsconfig.workers.json`으로 worker 전용 typecheck를 수행합니다.
