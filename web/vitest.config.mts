import path from "node:path";
import type { Plugin } from "vite";
import { transformWithEsbuild } from "vite";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

const configDir = import.meta.dirname;
const workerSocketReactMock = path.resolve(
  configDir,
  "../packages/worker-socket-bridge/src/react/testing/index.tsx"
);
const workerSocketCoreMock = path.resolve(
  configDir,
  "../packages/worker-socket-bridge/src/testing/index.ts"
);

function workerSocketBridgeTestMock(): Plugin {
  return {
    name: "worker-socket-bridge-test-mock",
    enforce: "pre",
    resolveId(source) {
      if (source === "@pungdung/worker-socket-bridge/react") {
        return workerSocketReactMock;
      }
      if (source === "@pungdung/worker-socket-bridge") {
        return workerSocketCoreMock;
      }
      return null;
    },
  };
}

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
      {
        find: /^@\//,
        replacement: `${path.resolve(configDir, "src")}/`,
      },
      {
        find: /^@pungdung\/worker-socket-bridge\/react$/,
        replacement: workerSocketReactMock,
      },
      {
        find: /^@pungdung\/worker-socket-bridge$/,
        replacement: workerSocketCoreMock,
      },
    ],
  },
  server: {
    fs: {
      allow: [path.resolve(configDir, ".."), path.resolve(configDir, "../packages")],
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/vitest.setup.ts"],
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", ".next"],
  },
});
