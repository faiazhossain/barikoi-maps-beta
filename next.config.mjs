/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'barikoi-admin-v2.s3.ap-southeast-1.amazonaws.com',
        pathname: '/place/**',
      },
      {
        protocol: 'https',
        hostname: 'graph.mapillary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'thumbnails-external-a.mapillary.com',
        pathname: '/v/thumbs/**',
      },
      // Add Facebook CDN domains
      {
        protocol: 'https',
        hostname: 'scontent.fdac7-1.fna.fbcdn.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.fna.fbcdn.net',
        pathname: '/**',
      },
      // Add flag CDN domain
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
