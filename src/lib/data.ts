import postgres from 'postgres';
import {
    Usuario,
} from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchUsuarios(): Promise<Usuario[]> {
  try {
    return await sql<Usuario[]>`SELECT * FROM tbladmins`;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw new Error('No se pudieron obtener los usuarios');
  }
}

export async function fetchUsuarioById(id: string): Promise<Usuario | null> {
  try {
    const result = await sql<Usuario[]>`SELECT * FROM tbladmins WHERE id = ${id}`;
    return result[0] || null;
  } catch (error) {
    console.error('Error al obtener el usuario por ID:', error);
    throw new Error('No se pudo obtener el usuario');
  }
}

