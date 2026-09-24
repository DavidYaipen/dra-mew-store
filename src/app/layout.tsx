import type { Metadata } from 'next';
import { Manrope, Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { STORE_NAME } from '@/lib/constants';
import { StoreProvider } from '@/store/StoreProvider';
import { AppChrome } from '@/components/layout/AppChrome';
import { Toast } from '@/components/layout/Toast';
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
    'Peluches, figuras, cartas y ropa Pokémon originales. Piezas seleccionadas para fans y coleccionistas, con recojo gratis en nuestros puntos de recojo.',
  metadataBase: new URL('https://dramewstore.com'),
  icons: {
    icon: '/logo/logo.png',
  },
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
          <AppChrome>{children}</AppChrome>
          <Toast />
        </StoreProvider>
      </body>
    </html>
  );
}
