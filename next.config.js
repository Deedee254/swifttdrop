/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // Produce a standalone build in .next/standalone for easier deploys
  output: 'standalone',
  
  // Basic configuration for CSS
  images: {
    domains: [],
  },
  
  // Simplified webpack configuration without TypeScript errors
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig;