export function hasAuthSessionCookie(
  accessToken: string | undefined,
  refreshToken: string | undefined
): boolean {
  return Boolean(accessToken || refreshToken);
}
