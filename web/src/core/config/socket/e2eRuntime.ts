// Playwright webServer가 주입하는 공개 플래그
// 프로덕션에서는 켜지 않음
export function isE2ERuntime(): boolean {
  return process.env.NEXT_PUBLIC_E2E === "1";
}
