import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-emerald-100 p-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Título animado */}
        <div className="mb-8">
          <h1 className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-800">
            404
          </h1>
          <p className="mt-2 text-3xl font-semibold text-gray-800">
            ¡Página no encontrada!
          </p>
        </div>

        {/* Fruta animada "enferma" */}
        <div className="relative flex justify-center mb-10">
          <div className="relative">
            {/* Cuerpo de la manzana */}
            <div className="w-60 h-60 rounded-full bg-gradient-to-r from-red-400 to-red-600 relative overflow-hidden shadow-2xl animate-[bounce_3s_ease-in-out_infinite]">
              {/* Cara triste */}
              <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28">
                {/* Ojos tristes */}
                <div className="flex justify-between mb-4">
                  <div className="w-8 h-8 bg-white rounded-full relative overflow-hidden">
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-black rounded-full"></div>
                    <div className="absolute top-0.5 left-1/2 transform -translate-x-1/2 w-6 h-3 bg-white rounded-t-full"></div>
                  </div>
                  <div className="w-8 h-8 bg-white rounded-full relative overflow-hidden">
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-black rounded-full"></div>
                    <div className="absolute top-0.5 left-1/2 transform -translate-x-1/2 w-6 h-3 bg-white rounded-t-full"></div>
                  </div>
                </div>
                
                {/* Boca triste */}
                <div className="relative mx-auto w-16 h-8">
                  <div className="absolute bottom-0 w-full h-full border-b-4 border-black rounded-b-full"></div>
                </div>
              </div>
              
              {/* Hoja en la parte superior */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-green-500 rounded-full rotate-45"></div>
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-8 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
              
              {/* Parche curita */}
              <div className="absolute bottom-8 right-8 transform rotate-12">
                <div className="w-16 h-8 bg-white border-2 border-red-300 flex">
                  <div className="w-1/3 border-r-2 border-red-300"></div>
                  <div className="w-1/3 border-r-2 border-red-300"></div>
                  <div className="w-1/3"></div>
                </div>
                <div className="w-4 h-4 bg-white absolute -top-2 -left-2 transform rotate-45"></div>
                <div className="w-4 h-4 bg-white absolute -top-2 -right-2 transform rotate-45"></div>
              </div>
            </div>
            
            {/* Termómetro */}
            <div className="absolute -right-6 top-12">
              <div className="w-8 h-40 bg-gradient-to-b from-gray-100 to-gray-300 rounded-lg shadow-lg relative">
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-32 bg-gradient-to-t from-red-500 to-red-300 rounded"></div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gray-200 rounded-full shadow-inner">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gray-100 rounded-full"></div>
                </div>
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs font-bold text-red-600">40°</div>
              </div>
            </div>
            
            {/* Gotas de "sudor" */}
            <div className="absolute -left-4 top-12">
              <div className="animate-[bounce_1s_infinite]">
                <div className="w-6 h-8 bg-blue-200 rounded-full mb-2 opacity-70"></div>
              </div>
              <div className="animate-[bounce_1s_infinite_300ms] ml-2">
                <div className="w-4 h-6 bg-blue-200 rounded-full opacity-70"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Mensaje */}
        <div className="mb-10">
          <p className="text-xl text-gray-700 mb-4">
            ¡Ups! Parece que esta página se perdió en el consultorio nutricional.
          </p>
          <p className="text-lg text-gray-600">
            La fruta está un poco indispuesta, pero podemos ayudarte a encontrar el camino correcto.
          </p>
        </div>

        {/* Botón de regreso */}
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-700 transform hover:-translate-y-1 transition-all duration-300"
          >
            <span>Volver al inicio saludable</span>
            <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </Link>
        </div>

        {/* Consejos nutricionales */}
        <div className="bg-white bg-opacity-70 rounded-2xl p-6 shadow-lg max-w-md mx-auto">
          <h3 className="text-lg font-bold text-emerald-800 mb-3">Mientras tanto, un consejo saludable:</h3>
          <p className="text-gray-700 italic">
            Recuerda consumir al menos 5 porciones de frutas y verduras al día para mantener tu salud en óptimas condiciones.
          </p>
        </div>
      </div>
    </main>
  );
}