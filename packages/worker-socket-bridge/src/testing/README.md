# Testing entrypoints

Vitest/JSDOM 등 브라우저 worker·STOMP 없이 앱 테스트를 돌릴 때 사용하는 **no-op 구현**입니다.

## Subpaths

| Import | 용도 |
|--------|------|
| `@pungdung/worker-socket-bridge/testing` | `SocketManager` 등 코어 클라이언트 대체 |
| `@pungdung/worker-socket-bridge/react/testing` | React provider·hook 대체 |

## Consumer vitest 예시

```ts
// vitest.config.ts resolve.alias
{
  find: "@pungdung/worker-socket-bridge/react",
  replacement: path.resolve(
    __dirname,
    "packages/worker-socket-bridge/src/react/testing/index.tsx"
  ),
},
{
  find: "@pungdung/worker-socket-bridge",
  replacement: path.resolve(
    __dirname,
    "packages/worker-socket-bridge/src/testing/index.ts"
  ),
},
```

프로덕션 번들에는 이 subpath를 import하지 마세요.
