'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import postgres from 'postgres';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/lib/auth.config'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function insertVersion(formData: FormData) {
  const nombre = formData.get('nombre') as string;
  const precio_base = parseFloat(formData.get('precio_base') as string);
  const marcca_id = formData.get('marca_id') as string;
  const modelo_id = formData.get('modelo_id') as string;
  const anio_id = formData.get('anio_id') as string;
  
  const session = await getServerSession(authConfig);
  if (!session) throw new Error('No autenticado');
  const usuarioActual = session.user.usuario;

  try {
    await sql.begin(async sql =>{
      await sql.unsafe(`SET LOCAL "app.user" = '${usuarioActual.replace(/'/g, "''")}'`);

      await sql`
        INSERT INTO tblversiones (nombre, precio_base, marca_id, modelo_id, anio_id)
        VALUES (${nombre}, ${precio_base}, ${marcca_id}, ${modelo_id}, ${anio_id})
      `;
    });
  } catch (error) {
    console.error('Error al insertar versión:', error);
    throw new Error('No se pudo insertar la versión');
  }
}

export async function updateVersion(id: string, formData: FormData) {
  const nombre = formData.get('nombre') as string;
  const precio_base = parseFloat(formData.get('precio_base') as string);
  const marca_id = formData.get('marca_id') as string;
  const modelo_id = formData.get('modelo_id') as string;
  const anio_id = formData.get('anio_id') as string;

  const session = await getServerSession(authConfig);
  if (!session) throw new Error('No autenticado');
  const usuarioActual = session.user.usuario;

  try {
    await sql.begin(async sql =>{
      await sql.unsafe(`SET LOCAL "app.user" = '${usuarioActual.replace(/'/g, "''")}'`);

      await sql`
        UPDATE tblversiones
        SET nombre = ${nombre}, precio_base = ${precio_base}, marca_id = ${marca_id}, modelo_id = ${modelo_id}, anio_id = ${anio_id}
        WHERE id = ${id}
      `;
    });
  } catch (error) {
    console.error('Error al actualizar versión:', error);
    throw new Error('No se pudo actualizar la versión');
  }

  revalidatePath('/admin/versiones');
  redirect('/admin/versiones');
}

export async function deleteVersion(id: string) {
  const session = await getServerSession(authConfig);
  if (!session) throw new Error('No autenticado');
  const usuarioActual = session.user.usuario;

  try {
    await sql.begin(async sql =>{
      await sql.unsafe(`SET LOCAL "app.user" = '${usuarioActual.replace(/'/g, "''")}'`);

      await sql`
        DELETE FROM tblversiones
        WHERE id = ${id}
      `;
    });

  } catch (error) {
    console.error('Error al eliminar versión:', error);
    throw new Error('No se pudo eliminar la versión');
  }

  revalidatePath('/admin/versiones');
}

export async function deleteVersionesPorMarca(marcaId: string) {
  const session = await getServerSession(authConfig);
  if (!session) throw new Error('No autenticado');
  const usuarioActual = session.user.usuario;

  try {
    await sql.begin(async sql =>{
      await sql.unsafe(`SET LOCAL "app.user" = '${usuarioActual.replace(/'/g, "''")}'`);

      await sql`
        DELETE FROM tblversiones
        WHERE marca_id = ${marcaId}
      `;
    });

  } catch (error) {
    console.error('Error al eliminar versiones por marca:', error);
    throw new Error('No se pudieron eliminar las versiones asociadas a la marca');
  }
}

export async function deleteVersionesPorModelo(modeloId: string) {
  const session = await getServerSession(authConfig);
  if (!session) throw new Error('No autenticado');
  const usuarioActual = session.user.usuario;

  try {
    await sql.begin(async sql =>{
      await sql.unsafe(`SET LOCAL "app.user" = '${usuarioActual.replace(/'/g, "''")}'`);

      await sql`
        DELETE FROM tblversiones
        WHERE modelo_id = ${modeloId}
      `;
    });

  } catch (error) {
    console.error('Error al eliminar versiones por modelo:', error);
    throw new Error('No se pudieron eliminar las versiones asociadas al modelo');
  }
}