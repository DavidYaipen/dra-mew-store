'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { signup } from '@/lib/supabase/auth';
import styles from './page.module.css';

export default function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    searchParams.then((p) => {
      if (p.error) setError(decodeURIComponent(p.error));
      if (p.success) setSuccess(p.success);
    });
  }, [searchParams]);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Crear cuenta</h1>
        <p className={styles.subtitle}>Regístrate para hacer pedidos y guardar tus favoritos.</p>

        <form
          className={styles.form}
          onSubmit={() => setLoading(true)}
          action={signup}
        >
          <div className={styles.field}>
            <label htmlFor="name">Nombre</label>
            <input id="name" name="name" type="text" required placeholder="Tu nombre" />
          </div>
          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required placeholder="tu@email.com" />
          </div>
          <div className={styles.field}>
            <label htmlFor="password">Contraseña</label>
            <input id="password" name="password" type="password" required placeholder="Mínimo 6 caracteres" minLength={6} />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          {success === '1' && (
            <div className={styles.success}>
              ✓ Cuenta creada. Revisa tu email para confirmar tu cuenta.
            </div>
          )}

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Creando...' : 'Crear cuenta'}
          </button>
        </form>

        <div className={styles.links}>
          <Link href="/login">¿Ya tienes cuenta? Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
}
