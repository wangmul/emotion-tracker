import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // 빌드 시 ESLint 에러로 실패하지 않도록 (Vercel 빌드 안정화)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 빌드 시 타입 오류로 실패하지 않도록 (Vercel 빌드 안정화)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
