"use client";

import Image from "next/image";
import { useState } from "react";
import { FaShoppingCart, FaHeart, FaRegHeart } from "react-icons/fa";

/* ============================
   Tipos
============================ */
interface Product {
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  category: string;
}

/* ============================
   Datos (mock)
============================ */
const products: Product[] = [
  { name: "Colágeno Premium", image: "colageno.png", price: 399, originalPrice: 449, category: "Colágeno" },
  { name: "Prowinner Protein", image: "prowinner.png", price: 549, originalPrice: 599, category: "Proteínas" },
  { name: "Gold Start Aminos", image: "goldstandar.png", price: 299, originalPrice: 349, category: "Aminoácidos" },
  { name: "PeakFormance Boost", image: "peakperformance.png", price: 469, originalPrice: 519, category: "Pre-Workout" },
  { name: "Protein Power", image: "proteinpowder.png", price: 529, originalPrice: 579, category: "Proteínas" },
  { name: "Pure Pre-Workout", image: "purepre.png", price: 449, originalPrice: 499, category: "Pre-Workout" },
  { name: "Suplin Daily Vitamins", image: "suplint.png", price: 199, originalPrice: 249, category: "Vitaminas" },
  { name: "Black Bear Mass", image: "blackbear.png", price: 599, originalPrice: 649, category: "Ganadores de Masa" },
  { name: "Protein Shake V2", image: "proteinshake2.png", price: 459, originalPrice: 509, category: "Proteínas" },
];

/* ============================
   Componente
============================ */
export default function ProductsGrid({
  search,
  category,
}: {
  search: string;
  category: string;
}) {
  const [cart, setCart] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  /* ============================
     Filtrado
  ============================ */
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "Todos" || p.category === category;

    return matchesSearch && matchesCategory;
  });

  /* ============================
     Acciones
  ============================ */
  const handleAdd = (product: Product) => {
    setCart([...cart, product]);
  };

  const toggleFavorite = (productName: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);

      if (newFavorites.has(productName)) {
        newFavorites.delete(productName);
      } else {
        newFavorites.add(productName);
      }

      return newFavorites;
    });
  };

  return (
    <section className="w-full py-10 px-6">
      {filteredProducts.length === 0 && (
        <p className="text-center text-gray-500 text-lg">
          No se encontraron productos
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredProducts.map((p) => {
          const isFavorite = favorites.has(p.name);
          const discount = Math.round(
            ((p.originalPrice - p.price) / p.originalPrice) * 100
          );

          return (
            <div
              key={p.name}
              className="bg-white shadow-lg rounded-2xl p-5 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 group relative"
            >
              {/* Descuento */}
              <div className="absolute top-3 left-3 z-10">
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  -{discount}%
                </span>
              </div>

              {/* Favoritos */}
              <button
                onClick={() => toggleFavorite(p.name)}
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:scale-110 transition-transform"
                aria-label={
                  isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"
                }
              >
                {isFavorite ? (
                  <FaHeart className="text-red-500 text-lg" />
                ) : (
                  <FaRegHeart className="text-gray-400 text-lg hover:text-red-400" />
                )}
              </button>

              {/* Imagen */}
              <div className="w-full h-56 relative mb-4 group-hover:scale-105 transition-transform duration-300">
                <Image
                  src={`/${p.image}`}
                  alt={p.name}
                  fill
                  className="object-contain drop-shadow-md"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>

              {/* Texto */}
              <div className="flex flex-col items-center text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2 min-h-[3rem] flex items-center justify-center">
                  {p.name}
                </h3>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-sm text-gray-500 line-through">
                    ${p.originalPrice}
                  </span>
                  <span
                    className="text-2xl font-extrabold"
                    style={{
                      background: "linear-gradient(135deg, #C96518, #E87C1E)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    ${p.price}
                  </span>
                </div>

                <button
                  onClick={() => handleAdd(p)}
                  className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                  style={{
                    background: "linear-gradient(135deg, #A8CF45, #7DA82E)",
                  }}
                  aria-label={`Agregar ${p.name} al carrito`}
                >
                  <FaShoppingCart className="text-white text-lg" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}