import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // @ts-expect-error
  allowedDevOrigins: ["192.168.15.12", "192.168.1.102"]
};

export default nextConfig;
