import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth.config';
import { fetchAcciones } from '@/lib/data'; 
import AccionesTable from '@/components/admin/table';

export const metadata: Metadata = {
  title: 'Panel de Administración',
  description: 'Página principal del administrador',
};

export default async function AdminHomePage() {
  const session = await getServerSession(authConfig);
  const usuario = session?.user?.usuario || 'Administrador';

  const acciones = await fetchAcciones();
  const ultimasAcciones = acciones.slice(0, 10);
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#1e343b]">Bienvenido, {usuario}</h1>

      <p className="text-sm text-gray-600">
        Desde este panel puedes administrar las diferentes secciones del sistema. Revisa tus acciones recientes para mantener el control.
      </p>

      <AccionesTable acciones={ultimasAcciones} />
    </div>
  );
}
