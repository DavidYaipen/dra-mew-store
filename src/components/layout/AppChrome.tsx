'use client';

import { Suspense, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { CategoryNav } from '@/components/layout/CategoryNav';
import { Footer } from '@/components/layout/Footer';
import { BackToTop } from '@/components/layout/BackToTop';
import { FloatingWhatsApp } from '@/components/layout/FloatingWhatsApp';

/**
 * El panel /admin tiene su propio layout (sidebar fijo + header propio) y no
 * debe llevar encima el header/nav/footer de la tienda — se ven duplicados y
 * el sidebar fijo del admin queda tapando el header de la tienda.
 */
export function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <AnnouncementBar />
      <Header />
      <Suspense fallback={null}>
        <CategoryNav />
      </Suspense>
      <main style={{ minHeight: '62vh' }}>{children}</main>
      <Footer />
      <BackToTop />
      <FloatingWhatsApp />
    </>
  );
}
