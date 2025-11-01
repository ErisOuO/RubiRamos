'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/lib/auth.config'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function deleteModelosPorMarca(marcaId: string) {
  const session = await getServerSession(authConfig);
  if (!session) throw new Error('No autenticado');
  const usuarioActual = session.user.usuario;
  
  try {
    await sql.begin(async sql => {
      await sql.unsafe(`SET LOCAL "app.user" = '${usuarioActual.replace(/'/g, "''")}'`);
      
      await sql`
        DELETE FROM tblmodelos
        WHERE marca_id = ${marcaId}
      `;
    });

  } catch (error) {
    console.error('Error al eliminar modelos por marca:', error);
    throw new Error('No se pudieron eliminar los modelos asociados a la marca');
  }
}

export async function createModelo(formData: FormData) {
  const nombre = formData.get('nombre') as string;
  const marcaId = formData.get('marca_id') as string;

  const session = await getServerSession(authConfig);
  if (!session) throw new Error('No autenticado');
  const usuarioActual = session.user.usuario;

  try {
    await sql.begin(async sql => {
      await sql.unsafe(`SET LOCAL "app.user" = '${usuarioActual.replace(/'/g, "''")}'`);

      await sql`
        INSERT INTO tblmodelos (nombre, marca_id)
        VALUES (${nombre}, ${marcaId})
      `;
    });
  } catch (error) {
    console.error('Error al crear modelo:', error);
    throw new Error('No se pudo crear el modelo');
  }

  revalidatePath('/admin/modelos');
  redirect('/admin/modelos');
}

export async function updateModelo(id: string, formData: FormData) {
  const nombre = formData.get('nombre') as string;
  const marcaId = formData.get('marca_id') as string;

  const session = await getServerSession(authConfig);
  if (!session) throw new Error('No autenticado');
  const usuarioActual = session.user.usuario;

  try {
    await sql.begin(async sql => {
      await sql.unsafe(`SET LOCAL "app.user" = '${usuarioActual.replace(/'/g, "''")}'`);

      await sql`
        UPDATE tblmodelos
        SET nombre = ${nombre}, marca_id = ${marcaId}
        WHERE id = ${id}
      `;
    });

  } catch (error) {
    console.error('Error al actualizar modelo:', error);
    throw new Error('No se pudo actualizar el modelo');
  }

  revalidatePath('/admin/modelos');
  redirect('/admin/modelos');
}

export async function deleteModelo(id: string) {
  const session = await getServerSession(authConfig);
  if (!session) throw new Error('No autenticado');
  const usuarioActual = session.user.usuario;

  try {
    await sql.begin(async sql => {
      await sql.unsafe(`SET LOCAL "app.user" = '${usuarioActual.replace(/'/g, "''")}'`);
      
      await sql`
        DELETE FROM tblmodelos
        WHERE id = ${id}
      `;
    });

  } catch (error) {
    console.error('Error al eliminar modelo:', error);
    throw new Error('No se pudo eliminar el modelo');
  }

  revalidatePath('/admin/modelos');
}