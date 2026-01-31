"use client";

import Link from "next/link";
import { useState } from "react";

export default function BadRequestPage() {
  const [isShaking, setIsShaking] = useState(false);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 to-amber-50 p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Encabezado con número 400 grande */}
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">
            400
          </h1>
        </div>

        {/* Subtítulo principal */}
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            ¡Solicitud mal digerida!
          </h2>
          <p className="text-xl text-gray-600 max-w-lg mx-auto">
            La información que enviaste no sigue la dieta correcta
          </p>
        </div>

        {/* Contenedor de la zanahoria */}
        <div className="relative flex justify-center mb-12">
          <div className="relative">
            {/* Zanahoria animada */}
            <div className={`relative w-48 h-72 ${isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}>
              {/* Hojas de la zanahoria */}
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                <div className="flex space-x-4">
                  <div className="w-5 h-24 bg-gradient-to-b from-green-400 to-emerald-600 rounded-t-lg transform -rotate-12"></div>
                  <div className="w-5 h-28 bg-gradient-to-b from-green-300 to-emerald-500 rounded-t-lg"></div>
                  <div className="w-5 h-20 bg-gradient-to-b from-green-500 to-emerald-700 rounded-t-lg transform rotate-12"></div>
                </div>
              </div>
              
              {/* Cuerpo de la zanahoria */}
              <div className="w-full h-56 bg-gradient-to-b from-orange-400 via-orange-500 to-orange-600 rounded-t-3xl rounded-b-lg shadow-2xl relative overflow-hidden">
                
                {/* Cara confundida */}
                <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-32">
                  {/* Ojos entrecerrados */}
                  <div className="flex justify-between mb-6">
                    <div className="w-8 h-4 bg-black rounded-full relative">
                      <div className="absolute top-0.5 left-1/2 transform -translate-x-1/2 w-6 h-1.5 bg-white rounded-full"></div>
                    </div>
                    <div className="w-8 h-4 bg-black rounded-full relative">
                      <div className="absolute top-0.5 left-1/2 transform -translate-x-1/2 w-6 h-1.5 bg-white rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Boca confundida */}
                  <div className="relative mx-auto w-16 h-8">
                    <svg viewBox="0 0 64 32" className="w-full h-full">
                      <path 
                        d="M8,20 Q32,12 56,20" 
                        fill="none" 
                        stroke="black" 
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
                
                {/* Etiqueta "FORMATO" destacada */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                  <div className="bg-red-100 border-2 border-red-300 px-5 py-2 rounded-full shadow-lg">
                    <div className="flex items-center space-x-2">
                      <span className="text-red-600 text-lg">⚠️</span>
                      <span className="text-sm font-bold text-red-700 tracking-wider">FORMATO INCORRECTO</span>
                    </div>
                  </div>
                </div>
                
                {/* Líneas de textura */}
                <div className="absolute inset-0">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i}
                      className="absolute h-full w-1.5 bg-gradient-to-b from-orange-300/40 to-transparent"
                      style={{ left: `${15 + i * 20}%` }}
                    ></div>
                  ))}
                </div>
              </div>
              
              {/* Raíces pequeñas */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <div className="w-1 h-6 bg-amber-800 rounded-full"></div>
                <div className="w-1 h-8 bg-amber-800 rounded-full"></div>
                <div className="w-1 h-7 bg-amber-800 rounded-full"></div>
              </div>
            </div>
            
            {/* Elementos decorativos flotantes */}
            <div className="absolute -top-6 -left-6 animate-[float_3s_ease-in-out_infinite]">
              <div className="w-12 h-12 bg-gradient-to-br from-red-300 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-xl">❌</span>
              </div>
            </div>
            
            <div className="absolute top-1/3 -right-8 animate-[float_3s_ease-in-out_infinite]" style={{animationDelay: '0.4s'}}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-300 to-cyan-400 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-lg">🚫</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mensaje explicativo */}
        <div className="mb-10 bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-amber-100">
          <div className="flex items-center justify-center mb-6">
            <div className="text-amber-600 text-4xl mr-4">📋</div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Análisis de solicitud</h3>
              <p className="text-gray-600">Diagnóstico nutricional digital</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-amber-50 p-5 rounded-xl border-2 border-amber-200">
              <div className="text-amber-600 text-3xl mb-3">🔍</div>
              <h4 className="font-bold text-amber-800 text-lg mb-2">Datos incompletos</h4>
              <p className="text-sm text-gray-600">Faltan campos por llenar</p>
            </div>
            
            <div className="bg-red-50 p-5 rounded-xl border-2 border-red-200">
              <div className="text-red-600 text-3xl mb-3">📝</div>
              <h4 className="font-bold text-red-800 text-lg mb-2">Formato incorrecto</h4>
              <p className="text-sm text-gray-600">Estructura no válida</p>
            </div>
            
            <div className="bg-blue-50 p-5 rounded-xl border-2 border-blue-200">
              <div className="text-blue-600 text-3xl mb-3">⚡</div>
              <h4 className="font-bold text-blue-800 text-lg mb-2">Sintaxis errónea</h4>
              <p className="text-sm text-gray-600">Caracteres no permitidos</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-5 border-l-4 border-amber-500">
            <p className="text-lg text-gray-800 italic">
              Los datos deben estar tan bien estructurados como una dieta balanceada
            </p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
          <button
            onClick={() => {
              setIsShaking(true);
              setTimeout(() => setIsShaking(false), 500);
              window.history.back();
            }}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center min-w-[200px]"
          >
            <span className="mr-3 text-2xl">↩️</span>
            <div className="text-left">
              <div className="text-lg">Revisar solicitud</div>
              <div className="text-sm font-normal text-white/80">Volver y corregir</div>
            </div>
          </button>
          
          <Link
            href="/"
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center min-w-[200px]"
          >
            <span className="mr-3 text-2xl">🏠</span>
            <div className="text-left">
              <div className="text-lg">Ir al inicio</div>
              <div className="text-sm font-normal text-white/80">Comenzar de nuevo</div>
            </div>
          </Link>
        </div>

        {/* Panel de solución */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 mb-8">
          <h3 className="text-xl font-bold text-emerald-800 mb-4 flex items-center">
            <span className="mr-3 text-2xl">💡</span>
            ¿Cómo solucionarlo?
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 text-sm font-bold">1</div>
              <div>
                <h4 className="font-bold text-gray-800">Revisa todos los campos</h4>
                <p className="text-gray-600 text-sm">Asegúrate de que no haya campos vacíos o con información incorrecta</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 text-sm font-bold">2</div>
              <div>
                <h4 className="font-bold text-gray-800">Verifica el formato</h4>
                <p className="text-gray-600 text-sm">Comprueba que los datos sigan el patrón requerido (email, teléfono, etc.)</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-1 text-sm font-bold">3</div>
              <div>
                <h4 className="font-bold text-gray-800">Vuelve a intentar</h4>
                <p className="text-gray-600 text-sm">Una vez corregidos los errores, envía la solicitud nuevamente</p>
              </div>
            </div>
          </div>
        </div>

        {/* Frutas y verduras decorativas */}
        <div className="mt-10">
          <div className="flex justify-center space-x-6 text-3xl mb-4">
            {['🥕', '🥦', '🍅', '🌽', '🥒', '🍆'].map((veg, index) => (
              <span 
                key={index}
                className="animate-bounce inline-block"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {veg}
              </span>
            ))}
          </div>
          
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Consultorio Nutricional Digital - Tu salud en línea también necesita cuidado
          </p>
        </div>
      </div>
    </main>
  );
}