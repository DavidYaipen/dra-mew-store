import { redirect } from 'next/navigation';

// El inventario se fusionó dentro de /admin/productos para no duplicar
// la misma información de stock en dos vistas separadas.
export default function AdminInventoryRedirect() {
  redirect('/admin/productos');
}
