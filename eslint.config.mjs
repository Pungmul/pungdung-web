import { FlatCompat } from "@eslint/eslintrc";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "dist/**",
      "build/**",

      "**/*.test.ts",
      "**/*.test.tsx",
      "**/*.spec.ts",
      "**/*.spec.tsx",
      "**/__tests__/**",
      "**/__mocks__/**",
      "**/__mock.ts",

      "*.config.js",
      "*.config.ts",
      "vitest.config.ts",
      "next.config.mjs",

      "public/mockServiceWorker.js",
      "public/socket-worker.js",
      "public/dedicated-worker.js",

      "packages/**/docs/.vitepress/cache/**",
      "packages/**/docs/.vitepress/dist/**",
    ],
  },

  ...compat.extends("next/core-web-vitals", "next/typescript"),

  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },

    rules: {
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^react$", "^react-dom", "^next(/.*)?$"],

            [
              "^zod$",
              "^zustand(/.*)?$",
              "^@tanstack/(.*)$",
              "^@hookform/(.*)$",
              "^react-hook-form$",
            ],

            [
              "^lodash(/.*)?$",
              "^dayjs$",
              "^clsx$",
              "^uuid$",
              "^ts-pattern$",
              "^tailwind-merge$",
              "^@suspensive/(.*)$",
              "^@?\\w",
            ],

            ["^@/core(/.*)?$", "^@core(/.*)?$"],

            ["^@/features/[^/]+$"],

            ["^@/shared(/.*)?$"],

            [
              "^\\.\\./(api|components|constants|hooks|queries|services|store|providers|types|lib)$",
            ],

            ["^\\./", "^\\.\\./"],
          ],
        },
      ],

      "simple-import-sort/exports": "error",
    },
  },

  {
    files: ["packages/**/*.{ts,tsx,mjs}"],
    rules: {
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^react$", "^react-dom"],
            ["^@?\\w"],
            ["^\\.\\./\\.\\./", "^\\.\\./"],
            ["^\\./"],
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
