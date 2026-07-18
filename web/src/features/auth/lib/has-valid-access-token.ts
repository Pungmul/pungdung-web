import { isAccessTokenExpired } from "./is-access-token-expired";

export function hasValidAccessToken(accessToken: string | undefined): boolean {
  return Boolean(accessToken && !isAccessTokenExpired(accessToken));
}
