# react

`SocketManager`를 React 앱에 연결하는 **Provider·hooks·foreground 복구** 레이어입니다. 비즈니스 feature에 의존하지 않으며 peer dependency로 React 18+만 요구합니다.

## 하위 모듈

| 폴더 | 요약 |
|------|------|
| `hooks/` | 연결·구독·초기화 hooks — `hooks/README.md` |
| `lib/` | 복구 정책·visibility·runner — `lib/README.md` |

## 파일

| 파일 | 책임 |
|------|------|
| `index.ts` | `@pungdung/worker-socket-bridge/react` public export |
| `SocketManagerProvider.tsx` | `SocketContext` + `useSocketManager` |

## 권장 사용 순서

```text
1. SocketManager 인스턴스 생성 (앱 bootstrap)
2. SocketManagerProvider로 감싸기
3. useInitSocketConnect — access token 기반 connect
4. useSocketForegroundReconnect — 백그라운드 복귀·transport 복구
5. useSocketSubscription — feature별 토픽 구독
```

## 의존 방향

- `client`, `protocol` 참조
- `use-sync-external-store`로 `SocketSnapshotStore` 구독
