import postgres from "postgres";
import {
    Factura,
} from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
const ITEMS_PER_PAGE = 10;

export async function fetchFacturas(): Promise<Factura[]> {
  try {
    return await sql<Factura[]>`SELECT * FROM tblfacturas ORDER BY nombre ASC`;
  } catch (error) {
    console.error('Error al obtener facturas:', error);
    throw new Error('No se pudieron obtener las facturas');
  }
}

export async function fetchFacturasP({
  query,
  page,
  sort,
  dir,
}: {
  query: string;
  page: number;
  sort: string; 
  dir: 'asc' | 'desc';
}): Promise<Factura[]> {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  const search = query ? `%${query}%` : '%';

  const allowedSort: Record<string, string> = {
    id: 'id',
    nombre: 'nombre',
    porcentaje: 'porcentaje',
  };

  const sortColumn = allowedSort[sort] ?? 'nombre';
  const direction  = dir === 'desc' ? sql`DESC` : sql`ASC`;

  return await sql<Factura[]>`
    SELECT *
    FROM tblfacturas
    WHERE nombre ILIKE ${search}
    ORDER BY ${sql.unsafe(sortColumn)} ${direction}
    LIMIT ${ITEMS_PER_PAGE}
    OFFSET ${offset};
  `;
}

export async function fetchFacturasPages(query: string) {
  try {
    const search = query ? `%${query}%` : '%';

    const result = await sql`
      SELECT COUNT(*) AS total
      FROM tblfacturas
      WHERE nombre ILIKE ${search};
    `;

    const totalItems = Number(result[0].total);
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    return totalPages;
  } catch (error) {
    console.error('Error al contar facturas:', error);
    return 0;
  }
}

export async function fetchFacturaById(id: string): Promise<Factura | null> {
  try {
    const result = await sql<Factura[]>`
      SELECT id, nombre, porcentaje
      FROM tblfacturas
      WHERE id = ${id}
    `;
    return result[0] || null;
  } catch (error) {
    console.error('Error al obtener la factura por ID:', error);
    throw new Error('No se pudo obtener la factura');
  }
}

export async function fetchFacturaInfo(id: string): Promise<{ nombre: string; pct: number }> {
  try {
    const row = await sql`
      SELECT nombre, porcentaje
      FROM tblfacturas
      WHERE id = ${id}
      LIMIT 1;
    `;
    if (!row.length) throw new Error('Factura no encontrada');
    return { nombre: row[0].nombre as string, pct: Number(row[0].porcentaje) };
  } catch (error) {
    console.error('Error al obtener información de la factura:', error);
    throw new Error('No se pudo obtener la información de la factura');
  }
}