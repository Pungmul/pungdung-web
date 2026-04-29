# 아키텍처

## 레이어 개요

```mermaid
flowchart TB
  subgraph App["Application"]
    R[react/ hooks & Provider]
  end

  subgraph Client["client/"]
    SM[SocketManager]
    SUB[SocketSubscriptions]
    PROBE[SocketProbe]
  end

  subgraph Bridge["rpc/"]
    RPC[SocketBridge]
  end

  subgraph Runtime["runtime/"]
    RT[SocketRuntime]
    T[WorkerTransport]
  end

  subgraph Worker["workers/ + stomp/"]
    STOMP[StompSession / SharedStompHub]
  end

  R --> SM
  SM --> RPC
  SM --> SUB
  SM --> PROBE
  RPC --> RT
  RT --> T
  T -->|postMessage| STOMP
  STOMP -->|ResponseEnvelope| RPC
```

## 연결 수명주기

```mermaid
sequenceDiagram
  participant App
  participant Manager as SocketManager
  participant Bridge as SocketBridge
  participant Runtime
  participant Worker as Worker/STOMP

  App->>Manager: connect(config)
  Manager->>Runtime: create + setMessageHandler
  Manager->>Bridge: invoke CONNECT
  Bridge->>Runtime: dispatch
  Runtime->>Worker: CommandEnvelope
  Worker-->>Runtime: CONNECTED
  Runtime-->>Bridge: handleResponse
  Bridge-->>Manager: Promise resolved
  Manager-->>App: connected
```

## Runtime Fallback

```mermaid
flowchart LR
  S[shared] -->|transport failure| D[dedicated]
  D -->|transport failure| M[main thread]
```

`SocketRuntimeFallbackController`가 chain을 관리합니다. SharedWorker를 쓸 수 없거나 hub 연결이 실패하면 dedicated로, Worker API 자체가 없으면(SSR) main thread로 동작합니다.

## 메시지 계약

모든 cross-boundary 메시지는 `protocol/`의 `CommandEnvelope` / `ResponseEnvelope`를 따릅니다.

- **RPC**: `CONNECT`, `PING`, `SUBSCRIBE`, `SEND_MESSAGE` — `commandId` + Promise
- **Post**: `UNSUBSCRIBE`, `DISCONNECT` — 즉시 dispatch

## 모듈 문서

각 폴더 README에서 파일별 책임을 확인할 수 있습니다.

| 모듈 | 문서 |
|------|------|
| protocol | [protocol](/modules/protocol) |
| rpc | [rpc](/modules/rpc) |
| client | [client](/modules/client) |
| runtime | [runtime](/modules/runtime/) |
| react | [react](/modules/react/) |
| stomp | [stomp](/modules/stomp) |
| workers | [workers](/modules/workers/) |
