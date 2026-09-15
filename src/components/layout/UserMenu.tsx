'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import { UserIcon } from '@/components/ui/Icons';
import styles from './Header.module.css';

export function UserMenu() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <Link href="/cuenta" className={styles.iconBtn} aria-label="Mi cuenta">
        <UserIcon size={21} />
      </Link>
    );
  }

  if (user) {
    const name = user.user_metadata?.name || user.email?.split('@')[0];
    return (
      <Link href="/cuenta" className={styles.userBtn} aria-label="Mi cuenta">
        <span className={styles.userAvatar}>{name?.charAt(0).toUpperCase()}</span>
        <span className={styles.userName}>{name}</span>
      </Link>
    );
  }

  return (
    <Link href="/login" className={styles.iconBtn} aria-label="Iniciar sesión">
      <UserIcon size={21} />
    </Link>
  );
}
