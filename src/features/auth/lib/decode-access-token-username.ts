type JwtPayloadLike = {
  sub?: unknown;
  username?: unknown;
};

const decodeBase64Url = (input: string): string | null => {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padLength = (4 - (normalized.length % 4)) % 4;
  const padded = `${normalized}${"=".repeat(padLength)}`;

  try {
    if (typeof atob === "function") {
      return atob(padded);
    }
    return Buffer.from(padded, "base64").toString("utf-8");
  } catch {
    return null;
  }
};

export const decodeAccessTokenUsername = (
  accessToken: string | undefined,
): string | undefined => {
  if (!accessToken) return undefined;

  const segments = accessToken.split(".");
  if (segments.length < 2) return undefined;

  const payloadRaw = decodeBase64Url(segments[1] ?? "");
  if (!payloadRaw) return undefined;

  try {
    const payload = JSON.parse(payloadRaw) as JwtPayloadLike;
    if (typeof payload.username === "string" && payload.username.length > 0) {
      return payload.username;
    }
    if (typeof payload.sub === "string" && payload.sub.length > 0) {
      return payload.sub;
    }
    return undefined;
  } catch {
    return undefined;
  }
};
