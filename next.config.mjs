/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pungmul-s3-bucket.s3.ap-northeast-2.amazonaws.com",
      },
    ],
    minimumCacheTTL: 60 * 60 * 1000,
  },
  experimental: {
    scrollRestoration: true,
  },
  async headers() {
    return [
      {
        source: "/pungdung-sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
      {
        source: "/socket-worker.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
      {
        source: "/dedicated-worker.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
