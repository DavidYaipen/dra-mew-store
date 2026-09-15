'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    fbq: (...args: unknown[]) => void;
  }
}

/** Google Analytics — track page views */
export function usePageView(url: string) {
  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || '', { page_path: url });
    }
  }, [url]);
}

/** Track custom events (GA + Meta Pixel) */
export function trackEvent(name: string, params?: Record<string, unknown>) {
  // Google Analytics
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, params);
  }

  // Meta Pixel
  if (typeof window.fbq === 'function') {
    window.fbq('track', name, params);
  }
}

/** Track ViewContent for product pages */
export function trackViewContent(product: { id: number; name: string; price: number; category: string }) {
  trackEvent('view_item', {
    items: [{
      item_id: String(product.id),
      item_name: product.name,
      price: product.price,
      item_category: product.category,
    }],
  });
}

/** Track AddToCart */
export function trackAddToCart(product: { id: number; name: string; price: number }, quantity: number) {
  trackEvent('add_to_cart', {
    items: [{
      item_id: String(product.id),
      item_name: product.name,
      price: product.price,
      quantity,
    }],
  });
}

/** Track BeginCheckout */
export function trackBeginCheckout(items: Array<{ id: number; name: string; price: number; qty: number }>, total: number) {
  trackEvent('begin_checkout', {
    value: total,
    currency: 'PEN',
    items: items.map((i) => ({
      item_id: String(i.id),
      item_name: i.name,
      price: i.price,
      quantity: i.qty,
    })),
  });
}

/** Track Purchase */
export function trackPurchase(orderId: string, total: number) {
  trackEvent('purchase', {
    transaction_id: orderId,
    value: total,
    currency: 'PEN',
  });
}
