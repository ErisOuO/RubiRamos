import { Metadata } from "next";
import Image from "next/image";
import {
  HeartIcon,
  UserCircleIcon,
  BeakerIcon,
  CalendarIcon,
  DocumentTextIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import FeatureCard from "@/components/FeatureCard/featureCard";

export const metadata: Metadata = {
  title: "Consultorio Nutricional - Lic. Rubí Ramos Álvarez",
  description:
    "Atención nutricional integral con evaluaciones personalizadas, planes alimenticios adecuados y asesoría profesional.",
};

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* HERO SECTION */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ backgroundColor: "#2C3E34" }}
      >
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-[1400px] mx-auto">
            {/* Layout: Mitad Foto (Izquierda) - Mitad Texto (Derecha) */}
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
              {/* Columna Izquierda - Foto movida a la izquierda y centrada */}
              <div className="lg:w-1/2 flex justify-center lg:justify-start lg:-ml-12 xl:-ml-20 w-full">
                <div className="relative">
                  {/* Marco decorativo superior izquierdo */}
                  <div className="absolute -top-6 -left-6 w-full h-full rounded-3xl bg-gradient-to-br from-[#BD7D4A] to-[#F58634] opacity-40"></div>
                  {/* Marco decorativo inferior derecho */}
                  <div className="absolute -bottom-6 -right-6 w-full h-full rounded-3xl bg-gradient-to-br from-[#7CB38C] to-[#A8CF45] opacity-40"></div>

                  {/* Contenedor de la foto (más rectangular para encuadrar mejor) */}
                  <div className="relative w-[350px] h-[450px] md:w-[500px] md:h-[600px] lg:w-[550px] lg:h-[700px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/90 bg-white/10 z-10">
                    <Image
                      src="/rubiramos.png"
                      alt="Lic. Rubí Ramos Álvarez - Nutrióloga"
                      fill
                      /* Aquí centramos a la doctora */
                      className="object-contain object-center scale-105"
                      priority
                      sizes="(max-width: 768px) 350px, (max-width: 1024px) 500px, 550px"
                    />
                  </div>

                  {/* Badge flotante */}
                  <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-6 py-2.5 shadow-xl whitespace-nowrap z-20 border border-gray-100">
                    <span
                      className="text-sm font-bold flex items-center gap-2"
                      style={{ color: "#2C3E34" }}
                    >
                      <span className="text-lg">🥗</span> Nutrióloga Certificada
                    </span>
                  </div>
                </div>
              </div>

              {/* Columna Derecha - Texto con mejor espacio y formato */}
              <div className="lg:w-1/2 text-center lg:text-left space-y-7 lg:pl-12 xl:pl-16 mt-8 lg:mt-0 flex flex-col justify-center">
                {/* Título principal */}
                <div className="space-y-4">
                  <h1
                    className="text-5xl lg:text-6xl xl:text-7xl font-bold font-serif tracking-tight leading-tight"
                    style={{ color: "#FFFFFF" }}
                  >
                    Consultorio
                    <br />
                    Nutricional
                  </h1>
                  <div className="w-20 h-1.5 bg-gradient-to-r from-[#BD7D4A] to-[#F58634] rounded-full mx-auto lg:mx-0"></div>
                </div>

                {/* Nombre de la nutrióloga */}
                <h2
                  className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-wide"
                  style={{ color: "#BD7D4A" }}
                >
                  Lic. Rubí Ramos Álvarez
                </h2>

                {/* Dirección con icono */}
                <div className="flex items-center justify-center lg:justify-start gap-3">
                  <MapPinIcon
                    className="h-6 w-6 flex-shrink-0"
                    style={{ color: "#BD7D4A" }}
                  />
                  <span
                    className="text-base md:text-lg opacity-90"
                    style={{ color: "#E6E3DE" }}
                  >
                    C. Juan Mogica Ugalde #10, Huejutla de Reyes
                  </span>
                </div>

                {/* Misión destacada */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-l-4 border-[#BD7D4A] shadow-lg">
                  <p
                    className="text-base md:text-lg leading-relaxed"
                    style={{ color: "#FFFFFF" }}
                  >
                    <span
                      className="font-bold block mb-2 text-xl tracking-wide"
                      style={{ color: "#BD7D4A" }}
                    >
                      Misión
                    </span>
                    Brindar atención nutricional integral a personas de
                    distintas edades mediante evaluaciones personalizadas,
                    planes alimenticios adecuados y asesoría profesional.
                  </p>
                </div>

                {/* Botones */}
                <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-4">
                  <button
                    className="px-8 py-4 rounded-xl font-bold text-base shadow-xl transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105 flex items-center justify-center gap-3"
                    style={{
                      backgroundColor: "#F58634",
                      color: "#FFFFFF",
                    }}
                  >
                    <CalendarIcon className="h-6 w-6" />
                    Agenda tu Primera Consulta
                  </button>
                  <button
                    className="px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300 hover:bg-white/10 transform hover:-translate-y-1 flex items-center justify-center gap-3"
                    style={{
                      backgroundColor: "transparent",
                      border: "2px solid #FFFFFF",
                      color: "#FFFFFF",
                    }}
                  >
                    <UserCircleIcon className="h-6 w-6" />
                    Conoce Nuestros Servicios
                  </button>
                </div>
              </div>
            </div>

            {/* Información de contacto - 3 columnas mejor formato */}
            <div className="mt-20 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-[#E6E3DE] relative z-20">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                <div className="flex items-center justify-center gap-5 pt-4 md:pt-0 px-4 group">
                  <div
                    className="h-14 w-14 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                    style={{ backgroundColor: "#7CB38C" }}
                  >
                    <PhoneIcon className="h-7 w-7 text-white" />
                  </div>
                  <div className="text-left">
                    <p
                      className="text-sm font-bold uppercase tracking-wider mb-1"
                      style={{ color: "#6E7C72" }}
                    >
                      Teléfono
                    </p>
                    <p
                      className="font-bold text-lg"
                      style={{ color: "#2C3E34" }}
                    >
                      +52 771 720 6956
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-5 pt-6 md:pt-0 px-4 group">
                  <div
                    className="h-14 w-14 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                    style={{ backgroundColor: "#7CB38C" }}
                  >
                    <EnvelopeIcon className="h-7 w-7 text-white" />
                  </div>
                  <div className="text-left">
                    <p
                      className="text-sm font-bold uppercase tracking-wider mb-1"
                      style={{ color: "#6E7C72" }}
                    >
                      Email
                    </p>
                    <p
                      className="font-bold text-base lg:text-lg"
                      style={{ color: "#2C3E34" }}
                    >
                      contacto@rubinutricion.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-5 pt-6 md:pt-0 px-4 group">
                  <div
                    className="h-14 w-14 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                    style={{ backgroundColor: "#7CB38C" }}
                  >
                    <CalendarIcon className="h-7 w-7 text-white" />
                  </div>
                  <div className="text-left">
                    <p
                      className="text-sm font-bold uppercase tracking-wider mb-1"
                      style={{ color: "#6E7C72" }}
                    >
                      Horario
                    </p>
                    <p
                      className="font-bold text-lg"
                      style={{ color: "#2C3E34" }}
                    >
                      Lun - Vie: 8am - 6pm
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2
              className="text-3xl md:text-4xl font-bold mb-4 font-serif"
              style={{ color: "#2C3E34" }}
            >
              Nuestros Servicios Profesionales
            </h2>
            <p
              className="text-lg md:text-xl max-w-3xl mx-auto"
              style={{ color: "#6E7C72" }}
            >
              Atención especializada adaptada a las necesidades específicas de
              cada paciente
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <FeatureCard
              icon={UserCircleIcon}
              title="Consulta Nutricional Inicial"
              description="Evaluación completa personalizada con historial clínico y establecimiento de objetivos claros."
            />
            <FeatureCard
              icon={BeakerIcon}
              title="Evaluación Antropométrica"
              description="Control profesional de peso, porcentaje de grasa, músculo, agua y grasa visceral."
            />
            <FeatureCard
              icon={DocumentTextIcon}
              title="Planes Alimenticios Personalizados"
              description="Elaboración manual de planes alimenticios adaptados a tus necesidades específicas."
            />
            <FeatureCard
              icon={HeartIcon}
              title="Seguimiento Nutricional"
              description="Control mensual de progreso con ajustes continuos para optimizar resultados."
            />
          </div>
        </div>
      </section>

      {/* MISIÓN, VISIÓN Y VALORES */}
      <section className="py-20" style={{ backgroundColor: "#FAF9F7" }}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div
              className="p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              style={{ backgroundColor: "#FFFFFF" }}
            >
              <div
                className="h-14 w-14 rounded-full flex items-center justify-center mb-6"
                style={{ backgroundColor: "#7CB38C" }}
              >
                <StarIcon className="h-7 w-7 text-white" />
              </div>
              <h3
                className="text-xl font-bold mb-4 font-serif"
                style={{ color: "#2C3E34" }}
              >
                Misión
              </h3>
              <p className="leading-relaxed" style={{ color: "#6E7C72" }}>
                Brindar atención nutricional integral a personas de distintas
                edades mediante evaluaciones personalizadas, planes alimenticios
                adecuados y asesoría profesional, contribuyendo a la mejora de
                la salud, el bienestar y la calidad de vida.
              </p>
            </div>
            <div
              className="p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              style={{ backgroundColor: "#FFFFFF" }}
            >
              <div
                className="h-14 w-14 rounded-full flex items-center justify-center mb-6"
                style={{ backgroundColor: "#BD7D4A" }}
              >
                <ChartBarIcon className="h-7 w-7 text-white" />
              </div>
              <h3
                className="text-xl font-bold mb-4 font-serif"
                style={{ color: "#2C3E34" }}
              >
                Visión
              </h3>
              <p className="leading-relaxed" style={{ color: "#6E7C72" }}>
                Consolidarnos como un consultorio nutricional de referencia a
                nivel regional, reconocido por la calidad de su atención, el
                profesionalismo en sus servicios y el impacto positivo en los
                hábitos alimenticios y la salud de nuestros pacientes.
              </p>
            </div>
            <div
              className="p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              style={{ backgroundColor: "#FFFFFF" }}
            >
              <div
                className="h-14 w-14 rounded-full flex items-center justify-center mb-6"
                style={{ backgroundColor: "#F58634" }}
              >
                <ShieldCheckIcon className="h-7 w-7 text-white" />
              </div>
              <h3
                className="text-xl font-bold mb-4 font-serif"
                style={{ color: "#2C3E34" }}
              >
                Valores
              </h3>
              <ul className="space-y-2">
                {[
                  "Profesionalismo",
                  "Responsabilidad",
                  "Confidencialidad",
                  "Empatía",
                  "Compromiso",
                  "Calidad",
                ].map((valor) => (
                  <li key={valor} className="flex items-center">
                    <div
                      className="h-2 w-2 rounded-full mr-3 flex-shrink-0"
                      style={{ backgroundColor: "#A8CF45" }}
                    ></div>
                    <span style={{ color: "#6E7C72" }}>{valor}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* METAS Y ESTRATEGIAS */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <h2
                className="text-3xl font-bold mb-8 font-serif text-center"
                style={{ color: "#2C3E34" }}
              >
                Nuestros Objetivos
              </h2>
              <div className="space-y-6">
                {[
                  "Proporcionar servicios de nutrición personalizados y de calidad",
                  "Promover hábitos alimenticios saludables en los pacientes",
                  "Mantener un seguimiento adecuado del progreso nutricional",
                  "Ofrecer atención organizada, puntual y profesional",
                  "Fortalecer la confianza y fidelidad de los pacientes",
                ].map((objetivo, index) => (
                  <div
                    key={index}
                    className="flex items-start p-4 rounded-xl hover:bg-[#FAF9F7] transition-colors"
                  >
                    <div
                      className="h-10 w-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
                      style={{ backgroundColor: "#7CB38C" }}
                    >
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <p className="text-lg" style={{ color: "#2C3E34" }}>
                      {objetivo}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2
                className="text-3xl font-bold mb-8 font-serif text-center"
                style={{ color: "#2C3E34" }}
              >
                Nuestras Estrategias
              </h2>
              <div className="space-y-6">
                {[
                  "Realizar evaluaciones nutricionales completas y personalizadas",
                  "Diseñar planes alimenticios acordes a las necesidades de cada paciente",
                  "Fomentar la comunicación constante para el seguimiento nutricional",
                  "Mantener procesos claros para la atención y control de consultas",
                  "Ofrecer un trato cercano que genere confianza y permanencia",
                ].map((estrategia, index) => (
                  <div
                    key={index}
                    className="flex items-start p-4 rounded-xl hover:bg-[#FAF9F7] transition-colors"
                  >
                    <div
                      className="h-10 w-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0"
                      style={{ backgroundColor: "#BD7D4A" }}
                    >
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <p className="text-lg" style={{ color: "#2C3E34" }}>
                      {estrategia}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-16" style={{ backgroundColor: "#7CB38C" }}>
        <div className="container mx-auto px-4 text-center">
          <h2
            className="text-3xl md:text-4xl font-bold mb-6 font-serif"
            style={{ color: "#FFFFFF" }}
          >
            ¿Listo para transformar tu salud?
          </h2>
          <p
            className="text-xl mb-10 max-w-2xl mx-auto"
            style={{ color: "#E6E3DE" }}
          >
            Agenda tu primera consulta y comienza tu camino hacia una vida más
            saludable con acompañamiento profesional.
          </p>
          <button
            className="px-12 py-5 rounded-xl font-bold text-lg shadow-2xl transition-all duration-300 hover:shadow-3xl transform hover:scale-105"
            style={{
              backgroundColor: "#F58634",
              color: "#FFFFFF",
            }}
          >
            Comienza Hoy Mismo
          </button>
        </div>
      </section>
    </main>
  );
}
