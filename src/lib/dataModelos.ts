import postgres from "postgres";
import {
    Modelo,
    ModeloConMarca,
} from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
const ITEMS_PER_PAGE = 10;

export async function fetchModelos(): Promise<Modelo[]> {
  try {
    return await sql<Modelo[]>`SELECT * FROM tblmodelos ORDER BY nombre ASC`;
  } catch (error) {
    console.error('Error al obtener modelos:', error);
    throw new Error('No se pudieron obtener los modelos');
  }
}

export async function fetchModelosPorMarca(marcaId: string): Promise<Modelo[]> {
  try {
    return await sql<Modelo[]>`
      SELECT *
      FROM tblmodelos
      WHERE marca_id = ${marcaId}
      ORDER BY nombre ASC;
    `;
  } catch (error) {
    console.error('Error al obtener modelos por marca:', error);
    throw new Error('No se pudieron obtener los modelos de la marca');
  }
}

export async function fetchModelosConMarca(): Promise<Modelo[]> {
    try {
        return await sql<Modelo[]>`
            SELECT m.id,
                   m.nombre,
                   m.marca_id,
                   marca.nombre AS marca_nombre
            FROM tblmodelos m
            JOIN tblmarcas marca ON marca.id = m.marca_id
            ORDER BY m.nombre ASC;
        `;
    } catch (error) {
        console.error('Error al obtener modelos con marca:', error);
        throw new Error('No se pudieron obtener los modelos con sus marcas');
    }
}

export async function fetchModelosById(id: string): Promise<ModeloConMarca | null> {
    try {
        const rows = await sql<ModeloConMarca[]>`
            SELECT m.id,
                    m.nombre,
                    m.marca_id,
                    marca.nombre AS marca_nombre
            FROM tblmodelos m
            JOIN tblmarcas marca ON marca.id = m.marca_id
            WHERE m.id = ${id};
        `;
        return rows[0] || null;
    } catch (error) {
        console.error('Error al obtener modelo por ID:', error);
        throw new Error('No se pudo obtener el modelo');
    }
}

export async function fetchModelosP({
  query,
  page,
  sort,
  dir,
  marcaId,
}: {
  query: string;
  page: number;
  sort: string; 
  dir: 'asc' | 'desc';
  marcaId?: string;
}): Promise<ModeloConMarca[]> {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  const search = query ? `%${query}%` : '%';

  const whereMarca = marcaId ? sql`AND m.marca_id = ${marcaId}` : sql``;

  const allowedSort: Record<string, string> = {
    id: 'm.id',
    nombre: 'm.nombre',
    marca_nombre: 'marca.nombre',
  };

  const sortColumn = allowedSort[sort] ?? 'm.nombre';
  const direction  = dir === 'desc' ? sql`DESC` : sql`ASC`;

  return await sql<ModeloConMarca[]>`
    SELECT
      m.id,
      m.nombre,
      m.marca_id,
      marca.nombre AS marca_nombre
    FROM tblmodelos m
    JOIN tblmarcas marca ON marca.id = m.marca_id
    WHERE m.nombre ILIKE ${search} ${whereMarca}
    ORDER BY ${sql.unsafe(sortColumn)} ${direction}
    LIMIT ${ITEMS_PER_PAGE}
    OFFSET ${offset};
  `;
}

export async function fetchModelosPages(query: string, marcaId?: string) {
  try {
    const search = query ? `%${query}%` : '%';

    const marcaFilter = marcaId ? sql`AND m.marca_id = ${Number(marcaId)}` : sql``;

    const result = await sql<{ total: string }[]>`
      SELECT COUNT(*) AS total
      FROM tblmodelos m
      WHERE m.nombre ILIKE ${search}
      ${marcaFilter}
    `;

    const totalItems = Number(result[0].total);
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    return totalPages;
  } catch (error) {
    console.error('Error al contar modelos:', error);
    return 0;
  }
}

export async function fetchModeloById(id: string): Promise<Modelo | null> {
  try {
    const result = await sql<Modelo[]>`SELECT * FROM tblmodelos WHERE id = ${id}`;
    return result[0] || null;
  } catch (error) {
    console.error('Error al obtener modelo por ID:', error);
    throw new Error('No se pudo obtener el modelo');
  }
}