import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { FaqAccordion } from './FaqAccordion';
import { FAQS } from '@/lib/faq';

describe('FaqAccordion', () => {
  it('lista todas las preguntas cerradas por defecto', () => {
    render(<FaqAccordion />);
    FAQS.forEach((f) => expect(screen.getByText(f.q)).toBeInTheDocument());
    expect(screen.queryByText(FAQS[0].a)).not.toBeInTheDocument();
  });

  it('abre y cierra una respuesta al pulsar', async () => {
    const user = userEvent.setup();
    render(<FaqAccordion />);
    const first = screen.getByRole('button', { name: new RegExp(FAQS[0].q) });

    await user.click(first);
    expect(screen.getByText(FAQS[0].a)).toBeInTheDocument();
    expect(first).toHaveAttribute('aria-expanded', 'true');

    await user.click(first);
    expect(screen.queryByText(FAQS[0].a)).not.toBeInTheDocument();
  });

  it('solo mantiene una respuesta abierta a la vez', async () => {
    const user = userEvent.setup();
    render(<FaqAccordion />);
    await user.click(screen.getByRole('button', { name: new RegExp(FAQS[0].q) }));
    await user.click(screen.getByRole('button', { name: new RegExp(FAQS[1].q) }));
    expect(screen.getByText(FAQS[1].a)).toBeInTheDocument();
    expect(screen.queryByText(FAQS[0].a)).not.toBeInTheDocument();
  });
});
