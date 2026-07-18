type AccessTokenPayload = { exp?: unknown };

export function isAccessTokenExpired(accessToken: string): boolean {
  const payload = accessToken.split(".")[1];
  if (!payload) return false;

  try {
    const normalizedPayload = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(Math.ceil(payload.length / 4) * 4, "=");
    const parsed = JSON.parse(atob(normalizedPayload)) as AccessTokenPayload;

    return (
      typeof parsed.exp === "number" && parsed.exp * 1000 <= Date.now()
    );
  } catch {
    return false;
  }
}
