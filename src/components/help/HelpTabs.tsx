'use client';

import Link from 'next/link';
import { HELP_TABS, type HelpTab } from '@/lib/faq';
import styles from './HelpTabs.module.css';

export function HelpTabs({ active }: { active: HelpTab }) {
  return (
    <div className={styles.tabs} role="tablist">
      {HELP_TABS.map((tab) => (
        <Link
          key={tab.key}
          href={`/ayuda?tab=${tab.key}`}
          className={styles.tab}
          data-active={tab.key === active}
          role="tab"
          aria-selected={tab.key === active}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
