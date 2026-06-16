import type { Metadata } from 'next';
import { Section } from '@/components/layout/Section';
import { AccountView } from '@/components/account/AccountView';

export const metadata: Metadata = { title: 'Mi cuenta' };

export default function AccountPage() {
  return (
    <Section background="var(--graphite-50)" maxWidth={460} style={{ paddingTop: 48 }}>
      <AccountView />
    </Section>
  );
}
