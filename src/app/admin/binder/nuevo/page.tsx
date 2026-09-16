import { BinderCardForm } from '@/components/admin/BinderCardForm';

export default function NewBinderCardPage() {
  return (
    <div style={{ maxWidth: 700 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>Nueva carta suelta</h2>
      <div className="admin-card">
        <BinderCardForm />
      </div>
    </div>
  );
}
