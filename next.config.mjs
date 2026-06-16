/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Los placeholders y las futuras fotos reales viven en /public.
    // Si en producción las fotos pasan a un CDN, añade aquí remotePatterns.
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
