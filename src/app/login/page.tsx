'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { login } from '@/lib/supabase/auth';
import styles from './page.module.css';

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    searchParams.then((p) => {
      if (p.error) setError(decodeURIComponent(p.error));
    });
  }, [searchParams]);

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Iniciar sesión</h1>
        <p className={styles.subtitle}>Accede a tu cuenta para ver tus pedidos y favoritos.</p>

        <form
          className={styles.form}
          onSubmit={() => setLoading(true)}
          action={login}
        >
          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required placeholder="tu@email.com" />
          </div>
          <div className={styles.field}>
            <label htmlFor="password">Contraseña</label>
            <input id="password" name="password" type="password" required placeholder="••••••••" minLength={6} />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Entrando...' : 'Iniciar sesión'}
          </button>
        </form>

        <div className={styles.links}>
          <Link href="/registro">¿No tienes cuenta? Regístrate</Link>
          <Link href="/olvido-contraseña">¿Olvidaste tu contraseña?</Link>
        </div>
      </div>
    </div>
  );
}
