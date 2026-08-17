import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/local/:path*",
        destination: `http://localhost:8080/:path*`
      },
      {
        source: "/api/:path*",
        // destination: "http://158.180.74.133:8080/:path*",
        destination: "https://ocp-dudu.duckdns.org/lcgs-be/:path*",
      },
    ];
  },
};

export default nextConfig;
