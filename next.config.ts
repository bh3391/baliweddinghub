import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**",
      },
      // Tambahkan jika nanti Bapak pakai storage lain (misal Supabase atau S3)
      /* {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
      */
    ],
  },
};

export default nextConfig;
