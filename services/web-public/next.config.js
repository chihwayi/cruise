/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Environment variables are automatically available if prefixed with NEXT_PUBLIC_
  // No need to explicitly set them here in docker-compose environment
  
  // Development server configuration to help with chunk loading
  onDemandEntries: {
    // Period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 60 * 1000, // 60 seconds
    // Number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 5,
  },
}

module.exports = nextConfig
