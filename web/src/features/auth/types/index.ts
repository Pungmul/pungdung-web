/**
 * Auth 도메인 타입 export surface.
 *
 * - **DTO 스키마/타입** (`LoginRequest`, `SignUpRequestForm` 등): `api/client/dto.schema` 또는 `api/server/dto.schema`에서 import한다.
 * - **이메일 가입 Zod·폼 타입**: `types/schemas/sign-up.schema` (API 순환 방지로 이 index에서 생략).
 * - **카카오 가입 스키마**: 이메일과 동명 export가 있어 아래는 별칭으로만 노출한다.
 * - **가입 단계**: `email-sign-up.types`, `kakao-sign-up.types`.
 */

export * from "./email-sign-up.types";
export * from "./kakao-sign-up.types";
export * from "./login-method";
