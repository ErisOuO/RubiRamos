import AppointmentCalendar from "@/components/calendar/AppointmentCalendar";

export default function Page() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-green-50 py-10">
      <div className="max-w-6xl mx-auto px-4">

        {/* Header */}
        <header className="text-center mb-14">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Agenda tu Cita Médica
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Consulta la disponibilidad del mes y selecciona el día que mejor se adapte a tus necesidades.
          </p>
        </header>

        {/* Tarjeta informativa */}
        <section className="bg-white rounded-2xl shadow-lg p-6 mb-10 border-l-4 border-blue-500">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            ℹ️ Información Importante
          </h2>

          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-blue-500 font-bold">•</span>
                <p>Horario de atención: Lunes a Viernes de 8:00 AM a 6:00 PM</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-500 font-bold">•</span>
                <p>Sábados de 9:00 AM a 1:00 PM</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-500 font-bold">•</span>
                <p>Duración promedio de cita: 30-45 minutos</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-blue-500 font-bold">•</span>
                <p>Máximo 15 citas por día para garantizar calidad</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-500 font-bold">•</span>
                <p>Puedes reagendar con 24 horas de anticipación</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-blue-500 font-bold">•</span>
                <p>Emergencias: Llama al (555) 123-4567</p>
              </div>
            </div>
          </div>
        </section>

        {/* Separador suave */}
        <div className="w-full h-[1px] bg-gray-300/40 rounded-full mb-10"></div>

        {/* Calendario */}
        <section id="calendario" className="mb-16">
          <AppointmentCalendar />

          {/* Mensaje debajo del calendario */}
          <p className="text-center text-gray-600 text-sm mt-6">
            Selecciona cualquier día del calendario para conocer su disponibilidad.
          </p>
        </section>

        {/* CTA final */}
        <section className="text-center bg-white rounded-2xl shadow-lg p-8 border-t-4 border-green-500">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            ¿Listo para agendar tu cita?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Contáctanos después de escoger el día para confirmar el horario disponible.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors duration-300 shadow-lg hover:shadow-xl">
              📞 Llamar para Agendar
            </button>
            <button className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors duration-300 shadow-lg hover:shadow-xl">
              💬 WhatsApp
            </button>
            <button className="px-8 py-3 bg-gray-500 text-white font-semibold rounded-xl hover:bg-gray-600 transition-colors duration-300 shadow-lg hover:shadow-xl">
              📧 Enviar Email
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-500 text-sm pb-6">
          <p>© 2024 Centro Médico Salud Integral. Todos los derechos reservados.</p>
          <p className="mt-2">
            Av. Principal #123, Ciudad • Tel: (555) 123-4567 • Email: info@centromedico.com
          </p>
        </footer>

      </div>
    </main>
  );
}
