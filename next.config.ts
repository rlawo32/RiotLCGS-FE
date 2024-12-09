import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination: `http://localhost:8080/:path*`
      },
    ];
  },
};

export default nextConfig;
