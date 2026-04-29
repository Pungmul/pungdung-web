# 시작하기

## 설치

이 패키지는 monorepo workspace 내부 패키지입니다.

```json
{
  "dependencies": {
    "@pungdung/worker-socket-bridge": "0.0.1"
  }
}
```

React hooks를 쓰려면 `react >= 18` peer dependency가 필요합니다.

## Worker 번들

앱 `public/`에 worker 스크립트가 있어야 합니다.

```bash
# 패키지 또는 루트에서
yarn build:workers
```

산출물:

- `public/socket-worker.js` — SharedWorker
- `public/dedicated-worker.js` — Dedicated Worker

## 기본 사용 (Vanilla)

```ts
import { SocketManager } from "@pungdung/worker-socket-bridge";

const manager = new SocketManager({
  sharedWorkerUrl: "/socket-worker.js",
  dedicatedWorkerUrl: "/dedicated-worker.js",
});

await manager.connect({
  url: process.env.NEXT_PUBLIC_SOCKET_URL!,
  headers: { Authorization: `Bearer ${token}` },
});

await manager.subscribe("/topic/example", (payload) => {
  console.log(payload);
});
```

## React 통합

```tsx
import {
  ClientSocketManagerProvider,
  useInitSocketConnect,
  useSocketForegroundReconnect,
  useSocketSubscription,
} from "@pungdung/worker-socket-bridge/react";

function AppSocketLayer({ token, children }) {
  return (
    <ClientSocketManagerProvider>
      <SocketBootstrap token={token} />
      {children}
    </ClientSocketManagerProvider>
  );
}

function SocketBootstrap({ token }) {
  useInitSocketConnect(token, async () => ({
    url: process.env.NEXT_PUBLIC_SOCKET_URL!,
    headers: { Authorization: `Bearer ${token}` },
  }));
  useSocketForegroundReconnect(token, async () => ({
    url: process.env.NEXT_PUBLIC_SOCKET_URL!,
    headers: { Authorization: `Bearer ${token}` },
  }));
  return null;
}
```

## Export 경로

| Path | 내용 |
|------|------|
| `.` | `SocketManager`, RPC, Runtime |
| `./react` | Provider, hooks |
| `./protocol` | Envelope 타입 |
| `./runtime` | Runtime factory |

다음: [아키텍처](./architecture.md)
