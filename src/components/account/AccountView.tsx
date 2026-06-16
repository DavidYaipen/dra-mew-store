'use client';

import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/Button';
import { ProductImage } from '@/components/ui/ProductImage';
import field from '@/components/ui/Field.module.css';
import styles from './AccountView.module.css';

export function AccountView() {
  const { showToast } = useStore();

  return (
    <div className={styles.card}>
      <div className={styles.head}>
        <ProductImage src="/assets/thiings/profile.png" alt="" size={64} shadow="0 12px 18px rgba(14,15,18,.16)" />
        <h1 className={styles.title}>Bienvenido de nuevo</h1>
        <p className={styles.subtitle}>Accede a tu cuenta de coleccionista</p>
      </div>

      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          showToast('Sesión iniciada (demo)');
        }}
      >
        <label className={field.label}>
          <span className={field.labelText}>Email</span>
          <input className={field.input} type="email" placeholder="tu@email.com" required />
        </label>
        <label className={field.label}>
          <span className={field.labelText}>Contraseña</span>
          <input className={field.input} type="password" placeholder="••••••••" required />
        </label>
        <div className={styles.forgot}>
          <a className={styles.link}>Olvidé mi contraseña</a>
        </div>
        <Button type="submit" variant="primary" size="lg" fullWidth>
          Iniciar sesión
        </Button>
        <div className={styles.divider}>
          <span className={styles.rule} />
          <span className={styles.or}>o</span>
          <span className={styles.rule} />
        </div>
        <button
          type="button"
          className={styles.secondary}
          onClick={() => showToast('Cuenta creada (demo)')}
        >
          Crear cuenta nueva
        </button>
      </form>
    </div>
  );
}
