"use client";

export default function InternalServerError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-orange-50 p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Título animado */}
        <div className="mb-8">
          <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">
            500
          </h1>
          <h2 className="text-3xl font-bold text-gray-800 mt-2">
            ¡Indigestión del sistema!
          </h2>
        </div>

        {/* Fruta animada con problemas digestivos */}
        <div className="relative flex justify-center mb-12">
          <div className="relative">
            {/* Cuerpo de la manzana con "dolor" */}
            <div className="w-72 h-72 rounded-full bg-gradient-to-r from-red-300 via-red-400 to-red-500 relative overflow-hidden shadow-2xl animate-pulse">
              
              {/* Cara con expresión de dolor */}
              <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32">
                {/* Ojos entrecerrados */}
                <div className="flex justify-between mb-6">
                  <div className="w-10 h-6 bg-white rounded-full relative overflow-hidden">
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-3 bg-black rounded-full"></div>
                  </div>
                  <div className="w-10 h-6 bg-white rounded-full relative overflow-hidden">
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-3 bg-black rounded-full"></div>
                  </div>
                </div>
                
                {/* Boca abierta (gritando) */}
                <div className="relative mx-auto w-20 h-12">
                  <div className="absolute inset-0 bg-black rounded-b-full"></div>
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-4 h-6 bg-white rounded-full"></div>
                </div>
              </div>
              
              {/* Líneas de "dolor" o mareo */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full">
                  {[...Array(6)].map((_, i) => (
                    <div 
                      key={i}
                      className="absolute w-2 h-20 bg-white opacity-20 rotate-45"
                      style={{
                        top: `${i * 30}%`,
                        left: `${i * 20}%`,
                        animation: `spin 2s linear infinite`,
                        animationDelay: `${i * 0.2}s`
                      }}
                    ></div>
                  ))}
                </div>
              </div>
              
              {/* "Gas" o burbujas saliendo */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="flex space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i}
                      className="w-8 h-8 bg-white rounded-full opacity-70 animate-bounce"
                      style={{
                        animationDelay: `${i * 0.3}s`
                      }}
                    ></div>
                  ))}
                </div>
              </div>
              
              {/* Pastilla o medicamento */}
              <div className="absolute bottom-6 left-6">
                <div className="w-12 h-6 bg-blue-400 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-8 h-1 bg-white"></div>
                </div>
              </div>
              
              {/* Termómetro digital */}
              <div className="absolute bottom-6 right-6 bg-gray-800 text-white p-2 rounded-lg shadow-lg">
                <div className="text-xs font-mono">ERROR</div>
                <div className="text-sm font-bold text-red-300">500°</div>
              </div>
            </div>
            
            {/* Etiqueta "No disponible" */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-4 py-2 rounded-full shadow-lg animate-bounce">
              <div className="flex items-center">
                <span className="mr-2">⚠️</span>
                <span className="font-bold">SISTEMA INDIGESTO</span>
              </div>
            </div>
            
            {/* Jarabe/botella */}
            <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
              <div className="w-16 h-24 bg-gradient-to-b from-blue-400 to-blue-600 rounded-t-lg rounded-b-xl shadow-lg relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-blue-300 rounded-b-lg"></div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-xs font-bold rotate-90">
                  ANTÍDOTO
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mensaje explicativo */}
        <div className="mb-10 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
          <p className="text-2xl text-gray-800 mb-4">
            ¡Nuestro sistema nutricional tiene una indigestión de datos!
          </p>
          <p className="text-lg text-gray-600 mb-6">
            Parece que algo no cayó bien en nuestro procesamiento de alimentos informáticos.
          </p>
          
          {/* Detalles del error (colapsable) */}
          <div className="mb-8">
            <details className="bg-red-50 rounded-xl p-4">
              <summary className="cursor-pointer font-medium text-red-700 flex items-center justify-center">
                <span className="mr-2">🔍 Ver detalles técnicos</span>
              </summary>
              <div className="mt-4 p-4 bg-white rounded-lg font-mono text-sm text-left overflow-x-auto">
                <code className="text-gray-700">
                  {error.message || "Error interno del servidor"}
                </code>
              </div>
            </details>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <button
            onClick={() => reset()}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="flex items-center justify-center">
              <span className="mr-3">💊</span>
              <span>Administrar antídoto</span>
              <span className="ml-3 group-hover:animate-ping">🔄</span>
            </div>
            <div className="text-sm font-normal mt-1 opacity-90">
              Reintentar la operación
            </div>
          </button>
          
          <link
            href="/"
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="flex items-center justify-center">
              <span className="mr-3">🏥</span>
              <span>Volver al consultorio</span>
              <span className="ml-3">🏃‍♂️</span>
            </div>
            <div className="text-sm font-normal mt-1 opacity-90">
              Regresar a la página principal
            </div>
          </link>
        </div>

        {/* Consejo nutricional de emergencia */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-orange-500 rounded-r-xl p-6 shadow-md">
          <h3 className="text-lg font-bold text-orange-800 mb-3 flex items-center">
            <span className="mr-3">🩺</span>
            Consejo nutricional de emergencia
          </h3>
          <p className="text-gray-700">
            Si tú también tienes una indigestión, recuerda: bebe agua tibia con limón y descansa.
            ¡El sistema digestivo (y el servidor) necesitan su tiempo!
          </p>
        </div>

        {/* Frutas decorativas */}
        <div className="mt-10 flex justify-center space-x-6 text-4xl opacity-80">
          <span className="animate-bounce" style={{animationDelay: "0s"}}>🍏</span>
          <span className="animate-bounce" style={{animationDelay: "0.2s"}}>🍊</span>
          <span className="animate-bounce" style={{animationDelay: "0.4s"}}>🍌</span>
          <span className="animate-bounce" style={{animationDelay: "0.6s"}}>🥝</span>
          <span className="animate-bounce" style={{animationDelay: "0.8s"}}>🍇</span>
        </div>
      </div>

      {/* Estilos CSS para animaciones */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(45deg) translateX(0); }
          50% { transform: rotate(45deg) translateX(10px); }
          100% { transform: rotate(45deg) translateX(0); }
        }
      `}</style>
    </main>
  );
}