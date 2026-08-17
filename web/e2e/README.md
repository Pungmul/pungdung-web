# Web E2E (Playwright)

전체 웹 E2E 하네스. 도메인별 스펙은 하위 폴더에 둔다.

```text
e2e/
  auth.setup.ts
  fixtures/
  helpers/
  lightning/          # 번개 도메인 (첫 적용)
  # home/, chat/, ...  # 이후 확장
```

## 브라우저 타깃

기본 `test:e2e`는 아래 3개를 모두 돈다.

| project | 의미 | Playwright device |
| --- | --- | --- |
| `mobile-chrome` | 모바일 크롬 | Pixel 7 (Chromium) |
| `mobile-safari` | 모바일 사파리 | iPhone 14 (WebKit) |
| `pwa` | PWA standalone 흉내 | Pixel 7 + `display-mode: standalone` mock |

실기기 PWA 설치/홈화면 추가는 Playwright만으로 완전 대체되지 않는다. `pwa` 프로젝트는 service worker 허용 + standalone media query 에뮬레이션이다.

## 실행

```bash
# 전체 (mobile-chrome + mobile-safari + pwa)
pnpm --filter @pungdung/web test:e2e

pnpm --filter @pungdung/web test:e2e:ui
pnpm --filter @pungdung/web test:e2e -- --project=mobile-chrome
pnpm --filter @pungdung/web test:e2e -- --project=mobile-safari
pnpm --filter @pungdung/web test:e2e -- --project=pwa
```

최초 1회 브라우저 바이너리:

```bash
pnpm --filter @pungdung/web exec playwright install chromium webkit
```

루트:

```bash
pnpm test:e2e:web
```

## 전제

- `NEXT_PUBLIC_E2E=1` → socket `main-thread` + SockJS websocket-only
- STOMP는 Playwright `routeWebSocket`(+ SockJS 프레임)으로 mock
- HTTP는 BFF `page.route` fulfill
