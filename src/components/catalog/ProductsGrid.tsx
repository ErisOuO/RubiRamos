"use client";

import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import EmptyState from "./EmptyState";
import { Producto, Categoria } from '@/lib/definitions';
import { FaShoppingCart } from 'react-icons/fa';

// Tipo simplificado para el carrito
type ProductoCarrito = Omit<Producto, 'created_at' | 'updated_at' | 'active'>;

interface ProductsGridProps {
  productos: Producto[];
  categorias: Categoria[];
  query: string;
  categoriaSeleccionada: string;
}

export default function ProductsGrid({ 
  productos, 
  query,
  categoriaSeleccionada 
}: ProductsGridProps) {
  const [cart, setCart] = useState<ProductoCarrito[]>([]);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [filteredProducts, setFilteredProducts] = useState<Producto[]>([]);

  // Solo filtrar por búsqueda, no por categoría (ya se hizo en el servidor)
  useEffect(() => {
    console.log('ProductsGrid - Productos recibidos:', productos.length);
    console.log('ProductsGrid - Query:', query);
    console.log('ProductsGrid - Categoría seleccionada:', categoriaSeleccionada);
    
    let filtered = [...productos];

    // Solo filtrar por búsqueda (la categoría ya fue filtrada en el servidor)
    if (query) {
      filtered = filtered.filter(producto =>
        producto.name.toLowerCase().includes(query.toLowerCase()) ||
        producto.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    console.log('ProductsGrid - Productos después de filtrar búsqueda:', filtered.length);
    setFilteredProducts(filtered);
  }, [productos, query]); // Quitamos categoriaSeleccionada y categorias de las dependencias

  // Manejar agregar al carrito
  const handleAddToCart = (producto: Producto) => {
    if (producto.stock > 0) {
      // Crear un producto simplificado para el carrito
      const productoCarrito: ProductoCarrito = {
        id: producto.id,
        name: producto.name,
        description: producto.description,
        price: producto.price,
        stock: producto.stock,
        image_url: producto.image_url
      };
      
      const newCart = [...cart, productoCarrito];
      setCart(newCart);
      
      // Mostrar notificación
      showNotification(`${producto.name} agregado al carrito`);
      
      // Guardar en localStorage
      localStorage.setItem('cart', JSON.stringify(newCart));
    }
  };

  // Manejar favoritos
  const toggleFavorite = (productoId: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      newFavorites.has(productoId) 
        ? newFavorites.delete(productoId) 
        : newFavorites.add(productoId);
      
      // Guardar en localStorage
      localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)));
      
      return newFavorites;
    });
  };

  // Función para mostrar notificaciones
  const showNotification = (message: string) => {
    // Puedes implementar un sistema de toast aquí
    console.log('Notificación:', message);
    // O usar un toast library como react-hot-toast
  };

  // Obtener productos favoritos y carrito del localStorage al cargar
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
    
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  return (
    <section className="w-full py-6">
      {/* Contador de resultados */}
      <div className="mb-8 text-center">
        <p className="text-lg" style={{ color: '#6E7C72' }}>
          <span className="font-bold" style={{ color: '#5A8C7A' }}>
            {filteredProducts.length}
          </span> producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Estado vacío - CORREGIDO: usar filteredProducts */}
      {filteredProducts.length === 0 ? (
        <EmptyState search={query} categoria={categoriaSeleccionada} />
      ) : (
        /* Grid de productos */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((producto) => (
            <ProductCard
              key={producto.id}
              producto={producto}
              isFavorite={favorites.has(producto.id)}
              onToggleFavorite={toggleFavorite}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}

      {/* Indicador de carrito */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 right-4 p-4 rounded-xl shadow-lg z-50 animate-in slide-in-from-bottom" 
          style={{ 
            backgroundColor: '#5A8C7A',
            color: '#FFFFFF'
          }}
        >
          <a href="/shopping_cart" className="flex items-center gap-2">
            <FaShoppingCart className="h-5 w-5" />
            <span className="font-semibold">
              {cart.length} producto{cart.length !== 1 ? 's' : ''} en el carrito
            </span>
            <span className="ml-2 px-2 py-1 rounded text-xs font-bold" style={{ backgroundColor: '#F58634' }}>
              Ver
            </span>
          </a>
        </div>
      )}
    </section>
  );
}