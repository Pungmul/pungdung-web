# react/lib

Foreground 복구·재연결 정책을 구현하는 **순수 조합 모듈**입니다. React hook 없이도 단위 테스트 가능하도록 분리되어 있습니다.

## 파일

| 파일 | 책임 |
|------|------|
| `socket-reconnect-config.ts` | debounce·throttle·cooldown·inactivity 기본 상수 |
| `foreground-visibility-tracker.ts` | `visibilitychange` / `pageshow` / `focus` — 포그라운드·백그라운드 duration 추적 |
| `socket-connection-watch.ts` | 주기적 inactivity·probe watch — `StateCheckTrigger` 발생 |
| `socket-reconnect-session.ts` | recovery action cooldown·중복 실행 방지 세션 상태 |
| `socket-recovery-policy.ts` | `ShouldRecreateRuntime` / `reconnectOnly` 등 복구 분기 규칙 |
| `socket-recovery-runner.ts` | policy 결과에 따라 `checkConnectionState` 호출 조율 |
| `socket-state-check-runner.ts` | throttle된 state check 실행기 |
| `transport-failure-recovery-handler.ts` | `onTransportFailure` 콜백 → debounced recovery |
| `socket-connection-watch.ts` | connection watch interval 루프 |
| `create-socket-store-selector.ts` | snapshot에서 파생 selector (hooks용) |
| `foreground-visibility-tracker.test.ts` | visibility 추적 테스트 |
| `socket-recovery-policy.test.ts` | 복구 정책 분기 테스트 |

## 복구 결정 흐름

```text
Trigger (visibility / watch / transport-failure)
    ↓
socket-state-check-runner (throttle)
    ↓
socket-recovery-policy (reconnectOnly? forceRecreate? background duration?)
    ↓
socket-recovery-runner → manager.checkConnectionState()
```

## 설계 원칙

- 매직 넘버는 `socket-reconnect-config.ts`에 집중
- `SocketManager`에 대한 직접 의존은 runner/handler 생성 시 주입
- policy는 React·DOM API 없이 순수 함수 위주
