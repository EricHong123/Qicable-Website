import type { NextConfig } from "next";
import path from "node:path";
import createNextIntlPlugin from "next-intl/plugin";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
export default (phase: string) => {
  const development = phase === PHASE_DEVELOPMENT_SERVER;
  const config: NextConfig = {
    output: development ? undefined : "export",
    trailingSlash: true,
    poweredByHeader: false,
    reactStrictMode: true,
    images: { unoptimized: true },
    turbopack: { root: path.resolve(__dirname, "..") },
    ...(development
      ? {
          // Multipart requests must reach the local adapter without a 308 body replay.
          skipTrailingSlashRedirect: true,
          experimental: { proxyClientMaxBodySize: "64mb" },
          async rewrites() {
            return ["/api/contact", "/api/contact-files"].map((source) => ({
              source,
              destination: `http://127.0.0.1:3101${source}`,
            }));
          },
        }
      : {}),
  };
  return createNextIntlPlugin("./preview/i18n/request.ts")(config);
};
