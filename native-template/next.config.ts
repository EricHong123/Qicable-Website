import type { NextConfig } from "next";
import path from "node:path";
import createNextIntlPlugin from "next-intl/plugin";
const config: NextConfig = {
  trailingSlash: true, poweredByHeader: false, reactStrictMode: true,
  images: { unoptimized: true }, turbopack: { root: path.resolve(__dirname, ".."), resolveAlias: { "next/link": "./ui/src/static-link.tsx" } },
};
export default createNextIntlPlugin("./preview/i18n/request.ts")(config);
