/**
 * `packages/worker-socket-bridge/workers` → consumer `public/*.js`
 */

import * as esbuild from "esbuild";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(__dirname, "..");
const PROJECT_ROOT = path.resolve(PACKAGE_ROOT, "..", "..");

function parseOutDir(argv) {
  const outDirIndex = argv.indexOf("--outdir");
  if (outDirIndex === -1) {
    return path.join(PROJECT_ROOT, "public");
  }
  const outDir = argv[outDirIndex + 1];
  if (!outDir) {
    throw new Error("--outdir requires a path");
  }
  return path.resolve(PROJECT_ROOT, outDir);
}

const WORKERS = [
  {
    entry: path.join(PACKAGE_ROOT, "workers/socket-worker.ts"),
    outfileName: "socket-worker.js",
  },
  {
    entry: path.join(PACKAGE_ROOT, "workers/dedicated-worker.ts"),
    outfileName: "dedicated-worker.js",
  },
];

function isProductionBuild() {
  if (process.env.NODE_ENV === "production") return true;
  const lifecycle = process.env.npm_lifecycle_event;
  return lifecycle === "prebuild" || lifecycle === "build";
}

function buildOptions(entry, outfile) {
  const production = isProductionBuild();

  return {
    entryPoints: [entry],
    outfile,
    bundle: true,
    format: "iife",
    platform: "browser",
    target: "es2020",
    // sockjs-client and peers reference Node's `global`; workers only have globalThis/self.
    define: {
      global: "globalThis",
    },
    minify: production,
    sourcemap: !production,
    logLevel: "info",
  };
}

async function buildWorkers(outDir) {
  await fs.mkdir(outDir, { recursive: true });

  await Promise.all(
    WORKERS.map(({ entry, outfileName }) =>
      esbuild.build(buildOptions(entry, path.join(outDir, outfileName)))
    )
  );

  for (const { outfileName } of WORKERS) {
    console.log("[worker-socket-bridge] wrote:", path.join(outDir, outfileName));
  }
}

async function watchWorkers(outDir) {
  await fs.mkdir(outDir, { recursive: true });

  await Promise.all(
    WORKERS.map(async ({ entry, outfileName }) => {
      const outfile = path.join(outDir, outfileName);
      const context = await esbuild.context(buildOptions(entry, outfile));
      await context.watch();
      console.log(
        "[worker-socket-bridge] watching:",
        path.relative(PACKAGE_ROOT, entry)
      );
      return context;
    })
  );

  console.log("[worker-socket-bridge] watch mode — Ctrl+C to stop");
  await new Promise(() => {});
}

async function main() {
  const watch = process.argv.includes("--watch");
  const outDir = parseOutDir(process.argv);

  if (watch) {
    await watchWorkers(outDir);
    return;
  }

  await buildWorkers(outDir);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
