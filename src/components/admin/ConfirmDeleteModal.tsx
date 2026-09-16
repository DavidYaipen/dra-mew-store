'use client';

import { useEffect, type ReactNode } from 'react';
import { TrashIcon, XIcon } from '@/components/admin/AdminIcons';

interface ConfirmDeleteModalProps {
  open: boolean;
  title: string;
  description: ReactNode;
  confirmLabel?: string;
  loading?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteModal({
  open,
  title,
  description,
  confirmLabel = 'Eliminar',
  loading = false,
  error,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div
      className="admin-modal-overlay"
      onClick={() => {
        if (!loading) onCancel();
      }}
    >
      <div className="admin-modal" style={{ maxWidth: 420 }} onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="admin-modal-icon" data-variant="danger">
              <TrashIcon size={20} />
            </div>
            <h2>{title}</h2>
          </div>
          <button
            className="admin-btn"
            data-variant="ghost"
            data-size="sm"
            onClick={onCancel}
            disabled={loading}
            aria-label="Cerrar"
          >
            <XIcon size={14} />
          </button>
        </div>
        <div className="admin-modal-body">
          <div style={{ fontSize: 14, color: 'var(--text-strong)', lineHeight: 1.5 }}>{description}</div>
          {error && <div className="admin-modal-error">{error}</div>}
        </div>
        <div className="admin-modal-footer">
          <button
            type="button"
            className="admin-btn"
            data-variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="admin-btn"
            data-variant="danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Eliminando…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
