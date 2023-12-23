/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['dev.updg8.com', 'updg8.com', "storage.googleapis.com"]
  }
}

module.exports = nextConfig
