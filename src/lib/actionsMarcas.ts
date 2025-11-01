'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/lib/auth.config'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function createMarca(formData: FormData) {
  const nombre = formData.get('nombre') as string;

  const session = await getServerSession(authConfig);
  if (!session) throw new Error('No autenticado');
  const usuarioActual = session.user.usuario;  

  try {
    await sql.begin(async sql => {
        await sql.unsafe(`SET LOCAL "app.user" = '${usuarioActual.replace(/'/g, "''")}'`);
      
        await sql`
          INSERT INTO tblmarcas (nombre)
          VALUES (${nombre})
      `;
    });
  } catch (error) {
    console.error('Error al crear marca:', error);
    throw new Error('No se pudo crear la marca');
  }

  revalidatePath('/admin/marcas');
  redirect('/admin/marcas');
}

export async function updateMarca(id: string, formData: FormData) {
  const nombre = formData.get('nombre') as string;

  const session = await getServerSession(authConfig);
  if (!session) throw new Error('No autenticado');
  const usuarioActual = session.user.usuario; 

  try {
    await sql.begin(async sql => {
      await sql.unsafe(`SET LOCAL "app.user" = '${usuarioActual.replace(/'/g, "''")}'`);
        await sql`
          UPDATE tblmarcas
          SET nombre = ${nombre}
          WHERE id = ${id}
        `;
    });
  } catch (error) {
    console.error('Error al actualizar marca:', error);
    throw new Error('No se pudo actualizar la marca');
  }

  revalidatePath('/admin/marcas');
  redirect('/admin/marcas');
}

export async function deleteMarca(id: string) {
  const session = await getServerSession(authConfig);
  if (!session) throw new Error('No autenticado');
  const usuarioActual = session.user.usuario; 

  try {
    await sql.begin(async sql =>{
      await sql.unsafe(`SET LOCAL "app.user" = '${usuarioActual.replace(/'/g, "''")}'`);
        await sql`
          DELETE FROM tblmarcas
          WHERE id = ${id}
        `;
    });
  } catch (error) {
    console.error('Error al eliminar marca:', error);
    throw new Error('No se pudo eliminar la marca');
  }

  revalidatePath('/admin/marcas');
}
