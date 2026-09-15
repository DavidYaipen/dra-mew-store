'use client';

import { useState } from 'react';
import styles from './NewsletterForm.module.css';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setStatus('loading');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className={styles.success}>
        ✓ ¡Gracias por suscribirte! Pronto recibirás novedades.
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="email"
        className={styles.input}
        placeholder="tu@email.com"
        value={email}
        onChange={(e) => { setEmail(e.target.value); setStatus('idle'); }}
        required
      />
      <button type="submit" className={styles.btn} disabled={status === 'loading'}>
        {status === 'loading' ? '...' : 'Suscribirme'}
      </button>
      {status === 'error' && <div className={styles.error}>Error al suscribir. Intenta de nuevo.</div>}
    </form>
  );
}
