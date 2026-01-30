"use client";

import { useState } from "react";
import ProductsGrid from "@/components/catalog/ProductsGrid";
import { FaSearch, FaFilter } from "react-icons/fa";

export default function Page() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");

  const categories = [
    "Todos",
    "Proteínas",
    "Pre-Workout",
    "Aminoácidos",
    "Vitaminas",
    "Colágeno",
    "Ganadores de Masa",
  ];

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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-6 py-4 pl-14 pr-12 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent shadow-sm text-lg"
            />
            <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <button
              title="Filtro"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FaFilter className="text-gray-500 text-lg" />
            </button>
          </div>
        </div>

        {/* Filtros por categoría */}
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-6 py-3 rounded-full border transition-all duration-300 shadow-sm font-medium
                ${
                  category === c
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-white text-gray-700 border-gray-300 hover:border-green-400 hover:bg-green-50 hover:text-green-700"
                }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-20">
          <ProductsGrid search={search} category={category} />
        </div>
      </div>
    </main>
  );
}