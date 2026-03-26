import postgres from 'postgres';
import {
    Usuario,
    Paciente,
    Categoria,
    Producto,
} from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchUsuarios(): Promise<Usuario[]> {
  try {
    return await sql<Usuario[]>`SELECT * FROM tblusers`;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw new Error('No se pudieron obtener los usuarios');
  }
}

export async function fetchUsuarioById(id: string): Promise<Usuario | null> {
  try {
    const result = await sql<Usuario[]>`SELECT * FROM tblusers WHERE id = ${id}`;
    return result[0] || null;
  } catch (error) {
    console.error('Error al obtener el usuario por ID:', error);
    throw new Error('No se pudo obtener el usuario');
  }
}

//Obtiene todos los pacientes activos (con active = null)
export async function fetchPacientes(): Promise<Paciente[]> {
  try {
    // Solo pacientes con active = null (activos)
    return await sql<Paciente[]>`
      SELECT * 
      FROM tblpatients 
      WHERE active IS NULL
      ORDER BY created_at DESC
    `;
  } catch (error) {
    console.error('Error al obtener pacientes:', error);
    throw new Error('No se pudieron obtener los pacientes');
  }
}

//Obtiene un paciente por ID (solo si está activo)
export async function fetchPacienteById(id: number): Promise<Paciente | null> {
  try {
    const result = await sql<Paciente[]>`
      SELECT * 
      FROM tblpatients 
      WHERE id = ${id} 
        AND active IS NULL
      LIMIT 1
    `;
    return result[0] || null;
  } catch (error) {
    console.error('Error al obtener el paciente por ID:', error);
    throw new Error('No se pudo obtener el paciente');
  }
}

//Obtiene pacientes con paginación (activos)
export async function fetchPacientesPaginados(
  pagina: number = 1,
  limite: number = 10
): Promise<{ pacientes: Paciente[], total: number }> {
  try {
    const offset = (pagina - 1) * limite;
    
    const [pacientes, totalResult] = await Promise.all([
      // Pacientes paginados
      sql<Paciente[]>`
        SELECT * 
        FROM tblpatients 
        WHERE active IS NULL
        ORDER BY created_at DESC
        LIMIT ${limite}
        OFFSET ${offset}
      `,
      
      // Total de pacientes activos
      sql<{ count: bigint }[]>`
        SELECT COUNT(*) as count
        FROM tblpatients 
        WHERE active IS NULL
      `
    ]);
    
    return {
      pacientes,
      total: Number(totalResult[0].count)
    };
  } catch (error) {
    console.error('Error al obtener pacientes paginados:', error);
    throw new Error('No se pudieron obtener los pacientes');
  }
}

//Busca pacientes por nombre, apellido o email (activos)
export async function buscarPacientes(query: string): Promise<Paciente[]> {
  try {
    const searchQuery = `%${query}%`;
    
    return await sql<Paciente[]>`
      SELECT * 
      FROM tblpatients 
      WHERE active IS NULL
        AND (
          first_name ILIKE ${searchQuery}
          OR second_name ILIKE ${searchQuery}
          OR last_name ILIKE ${searchQuery}
          OR second_last_name ILIKE ${searchQuery}
          OR email ILIKE ${searchQuery}
          OR phone ILIKE ${searchQuery}
        )
      ORDER BY 
        CASE 
          WHEN first_name ILIKE ${searchQuery} THEN 1
          WHEN last_name ILIKE ${searchQuery} THEN 2
          WHEN email ILIKE ${searchQuery} THEN 3
          ELSE 4
        END,
        created_at DESC
      LIMIT 20
    `;
  } catch (error) {
    console.error('Error al buscar pacientes:', error);
    throw new Error('No se pudo realizar la búsqueda de pacientes');
  }
}

//Obtiene el número total de pacientes activos
export async function obtenerTotalPacientes(): Promise<number> {
  try {
    const result = await sql<{ count: bigint }[]>`
      SELECT COUNT(*) as count
      FROM tblpatients 
      WHERE active IS NULL
    `;
    
    return Number(result[0].count);
  } catch (error) {
    console.error('Error al obtener total de pacientes:', error);
    throw new Error('No se pudo obtener el total de pacientes');
  }
}

//Obtiene pacientes recientemente registrados (últimos 7 días)
export async function fetchPacientesRecientes(): Promise<Paciente[]> {
  try {
    return await sql<Paciente[]>`
      SELECT * 
      FROM tblpatients 
      WHERE active IS NULL
        AND created_at >= NOW() - INTERVAL '7 days'
      ORDER BY created_at DESC
      LIMIT 10
    `;
  } catch (error) {
    console.error('Error al obtener pacientes recientes:', error);
    throw new Error('No se pudieron obtener los pacientes recientes');
  }
}

export async function fetchCategorias(): Promise<Categoria[]> {
  try {
    return await sql<Categoria[]>`SELECT * FROM tblcategories WHERE active IS true ORDER BY name ASC`;
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    throw new Error('No se pudieron obtener las categorías');
  }
}

export async function fetchProductos(params?: { 
  categoriaId?: number;
  precioMin?: number;
  precioMax?: number;
}): Promise<Producto[]> {
  try {
    const { categoriaId, precioMin, precioMax } = params || {};

    if (categoriaId) {
      return await sql<Producto[]>`
        SELECT p.*
        FROM tblproducts p
        INNER JOIN tblproducts_categories pc ON pc.product_id = p.id
        WHERE pc.category_id = ${categoriaId}
          ${precioMin !== undefined ? sql`AND p.price >= ${precioMin}` : sql``}
          ${precioMax !== undefined ? sql`AND p.price <= ${precioMax}` : sql``}
          AND p.active IS true
        ORDER BY p.name ASC
      `;
    }

    return await sql<Producto[]>`
      SELECT p.*
      FROM tblproducts p
      WHERE ${precioMin !== undefined ? sql`p.price >= ${precioMin}` : sql`1=1`}
        ${precioMax !== undefined ? sql`AND p.price <= ${precioMax}` : sql``}
        AND p.active IS true
      ORDER BY p.name ASC
    `;

  } catch (error) {
    console.error('Error en fetchProductos:', error);
    throw new Error('No se pudieron obtener los productos');
  }
}

export async function fetchProductosByCategoria(categoriaId: number): Promise<Producto[]> {
  return fetchProductos({ categoriaId });
}