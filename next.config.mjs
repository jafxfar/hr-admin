/** @type {import('next').NextConfig} */

// Standalone copies node_modules via symlinks — fails on Windows without Developer Mode.
// Enable for Docker/CI: NEXT_STANDALONE=1 pnpm build  (or use build:standalone script)
const useStandalone =
  process.env.NEXT_STANDALONE === '1' || process.env.NEXT_STANDALONE === 'true'

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://backend:8000/api/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'http://backend:8000/uploads/:path*',
      },
    ]
  },
  images: {
    unoptimized: true,
  },
  ...(useStandalone ? { output: 'standalone' } : {}),
}

export default nextConfig
