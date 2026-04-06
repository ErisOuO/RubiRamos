'use client';

import { useState, useEffect, useCallback } from 'react';
import { Producto, Categoria } from '@/lib/definitions';
import { eliminarProducto } from '@/lib/productos-actions';
import ModalProducto from './modalProducto';
import { toast } from 'react-hot-toast';

interface ProductosClientProps {
  productosIniciales: Producto[];
  categorias: Categoria[];
  totalInicial: number;
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

type SortField = 'name' | 'price' | 'stock';
type SortOrder = 'asc' | 'desc';

export default function ProductosClient({ 
  productosIniciales, 
  categorias, 
  totalInicial 
}: ProductosClientProps) {
  const [productos, setProductos] = useState<Producto[]>(productosIniciales);
  const [total, setTotal] = useState(totalInicial);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);
  const [eliminandoId, setEliminandoId] = useState<number | null>(null);
  const [cargando, setCargando] = useState(false);
  
  // Estados para filtros y paginación
  const [searchTerm, setSearchTerm] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number>(0);
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina] = useState(10);
  
  // Estados para ordenamiento
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  
  // Debounce para búsqueda
  const [searchDebounced, setSearchDebounced] = useState('');

  // Efecto para debounce de búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounced(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Efecto para resetear página cuando cambian filtros u ordenamiento
  useEffect(() => {
    setPaginaActual(1);
  }, [searchDebounced, categoriaSeleccionada, sortField, sortOrder]);

  // Cargar productos con filtros y ordenamiento
  const cargarProductos = useCallback(async () => {
    setCargando(true);
    try {
      const { getProductos } = await import('@/lib/productos-data');
      const result = await getProductos({
        search: searchDebounced,
        categoriaId: categoriaSeleccionada === 0 ? undefined : categoriaSeleccionada,
        page: paginaActual,
        pageSize: itemsPorPagina,
        sortBy: sortField,
        sortOrder: sortOrder
      });
      setProductos(result.productos);
      setTotal(result.total);
    } catch (error) {
      console.error('Error al cargar productos:', error);
      toast.error('Error al cargar productos');
    } finally {
      setCargando(false);
    }
  }, [searchDebounced, categoriaSeleccionada, paginaActual, itemsPorPagina, sortField, sortOrder]);

  useEffect(() => {
    cargarProductos();
  }, [cargarProductos]);

  const handleEliminar = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      setEliminandoId(id);
      try {
        await eliminarProducto(id);
        toast.success('Producto eliminado exitosamente');
        cargarProductos();
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
    cargarProductos();
    handleModalClose();
  };

  const limpiarFiltros = () => {
    setSearchTerm('');
    setCategoriaSeleccionada(0);
    setSortField('name');
    setSortOrder('asc');
    setPaginaActual(1);
  };

  // Función para manejar el ordenamiento
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Si es el mismo campo, cambiar el orden
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Si es un campo nuevo, ordenar asc por defecto
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Obtener el ícono de ordenamiento
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 inline-block ml-1 text-[#6E7C72]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortOrder === 'asc' ? (
      <svg className="w-4 h-4 inline-block ml-1 text-[#5A8C7A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 inline-block ml-1 text-[#5A8C7A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  const totalPaginas = Math.ceil(total / itemsPorPagina);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#5A8C7A]">Productos</h1>
        <button
          onClick={handleCrear}
          disabled={cargando}
          className="bg-[#BD7D4A] hover:bg-[#F58634] text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          + Nuevo Producto
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-[#E6E3DE]">
        <div className="flex gap-4 items-end">
          {/* Búsqueda por nombre/descripción - Ocupa más espacio horizontal */}
          <div className="flex-1">
            <label className="block text-sm font-semibold text-[#2C3E34] mb-2">
              Buscar producto
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nombre o descripción..."
                className="w-full pl-10 pr-4 py-2 border border-[#E6E3DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A8C7A] focus:border-transparent transition-all text-[#2C3E34]"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-[#6E7C72]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Filtro por categoría */}
          <div className="w-64">
            <label className="block text-sm font-semibold text-[#2C3E34] mb-2">
              Filtrar por categoría
            </label>
            <select
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(Number(e.target.value))}
              className="w-full px-4 py-2 border border-[#E6E3DE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5A8C7A] focus:border-transparent transition-all text-[#2C3E34] bg-white"
            >
              <option value={0}>Todas las categorías</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.name}
                </option>
              ))}
            </select>
          </div>

          {/* Botón limpiar filtros - X roja */}
          <button
            onClick={limpiarFiltros}
            className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
            title="Limpiar filtros"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Resultados encontrados */}
        <div className="mt-3 text-sm text-[#6E7C72]">
          {cargando ? (
            <span>Cargando...</span>
          ) : (
            <span>Se encontraron {total} producto{total !== 1 ? 's' : ''}</span>
          )}
        </div>
      </div>

      {/* Tabla de productos */}
      {cargando && productos.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-[#E6E3DE]">
          <p className="text-[#6E7C72]">Cargando productos...</p>
        </div>
      ) : productos.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-[#E6E3DE]">
          <p className="text-[#6E7C72]">No hay productos registrados</p>
          <button
            onClick={handleCrear}
            className="mt-4 text-[#BD7D4A] hover:text-[#F58634] transition-colors font-semibold"
          >
            Crear el primer producto
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#E6E3DE]">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#E6E3DE]">
                <thead className="bg-[#FAF9F7]">
                  <tr>
                    {/* Columna Producto con ordenamiento */}
                    <th 
                      className="px-6 py-3 text-left text-xs font-semibold text-[#6E7C72] uppercase tracking-wider cursor-pointer hover:text-[#5A8C7A] transition-colors"
                      onClick={() => handleSort('name')}
                    >
                      <span className="flex items-center">
                        Producto
                        {getSortIcon('name')}
                      </span>
                    </th>
                    
                    {/* Columna Precio con ordenamiento */}
                    <th 
                      className="px-6 py-3 text-left text-xs font-semibold text-[#6E7C72] uppercase tracking-wider cursor-pointer hover:text-[#5A8C7A] transition-colors"
                      onClick={() => handleSort('price')}
                    >
                      <span className="flex items-center">
                        Precio
                        {getSortIcon('price')}
                      </span>
                    </th>
                    
                    {/* Columna Stock con ordenamiento */}
                    <th 
                      className="px-6 py-3 text-left text-xs font-semibold text-[#6E7C72] uppercase tracking-wider cursor-pointer hover:text-[#5A8C7A] transition-colors"
                      onClick={() => handleSort('stock')}
                    >
                      <span className="flex items-center">
                        Stock
                        {getSortIcon('stock')}
                      </span>
                    </th>
                    
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#6E7C72] uppercase tracking-wider">
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
                            <div className="text-sm font-medium text-[#2C3E34]">
                              {producto.name}
                            </div>
                            <div className="text-sm text-[#6E7C72]">
                              {producto.description.substring(0, 50)}
                              {producto.description.length > 50 ? '...' : ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-[#2C3E34]">
                          {formatPrice(producto.price)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${getStockStatus(producto.stock)}`}>
                          {producto.stock} unidades
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditar(producto)}
                          disabled={cargando}
                          className="text-[#BD7D4A] hover:text-[#F58634] mr-3 disabled:opacity-50 transition-colors font-semibold"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleEliminar(producto.id)}
                          disabled={eliminandoId === producto.id || cargando}
                          className="text-[#F58634] hover:text-[#BD7D4A] disabled:opacity-50 transition-colors font-semibold"
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

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-[#6E7C72]">
                Mostrando {((paginaActual - 1) * itemsPorPagina) + 1} - {Math.min(paginaActual * itemsPorPagina, total)} de {total} productos
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
                  disabled={paginaActual === 1 || cargando}
                  className="px-3 py-1 border border-[#E6E3DE] rounded-lg text-[#2C3E34] hover:bg-[#FAF9F7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
                    let pageNum;
                    if (totalPaginas <= 5) {
                      pageNum = i + 1;
                    } else if (paginaActual <= 3) {
                      pageNum = i + 1;
                    } else if (paginaActual >= totalPaginas - 2) {
                      pageNum = totalPaginas - 4 + i;
                    } else {
                      pageNum = paginaActual - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPaginaActual(pageNum)}
                        className={`px-3 py-1 rounded-lg transition-colors ${
                          paginaActual === pageNum
                            ? 'bg-[#5A8C7A] text-white'
                            : 'border border-[#E6E3DE] text-[#2C3E34] hover:bg-[#FAF9F7]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
                  disabled={paginaActual === totalPaginas || cargando}
                  className="px-3 py-1 border border-[#E6E3DE] rounded-lg text-[#2C3E34] hover:bg-[#FAF9F7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </>
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