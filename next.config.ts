import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-1d9eaf01e84e452a968f82e2aed10777.r2.dev",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    ".space-z.ai",
    "127.0.0.1",
    "localhost",
  ],
  async redirects() {
    // Legacy static suite pages — the suites they referenced (slugs
    // "suite-chorfa"/"suite-familiale"/"suite-junior") don't exist in the
    // database (real slugs are "suite"/"tente-familiale"/"tente-junior"),
    // so these routes rendered a "not found" empty state while returning
    // 200 OK — a soft-404 that actively hurts SEO. Redirect permanently to
    // the real, fully-optimized dynamic detail pages instead.
    return [
      { source: "/suite-chorfa", destination: "/les-tentes/suite", permanent: true },
      { source: "/suite-familiale", destination: "/les-tentes/tente-familiale", permanent: true },
      { source: "/suite-junior", destination: "/les-tentes/tente-junior", permanent: true },
    ];
  },
};

export default nextConfig;
