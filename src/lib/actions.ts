'use server';

import postgres from 'postgres';
import bycript from 'bcrypt';
import { getServerSession } from 'next-auth/next';
import { authConfig } from '@/lib/auth.config'

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function updateContrasena(id: string, formData: FormData) {
  const contrasena = formData.get('contrasena') as string;

  try {
    const hashedContrasena = await bycript.hash(contrasena, 10);

    await sql`
      UPDATE tblusuarios
      SET contrasena = ${hashedContrasena}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Error al actualizar contraseña:', error);
    throw new Error('No se pudo actualizar la contraseña');
  }
}

export async function ajustarPrecioPorMarca(marcaId: string, porcentaje: number) {
  const session = await getServerSession(authConfig);
  if (!session) throw new Error('No autenticado');
  const usuarioActual = session.user.usuario;

  try {
    await sql.begin(async sql => {
      await sql.unsafe(`SET LOCAL "app.user" = '${usuarioActual.replace(/'/g, "''")}'`);

      await sql`
        CALL ajustar_precio_por_marca(${marcaId}, ${porcentaje})
      `;
    });
  } catch (error) {
    console.error('Error al ajustar precio por marca:', error);
    throw new Error('No se pudo ajustar el precio por marca');
  }
}

export async function ajustarPrecioPorModelo(modeloId: string, porcentaje: number) {
  const session = await getServerSession(authConfig);
  if (!session) throw new Error('No autenticado');
  const usuarioActual = session.user.usuario;

  try {
    await sql.begin(async sql => {
      await sql.unsafe(`SET LOCAL "app.user" = '${usuarioActual.replace(/'/g, "''")}'`);

      await sql`
        CALL ajustar_precio_por_modelo(${modeloId}, ${porcentaje})
      `;
    });
  } catch (error) {
    console.error('Error al ajustar precio por modelo:', error);
    throw new Error('No se pudo ajustar el precio por modelo');
  }
}

export async function ajustarPrecioPorAnio(anioId: string, porcentaje: number) {
  const session = await getServerSession(authConfig);
  if (!session) throw new Error('No autenticado');
  const usuarioActual = session.user.usuario;

  try {
    await sql.begin(async sql => {
      await sql.unsafe(`SET LOCAL "app.user" = '${usuarioActual.replace(/'/g, "''")}'`);

      await sql`
        CALL ajustar_precio_por_anio(${anioId}, ${porcentaje})
      `;
    });
  } catch (error) {
    console.error('Error al ajustar precio por año:', error);
    throw new Error('No se pudo ajustar el precio por año');
  }
}