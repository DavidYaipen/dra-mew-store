'use client';

import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import styles from './Toast.module.css';

/** Notificación efímera inferior, con acción opcional "Ver carrito →". */
export function Toast() {
  const router = useRouter();
  const { toast, dismissToast } = useStore();

  if (!toast) return null;

  return (
    <div className={styles.toast} role="status" aria-live="polite">
      <span className={styles.check} data-kind={toast.kind} aria-hidden>
        {toast.kind === 'warning' ? '!' : '✓'}
      </span>
      {toast.message}
      {toast.cta && (
        <button
          type="button"
          className={styles.cta}
          onClick={() => {
            dismissToast();
            router.push('/carrito');
          }}
        >
          Ver carrito →
        </button>
      )}
    </div>
  );
}
