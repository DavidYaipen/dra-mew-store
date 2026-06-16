import Link from 'next/link';
import type { ButtonHTMLAttributes, ComponentProps } from 'react';
import styles from './Button.module.css';

type Variant = 'primary' | 'secondary';
type Size = 'md' | 'lg';

function buttonClasses(variant: Variant, size: Size, fullWidth: boolean, className?: string) {
  return [
    styles.button,
    styles[variant],
    styles[size],
    fullWidth ? styles.fullWidth : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

/**
 * Botón principal del design system (Universal Identity).
 * `primary` es el azul de marca con glow; `secondary` el contorno claro.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={buttonClasses(variant, size, fullWidth, className)} {...props} />
  );
}

interface LinkButtonProps extends ComponentProps<typeof Link> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

/** Enlace de navegación con apariencia de botón del design system. */
export function LinkButton({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  ...props
}: LinkButtonProps) {
  return <Link className={buttonClasses(variant, size, fullWidth, className)} {...props} />;
}
