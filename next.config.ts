import type { NextConfig } from "next";

const authBuildVersion = process.env.VET68_BUILD_VERSION
  ?? process.env.VERCEL_DEPLOYMENT_ID
  ?? process.env.VERCEL_GIT_COMMIT_SHA
  ?? `local-${Date.now()}`;

const nextConfig: NextConfig = {
  env: { VET68_BUILD_VERSION: authBuildVersion },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
      { protocol: "http", hostname: "127.0.0.1", pathname: "/storage/v1/object/public/**" },
      { protocol: "http", hostname: "localhost", pathname: "/storage/v1/object/public/**" },
    ],
  },
};

export default nextConfig;
