import type { Metadata } from 'next';
import { LegalLayout } from '@/components/help/LegalLayout';

export const metadata: Metadata = {
  title: 'Política de Devoluciones',
  description:
    'Conoce el proceso, plazos y condiciones para devolver un producto en Dra. Mew Store.',
};

export default function DevolucionesPage() {
  return (
    <LegalLayout title="Política de Devoluciones" lastUpdated="1 de septiembre de 2026">
      <h2>1. Derecho de desistimiento</h2>
      <p>
        Tienes derecho a devolver cualquier producto adquirido en Dra. Mew Store <strong>sin necesidad
        de justificar la causa</strong> dentro de los <strong>30 días naturales</strong> siguientes a la recepción del
        pedido, conforme a la normativa de consumo vigente.
      </p>

      <h2>2. Coniciones para la devolución</h2>
      <p>Para que la devolución sea aceptada, el producto debe:</p>
      <ul>
        <li>Estar sin usar, sin lavar y sin manipular.</li>
        <li>Conservar todas las etiquetas originales.</li>
        <li>Estar en su embalaje original, sin daños.</li>
        <li>Incluir todos los accesorios y manuales que lo acompañaban.</li>
      </ul>
      <p>
        <strong>No se aceptan devoluciones</strong> de productos personalizados, íntimos o de higiene,
        ni de productos que, por su naturaleza, no puedan ser devueltos.
      </p>

      <h2>3. Proceso de devolución</h2>
      <ol>
        <li>
          <strong>Contacta con nosotros:</strong> envía un email a{' '}
          <strong>hola@dramewstore.com</strong> indicando tu número de pedido y el motivo de la
          devolución.
        </li>
        <li>
          <strong>Recibe instrucciones:</strong> te confirmaremos la aceptación de la devolución y te
          proporcionaremos las instrucciones para el envío.
        </li>
        <li>
          <strong>Envía el producto:</strong> el gasto de envío de devolución corre por cuenta del
          cliente, salvo en casos de producto defectuoso o error de envío.
        </li>
        <li>
          <strong>Recepción y revisión:</strong> una vez recibido el producto, lo revisaremos en un
          plazo máximo de 48 horas.
        </li>
        <li>
          <strong>Reembolso:</strong> si la devolución es aceptada, procederemos al reembolso en un
          plazo máximo de 5 días laborables mediante el mismo método de pago utilizado en la compra.
        </li>
      </ol>

      <h2>4. Productos defectuosos</h2>
      <p>
        Si el producto recibido está defectuoso, dañado o no corresponde con el pedido, contáctanos
        en un plazo máximo de <strong>48 horas</strong> desde la recepción. En estos casos:
      </p>
      <ul>
        <li>Nos hacemos cargo del coste de envío de devolución.</li>
        <li>Opciones: reemplazo del producto, reembolso completo o descuento para futuras compras.</li>
      </ul>

      <h2>5. Reembolso</h2>
      <p>
        El reembolso incluye el precio del producto y los gastos de envío iniciales (envío estándar).
        No se reembolsan gastos de envío adicionales (express, envío a Ceuta/Melilla, etc.) salvo
        error imputable a la Tienda.
      </p>

      <h2>6. Cambios</h2>
      <p>
        Si deseas cambiar un producto por otro tamaño o variante, contacta con nosotros y gestione el
        cambio sujeto a disponibilidad de stock.
      </p>
    </LegalLayout>
  );
}
