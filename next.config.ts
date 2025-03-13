import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // This allows production builds to successfully complete even with ESLint errors
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  // Add any other Next.js config options you need here
};

export default nextConfig;
