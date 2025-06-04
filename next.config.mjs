/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com'],
  },
  // Enable static optimization
  output: 'standalone',
  // Enable React strict mode
  reactStrictMode: true,
};

export default nextConfig; 