import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: ".",
  testMatch: "*.spec.mjs",
  outputDir: "test-results",
  timeout: 20_000,
  use: {
    browserName: "chromium",
    headless: true,
  },
});
