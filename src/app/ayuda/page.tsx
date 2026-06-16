import type { Metadata } from 'next';
import { Suspense } from 'react';
import type { HelpTab } from '@/lib/faq';
import { Section } from '@/components/layout/Section';
import { Breadcrumb } from '@/components/layout/Breadcrumb';
import { HelpTabs } from '@/components/help/HelpTabs';
import { FaqAccordion } from '@/components/help/FaqAccordion';
import { InfoCards, type InfoCard } from '@/components/help/InfoCards';
import { ContactForm } from '@/components/help/ContactForm';
import { LinkButton } from '@/components/ui/Button';
import styles from './page.module.css';

export const metadata: Metadata = { title: 'Centro de ayuda' };

const VALID_TABS: HelpTab[] = ['faq', 'envios', 'devoluciones', 'contacto'];

const ENVIOS: InfoCard[] = [
  {
    icon: 'lightning.png',
    title: 'Plazos de entrega',
    text: 'Península 24-48h · Baleares 2-3 días · Canarias 5-7 días laborables.',
  },
  {
    icon: 'shield.png',
    title: 'Costes de envío',
    text: 'Gratis desde 35 €. Por debajo, una tarifa plana de 3,95 €.',
  },
  {
    icon: 'refresh.png',
    title: 'Seguimiento',
    text: 'Recibirás un email con el número de seguimiento al salir tu pedido.',
  },
];

const DEVOLUCIONES: InfoCard[] = [
  { icon: 'refresh.png', title: '30 días', text: 'Desde que recibes tu pedido para solicitar la devolución.' },
  {
    icon: 'shield.png',
    title: 'Condiciones',
    text: 'El producto debe estar sin usar y con su embalaje original.',
  },
  { icon: 'lock.png', title: 'Reembolso', text: 'Te devolvemos el importe en 5-7 días tras recibir el paquete.' },
];

export default async function HelpPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const active: HelpTab = VALID_TABS.includes(tab as HelpTab) ? (tab as HelpTab) : 'faq';

  return (
    <Section background="#fff" maxWidth={920}>
      <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Ayuda' }]} />
      <h1 className={styles.title}>Centro de ayuda</h1>
      <p className={styles.intro}>Resolvemos tus dudas sobre pedidos, envíos y devoluciones.</p>

      <Suspense fallback={null}>
        <HelpTabs active={active} />
      </Suspense>

      {active === 'faq' && <FaqAccordion />}

      {active === 'envios' && (
        <div>
          <p className={styles.sectionIntro}>
            Preparamos cada pedido con cuidado y lo enviamos con seguimiento. Estos son los plazos y
            costes habituales.
          </p>
          <InfoCards cards={ENVIOS} />
        </div>
      )}

      {active === 'devoluciones' && (
        <div>
          <p className={styles.sectionIntro}>
            Si algo no es lo que esperabas, tienes 30 días para devolverlo. Así de fácil.
          </p>
          <InfoCards cards={DEVOLUCIONES} />
          <div className={styles.returnCta}>
            <LinkButton href="/ayuda?tab=contacto" variant="primary" size="md">
              Iniciar una devolución
            </LinkButton>
          </div>
        </div>
      )}

      {active === 'contacto' && <ContactForm />}
    </Section>
  );
}
