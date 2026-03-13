import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "beljumlah-11072023-28562543.dev.odoo.com",
      },
    ],
  },
};

module.exports = nextConfig;
