// 가입/소켓 장애 extra용 디바이스
// 이메일, 토큰, 요청 바디는 넣지 않음
export function collectDeviceExtras(): Record<string, unknown> {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return {};
  }
  const extras: Record<string, unknown> = {
    userAgent: navigator.userAgent,
    display_mode: window.matchMedia("(display-mode: standalone)").matches
      ? "standalone"
      : "browser",
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
    language: navigator.language,
    platform: navigator.platform,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
  const connection = (
    navigator as Navigator & { connection?: { effectiveType?: string } }
  ).connection;
  if (connection?.effectiveType) {
    extras.effectiveType = connection.effectiveType;
  }
  return extras;
}
