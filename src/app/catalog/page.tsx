import ProductsGrid from "@/components/catalog/ProductsGrid";
import { FaSearch, FaFilter } from "react-icons/fa";

export default function Page() {
  return (
    <main className="min-h-screen w-full">
      
        {/* Barra de búsqueda y filtros */}
        <div className="mt-2">
          {/* Barra de búsqueda */}
          <div className="relative max-w-2xl mx-auto mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full px-6 py-4 pl-14 pr-12 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent shadow-sm text-lg"
              />
              <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <button title="Filtro" className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <FaFilter className="text-gray-500 text-lg" />
              </button>
            </div>
          </div>

          {/* Filtros por categoría */}
          <div className="flex flex-wrap justify-center gap-4">
            <button className="px-6 py-3 rounded-full bg-white border border-gray-300 hover:border-green-400 hover:bg-green-50 transition-all duration-300 shadow-sm font-medium text-gray-700 hover:text-green-700">
              Todos
            </button>
            <button className="px-6 py-3 rounded-full bg-white border border-gray-300 hover:border-green-400 hover:bg-green-50 transition-all duration-300 shadow-sm font-medium text-gray-700 hover:text-green-700">
              Proteínas
            </button>
            <button className="px-6 py-3 rounded-full bg-white border border-gray-300 hover:border-green-400 hover:bg-green-50 transition-all duration-300 shadow-sm font-medium text-gray-700 hover:text-green-700">
              Pre-Workout
            </button>
            <button className="px-6 py-3 rounded-full bg-white border border-gray-300 hover:border-green-400 hover:bg-green-50 transition-all duration-300 shadow-sm font-medium text-gray-700 hover:text-green-700">
              Aminoácidos
            </button>
            <button className="px-6 py-3 rounded-full bg-white border border-gray-300 hover:border-green-400 hover:bg-green-50 transition-all duration-300 shadow-sm font-medium text-gray-700 hover:text-green-700">
              Vitaminas
            </button>
            <button className="px-6 py-3 rounded-full bg-white border border-gray-300 hover:border-green-400 hover:bg-green-50 transition-all duration-300 shadow-sm font-medium text-gray-700 hover:text-green-700">
              Colágeno
            </button>
            <button className="px-6 py-3 rounded-full bg-white border border-gray-300 hover:border-green-400 hover:bg-green-50 transition-all duration-300 shadow-sm font-medium text-gray-700 hover:text-green-700">
              Ganadores de Masa
            </button>
          </div>
        </div>

      {/* Carrusel - SIN padding superior y pegado al borde 
      <div className="w-full">
        <CarouselProducts />
      </div>
      */}

      {/* Contenido con padding normal */}
      <div className="max-w-6xl mx-auto px-6 py-12">

        {/* Grid de Productos */}
        <div className="mb-20">
          <ProductsGrid />
        </div>
      </div>
    </main>
  );
}