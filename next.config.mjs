/** @type {import('next').NextConfig} */
const nextConfig = {
  // Transpile GSAP and other ESM modules if needed
  transpilePackages: ["gsap"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

export default nextConfig;
