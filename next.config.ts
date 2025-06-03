import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  analyticsId: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID,
};

export default nextConfig;
