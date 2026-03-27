/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Turbopack config để tránh conflict với webpack
  turbopack: {},
}

export default nextConfig;
