function extractToken(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;

  const candidate = value as Record<string, unknown>;
  const tokenValue = candidate.token ?? candidate.fcmToken;
  return typeof tokenValue === "string" ? tokenValue : null;
}

export async function invalidateFCMToken(token: string): Promise<boolean> {
  try {
    const response = await fetch("/api/notification/token", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ token }),
    });

    return response.ok;
  } catch (error) {
    console.error("FCM 토큰 무효화 실패:", error);
    return false;
  }
}

export async function fetchMyFCMTokens(): Promise<string[]> {
  try {
    const response = await fetch("/api/notification/token/me", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = (await response.json()) as {
      response?: unknown;
    };
    const payload = json?.response;
    if (!Array.isArray(payload)) return [];

    return payload
      .map(extractToken)
      .filter((token): token is string => token !== null);
  } catch (error) {
    console.error("내 FCM 토큰 조회 실패:", error);
    return [];
  }
}
