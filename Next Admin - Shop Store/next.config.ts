import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {}, // ✅ must be an object
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
};

export default nextConfig;