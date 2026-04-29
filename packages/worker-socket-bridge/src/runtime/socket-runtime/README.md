# runtime/socket-runtime

`SocketRuntime` 추상화와 mode별 구현체입니다. 공통 dispatch 큐는 `BaseSocketRuntime`에 있습니다.

## 파일

| 파일 | 책임 |
|------|------|
| `index.ts` | socket-runtime export |
| `base-socket-runtime.ts` | `PriorityDispatchQueue` 보유 추상 클래스 — `dispatch` / `setMessageHandler` 계약 |
| `worker-socket-runtime.ts` | `WorkerTransport`에 command 전달, worker message 수신 |
| `main-thread-socket-runtime.ts` | Worker 없이 `createStompSession`을 메인 스레드에서 직접 실행 |

## 구현 비교

| 구현 | `mode` | 메시지 경로 |
|------|--------|-------------|
| `WorkerSocketRuntime` | `shared` / `dedicated` | `transport.postMessage` ↔ Worker |
| `MainThreadSocketRuntime` | `main` | in-process `StompSession.handleCommand` |

## `BaseSocketRuntime`

- constructor에 `sink: (envelope) => void` 주입 — 실제 전송은 하위 클래스
- `dispatch` → 큐 enqueue → sink 호출
- runtime dispose 시 큐 clear
