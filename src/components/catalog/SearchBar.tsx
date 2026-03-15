"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { FaSearch } from 'react-icons/fa';

export default function SearchBar({ initialQuery }: { initialQuery: string }) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    
    replace(`/catalog?${params.toString()}`);
  }, 300);

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Buscar productos por nombre..."
        defaultValue={initialQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full px-6 py-4 pl-14 pr-12 rounded-2xl border focus:outline-none focus:ring-2 shadow-lg text-lg transition-all duration-300"
        style={{ 
          backgroundColor: '#FFFFFF',
          borderColor: '#E6E3DE',
          color: '#2C3E34'
        }}
      />
      <FaSearch 
        className="absolute left-5 top-1/2 transform -translate-y-1/2 text-xl" 
        style={{ color: '#6E7C72' }}
      />
      {initialQuery && (
        <button
          onClick={() => {
            const params = new URLSearchParams(searchParams);
            params.delete('query');
            replace(`/catalog?${params.toString()}`);
          }}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors"
          style={{ color: '#6E7C72', backgroundColor: '#FAF9F7' }}
          aria-label="Limpiar búsqueda"
        >
          ×
        </button>
      )}
    </div>
  );
}