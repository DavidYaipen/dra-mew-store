import type { FaqItem } from './types';

/** Preguntas frecuentes del Centro de ayuda. */
export const FAQS: FaqItem[] = [
  {
    q: '¿Cuánto tarda en llegar mi pedido?',
    a: 'Los pedidos a la Península se entregan en 24-48h. Baleares en 2-3 días y Canarias en 5-7 días laborables.',
  },
  {
    q: '¿El envío es gratis?',
    a: 'El envío a domicilio tiene una tarifa plana de S/ 14.90 (S/ 19.90 en express). Si prefieres no pagar envío, recoge tu pedido gratis en uno de nuestros puntos de recojo — elígelo en el checkout.',
  },
  {
    q: '¿Los productos son originales?',
    a: 'Sí. Trabajamos únicamente con productos oficiales y con licencia. Nunca vendemos imitaciones.',
  },
  {
    q: '¿Puedo devolver un producto?',
    a: 'Tienes 30 días desde la recepción para devolverlo sin usar y con su embalaje original.',
  },
  {
    q: '¿Cómo puedo seguir mi pedido?',
    a: 'Al salir tu pedido recibirás un email con el número de seguimiento para consultarlo en todo momento.',
  },
  {
    q: '¿Qué métodos de pago aceptáis?',
    a: 'Aceptamos Visa, Mastercard y PayPal, con pago seguro y cifrado SSL.',
  },
];

export type HelpTab = 'faq' | 'envios' | 'devoluciones' | 'contacto';

export const HELP_TABS: { key: HelpTab; label: string }[] = [
  { key: 'faq', label: 'Preguntas frecuentes' },
  { key: 'envios', label: 'Envíos' },
  { key: 'devoluciones', label: 'Devoluciones' },
  { key: 'contacto', label: 'Contacto' },
];
