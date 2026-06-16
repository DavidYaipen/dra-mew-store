import Image from 'next/image';

interface ProductImageProps {
  src: string;
  alt: string;
  /** Lado del cuadro de la imagen en px (las piezas 3D son cuadradas). */
  size: number;
  /** Sombra de proyección que asienta la pieza sobre la superficie. */
  shadow?: string;
  priority?: boolean;
}

/**
 * Imagen de producto. Envuelve next/image y aplica la sombra "object" del DS.
 * Sirve igual para los placeholders 3D que para fotos reales en /products.
 */
export function ProductImage({
  src,
  alt,
  size,
  shadow = '0 14px 20px rgba(14,15,18,.18)',
  priority = false,
}: ProductImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      priority={priority}
      style={{
        width: size,
        height: 'auto',
        objectFit: 'contain',
        filter: `drop-shadow(${shadow})`,
      }}
    />
  );
}
