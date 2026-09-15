/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Los placeholders y las futuras fotos reales viven en /public.
    // Si en producción las fotos pasan a un CDN, añade aquí remotePatterns.
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // Supabase Storage — para fotos reales de productos
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      // Si usas un CDN externo, añade aquí sus patterns
    ],
  },
};

export default nextConfig;
