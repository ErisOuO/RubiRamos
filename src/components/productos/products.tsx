'use client';

import { useState } from 'react';
import { Producto, Categoria } from '@/lib/definitions';
import { eliminarProducto } from '@/lib/productos-actions';
import ModalProducto from './modalProducto';
import { toast } from 'react-hot-toast';

interface ProductosClientProps {
  productosIniciales: Producto[];
  categorias: Categoria[];
}

// Función helper para formatear precio de manera segura
const formatPrice = (price: number): string => {
  if (typeof price !== 'number' || isNaN(price)) {
    return '$0.00';
  }
  return `$${price.toFixed(2)}`;
};

// Función para obtener el estado del stock con colores de la paleta
const getStockStatus = (stock: number): string => {
  if (stock > 10) return 'bg-[#A8CF45]/20 text-[#2C3E34]';
  if (stock > 0) return 'bg-[#BD7D4A]/20 text-[#2C3E34]';
  return 'bg-[#F58634]/20 text-[#2C3E34]';
};

export default function ProductosClient({ productosIniciales, categorias }: ProductosClientProps) {
  const [productos, setProductos] = useState<Producto[]>(productosIniciales);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);
  const [recargando, setRecargando] = useState(false);

  const recargarProductos = async () => {
    setRecargando(true);
    try {
      const { getProductos } = await import('@/lib/productos-data');
      const nuevosProductos = await getProductos();
      setProductos(nuevosProductos);
    } catch (error) {
      console.error('Error al recargar productos:', error);
      toast.error('Error al actualizar la lista');
    } finally {
      setRecargando(false);
    }
  };

  const handleEliminar = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      setEliminandoId(id);
      try {
        await eliminarProducto(id);
        setProductos(productos.filter(p => p.id !== id));
        toast.success('Producto eliminado exitosamente');
      } catch (error) {
        toast.error('Error al eliminar producto');
      } finally {
        setEliminandoId(null);
      }
    }
  };

  const handleEditar = (producto: Producto) => {
    setEditingProducto(producto);
    setModalOpen(true);
  };

  const handleCrear = () => {
    setEditingProducto(null);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingProducto(null);
  };

  const handleProductoGuardado = async () => {
    await recargarProductos();
    handleModalClose();
  };

  if (recargando && productos.length === 0) {
    return (
      <div className="p-6 text-center">
        <div className="text-[#6E7C72] font-['Open_Sans']">Cargando productos...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#5A8C7A] font-['Merriweather']">Productos</h1>
        <button
          onClick={handleCrear}
          disabled={recargando}
          className="bg-[#BD7D4A] hover:bg-[#F58634] text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-['Open_Sans'] font-semibold"
        >
          + Nuevo Producto
        </button>
      </div>

      {productos.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-[#E6E3DE]">
          <p className="text-[#6E7C72] font-['Open_Sans']">No hay productos registrados</p>
          <button
            onClick={handleCrear}
            className="mt-4 text-[#BD7D4A] hover:text-[#F58634] transition-colors font-['Open_Sans'] font-semibold"
          >
            Crear el primer producto
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#E6E3DE]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E6E3DE]">
              <thead className="bg-[#FAF9F7]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#6E7C72] uppercase tracking-wider font-['Open_Sans']">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#6E7C72] uppercase tracking-wider font-['Open_Sans']">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#6E7C72] uppercase tracking-wider font-['Open_Sans']">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[#6E7C72] uppercase tracking-wider font-['Open_Sans']">
                    Acciones
                  </th>
                 </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[#E6E3DE]">
                {productos.map((producto) => (
                  <tr key={producto.id} className="hover:bg-[#FAF9F7] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {producto.image_url && (
                          <img
                            src={producto.image_url}
                            alt={producto.name}
                            className="h-10 w-10 rounded-lg object-cover mr-3 border border-[#E6E3DE]"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-[#2C3E34] font-['Open_Sans']">
                            {producto.name}
                          </div>
                          <div className="text-sm text-[#6E7C72] font-['Open_Sans']">
                            {producto.description.substring(0, 50)}
                            {producto.description.length > 50 ? '...' : ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-[#2C3E34] font-['Open_Sans']">
                        {formatPrice(producto.price)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${getStockStatus(producto.stock)} font-['Open_Sans']`}>
                        {producto.stock} unidades
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEditar(producto)}
                        disabled={recargando}
                        className="text-[#BD7D4A] hover:text-[#F58634] mr-3 disabled:opacity-50 transition-colors font-['Open_Sans'] font-semibold"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminar(producto.id)}
                        disabled={eliminandoId === producto.id || recargando}
                        className="text-[#F58634] hover:text-[#BD7D4A] disabled:opacity-50 transition-colors font-['Open_Sans'] font-semibold"
                      >
                        {eliminandoId === producto.id ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ModalProducto
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSuccess={handleProductoGuardado}
        producto={editingProducto}
        categorias={categorias}
      />
    </div>
  );
}