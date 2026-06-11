/**
 * 빌드/로컬 dev 전에 실행:
 * `pungdung-fcm-background.template.js` + env → `pungdung-fcm-background.js`
 *
 * Next.js 와 같은 규칙으로 env 파일 로드 (@next/env).
 * `prebuild` 는 `NODE_ENV` 가 아직 안 잡혀 있는 경우가 있어 npm_lifecycle_event 로 production 파일을 택한다.
 */

import fs from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");
const DEFAULT_APP_PATH = "web";

const ENV_KEYS = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
  "NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID",
];

function shouldUseDevelopmentEnvFiles() {
  if (process.env.NODE_ENV === "production") return false;
  const ev = process.env.npm_lifecycle_event;
  if (ev === "prebuild" || ev === "build") return false;
  return true;
}

function parseAppRoot(argv) {
  const appIndex = argv.indexOf("--app");
  if (appIndex !== -1) {
    const appPath = argv[appIndex + 1];
    if (!appPath) {
      throw new Error("--app requires a path");
    }
    return path.resolve(PROJECT_ROOT, appPath);
  }

  return path.resolve(PROJECT_ROOT, DEFAULT_APP_PATH);
}

async function main() {
  const appRoot = parseAppRoot(process.argv);
  const requireFromApp = createRequire(path.join(appRoot, "package.json"));
  const { loadEnvConfig } = requireFromApp("@next/env");
  loadEnvConfig(appRoot, shouldUseDevelopmentEnvFiles());

  const missing = ENV_KEYS.filter((key) => {
    const v = process.env[key];
    return v === undefined || v === "";
  });
  if (missing.length > 0) {
    console.error(
      "[generate-firebase-sw] 다음 환경 변수가 필요합니다:",
      missing.join(", ")
    );
    process.exit(1);
  }

  const templatePath = path.join(
    appRoot,
    "public",
    "pungdung-fcm-background.template.js"
  );
  const outPath = path.join(
    appRoot,
    "public",
    "pungdung-fcm-background.js"
  );

  let contents = await fs.readFile(templatePath, "utf8");
  for (const key of ENV_KEYS) {
    const token = `%%${key}%%`;
    const value = process.env[key];
    if (!contents.includes(token)) {
      console.error(
        `[generate-firebase-sw] 템플릿에 플레이스홀더 없음: ${token}`
      );
      process.exit(1);
    }
    contents = contents.split(token).join(value);
  }

  await fs.writeFile(outPath, contents, "utf8");
  console.log("[generate-firebase-sw] wrote:", outPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
