import postgres from "postgres";
import { KmRange, KmRangeConAnio } from "./definitions";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
const ITEMS_PER_PAGE = 10;

export async function fetchKmRanges(): Promise<KmRange[]> {
  try {
    return await sql<KmRange[]>`
      SELECT *
      FROM tblrangokm
      ORDER BY kilometraje ASC
    `;
  } catch (error) {
    console.error("Error al obtener rangos de kilometraje:", error);
    throw new Error("No se pudieron obtener los rangos de kilometraje");
  }
}

export async function fetchKmRangePorAnio(anioId: string): Promise<KmRange[]> {
  try {
    return await sql<KmRange[]>`
      SELECT *
      FROM tblrangokm
      WHERE anio_id = ${anioId}
      ORDER BY kilometraje ASC
    `;
  } catch (error) {
    console.error("Error al obtener los rangos de kilometraje:", error);
    throw new Error("No se pudieron obtener los rangos de kilometraje.");
  }
}

export async function fetchKmRangesConAnio(): Promise<KmRangeConAnio[]> {
  try {
    return await sql<KmRangeConAnio[]>`
      SELECT r.id,
             r.kilometraje,
             r.factor_ajuste,
             anio.anio AS anio_anio
      FROM tblrangokm r
      JOIN tblanios anio ON anio.id = r.anio_id
      ORDER BY r.kilometraje ASC
    `;
  } catch (error) {
    console.error("Error al obtener rangos con año:", error);
    throw new Error("No se pudieron obtener los rangos de kilometraje con año");
  }
}

export async function fetchKmRangeById(id: string): Promise<KmRangeConAnio | null> {
  try {
    const result = await sql<KmRangeConAnio[]>`
      SELECT r.id,
             r.kilometraje,
             r.factor_ajuste,
             r.anio_id,
             anio.anio AS anio_anio
      FROM tblrangokm r
      JOIN tblanios anio ON anio.id = r.anio_id
      WHERE r.id = ${id}
    `;
    return result[0] || null;
  } catch (error) {
    console.error("Error al obtener rango por ID:", error);
    throw new Error("No se pudo obtener el rango de kilometraje");
  }
}

export async function fetchKmRangeConAnioById(id: string): Promise<KmRangeConAnio | null> {
  try {
    const result = await sql<KmRangeConAnio[]>`
      SELECT r.id,
             r.kilometraje,
             r.factor_ajuste,
             anio.anio AS anio_anio
      FROM tblrangokm r
      JOIN tblanios anio ON anio.id = r.anio_id
      WHERE r.id = ${id}
    `;
    return result[0] || null;
  } catch (error) {
    console.error("Error al obtener rango con año por ID:", error);
    throw new Error("No se pudo obtener el rango con año");
  }
}

export async function fetchKmRangesP({
  query,
  page,
  sort,
  dir,
  anioId,
}: {
  query: string;
  page: number;
  sort: string;
  dir: 'asc' | 'desc';
  anioId?: string;
}): Promise<KmRangeConAnio[]> {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  const search = query ? `%${query}%` : '%';

  const whereAnio = anioId ? sql`AND r.anio_id = ${anioId}` : sql``;

  const allowedSort: Record<string, string> = {
    id: 'r.id',
    kilometraje: 'r.kilometraje',
    factor_ajuste: 'r.factor_ajuste',
    anio_anio: 'anio.anio',
  };

  const sortColumn = allowedSort[sort] ?? 'anio.anio';
  const direction = dir === 'desc' ? sql`DESC` : sql`ASC`;

  return await sql<KmRangeConAnio[]>`
    SELECT r.id,
           r.kilometraje,
           r.factor_ajuste,
           anio.anio AS anio_anio
    FROM tblrangokm r
    JOIN tblanios anio ON anio.id = r.anio_id
    WHERE r.kilometraje ILIKE ${search}
      ${whereAnio}
    ORDER BY ${sql.unsafe(sortColumn)} ${direction}
    LIMIT ${ITEMS_PER_PAGE}
    OFFSET ${offset}
  `;
}

export async function fetchKmRangesPages(query: string, anioId?: string) {
  try {
    const search = query ? `%${query}%` : '%';
    const whereAnio = anioId ? sql`AND anio_id = ${anioId}` : sql``;

    const result = await sql<{ total: string }[]>`
      SELECT COUNT(*) AS total
      FROM tblrangokm
      WHERE kilometraje ILIKE ${search}
      ${whereAnio}
    `;

    const totalItems = Number(result[0].total);
    return Math.ceil(totalItems / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Error al contar rangos de kilometraje:", error);
    return 0;
  }
}