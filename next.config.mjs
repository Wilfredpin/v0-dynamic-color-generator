/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Update basePath for GitHub Pages - replace with your repo name
  basePath: process.env.NODE_ENV === 'production' ? '/v0-dynamic-color-generator' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/v0-dynamic-color-generator/' : '',
}

export default nextConfig
