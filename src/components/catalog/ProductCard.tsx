"use client";

import Image from "next/image";
import { useState } from "react";
import { FaShoppingCart, FaHeart, FaRegHeart, FaTag, FaImage } from "react-icons/fa";
import { Producto as ProductoType } from '@/lib/definitions';

interface ProductCardProps {
  producto: ProductoType;
  isFavorite: boolean;
  onToggleFavorite: (productoId: number) => void;
  onAddToCart: (producto: ProductoType) => void;
}

export default function ProductCard({ 
  producto, 
  isFavorite, 
  onToggleFavorite, 
  onAddToCart 
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  // Convertir price a número si viene como string
  const precio = typeof producto.price === 'string' 
    ? parseFloat(producto.price) 
    : producto.price;

  // Determinar estado del stock
  const getStockStatus = () => {
    if (producto.stock === 0) return { text: 'Agotado', color: '#6E7C72' };
    if (producto.stock < 10) return { text: 'Últimas unidades', color: '#F58634' };
    return { text: 'Disponible', color: '#A8CF45' };
  };

  const stockStatus = getStockStatus();

  // Función para generar un placeholder SVG en línea basado en el nombre del producto
  const getPlaceholderSVG = (name: string) => {
    // Colores de la paleta
    const colors = {
      background: '#FAF9F7',
      circle: '#E6E3DE',
      text: '#6E7C72',
      accent: '#5A8C7A'
    };
    
    // Primera letra del producto para el placeholder
    const firstLetter = name.charAt(0).toUpperCase();
    
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E
      %3Crect width='400' height='300' fill='${colors.background.replace('#', '%23')}'/%3E
      %3Ccircle cx='200' cy='120' r='60' fill='${colors.circle.replace('#', '%23')}'/%3E
      %3Ctext x='200' y='130' font-family='Arial, sans-serif' font-size='48' font-weight='bold' text-anchor='middle' fill='${colors.accent.replace('#', '%23')}'%3E${firstLetter}%3C/text%3E
      %3Ctext x='200' y='200' font-family='Arial, sans-serif' font-size='16' text-anchor='middle' fill='${colors.text.replace('#', '%23')}'%3E${encodeURIComponent(name)}%3C/text%3E
      %3Ctext x='200' y='220' font-family='Arial, sans-serif' font-size='12' text-anchor='middle' fill='${colors.text.replace('#', '%23')}'%3EProducto Nutricional%3C/text%3E
    %3C/svg%3E`;
  };

  // Función para obtener la fuente de la imagen (con fallback)
  const getImageSrc = () => {
    // Si ya sabemos que hay error o no hay URL, usar placeholder
    if (imageError || !producto.image_url) {
      return getPlaceholderSVG(producto.name);
    }
    
    // Intentar usar la URL proporcionada
    try {
      // Verificar si es una URL válida
      if (producto.image_url.startsWith('http://') || producto.image_url.startsWith('https://')) {
        return producto.image_url;
      }
      
      // Si es una ruta relativa, asegurar que empiece con /
      if (producto.image_url.startsWith('/')) {
        return producto.image_url;
      }
      
      return `/${producto.image_url}`;
    } catch {
      return getPlaceholderSVG(producto.name);
    }
  };

  return (
    <div 
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-[#E6E3DE] flex flex-col h-full"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      {/* Estado del stock */}
      <div className="absolute top-4 left-4 z-10">
        <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
          style={{ 
            backgroundColor: stockStatus.color + '20', // 20% de opacidad
            color: stockStatus.color
          }}
        >
          <FaTag className="h-3 w-3" />
          {stockStatus.text}
        </span>
      </div>

      {/* Botón de favoritos */}
      <button
        onClick={() => onToggleFavorite(producto.id)}
        className="absolute top-4 right-4 z-10 p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform"
        style={{ 
          backgroundColor: '#FFFFFF',
          color: isFavorite ? '#F58634' : '#6E7C72'
        }}
        aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
      >
        {isFavorite ? (
          <FaHeart className="h-5 w-5" />
        ) : (
          <FaRegHeart className="h-5 w-5" />
        )}
      </button>

      {/* Imagen del producto */}
      <div className="relative h-64 w-full bg-gradient-to-b from-[#FAF9F7] to-[#FFFFFF] overflow-hidden flex-1">
        <Image
          src={getImageSrc()}
          alt={producto.name}
          fill
          className="object-contain p-6 transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => {
            setImageError(true);
          }}
          unoptimized={true} // Para evitar problemas con URLs no válidas
        />
        
        {/* Badge de placeholder si hay error */}
        {imageError && (
          <div className="absolute bottom-2 right-2">
            <span className="text-xs px-2 py-1 rounded-full bg-white/80 backdrop-blur-sm">
              <FaImage className="inline h-3 w-3 mr-1" />
              Placeholder
            </span>
          </div>
        )}
      </div>

      {/* Contenido del producto */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Nombre del producto */}
        <h3 className="text-lg font-bold font-serif mb-3 line-clamp-2" style={{ color: '#2C3E34' }}>
          {producto.name}
        </h3>

        {/* Descripción */}
        <p className="text-sm mb-4 flex-grow line-clamp-3" style={{ color: '#6E7C72' }}>
          {producto.description}
        </p>

        {/* Precio */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-1" style={{ color: '#6E7C72' }}>
            Precio:
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold" style={{ color: '#BD7D4A' }}>
              ${precio.toFixed(2)}
            </span>
            <span className="text-sm" style={{ color: '#6E7C72' }}>
              MXN
            </span>
            <div className="ml-auto text-sm" style={{ color: '#6E7C72' }}>
              Stock: <span className="font-semibold">{producto.stock}</span>
            </div>
          </div>
        </div>

        {/* Botón de agregar al carrito */}
        <button
          onClick={() => onAddToCart(producto)}
          disabled={producto.stock === 0}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2 group/btn mt-auto
            ${producto.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          style={{ 
            backgroundColor: producto.stock === 0 ? '#E6E3DE' : '#5A8C7A',
            color: '#FFFFFF'
          }}
          aria-label={`Agregar ${producto.name} al carrito`}
        >
          {producto.stock === 0 ? (
            <>
              <span>Agotado</span>
            </>
          ) : (
            <>
              <FaShoppingCart className="h-5 w-5 transition-transform group-hover/btn:scale-110" />
              <span>Agregar al carrito</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}