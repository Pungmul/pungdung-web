import { defineConfig, devices } from "@playwright/test";
import path from "node:path";

const webRoot = __dirname;
const authStoragePath = path.join(webRoot, "e2e/.auth/user.json");

const sharedUse = {
  baseURL: "http://127.0.0.1:3100",
  trace: "on-first-retry" as const,
  geolocation: { latitude: 37.5665, longitude: 126.978 },
};

// 웹 앱 전체 E2E. 도메인별 스펙은 e2e/<domain>/ 아래.
// 필수 타깃: mobile-chrome, mobile-safari, desktop-chrome, pwa
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  ...(process.env.CI ? { workers: 1 } : {}),
  reporter: [["list"], ["html", { open: "never" }]],
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  use: sharedUse,
  webServer: {
    command:
      "pnpm exec cross-env NEXT_PUBLIC_E2E=1 next dev -p 3100 -H 127.0.0.1",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    cwd: webRoot,
    env: {
      ...process.env,
      NEXT_PUBLIC_E2E: "1",
      NEXT_PUBLIC_WEBSOCKET_URL: "http://127.0.0.1:3100/ws",
      NEXT_PUBLIC_LOCAL_URL: "http://127.0.0.1:3100",
    },
  },
  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
      use: {
        ...devices["Desktop Chrome"],
        ...sharedUse,
      },
    },
    {
      name: "mobile-chrome",
      dependencies: ["setup"],
      use: {
        ...devices["Pixel 7"],
        ...sharedUse,
        storageState: authStoragePath,
        permissions: ["geolocation", "notifications"],
      },
      testIgnore: /auth\.setup\.ts/,
    },
    {
      name: "mobile-safari",
      dependencies: ["setup"],
      use: {
        ...devices["iPhone 14"],
        ...sharedUse,
        storageState: authStoragePath,
      },
      testIgnore: /auth\.setup\.ts/,
    },
    {
      name: "desktop-chrome",
      dependencies: ["setup"],
      use: {
        ...devices["Desktop Chrome"],
        ...sharedUse,
        storageState: authStoragePath,
        permissions: ["geolocation", "notifications"],
      },
      testIgnore: /auth\.setup\.ts/,
    },
    {
      // 실기기 PWA 설치 대신 Chromium + standalone display-mode 에뮬레이션
      name: "pwa",
      dependencies: ["setup"],
      use: {
        ...devices["Pixel 7"],
        ...sharedUse,
        storageState: authStoragePath,
        permissions: ["geolocation", "notifications"],
        serviceWorkers: "allow",
      },
      testIgnore: /auth\.setup\.ts/,
    },
  ],
});
