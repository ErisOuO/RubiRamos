"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

interface CategoryFilterProps {
  categorias: { id: number; name: string }[];
  categoriaSeleccionada: string;
}

export default function CategoryFilter({ categorias, categoriaSeleccionada }: CategoryFilterProps) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    category === 'Todos' ? params.delete('categoria') : params.set('categoria', category);
    params.delete('query');
    replace(`/catalog?${params}`);
  };

  const handlePriceFilter = () => {
    const params = new URLSearchParams(searchParams);
    
    if (precioMin) params.set('precioMin', precioMin);
    else params.delete('precioMin');
    
    if (precioMax) params.set('precioMax', precioMax);
    else params.delete('precioMax');
    
    replace(`/catalog?${params}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('categoria');
    params.delete('precioMin');
    params.delete('precioMax');
    params.delete('query');
    replace(`/catalog?${params}`);
    setPrecioMin('');
    setPrecioMax('');
    setShowPriceFilter(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-center gap-3">
        {categorias.map(({ id, name }) => {
          const isSelected = categoriaSeleccionada === name;
          return (
            <button
              key={id}
              onClick={() => handleCategoryChange(name)}
              className={`px-5 py-2.5 rounded-full border transition-all duration-300 font-medium text-sm md:text-base shadow-sm hover:shadow-md ${isSelected ? 'font-semibold' : ''}`}
              style={{
                backgroundColor: isSelected ? '#F58634' : '#FFFFFF',
                color: isSelected ? '#FFFFFF' : '#5A8C7A',
                borderColor: isSelected ? '#F58634' : '#E6E3DE'
              }}
            >
              {name}
            </button>
          );
        })}
      </div>

      {/* Filtro de precios */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={() => setShowPriceFilter(!showPriceFilter)}
          className="text-sm text-[#5A8C7A] hover:text-[#F58634] transition-colors flex items-center gap-1"
        >
          {showPriceFilter ? '−' : '+'} Filtrar por precio
        </button>

        {showPriceFilter && (
          <div className="flex flex-wrap items-center justify-center gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="number"
              placeholder="Mínimo"
              value={precioMin}
              onChange={(e) => setPrecioMin(e.target.value)}
              className="w-28 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F58634]"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              placeholder="Máximo"
              value={precioMax}
              onChange={(e) => setPrecioMax(e.target.value)}
              className="w-28 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#F58634]"
            />
            <button
              onClick={handlePriceFilter}
              className="px-4 py-2 bg-[#5A8C7A] text-white rounded-md text-sm hover:bg-[#4A7A68] transition-colors"
            >
              Aplicar
            </button>
            <button
              onClick={clearFilters}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-100 transition-colors"
            >
              Limpiar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}