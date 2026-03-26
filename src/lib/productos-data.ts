'use server';

import postgres from 'postgres';
import { Categoria, Producto } from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Helper para convertir producto de la DB a tipo Producto
const convertToProducto = (dbProduct: any): Producto => ({
  id: Number(dbProduct.id),
  name: dbProduct.name,
  description: dbProduct.description,
  price: typeof dbProduct.price === 'string' ? parseFloat(dbProduct.price) : Number(dbProduct.price),
  stock: typeof dbProduct.stock === 'string' ? parseInt(dbProduct.stock) : Number(dbProduct.stock),
  image_url: dbProduct.image_url,
  created_at: new Date(dbProduct.created_at),
  updated_at: new Date(dbProduct.updated_at),
  active: dbProduct.active
});

// Helper para convertir categoría de la DB a tipo Categoria
const convertToCategoria = (dbCategoria: any): Categoria => ({
  id: Number(dbCategoria.id),
  name: dbCategoria.name,
  description: dbCategoria.description,
  created_at: new Date(dbCategoria.created_at),
  updated_at: new Date(dbCategoria.updated_at),
  active: dbCategoria.active
});

export async function getProductos(): Promise<Producto[]> {
  try {
    const productos = await sql<any[]>`
      SELECT * FROM tblproducts 
      WHERE active = true 
      ORDER BY name ASC
    `;
    
    return productos.map(convertToProducto);
  } catch (error) {
    console.error('Error en getProductos:', error);
    throw new Error('No se pudieron obtener los productos');
  }
}

export async function getProductoById(id: number): Promise<Producto | null> {
  try {
    const result = await sql<any[]>`
      SELECT * FROM tblproducts WHERE id = ${id}
    `;
    
    if (result[0]) {
      return convertToProducto(result[0]);
    }
    
    return null;
  } catch (error) {
    console.error('Error al obtener producto por ID:', error);
    throw new Error('No se pudo obtener el producto');
  }
}

export async function getCategoriasActivas(): Promise<Categoria[]> {
  try {
    const categorias = await sql<any[]>`
      SELECT * FROM tblcategories 
      WHERE active = true 
      ORDER BY name ASC
    `;
    
    return categorias.map(convertToCategoria);
  } catch (error) {
    console.error('Error al obtener categorías activas:', error);
    throw new Error('No se pudieron obtener las categorías');
  }
}

export async function getCategoriasByProducto(productoId: number): Promise<number[]> {
  try {
    const result = await sql<{ category_id: number | string }[]>`
      SELECT category_id 
      FROM tblproducts_categories 
      WHERE product_id = ${productoId}
    `;
    
    return result.map(row => Number(row.category_id));
  } catch (error) {
    console.error('Error al obtener categorías del producto:', error);
    throw new Error('No se pudieron obtener las categorías del producto');
  }
}