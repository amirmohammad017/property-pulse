import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: process.env.ARVAN_CLOUD_S3_PUBLIC_URL_WITHOUT_PROTOCOL!,
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
