import type { Metadata } from 'next';
import { LegalLayout } from '@/components/help/LegalLayout';

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
  description:
    'Condiciones generales de uso y compra en Dra. Mew Store.',
};

export default function TerminosPage() {
  return (
    <LegalLayout title="Términos y Condiciones" lastUpdated="1 de septiembre de 2026">
      <h2>1. Acceptación de los términos</h2>
      <p>
        Al acceder y utilizar la tienda online de Dra. Mew Store, aceptas íntegramente estos
        términos y condiciones. Si no estás de acuerdo, te rogamos no utilices la tienda.
      </p>

      <h2>2. Información de la tienda</h2>
      <ul>
        <li><strong>Razón social:</strong> Dra. Mew Store</li>
        <li><strong>Actividad:</strong> Venta online de coleccionables Pokémon</li>
        <li><strong>Email:</strong> hola@dramewstore.com</li>
      </ul>

      <h2>3. Productos</h2>
      <p>
        Todos los productos mostrados son originales y con licencia oficial. Las imágenes son
        representativas y pueden diferir ligeramente del producto real en color o detalles menores.
        La Tienda se reserva el derecho de modificar el catálogo sin previo aviso.
      </p>

      <h2>4. Precos e impuestos</h2>
      <p>
        Todos los precios incluyen IVA (21%). Los gastos de envío no están incluidos en el precio del
        producto y se muestran antes de finalizar la compra. La Tienda se reserva el derecho de
        modificar los precios en cualquier momento.
      </p>

      <h2>5. Proceso de compra</h2>
      <ol>
        <li>Selecciona los productos y añádelos al carrito.</li>
        <li>Completa los datos de envío y facturación.</li>
        <li>Elige el método de pago.</li>
        <li>Confirma el pedido. Recibirás un email de confirmación.</li>
      </ol>
      <p>
        El contrato de compraventa se formaliza cuando recibes el email de confirmación del pedido.
        La Tienda se reserva el derecho de rechazar pedidos en casos de error de precio, stock
        insuficiente o sospecha de fraude.
      </p>

      <h2>6. Métodos de pago</h2>
      <p>Aceptamos:</p>
      <ul>
        <li>Visa y Mastercard (cifrado SSL)</li>
        <li>PayPal</li>
      </ul>
      <p>
        No se aceptan transferencias bancarias, contrareembolso ni criptomonedas.
      </p>

      <h2>7. Envíos</h2>
      <p>
        Los envíos se realizan a la Península, Baleares, Ceuta, Melilla y Canarias. Los plazos de
        entrega son orientativos y no son vinculantes. La Tienda no se responsabiliza de retrasos
        causados por el servicio de mensajería.
      </p>

      <h2>8. Propiedad intelectual</h2>
      <p>
        Todo el contenido de la tienda (diseños, textos, fotografías, logotipos, iconos, software) es
        propiedad de Dra. Mew Store o de sus proveedores y está protegido por las leyes de propiedad
        intelectual. Queda prohibida su reproducción total o parcial sin autorización expresa.
      </p>

      <h2>9. Limitación de responsabilidad</h2>
      <p>
        La Tienda no será responsable de daños derivados de:
      </p>
      <ul>
        <li>Uso indebido de los productos.</li>
        <li>Interrupciones del servicio o errores en la web.</li>
        <li>Retrasos en la entrega atribuibles al transportista.</li>
      </ul>

      <h2>10. Legislación aplicable</h2>
      <p>
        Estos términos se rigen por la legislación española. Para cualquier controversia, las partes
        se someten a los juzgados y tribunales de la ciudad del domicilio del comprador, salvo que
        la ley establezca otra cosa.
      </p>
    </LegalLayout>
  );
}
