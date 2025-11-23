import ShoppingCart from "@/components/car_shop/ShoppingCart";

export default function CartPage() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header de la página */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Mi Carrito de Compras
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Revisa tus productos, ajusta las cantidades y procede al checkout de forma segura
          </p>
        </div>

        {/* Proceso de compra */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-2 border border-gray-200">
            <div className="flex items-center gap-8 text-sm font-medium">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                  1
                </div>
                <span className="text-green-600">Carrito</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold">
                  2
                </div>
                <span className="text-gray-500">Información</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold">
                  3
                </div>
                <span className="text-gray-500">Pago</span>
              </div>
              <div className="w-12 h-0.5 bg-gray-300"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold">
                  4
                </div>
                <span className="text-gray-500">Confirmación</span>
              </div>
            </div>
          </div>
        </div>

        {/* Componente del carrito */}
        <div className="mb-12">
          <ShoppingCart />
        </div>

        {/* Beneficios y garantías */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚚</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Envío Rápido</h3>
            <p className="text-gray-600 text-sm">
              Recibe tu pedido en 24-48 horas en la CDMX y área metropolitana
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Pago Seguro</h3>
            <p className="text-gray-600 text-sm">
              Transacciones protegidas con encriptación SSL de 256 bits
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">↩️</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Devoluciones</h3>
            <p className="text-gray-600 text-sm">
              30 días para cambiar o devolver tus productos sin complicaciones
            </p>
          </div>
        </div>

        {/* Preguntas frecuentes */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Preguntas Frecuentes
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  ¿Cuáles son los métodos de pago aceptados?
                </h3>
                <p className="text-gray-600 text-sm">
                  Aceptamos tarjetas de crédito/débito (Visa, MasterCard, American Express), PayPal y transferencias bancarias.
                </p>
              </div>
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  ¿Puedo modificar mi pedido después de pagar?
                </h3>
                <p className="text-gray-600 text-sm">
                  Sí, puedes contactarnos dentro de las primeras 2 horas después de tu compra para realizar modificaciones.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  ¿Ofrecen envío internacional?
                </h3>
                <p className="text-gray-600 text-sm">
                  Actualmente solo realizamos envíos dentro de México. Próximamente expandiremos a otros países.
                </p>
              </div>
              <div className="border-b border-gray-200 pb-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  ¿Cómo funciona la garantía de los productos?
                </h3>
                <p className="text-gray-600 text-sm">
                  Todos nuestros productos tienen garantía de 30 días contra defectos de fabricación.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contacto de soporte */}
        <div className="text-center bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">¿Necesitas ayuda?</h2>
          <p className="mb-6 opacity-90">
            Nuestro equipo de soporte está disponible para resolver tus dudas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-white text-green-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-300">
              📞 Llamar a Soporte
            </button>
            <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-300">
              💬 Chat en Vivo
            </button>
            <button className="px-6 py-3 bg-white text-gray-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-300">
              📧 Enviar Email
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}