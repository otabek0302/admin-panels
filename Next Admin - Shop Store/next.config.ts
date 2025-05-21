import type { NextConfig } from "next";
import path from "path";
import type { Configuration } from "webpack";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: true, // or anything else you're using
  },
  webpack: (config: Configuration) => {
    config.resolve.alias['@'] = path.resolve(process.cwd(), 'src');
    return config;
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
};

export default nextConfig;
