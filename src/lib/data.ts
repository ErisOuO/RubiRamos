import postgres from 'postgres';
import {
    Anio, 
    Usuario,
    KmRange,
    Accion,
} from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchKmRanges(anioId: string): Promise<KmRange[]> {
  return await sql<KmRange[]>`
    SELECT id, kilometraje, factor_ajuste
    FROM tblrangokm
    WHERE anio_id = ${anioId}
    ORDER BY id;
  `;
}

export async function fetchAniosPorModelo(modeloId: string): Promise<Anio[]> {
  return await sql`
    SELECT tblanios.id, tblanios.anio
    FROM tblversiones
    JOIN tblanios ON tblversiones.anio_id = tblanios.id
    WHERE tblversiones.modelo_id = ${modeloId}
    GROUP BY tblanios.id, tblanios.anio
    ORDER BY tblanios.anio DESC
  `;
}

export async function fetchAnios(): Promise<Anio[]> {
  try {
    return await sql<Anio[]>`SELECT * FROM tblanios ORDER BY anio DESC`;
  } catch (error) {
    console.error('Error al obtener años:', error);
    throw new Error('No se pudieron obtener los años');
  }
}

export async function fetchUsuarios(): Promise<Usuario[]> {
  try {
    return await sql<Usuario[]>`SELECT * FROM tblusuarios`;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw new Error('No se pudieron obtener los usuarios');
  }
}

export async function fetchUsuarioById(id: string): Promise<Usuario | null> {
  try {
    const result = await sql<Usuario[]>`SELECT * FROM tblusuarios WHERE id = ${id}`;
    return result[0] || null;
  } catch (error) {
    console.error('Error al obtener el usuario por ID:', error);
    throw new Error('No se pudo obtener el usuario');
  }
}

export async function fetchAcciones(): Promise<Accion[]> {
  try {
    return await sql<Accion[]>`SELECT * FROM auditoria_acciones ORDER BY fecha_hora DESC`;
  } catch (error) {
    console.error('Error al obtener las acciones: ', error);
    throw new Error('No se pudieron obtener las acciones.');
  }
}