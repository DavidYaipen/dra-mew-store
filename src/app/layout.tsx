import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Manrope, Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { STORE_NAME } from '@/lib/constants';
import { StoreProvider } from '@/store/StoreProvider';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { CategoryNav } from '@/components/layout/CategoryNav';
import { Footer } from '@/components/layout/Footer';
import { Toast } from '@/components/layout/Toast';
import { BackToTop } from '@/components/layout/BackToTop';
import { FloatingWhatsApp } from '@/components/layout/FloatingWhatsApp';
import { AnalyticsScripts } from '@/components/layout/AnalyticsScripts';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' });
const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument',
  display: 'swap',
});
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono-jb',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: `${STORE_NAME} · Coleccionables Pokémon`,
    template: `%s · ${STORE_NAME}`,
  },
  description:
    'Peluches, figuras, cartas y ropa Pokémon originales. Piezas seleccionadas para fans y coleccionistas, con envío gratis desde 35 €.',
  metadataBase: new URL('https://dramewstore.com'),
  openGraph: {
    title: `${STORE_NAME} · Coleccionables Pokémon`,
    description: 'Coleccionables Pokémon originales para fans de todas las edades.',
    locale: 'es_ES',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${manrope.variable} ${instrument.variable} ${jetbrains.variable}`}>
      <body>
        <AnalyticsScripts />
        <StoreProvider>
          <AnnouncementBar />
          <Header />
          <Suspense fallback={null}>
            <CategoryNav />
          </Suspense>
          <main style={{ minHeight: '62vh' }}>{children}</main>
          <Footer />
          <Toast />
          <BackToTop />
          <FloatingWhatsApp />
        </StoreProvider>
      </body>
    </html>
  );
}
