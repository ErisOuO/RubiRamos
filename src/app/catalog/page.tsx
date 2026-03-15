import { fetchCategorias, fetchProductos, fetchProductosByCategoria } from '@/lib/data';
import ProductsGrid from '@/components/catalog/ProductsGrid';
import SearchBar from '@/components/catalog/SearchBar';
import CategoryFilter from '@/components/catalog/CategoryFilter';
import { FaFilter } from 'react-icons/fa';

export const metadata = {
  title: 'Catálogo de Suplementos - Consultorio Nutricional Rubí Ramos',
  description: 'Productos nutricionales de calidad premium para complementar tu plan alimenticio',
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; categoria?: string }>
}) {
  // Desenvolver searchParams
  const params = await searchParams;
  const query = params?.query || '';
  const categoriaParam = decodeURIComponent(params?.categoria || 'Todos');
  
  // Obtener datos del servidor
  const categorias = await fetchCategorias();
  
  // Depuración: ver qué categorías tenemos
  console.log('Categorías disponibles:', categorias.map(c => c.name));
  console.log('Categoría seleccionada:', categoriaParam);
  
  // Obtener productos según la categoría seleccionada
  let productos;
  if (categoriaParam === 'Todos') {
    productos = await fetchProductos();
  } else {
    // Buscar categoría con diferentes variaciones
    const categoriaSeleccionada = categorias.find(c => 
      c.name.toLowerCase() === categoriaParam.toLowerCase() ||
      c.name.toLowerCase().includes(categoriaParam.toLowerCase()) ||
      categoriaParam.toLowerCase().includes(c.name.toLowerCase())
    );
    
    console.log('Categoría encontrada:', categoriaSeleccionada);
    
    if (categoriaSeleccionada) {
      productos = await fetchProductosByCategoria(categoriaSeleccionada.id);
    } else {
      // Si no encuentra la categoría, mostrar todos los productos
      console.log('Categoría no encontrada, mostrando todos los productos');
      productos = await fetchProductos();
    }
  }

  console.log('Productos encontrados:', productos.length);

  // Preparar categorías para el filtro
  const categoriasFiltro = [
    { id: 0, name: 'Todos' },
    ...categorias.map(cat => ({ id: cat.id, name: cat.name }))
  ];

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#FAF9F7' }}>
      {/* Hero Section del Catálogo */}
      <div className="relative py-16 px-4 overflow-hidden" style={{ backgroundColor: '#5A8C7A' }}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4 text-white">
              Catálogo de Suplementos
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              Productos de calidad premium recomendados por la Lic. Rubí Ramos
            </p>
          </div>

          {/* Barra de búsqueda */}
          <div className="max-w-3xl mx-auto mb-8">
            <SearchBar initialQuery={query} />
          </div>

          {/* Filtros por categoría */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-white mb-2">
              <FaFilter className="h-5 w-5" />
              <span className="font-semibold">Filtrar por categoría:</span>
            </div>
            <CategoryFilter 
              categorias={categoriasFiltro}
              categoriaSeleccionada={categoriaParam}
            />
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold font-serif" style={{ color: '#2C3E34' }}>
              {query 
                ? `Resultados para "${query}"` 
                : categoriaParam === "Todos" 
                  ? "Todos los productos" 
                  : `Categoría: ${categoriaParam}`
              }
            </h2>
            <p className="mt-2" style={{ color: '#6E7C72' }}>
              {productos.length} producto{productos.length !== 1 ? 's' : ''} disponibles
            </p>
          </div>
        </div>
        
        {/* Grid de productos */}
        <ProductsGrid 
          productos={productos}
          categorias={categorias}
          query={query}
          categoriaSeleccionada={categoriaParam}
        />
      </div>

      {/* Sección informativa */}
      <div className="py-12 px-4" style={{ backgroundColor: '#FAF9F7' }}>
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-bold font-serif mb-6" style={{ color: '#2C3E34' }}>
            ¿Necesitas asesoría personalizada?
          </h3>
          <p className="text-lg mb-8 max-w-3xl mx-auto" style={{ color: '#6E7C72' }}>
            La Lic. Rubí Ramos puede recomendarte los productos más adecuados según tu plan nutricional personalizado
          </p>
          <a 
            href="/schedule"
            className="inline-block px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
            style={{ 
              backgroundColor: '#F58634',
              color: '#FFFFFF'
            }}
          >
            Agendar Consulta Personalizada
          </a>
        </div>
      </div>
    </main>
  );
}