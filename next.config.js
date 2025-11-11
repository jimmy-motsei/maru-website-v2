/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  turbopack: { root: __dirname },
  images: { formats: ["image/avif","image/webp"] },
  reactStrictMode: true,
}
module.exports = nextConfig
