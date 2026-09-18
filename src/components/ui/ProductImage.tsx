import Image from 'next/image';

interface ProductImageProps {
  src: string;
  alt: string;
  /** Lado del cuadro de la imagen en px (las piezas 3D son cuadradas). Ignorado si `fill` es true. */
  size?: number;
  /** Si es true, la imagen llena su contenedor (que debe tener `position: relative`). */
  fill?: boolean;
  /** Atributo `sizes` de next/image, requerido cuando `fill` es true. */
  sizes?: string;
  /** Sombra de proyección que asienta la pieza sobre la superficie. */
  shadow?: string;
  /** Reduce la opacidad levemente (p. ej. para productos agotados). */
  faded?: boolean;
  priority?: boolean;
}

/**
 * Imagen de producto. Envuelve next/image y aplica la sombra "object" del DS.
 * Soporta imagenes locales y de Supabase Storage, en tamaño fijo (`size`) o
 * llenando su contenedor (`fill`, para tarjetas con aspect-ratio responsive).
 */
export function ProductImage({
  src,
  alt,
  size,
  fill = false,
  sizes,
  shadow = '0 14px 20px rgba(14,15,18,.18)',
  faded = false,
  priority = false,
}: ProductImageProps) {
  const filter = `${faded ? 'opacity(0.55) ' : ''}drop-shadow(${shadow})`;

  // Si es una URL externa (Supabase Storage), usar img nativo
  if (src.startsWith('http')) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        width={fill ? undefined : size}
        height={fill ? undefined : size}
        style={
          fill
            ? {
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter,
              }
            : {
                width: size,
                height: size,
                objectFit: 'contain',
                filter,
              }
        }
      />
    );
  }

  // Para imagenes locales, usar next/image
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        style={{
          objectFit: 'contain',
          filter,
        }}
      />
    );
  }

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
        filter,
      }}
    />
  );
}
