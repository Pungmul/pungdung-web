# @pungdung/worker-socket-bridge

Worker 기반 STOMP 소켓 브리지 패키지입니다. 메인 스레드에서 `SocketManager`로 연결·구독·발행을 제어하고, STOMP 세션은 Dedicated Worker / SharedWorker / Main Thread 런타임 중 하나에서 실행됩니다.

## 패키지 구조

```text
worker-socket-bridge/
├── src/
│   ├── protocol/     # 메인↔워커 메시지 계약 (타입·envelope)
│   ├── rpc/          # commandId 기반 RPC 브리지
│   ├── runtime/      # Worker / Main-thread 실행 환경
│   ├── client/       # SocketManager 및 도메인 조립
│   └── react/        # React Provider·hooks·복구 정책
├── stomp/            # STOMP 세션·전송·liveness (워커 내부)
├── workers/          # 번들 대상 Worker 엔트리
├── scripts/          # Worker 빌드 스크립트
└── docs/             # VitePress 문서 사이트
```

## Public API

| Export path | 용도 |
|-------------|------|
| `@pungdung/worker-socket-bridge` | `SocketManager`, `TopicBuffer`, RPC, Runtime |
| `@pungdung/worker-socket-bridge/react` | Provider, hooks, foreground reconnect |
| `@pungdung/worker-socket-bridge/protocol` | Envelope·상태 타입 |
| `@pungdung/worker-socket-bridge/runtime` | Runtime factory·transport |

## 빠른 시작

```ts
import { SocketManager } from "@pungdung/worker-socket-bridge";

const manager = new SocketManager({ dedicatedWorkerUrl: "/dedicated-worker.js" });

await manager.connect({
  url: "https://example.com/ws",
  headers: { Authorization: "Bearer …" },
});

const listener = await manager.subscribe("/topic/chat", (message) => {
  console.log(message);
});

await manager.sendMessage("/topic/chat", { text: "hello" });
listener.unsubscribe();
await manager.disconnect();
```

React 앱에서는 `@pungdung/worker-socket-bridge/react`의 `SocketManagerProvider`와 hooks를 사용합니다.

## 스크립트

| 명령 | 설명 |
|------|------|
| `yarn build:workers` | `workers/` → 앱 `public/*.js` 번들 |
| `yarn build:workers:watch` | Worker 번들 watch 모드 |
| `yarn docs:sync` | README → docs/modules 동기화 |
| `yarn docs:dev` | VitePress 개발 서버 (`predocs:dev`로 자동 sync) |
| `yarn docs:build` | VitePress 정적 사이트 빌드 |
| `yarn docs:preview` | 빌드 결과 미리보기 |

## 문서

- 각 모듈 폴더의 `README.md` — 파일별 책임 정리 (단일 소스)
- `yarn docs:sync` — README → VitePress `docs/modules/` 동기화
- `yarn docs:dev` — 아키텍처 다이어그램·탐색 가능한 문서 사이트

## 데이터 흐름 (요약)

```text
React hooks / App
    ↓
SocketManager (client/)
    ↓ createSocketBridge (rpc/)
    ↓ dispatch
SocketRuntime (runtime/) ──postMessage──► Worker / STOMP (workers/, stomp/)
    ↑ handleResponse / push
SocketPushHandler → SocketSubscriptions → listener callback
```
