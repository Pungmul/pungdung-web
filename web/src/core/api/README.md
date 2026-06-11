# core/api

`src/core/api`는 API 통신에서 공통으로 쓰는 유틸을 모아둔 레이어입니다.
신규 개발자는 이 디렉터리만 먼저 이해해도, 인증/응답 검증/에러 처리 흐름을 빠르게 따라갈 수 있습니다.

## 목적

- 백엔드 공통 응답(envelope) 형식 검증
- 클라이언트 요청의 타입 안전성 확보 (`zod` 기반)
- 토큰 쿠키 갱신/삭제 로직 중앙화
- 프록시 라우트에서 일관된 실패 응답 반환

## 디렉터리 구조

- `client/`
  - 클라이언트 요청 유틸
  - 외부 공개: `clientApiRequest`, `ClientApiError`, `CLIENT_API_ERROR_CODE`
- `server/`
  - 서버 프록시/인증/업스트림 검증 유틸
  - 외부 공개: `fetchWithRefresh`, `proxyFailureError`, `validateUpstreamJsonResponse` 등
- `index.ts`
  - `client`, `server` 배럴 재-export

## 주요 파일

- `client/client-api-request.ts`
  - 클라이언트용 공통 요청 함수
  - 응답을 envelope로 검증하고, `responseSchema`로 payload를 다시 검증
  - 실패 시 `ClientApiError`를 던짐
- `client/client-api-error.ts`
  - 클라이언트 요청 실패를 표현하는 에러 클래스
  - `status`, `code`, `payload`, `details` 필드 포함
- `server/upstream-envelope.ts`
  - 외부(업스트림) 응답이 공통 JSON 형식인지 검증
  - 형식이 깨지면 502 에러 응답으로 변환
- `server/fetchWithRefresh.ts`
  - API Router 전용 fetch 래퍼
  - access/refresh 토큰을 쿠키에서 읽고, 만료 시 재발급 후 재시도
- `server/update-token-cookies.ts`
  - 토큰 쿠키 설정(갱신)
- `server/clean-token-cookies.ts`
  - 토큰 쿠키 삭제(만료 처리)
- `server/proxy-failure-error.ts`
  - 프록시 라우트 실패를 공통 형식 JSON으로 반환
- `server/type.ts`
  - 공통 타입/스키마 정의 (`upstreamEnvelopeSchema`, `RefreshTokenResponse` 등)
- `client/constant.ts`
  - 클라이언트 API 공통 에러 코드 상수
- `server/extractErrorCode.ts`
  - 다양한 에러 payload에서 코드 필드 추출

## 기본 사용 패턴

### 1) 클라이언트에서 API 호출

- `clientApiRequest` + `zod` 스키마를 함께 사용
- 서버 응답 envelope와 실제 payload를 모두 검증

### 2) 서버 라우트에서 업스트림 응답 중계

- 업스트림 응답을 그대로 넘기지 말고 `validateUpstreamJsonResponse` 또는 `createValidatedUpstreamResponse`로 검증 후 반환

### 3) 인증 에러 처리

- 인증 관련 실패 시 쿠키 정리는 `clearTokenCookies`로 통일
- 토큰 갱신은 `updateTokenCookies`로 통일

## 신규 개발자 체크리스트

- 새 API 클라이언트 함수 작성 시 `clientApiRequest`를 우선 사용
- 응답 타입은 반드시 `zod` 스키마로 검증
- 프록시 라우트에서 실패 응답 shape를 임의로 만들지 말고 기존 유틸 재사용
- 토큰 쿠키 키 이름(`accessToken`, `refreshToken`)을 변경할 때는 관련 유틸을 함께 수정
- 외부에서 import가 필요하면 먼저 `client/index.ts` 또는 `server/index.ts`에 공개 여부를 검토

## 테스트

- `client-api-request.test.ts`: 잘못된 응답 형식/스키마 오류 케이스 검증
- `upstream-envelope.test.ts`: 업스트림 JSON 파싱 실패/응답 형식 오류 검증
