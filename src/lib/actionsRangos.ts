'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/lib/auth.config'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function createRango(formData: FormData) {
  const kilometraje = formData.get('kilometraje') as string;
  const factor_ajuste = formData.get('factor_ajuste') as string;
  const anioId = formData.get('anio_id') as string;

  const session = await getServerSession(authConfig);
  if (!session) throw new Error('No autenticado');
  const usuarioActual = session.user.usuario;

  try {
    await sql.begin(async sql => {
      await sql.unsafe(`SET LOCAL "app.user" = '${usuarioActual.replace(/'/g, "''")}'`);

      await sql`
        INSERT INTO tblrangokm (kilometraje, factor_ajuste, anio_id)
        VALUES (${kilometraje}, ${factor_ajuste}, ${anioId})
      `;
    });
  } catch (error) {
    console.error('Error al crear el rango de kilometraje:', error);
    throw new Error('No se pudo crear el rango de kilometraje');
  }

  revalidatePath('/admin/rangos');
  redirect('/admin/rangos');
}

export async function updateRango(id: string, formData: FormData) {
  const kilometraje = formData.get('kilometraje') as string;
  const factor_ajuste = formData.get('factor_ajuste') as string;
  const anioId = formData.get('anio_id') as string;

  const session = await getServerSession(authConfig);
  if (!session) throw new Error('No autenticado');
  const usuarioActual = session.user.usuario;

  try {
    await sql.begin(async sql => {
      await sql.unsafe(`SET LOCAL "app.user" = '${usuarioActual.replace(/'/g, "''")}'`);

      await sql`
        UPDATE tblrangokm
        SET kilometraje = ${kilometraje}, factor_ajuste = ${factor_ajuste}, anio_id = ${anioId}
        WHERE id = ${id}
      `;
    });

  } catch (error) {
    console.error('Error al actualizar el rango de kilometraje:', error);
    throw new Error('No se pudo actualizar el rango de kilometraje.');
  }

  revalidatePath('/admin/rangos');
  redirect('/admin/rangos');
}

export async function deleteRango(id: string) {
  const session = await getServerSession(authConfig);
  if (!session) throw new Error('No autenticado');
  const usuarioActual = session.user.usuario;

  try {
    await sql.begin(async sql => {
      await sql.unsafe(`SET LOCAL "app.user" = '${usuarioActual.replace(/'/g, "''")}'`);
      
      await sql`
        DELETE FROM tblrangokm
        WHERE id = ${id}
      `;
    });

  } catch (error) {
    console.error('Error al eliminar el rango de kilometraje:', error);
    throw new Error('No se pudo eliminar el rango de kilometraje');
  }

  revalidatePath('/admin/rangos');
}