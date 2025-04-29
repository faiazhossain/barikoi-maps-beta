/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'barikoi-admin-v2.s3.ap-southeast-1.amazonaws.com',
        pathname: '/place/**',
      },
    ],
  },
};

export default nextConfig;
