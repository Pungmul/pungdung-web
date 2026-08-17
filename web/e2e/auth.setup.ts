import { test as setup } from "@playwright/test";
import path from "node:path";

import { seedAuthCookies } from "./helpers/auth";

const authFile = path.join(__dirname, ".auth/user.json");

setup("seed auth storage state", async ({ page, context }) => {
  await seedAuthCookies(context);
  // storageState는 쿠키를 포함해야 하므로 문서 로드 후 저장한다.
  await page.goto("/");
  await context.storageState({ path: authFile });
});
