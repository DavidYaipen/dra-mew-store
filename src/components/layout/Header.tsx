'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, type KeyboardEvent } from 'react';
import { useStore } from '@/store/useStore';
import { Logo } from './Logo';
import { SearchIcon, UserIcon, HeartIcon, CartIcon } from '@/components/ui/Icons';
import styles from './Header.module.css';

/** Cabecera fija: logo, búsqueda y accesos a cuenta, favoritos y carrito. */
export function Header() {
  const router = useRouter();
  const { cartCount, wishCount } = useStore();
  const [search, setSearch] = useState('');

  const onSearchKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && search.trim()) {
      router.push(`/productos?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <header className={styles.header}>
      <Logo />

      <div className={styles.search}>
        <span className={styles.searchIcon}>
          <SearchIcon size={18} />
        </span>
        <input
          className={styles.searchInput}
          placeholder="Buscar Mew, figuras, cartas... (Enter)"
          aria-label="Buscar productos"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={onSearchKey}
        />
      </div>

      <div className={styles.actions}>
        <Link href="/cuenta" className={styles.iconBtn} aria-label="Mi cuenta">
          <UserIcon size={21} />
        </Link>
        <Link href="/favoritos" className={styles.iconBtn} aria-label="Favoritos">
          <HeartIcon size={21} />
          {wishCount > 0 && (
            <span className={styles.badge} data-variant="wish">
              {wishCount}
            </span>
          )}
        </Link>
        <Link href="/carrito" className={styles.iconBtn} aria-label="Carrito">
          <CartIcon size={21} />
          {cartCount > 0 && (
            <span className={styles.badge} data-variant="cart">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
