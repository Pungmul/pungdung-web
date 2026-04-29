# runtime/transport

Main thread와 Worker 간 **postMessage 어댑터**입니다. `WorkerTransport` 인터페이스를 구현합니다.

## 파일

| 파일 | 책임 |
|------|------|
| `index.ts` | transport export + feature detection helpers |
| `dedicated-worker-transport.ts` | `new Worker(url)` — 탭 전용 worker |
| `shared-worker-transport.ts` | `new SharedWorker(url)` — 탭 간 공유 hub |
| `worker-urls.ts` | 기본 URL(`/socket-worker.js`, `/dedicated-worker.js`) resolve·지원 여부 검사 |

## `WorkerTransport` 계약

```ts
interface WorkerTransport {
  readonly mode: "shared" | "dedicated";
  postMessage(message: CommandEnvelope): void;
  setMessageHandler(handler: (response: ResponseEnvelope) => void): void;
  dispose(): void;
}
```

## Feature detection

| 함수 | 설명 |
|------|------|
| `isSharedWorkerSupported()` | `SharedWorker` 생성 가능 여부 |
| `isDedicatedWorkerSupported()` | `Worker` 생성 가능 여부 |
| `resolveWorkerUrls(options)` | 앱에서 주입한 URL과 기본값 병합 |

## 빌드 산출물

`scripts/build-workers.mjs`가 `workers/` 엔트리를 앱 `public/`에 번들합니다. transport는 해당 정적 URL을 로드합니다.
