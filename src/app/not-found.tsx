import { Section } from '@/components/layout/Section';
import { EmptyState } from '@/components/ui/EmptyState';

export default function NotFound() {
  return (
    <Section background="#fff">
      <EmptyState
        icon="search.png"
        title="Página no encontrada"
        description="La página que buscas no existe o se ha movido."
        actionLabel="Volver al inicio"
        actionHref="/"
      />
    </Section>
  );
}
