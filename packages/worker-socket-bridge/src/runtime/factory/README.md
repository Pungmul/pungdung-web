# runtime/factory

환경·옵션에 맞는 `SocketRuntime` 인스턴스를 생성하고, **fallback chain**을 관리합니다.

## 파일

| 파일 | 책임 |
|------|------|
| `index.ts` | factory 모듈 export |
| `create-socket-runtime.ts` | `createSocketRuntime(mode)`, `getDefaultRuntimeFallbackChain()`, worker URL resolve |
| `socket-runtime-fallback-controller.ts` | `SocketRuntimeFallbackController` — 실패 시 다음 mode로 교체 |

## `createSocketRuntime`

```ts
createSocketRuntime("shared", { sharedWorkerUrl, dedicatedWorkerUrl })
// → WorkerSocketRuntime(SharedWorkerTransport)
// → WorkerSocketRuntime(DedicatedWorkerTransport)
// → MainThreadSocketRuntime
```

브라우저 Worker API 지원 여부와 mode에 따라 구현체가 결정됩니다.

## `SocketRuntimeFallbackController`

| 메서드 | 책임 |
|--------|------|
| `runtime` | 현재 활성 runtime getter |
| `advanceFallback()` | chain 다음 mode로 교체·이전 runtime dispose |
| `reset()` | chain 처음으로 되돌림 |

`client/socket-connection.ts`가 connect 실패·transport 오류 시 controller를 통해 runtime을 재생성합니다.
