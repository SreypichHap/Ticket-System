import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Event / hotel photos served by the BookMe+ API and its CDNs
      { protocol: "https", hostname: "**.bookme.plus" },
    ],
  },
};

export default nextConfig;
