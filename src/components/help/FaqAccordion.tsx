'use client';

import { useState } from 'react';
import { FAQS } from '@/lib/faq';
import styles from './FaqAccordion.module.css';

export function FaqAccordion() {
  const [open, setOpen] = useState(-1);

  return (
    <div className={styles.list}>
      {FAQS.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div key={faq.q} className={styles.item}>
            <button
              type="button"
              className={styles.question}
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : i)}
            >
              <span className={styles.q}>{faq.q}</span>
              <span className={styles.icon} data-open={isOpen}>
                +
              </span>
            </button>
            {isOpen && <div className={styles.answer}>{faq.a}</div>}
          </div>
        );
      })}
    </div>
  );
}
