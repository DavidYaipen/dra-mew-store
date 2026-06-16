'use client';

import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/Button';
import { ProductImage } from '@/components/ui/ProductImage';
import field from '@/components/ui/Field.module.css';
import styles from './ContactForm.module.css';

export function ContactForm() {
  const { showToast } = useStore();

  return (
    <div className={styles.layout}>
      <form
        className={styles.card}
        onSubmit={(e) => {
          e.preventDefault();
          showToast('Mensaje enviado. Te responderemos pronto.');
          e.currentTarget.reset();
        }}
      >
        <div className={styles.cardTitle}>Escríbenos</div>
        <div className={styles.fields}>
          <label className={field.label}>
            <span className={field.labelText}>Nombre</span>
            <input className={field.input} placeholder="Tu nombre" required />
          </label>
          <label className={field.label}>
            <span className={field.labelText}>Email</span>
            <input className={field.input} type="email" placeholder="tu@email.com" required />
          </label>
          <label className={field.label}>
            <span className={field.labelText}>Mensaje</span>
            <textarea
              className={`${field.input} ${field.textarea}`}
              rows={4}
              placeholder="¿En qué podemos ayudarte?"
              required
            />
          </label>
          <Button type="submit" variant="primary" size="lg" fullWidth>
            Enviar mensaje
          </Button>
        </div>
      </form>

      <aside className={styles.info}>
        <ProductImage src="/assets/thiings/mail.png" alt="" size={48} shadow="0 10px 14px rgba(14,15,18,.14)" />
        <div className={styles.infoTitle}>Contacto directo</div>
        <div className={styles.infoList}>
          <div>
            <div className={styles.infoLabel}>Correo</div>
            <div className={styles.infoValue}>hola@dramewstore.com</div>
          </div>
          <div>
            <div className={styles.infoLabel}>Horario</div>
            <div className={styles.infoValue}>Lun a Vie · 9:00 - 18:00</div>
          </div>
          <div>
            <div className={styles.infoLabel}>Respuesta</div>
            <div className={styles.infoValue}>En menos de 24 horas</div>
          </div>
        </div>
      </aside>
    </div>
  );
}
