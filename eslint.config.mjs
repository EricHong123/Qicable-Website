import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    settings: { next: { rootDir: "preview/" } },
    rules: {
      // This static UI package serves reviewed local assets without a Next image server.
      "@next/next/no-img-element": "off",
    },
  },
  globalIgnores([
    "preview/.next/**",
    "preview/out/**",
    "preview/next-env.d.ts",
    "plans/research/**",
  ]),
]);
