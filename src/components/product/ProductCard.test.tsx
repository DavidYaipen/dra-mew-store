import { describe, it, expect, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { renderWithStore, screen } from '@/test/utils';
import { useStore } from '@/store/useStore';
import { ProductCard } from './ProductCard';
import { getProduct } from '@/lib/catalog';

/** Sonda que expone los contadores del store en el DOM. */
function Probe() {
  const { cartCount, wishCount } = useStore();
  return (
    <div>
      <span data-testid="cart">{cartCount}</span>
      <span data-testid="wish">{wishCount}</span>
    </div>
  );
}

describe('ProductCard', () => {
  beforeEach(() => window.localStorage.clear());

  it('muestra nombre, precio y enlaza a la ficha', () => {
    const product = getProduct(1)!;
    renderWithStore(<ProductCard product={product} />);
    expect(screen.getByText('Peluche Mew 30 cm')).toBeInTheDocument();
    expect(screen.getByText('34,99 €')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/producto/1');
  });

  it('muestra etiqueta de descuento y precio anterior en rebajas', () => {
    const product = getProduct(2)!; // Pikachu con oldPrice
    renderWithStore(<ProductCard product={product} showCategory />);
    expect(screen.getByText('-25%')).toBeInTheDocument();
    expect(screen.getByText('39,99 €')).toBeInTheDocument();
  });

  it('añade al carrito sin navegar', async () => {
    const user = userEvent.setup();
    const product = getProduct(1)!;
    renderWithStore(
      <>
        <Probe />
        <ProductCard product={product} />
      </>,
    );
    await user.click(screen.getByRole('button', { name: 'Añadir al carrito' }));
    expect(screen.getByTestId('cart')).toHaveTextContent('1');
  });

  it('alterna favoritos al pulsar el corazón', async () => {
    const user = userEvent.setup();
    const product = getProduct(1)!;
    renderWithStore(
      <>
        <Probe />
        <ProductCard product={product} />
      </>,
    );
    const heart = screen.getByRole('button', { name: 'Añadir a favoritos' });
    await user.click(heart);
    expect(screen.getByTestId('wish')).toHaveTextContent('1');
    expect(screen.getByRole('button', { name: 'Quitar de favoritos' })).toBeInTheDocument();
  });
});
