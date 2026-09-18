'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { login, resendConfirmation } from '@/lib/supabase/auth';
import { EyeIcon, EyeOffIcon } from '@/components/ui/Icons';
import styles from './page.module.css';

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    searchParams.then((p) => {
      if (p.error) setError(decodeURIComponent(p.error));
    });
  }, [searchParams]);

  const isEmailNotConfirmed = error.toLowerCase().includes('email not confirmed');

  async function handleResend() {
    if (!email) {
      setError('Ingresa tu email para reenviar la confirmación');
      return;
    }
    setResending(true);
    setResendSuccess(false);
    const { error: resendError } = await resendConfirmation(email);
    if (resendError) {
      setError(resendError);
    } else {
      setResendSuccess(true);
      setError('');
    }
    setResending(false);
  }

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
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="password">Contraseña</label>
            <div className={styles.passwordWrap}>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                minLength={6}
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className={styles.error}>
              {isEmailNotConfirmed ? (
                <>
                  <strong>Tu email no ha sido confirmado.</strong>
                  <span>Revisa tu bandeja de entrada o spam, o haz clic en reenviar para recibir un nuevo link de confirmación.</span>
                </>
              ) : (
                error
              )}
            </div>
          )}

          {resendSuccess && (
            <div className={styles.success}>
              ✓ Email de confirmación reenviado. Revisa tu bandeja de entrada.
            </div>
          )}

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? 'Entrando...' : 'Iniciar sesión'}
          </button>

          {isEmailNotConfirmed && (
            <button
              type="button"
              className={styles.resendBtn}
              onClick={handleResend}
              disabled={resending}
            >
              {resending ? 'Reenviando...' : 'Reenviar email de confirmación'}
            </button>
          )}
        </form>

        <div className={styles.links}>
          <Link href="/registro">¿No tienes cuenta? Regístrate</Link>
          <Link href="/olvido-contrasena">¿Olvidaste tu contraseña?</Link>
        </div>
      </div>
    </div>
  );
}
