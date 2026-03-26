import { Suspense } from 'react';
import { getProductos, getCategoriasActivas } from '@/lib/productos-data';
import ProductosClient from '@/components/productos/products';

export default async function ProductosPage() {
  const [productos, categorias] = await Promise.all([
    getProductos(),
    getCategoriasActivas()
  ]);

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <Suspense fallback={<div className="p-6 text-center text-[#6E7C72]">Cargando productos...</div>}>
        <ProductosClient 
          productosIniciales={productos} 
          categorias={categorias} 
        />
      </Suspense>
    </div>
  );
}