import postgres from "postgres";
import {
    Marca,
} from "./definitions";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
const ITEMS_PER_PAGE = 10;

export async function fetchMarcas(): Promise<Marca[]> {
   try {
        return await sql<Marca[]>`SELECT * FROM tblmarcas ORDER BY nombre ASC`;
   } catch (error) {
        console.error('Error al obtener marcas:', error);
        throw new Error('No se pudieron obtener las marcas');
    }
}

export async function fetchMarcasPages(query: string) {
  try {
    const search = query ? `%${query}%` : '%';

    const result = await sql`
      SELECT COUNT(*) AS total
      FROM tblmarcas
      WHERE nombre ILIKE ${search};
    `;

    const totalItems = Number(result[0].total);
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    return totalPages;
  } catch (error) {
    console.error('Error al contar marcas:', error);
    return 0;
  }
}

export async function fetchMarcasP({
  query,
  page,
  sort,
  dir,
}: {
  query: string;
  page: number;
  sort: string; 
  dir: 'asc' | 'desc';
}): Promise<Marca[]> {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  const search = query ? `%${query}%` : '%';

  const allowedSort: Record<string, string> = {
    id: 'id',
    nombre: 'nombre',
  };

  const sortColumn = allowedSort[sort] ?? 'nombre';
  const direction  = dir === 'desc' ? sql`DESC` : sql`ASC`;

  return await sql<Marca[]>`
    SELECT *
    FROM tblmarcas
    WHERE nombre ILIKE ${search}
    ORDER BY ${sql.unsafe(sortColumn)} ${direction}
    LIMIT ${ITEMS_PER_PAGE}
    OFFSET ${offset};
  `;
}

export async function fetchMarcaById(id: string): Promise<Marca | null> {
  try {
    const result = await sql<Marca[]>`SELECT * FROM tblmarcas WHERE id = ${id}`;
    return result[0] || null;
  } catch (error) {
    console.error('Error al obtener la marca por ID:', error);
    throw new Error('No se pudo obtener la marca');
  }
}