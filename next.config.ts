import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https', // or 'http' if applicable
        hostname: 'zhex-s3-storage.s3.us-east-2.amazonaws.com', // Replace with your existing domain
      },
    ],
  },
}

export default nextConfig
