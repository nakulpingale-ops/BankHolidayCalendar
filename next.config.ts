import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // This creates the static files for Cloudflare
  images: {
    unoptimized: true, // Required for static export in Next.js
  },
};

export default nextConfig;