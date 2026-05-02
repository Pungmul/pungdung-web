import path from "node:path";
import type { Plugin } from "vite";
import { transformWithEsbuild } from "vite";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

/** vitest에서 worker-socket-bridge 패키지 대신 패키지 공식 testing subpath 사용 */
function workerSocketBridgeTestMock(): Plugin {
  const reactMock = path.resolve(
    __dirname,
    "packages/worker-socket-bridge/src/react/testing/index.tsx"
  );
  const coreMock = path.resolve(
    __dirname,
    "packages/worker-socket-bridge/src/testing/index.ts"
  );

  return {
    name: "worker-socket-bridge-test-mock",
    enforce: "pre",
    resolveId(source) {
      if (source === "@pungdung/worker-socket-bridge/react") {
        return reactMock;
      }
      if (source === "@pungdung/worker-socket-bridge") {
        return coreMock;
      }
      return null;
    },
  };
}

/** tsconfig `jsx: preserve` 환경에서 vitest import-analysis 실패 방지 */
function vitestTsxPreTransform(): Plugin {
  const srcRoot = `${path.sep}src${path.sep}`;
  return {
    name: "vitest-tsx-pre-transform",
    enforce: "pre",
    async transform(code, id) {
      if (!id.includes(srcRoot) || !id.endsWith(".tsx") || id.includes("node_modules")) {
        return null;
      }
      return transformWithEsbuild(code, id, {
        loader: "tsx",
        jsx: "automatic",
      });
    },
  };
}

export default defineConfig({
  plugins: [workerSocketBridgeTestMock(), vitestTsxPreTransform(), react()],
  resolve: {
    tsconfigPaths: true,
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "src") },
      {
        find: "@pungdung/worker-socket-bridge/react",
        replacement: path.resolve(
          __dirname,
          "packages/worker-socket-bridge/src/react/testing/index.tsx"
        ),
      },
      {
        find: "@pungdung/worker-socket-bridge",
        replacement: path.resolve(
          __dirname,
          "packages/worker-socket-bridge/src/testing/index.ts"
        ),
      },
    ],
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/vitest.setup.ts"],
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", ".next"],
  },
});
