/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove export, let Vercel handle serverless deployment
  distDir: '.next'
}

module.exports = nextConfig
