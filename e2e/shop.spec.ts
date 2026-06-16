import { test, expect } from '@playwright/test';

test.describe('Dra. Mew Store', () => {
  test('flujo de compra: producto → carrito → finalizar', async ({ page }) => {
    await page.goto('/');

    // La home muestra el hero y el drop destacado.
    await expect(page.getByRole('heading', { name: /compañero/i })).toBeVisible();

    // Abrir la ficha del Peluche Mew desde el drop de la semana.
    await page.getByRole('link', { name: /Peluche Mew 30 cm/ }).first().click();
    await expect(page).toHaveURL(/\/producto\/1$/);
    await expect(page.getByRole('heading', { name: 'Peluche Mew 30 cm' })).toBeVisible();

    // Añadir al carrito → toast + badge en la cabecera.
    // (El primer botón es el de la ficha; los demás son productos relacionados.)
    await page.getByRole('button', { name: 'Añadir al carrito' }).first().click();
    await expect(page.getByText('Añadido al carrito')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Carrito', exact: true })).toContainText('1');

    // Ir al carrito y finalizar la compra.
    await page.getByRole('link', { name: 'Carrito', exact: true }).click();
    await expect(page).toHaveURL(/\/carrito$/);
    await expect(page.getByText('Peluche Mew 30 cm')).toBeVisible();
    await page.getByRole('button', { name: 'Finalizar compra' }).click();
    await expect(page.getByText(/Pedido realizado/)).toBeVisible();
  });

  test('búsqueda lleva a la página de resultados', async ({ page }) => {
    await page.goto('/');
    const search = page.getByPlaceholder('Buscar Mew, figuras, cartas... (Enter)');
    await search.fill('pikachu');
    await search.press('Enter');

    await expect(page).toHaveURL(/\/productos\?q=pikachu/);
    await expect(page.getByRole('heading', { name: 'Resultados para "pikachu"' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Peluche Pikachu/ })).toBeVisible();
  });

  test('filtrar por categoría desde la navegación', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Figuras', exact: true }).first().click();
    await expect(page).toHaveURL(/\/productos\?cat=Figuras/);
    await expect(page.getByRole('heading', { name: 'Figuras' })).toBeVisible();
  });
});
