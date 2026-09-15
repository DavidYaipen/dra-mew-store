import type { Metadata } from 'next';
import { LegalLayout } from '@/components/help/LegalLayout';

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description:
    'Conoce cómo Dra. Mew Store recopila, usa y protege tus datos personales conforme al RGPD.',
};

export default function PrivacidadPage() {
  return (
    <LegalLayout title="Política de Privacidad" lastUpdated="1 de septiembre de 2026">
      <h2>1. Responsable del tratamiento</h2>
      <p>
        Dra. Mew Store (en adelante, «la Tienda») es responsable del tratamiento de los datos
        personales de sus clientes y visitantes. Si tienes preguntas sobre esta política, puedes
        contactarnos en <strong>hola@dramewstore.com</strong>.
      </p>

      <h2>2. Datos que recopilamos</h2>
      <p>Recopilamos los siguientes datos cuando utilizas nuestra tienda:</p>
      <ul>
        <li>
          <strong>Datos de identificación:</strong> nombre, apellidos, dirección de correo electrónico.
        </li>
        <li>
          <strong>Datos de envío:</strong> dirección postal, código postal, ciudad, teléfono de
          contacto.
        </li>
        <li>
          <strong>Datos de navegación:</strong> dirección IP, tipo de navegador, páginas visitadas,
          tiempo de permanencia.
        </li>
        <li>
          <strong>Datos de pago:</strong> la Tienda no almacena números de tarjeta. El procesamiento
          lo realiza nuestro proveedor de pagos con cifrado SSL.
        </li>
      </ul>

      <h2>3. Finalidad del tratamiento</h2>
      <p>Utilizamos tus datos para:</p>
      <ul>
        <li>Gestionar y enviar tu pedido.</li>
        <li>Enviar comunicaciones sobre tu pedido (confirmación, seguimiento).</li>
        <li>Responder a consultas y solicitudes de atención al cliente.</li>
        <li>Enviar newsletters y promociones (solo si te has suscrito).</li>
        <li>Mejorar la experiencia de navegación y el catálogo de productos.</li>
      </ul>

      <h2>4. Base legal del tratamiento</h2>
      <p>
        El tratamiento se basa en la ejecución de un contrato (tu pedido), tu consentimiento
        (newsletter) y el interés legítimo de mejorar nuestro servicio.
      </p>

      <h2>5. Conservación de datos</h2>
      <p>
        Los datos de pedido se conservan durante 5 años por obligación fiscal. Los datos de
        newsletter se mantienen mientras no te des suscribas.
      </p>

      <h2>6. Tus derechos (RGPD)</h2>
      <p>Tienes derecho a:</p>
      <ul>
        <li>Acceder a tus datos personales.</li>
        <li>Solicitar la rectificación o supresión de tus datos.</li>
        <li>Oponerte al tratamiento o solicitar la limitación.</li>
        <li>Solicitar la portabilidad de tus datos.</li>
        <li>Retirar tu consentimiento en cualquier momento.</li>
      </ul>
      <p>
        Para ejercer estos derechos, envía un email a <strong>hola@dramewstore.com</strong> con una
        copia de tu documento de identidad.
      </p>

      <h2>7. Cookies</h2>
      <p>
        Utilizamos cookies técnicas necesarias para el funcionamiento de la tienda. No utilizamos
        cookies de rastreo publicitario sin tu consentimiento expreso.
      </p>

      <h2>8. Seguridad</h2>
      <p>
        Implementamos medidas de seguridad técnicas y organizativas para proteger tus datos contra
        acceso no autorizado, pérdida o alteración. Todas las transacciones de pago se cifran con
        SSL/TLS.
      </p>
    </LegalLayout>
  );
}
