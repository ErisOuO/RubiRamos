import postgres from "postgres";
import {
    Version,
    VersionConNombres,
} from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
const ITEMS_PER_PAGE = 10;

export async function fetchVersiones(): Promise<Version[]> {
  try {
    return await sql<Version[]>`SELECT * FROM tblversiones ORDER BY nombre ASC`;
  } catch (error) {
    console.error('Error al obtener versiones:', error);
    throw new Error('No se pudieron obtener las versiones');
  }
}

export async function fetchVersionesConNombres(): Promise<VersionConNombres[]> {
  try {  
    return await sql<VersionConNombres[]>`
      SELECT  v.id,
              v.nombre,
              v.precio_base,
              m.nombre  AS marca_nombre,
              mo.nombre AS modelo_nombre,
              a.anio
      FROM tblversiones v
      JOIN tblmarcas  m  ON v.marca_id  = m.id
      JOIN tblmodelos mo ON v.modelo_id = mo.id
      JOIN tblanios   a  ON v.anio_id   = a.id
      ORDER BY v.nombre ASC;
    `;
  } catch (error) {
    console.error('Error al obtener versiones con nombres:', error);
    throw new Error('No se pudieron obtener las versiones con nombres');
  }
}

export async function fetchVersionesP({
  query,
  page,
  sort,
  dir,
  marca,
  modelo,
  anio,
}: {
  query: string;
  page: number;
  sort: string;
  dir: "asc" | "desc";
  marca?: string;
  modelo?: string;
  anio?: string;
}): Promise<VersionConNombres[]> {
  const offset = (page - 1) * ITEMS_PER_PAGE;
  const search = query ? `%${query}%` : "%";

  const marcaFilter = marca ? sql`AND m.id = ${marca}` : sql``;
  const modeloFilter = modelo ? sql`AND mo.id = ${modelo}` : sql``;
  const anioFilter = anio ? sql`AND a.id = ${anio}` : sql``;

  const allowedSort: Record<string, string> = {
    id: "v.id",
    nombre: "v.nombre",
    precio_base: "v.precio_base",
    marca_nombre: "m.nombre",
    modelo_nombre: "mo.nombre",
    anio: "a.anio",
  };

  const sortColumn = allowedSort[sort] ?? "v.nombre";
  const direction = dir === "desc" ? sql`DESC` : sql`ASC`;

  return await sql<VersionConNombres[]>`
    SELECT
      v.id,
      v.nombre,
      v.precio_base,
      m.nombre AS marca_nombre,
      mo.nombre AS modelo_nombre,
      a.anio
    FROM tblversiones v
    JOIN tblmodelos mo ON mo.id = v.modelo_id
    JOIN tblmarcas m ON m.id = mo.marca_id
    JOIN tblanios a ON a.id = v.anio_id
    WHERE v.nombre ILIKE ${search}
      ${marcaFilter}
      ${modeloFilter}
      ${anioFilter}
    ORDER BY ${sql.unsafe(sortColumn)} ${direction}
    LIMIT ${ITEMS_PER_PAGE}
    OFFSET ${offset};
  `;
}

export async function fetchVersionesPages({
  query,
  marca,
  modelo,
  anio,
}: {
  query: string;
  marca?: string;
  modelo?: string;
  anio?: string;
}) {
  try {
    const search = query ? `%${query}%` : "%";

    const marcaFilter = marca ? sql`AND m.id = ${marca}` : sql``;
    const modeloFilter = modelo ? sql`AND mo.id = ${modelo}` : sql``;
    const anioFilter = anio ? sql`AND a.id = ${anio}` : sql``;

    const result = await sql`
      SELECT COUNT(*) AS total
      FROM tblversiones v
      JOIN tblmodelos mo ON mo.id = v.modelo_id
      JOIN tblmarcas m ON m.id = mo.marca_id
      JOIN tblanios a ON a.id = v.anio_id
      WHERE v.nombre ILIKE ${search}
        ${marcaFilter}
        ${modeloFilter}
        ${anioFilter};
    `;

    const totalItems = Number(result[0].total);
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    return totalPages;
  } catch (error) {
    console.error("Error al contar versiones:", error);
    return 0;
  }
}

export async function fetchVersionById(id: string): Promise<VersionConNombres | null> {
  try {
    const result = await sql<VersionConNombres[]>`
      SELECT 
        v.id,
        v.nombre,
        v.precio_base,
        v.modelo_id,
        mo.marca_id,
        v.anio_id,
        m.nombre AS marca_nombre,
        mo.nombre AS modelo_nombre,
        a.anio
      FROM tblversiones v
      JOIN tblmodelos mo ON v.modelo_id = mo.id
      JOIN tblmarcas m ON mo.marca_id = m.id
      JOIN tblanios a ON v.anio_id = a.id
      WHERE v.id = ${id}
    `;
    return result[0] || null;
  } catch (error) {
    console.error('Error al obtener versión por ID:', error);
    return null;
  }
}

export async function fetchVersionesConNombresFiltradas({
  marcaId,
  modeloId,
  anioId,
}: {
  marcaId: string;
  modeloId: string;
  anioId: string;
}): Promise<VersionConNombres[]> {
  try {
    return await sql<VersionConNombres[]>`
      SELECT v.id, v.nombre, v.precio_base,
             m.nombre AS marca_nombre,
             mo.nombre AS modelo_nombre,
             a.anio
      FROM tblversiones v
      JOIN tblmodelos mo ON v.modelo_id = mo.id
      JOIN tblmarcas m ON mo.marca_id = m.id
      JOIN tblanios a ON v.anio_id = a.id
      WHERE v.marca_id = ${marcaId}
        AND v.modelo_id = ${modeloId}
        AND v.anio_id = ${anioId}
      ORDER BY v.nombre ASC;
    `;
  } catch (error) {
    console.error('Error al obtener versiones filtradas:', error);
    throw new Error('No se pudieron obtener las versiones filtradas');
  }
}