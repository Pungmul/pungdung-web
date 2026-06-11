/** 지정한 경로가 prefix 목록 중 하나로 시작하는지 확인합니다. */
export const matchesPrefix = (
  pathname: string,
  prefixes: readonly string[],
): boolean => prefixes.some((prefix) => pathname.startsWith(prefix));
