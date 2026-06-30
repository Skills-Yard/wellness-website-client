import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.1.114", "192.168.1.104", "192.168.1.112", "192.168.1.111", "10.40.241.84:3000"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.urbancompany.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;