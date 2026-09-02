import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Booking attachments are capped at 10 MB; the rest is multipart overhead.
      bodySizeLimit: "12mb",
    },
  },
};

export default nextConfig;
