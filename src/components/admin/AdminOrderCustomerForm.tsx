'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
  orderId: string;
  customer: { name: string; email: string; phone: string } | null;
  address: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
  } | null;
}

export function AdminOrderCustomerForm({ orderId, customer, address }: Props) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const body = {
      id: orderId,
      customer: {
        name: form.get('customer_name'),
        phone: form.get('customer_phone'),
        email: form.get('customer_email') || null,
      },
      shipping_address: {
        name: form.get('address_name'),
        street: form.get('address_street'),
        city: form.get('address_city'),
        state: form.get('address_state'),
        zip: form.get('address_zip'),
        country: form.get('address_country'),
        phone: form.get('address_phone'),
      },
    };

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setEditing(false);
        router.refresh();
      } else {
        const data = await res.json();
        alert(data.error || 'Error al guardar');
      }
    } catch {
      alert('Error de conexion');
    } finally {
      setLoading(false);
    }
  };

  if (!editing) {
    return (
      <>
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Cliente</h3>
            <button className="admin-btn" data-variant="ghost" data-size="sm" onClick={() => setEditing(true)}>
              Editar
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 14 }}>
            <div style={{ fontWeight: 600 }}>{customer?.name || 'Sin nombre'}</div>
            <div style={{ color: 'var(--text-faint)' }}>{customer?.email || 'Sin correo'}</div>
            <div style={{ color: 'var(--text-faint)' }}>{customer?.phone || 'Sin telefono'}</div>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Direccion de envio</h3>
          </div>
          {address ? (
            <div style={{ fontSize: 14, lineHeight: 1.6 }}>
              <div>{address.name}</div>
              <div>{address.street}</div>
              <div>{address.city}, {address.state} {address.zip}</div>
              <div>{address.country}</div>
              <div style={{ color: 'var(--text-faint)' }}>{address.phone}</div>
            </div>
          ) : (
            <p style={{ fontSize: 14, color: 'var(--text-faint)' }}>
              Sin dirección todavía. Coordina la entrega por WhatsApp y complétala con &quot;Editar&quot; en Cliente.
            </p>
          )}
        </div>
      </>
    );
  }

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <h3 className="admin-card-title">Editar cliente y direccion</h3>
      </div>
      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre</label>
          <input name="customer_name" type="text" defaultValue={customer?.name || ''} required />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Telefono</label>
            <input name="customer_phone" type="text" defaultValue={customer?.phone || ''} required />
          </div>
          <div className="form-group">
            <label>Email (opcional)</label>
            <input name="customer_email" type="email" defaultValue={customer?.email || ''} />
          </div>
        </div>

        <div className="form-group">
          <label>Direccion</label>
          <input name="address_street" type="text" placeholder="Calle y numero" defaultValue={address?.street || ''} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Ciudad</label>
            <input name="address_city" type="text" defaultValue={address?.city || ''} />
          </div>
          <div className="form-group">
            <label>Provincia</label>
            <input name="address_state" type="text" defaultValue={address?.state || ''} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Codigo postal</label>
            <input name="address_zip" type="text" defaultValue={address?.zip || ''} />
          </div>
          <div className="form-group">
            <label>Pais</label>
            <input name="address_country" type="text" defaultValue={address?.country || 'Peru'} />
          </div>
        </div>
        <div className="form-group">
          <label>Telefono de contacto para la entrega</label>
          <input name="address_phone" type="text" defaultValue={address?.phone || customer?.phone || ''} />
        </div>
        <input type="hidden" name="address_name" defaultValue={customer?.name || ''} />

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <button type="button" className="admin-btn" data-variant="secondary" onClick={() => setEditing(false)}>
            Cancelar
          </button>
          <button type="submit" className="admin-btn" data-variant="primary" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
}
