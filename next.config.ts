import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  
  // Configuration for Node.js hosting (cPanel)
  // No static export - we want full Next.js functionality
  
  // Enable cross-origin requests for API calls
  crossOrigin: 'anonymous',
  
  // Keep image optimization enabled for better performance
  images: {
    unoptimized: false,
  },
  
  // Configure for production deployment
  poweredByHeader: false,
  
  // Compress responses
  compress: true,
};

export default nextConfig;
