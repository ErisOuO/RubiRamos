'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/lib/auth.config'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function insertFactura(formData: FormData) {
  const nombre = formData.get('nombre') as string;
  const porcentaje = parseFloat(formData.get('porcentaje') as string);

  const session = await getServerSession(authConfig);
  if (!session) throw new Error('No autenticado');
  const usuarioActual = session.user.usuario;

  try {
    await sql.begin(async sql => {
      await sql.unsafe(`SET LOCAL "app.user" = '${usuarioActual.replace(/'/g, "''")}'`);

      await sql`
        INSERT INTO tblfacturas (nombre, porcentaje)
        VALUES (${nombre}, ${porcentaje})
      `;
    });
  } catch (error) {
    console.error('Error al insertar factura:', error);
    throw new Error('No se pudo insertar la factura');
  }

  revalidatePath('/admin/facturas');
  redirect('/admin/facturas');
}

export async function deleteFactura(id: string) {
  const session = await getServerSession(authConfig);
  if (!session) throw new Error('No autenticado');
  const usuarioActual = session.user.usuario;

  try {
    await sql.begin(async sql => {
      await sql.unsafe(`SET LOCAL "app.user" = '${usuarioActual.replace(/'/g, "''")}'`);

      await sql`
        DELETE FROM tblfacturas
        WHERE id = ${id}
      `;
    });
  } catch (error) {
    console.error('Error al eliminar factura:', error);
    throw new Error('No se pudo eliminar la factura');
  }

  revalidatePath('/admin/facturas');
}

export async function updateFactura(id: string, formData: FormData) {
  const nombre = formData.get('nombre') as string;
  const porcentaje = parseFloat(formData.get('porcentaje') as string);

  const session = await getServerSession(authConfig);
  if (!session) throw new Error('No autenticado');
  const usuarioActual = session.user.usuario;

  try {
    await sql.begin(async sql => {
      await sql.unsafe(`SET LOCAL "app.user" = '${usuarioActual.replace(/'/g, "''")}'`);

      await sql`
        UPDATE tblfacturas
        SET nombre = ${nombre}, porcentaje = ${porcentaje}
        WHERE id = ${id}
      `;
    });
  } catch (error) {
    console.error('Error al actualizar factura:', error);
    throw new Error('No se pudo actualizar la factura');
  }

  revalidatePath('/admin/facturas');
  redirect('/admin/facturas');
}
