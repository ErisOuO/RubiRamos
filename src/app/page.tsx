import { Metadata } from 'next';
import Image from 'next/image';
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
  StarIcon
} from '@heroicons/react/24/outline';
import FeatureCard from '@/components/FeatureCard/featureCard';

export const metadata: Metadata = {
  title: 'Consultorio Nutricional - Lic. Rubí Ramos Álvarez',
  description: 'Atención nutricional integral con evaluaciones personalizadas, planes alimenticios adecuados y asesoría profesional.',
};

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* HERO SECTION - CON FONDO */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/fondo_inicio.png"
            alt="Fondo consultorio nutricional"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          {/* Overlay para mejorar legibilidad */}
          <div className="absolute inset-0 bg-[#2C3E34]/80 backdrop-blur-[2px]"></div>
        </div>

        {/* Contenido sobre la imagen */}
        <div className="container mx-auto px-4 relative z-10 py-16">
          <div className="max-w-5xl mx-auto">
            {/* Información principal de la empresa */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 font-serif" style={{ color: '#FFFFFF' }}>
                Consultorio Nutricional
              </h1>
              <h2 className="text-2xl md:text-4xl font-semibold mb-10" style={{ color: '#BD7D4A' }}>
                Nutrióloga Rubí Ramos Álvarez
              </h2>
              <div className="inline-flex items-center justify-center gap-3 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-2 border border-white/30">
                <MapPinIcon className="h-5 w-5" style={{ color: '#FFFFFF' }} />
                <span className="text-lg font-medium" style={{ color: '#FFFFFF' }}>
                  C. Juan Mogica Ugalde #10, Huejutla de Reyes, c.p. 43000<br />
                  Clinica Huejutla, Segundo Piso, Consultorio 13
                </span>
              </div>
            </div>

            {/* CTA principal */}
            <div className="text-center mb-16">
              <div className="max-w-2xl mx-auto mb-10">
                <p className="text-xl mb-6 leading-relaxed" style={{ color: '#FFFFFF' }}>
                  <strong className="font-bold" style={{ color: '#BD7D4A' }}>Misión:</strong> Brindar atención nutricional integral a personas de distintas edades mediante evaluaciones personalizadas, planes alimenticios adecuados y asesoría profesional.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  className="px-10 py-5 rounded-xl font-bold text-lg shadow-2xl transition-all duration-300 hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105"
                  style={{ 
                    backgroundColor: '#F58634',
                    color: '#FFFFFF'
                  }}
                >
                  Agenda tu Primera Consulta
                </button>
                <button 
                  className="px-10 py-5 border-2 rounded-xl font-bold text-lg transition-all duration-300 hover:bg-white/10 transform hover:-translate-y-1 hover:scale-105"
                  style={{ 
                    borderColor: '#FFFFFF',
                    color: '#FFFFFF'
                  }}
                >
                  Conoce Nuestros Servicios
                </button>
              </div>
            </div>

            {/* Información de contacto inmediata */}
            <div className="max-w-3xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-[#E6E3DE]">
              <h3 className="text-2xl font-bold text-center mb-8 font-serif" style={{ color: '#2C3E34' }}>
                📞 Contacto Directo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-[#FAF9F7] transition-colors">
                  <div className="h-14 w-14 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: '#5A8C7A' }}>
                    <PhoneIcon className="h-7 w-7 text-white" />
                  </div>
                  <span className="font-bold text-lg mb-1" style={{ color: '#2C3E34' }}>Teléfono</span>
                  <span className="text-lg font-medium" style={{ color: '#5A8C7A' }}>+52 77 1720 6956</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-[#FAF9F7] transition-colors">
                  <div className="h-14 w-14 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: '#5A8C7A' }}>
                    <EnvelopeIcon className="h-7 w-7 text-white" />
                  </div>
                  <span className="font-bold text-lg mb-1" style={{ color: '#2C3E34' }}>Email</span>
                  <span className="text-lg font-medium" style={{ color: '#5A8C7A' }}>contacto@rubinutricion.com</span>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-[#FAF9F7] transition-colors">
                  <div className="h-14 w-14 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: '#5A8C7A' }}>
                    <CalendarIcon className="h-7 w-7 text-white" />
                  </div>
                  <span className="font-bold text-lg mb-1" style={{ color: '#2C3E34' }}>Horario</span>
                  <span className="text-lg font-medium" style={{ color: '#5A8C7A' }}>
                    Lun-Vie: 8am - 6pm
                  </span>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif" style={{ color: '#2C3E34' }}>
              Nuestros Servicios Profesionales
            </h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto" style={{ color: '#6E7C72' }}>
              Atención especializada adaptada a las necesidades específicas de cada paciente
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
      <section className="py-20" style={{ backgroundColor: '#FAF9F7' }}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Misión */}
            <div 
              className="p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              <div className="h-14 w-14 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#5A8C7A' }}>
                <StarIcon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 font-serif" style={{ color: '#2C3E34' }}>
                Misión
              </h3>
              <p className="leading-relaxed" style={{ color: '#6E7C72' }}>
                Brindar atención nutricional integral a personas de distintas edades mediante evaluaciones personalizadas, planes alimenticios adecuados y asesoría profesional, contribuyendo a la mejora de la salud, el bienestar y la calidad de vida.
              </p>
            </div>

            {/* Visión */}
            <div 
              className="p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              <div className="h-14 w-14 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#BD7D4A' }}>
                <ChartBarIcon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 font-serif" style={{ color: '#2C3E34' }}>
                Visión
              </h3>
              <p className="leading-relaxed" style={{ color: '#6E7C72' }}>
                Consolidarnos como un consultorio nutricional de referencia a nivel regional, reconocido por la calidad de su atención, el profesionalismo en sus servicios y el impacto positivo en los hábitos alimenticios y la salud de nuestros pacientes.
              </p>
            </div>

            {/* Valores */}
            <div 
              className="p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              <div className="h-14 w-14 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#F58634' }}>
                <ShieldCheckIcon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4 font-serif" style={{ color: '#2C3E34' }}>
                Valores
              </h3>
              <ul className="space-y-2">
                {['Profesionalismo', 'Responsabilidad', 'Confidencialidad', 'Empatía', 'Compromiso', 'Calidad'].map((valor) => (
                  <li key={valor} className="flex items-center">
                    <div className="h-2 w-2 rounded-full mr-3 flex-shrink-0" style={{ backgroundColor: '#A8CF45' }}></div>
                    <span style={{ color: '#6E7C72' }}>{valor}</span>
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
            {/* Objetivos y Metas */}
            <div>
              <h2 className="text-3xl font-bold mb-8 font-serif text-center" style={{ color: '#2C3E34' }}>
                Nuestros Objetivos
              </h2>
              <div className="space-y-6">
                {[
                  'Proporcionar servicios de nutrición personalizados y de calidad',
                  'Promover hábitos alimenticios saludables en los pacientes',
                  'Mantener un seguimiento adecuado del progreso nutricional',
                  'Ofrecer atención organizada, puntual y profesional',
                  'Fortalecer la confianza y fidelidad de los pacientes'
                ].map((objetivo, index) => (
                  <div key={index} className="flex items-start p-4 rounded-xl hover:bg-[#FAF9F7] transition-colors">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0" style={{ backgroundColor: '#5A8C7A' }}>
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <p className="text-lg" style={{ color: '#2C3E34' }}>{objetivo}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Estrategias */}
            <div>
              <h2 className="text-3xl font-bold mb-8 font-serif text-center" style={{ color: '#2C3E34' }}>
                Nuestras Estrategias
              </h2>
              <div className="space-y-6">
                {[
                  'Realizar evaluaciones nutricionales completas y personalizadas',
                  'Diseñar planes alimenticios acordes a las necesidades de cada paciente',
                  'Fomentar la comunicación constante para el seguimiento nutricional',
                  'Mantener procesos claros para la atención y control de consultas',
                  'Ofrecer un trato cercano que genere confianza y permanencia'
                ].map((estrategia, index) => (
                  <div key={index} className="flex items-start p-4 rounded-xl hover:bg-[#FAF9F7] transition-colors">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0" style={{ backgroundColor: '#BD7D4A' }}>
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <p className="text-lg" style={{ color: '#2C3E34' }}>{estrategia}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-16" style={{ backgroundColor: '#5A8C7A' }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif" style={{ color: '#FFFFFF' }}>
            ¿Listo para transformar tu salud?
          </h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto" style={{ color: '#E6E3DE' }}>
            Agenda tu primera consulta y comienza tu camino hacia una vida más saludable con acompañamiento profesional.
          </p>
          <button 
            className="px-12 py-5 rounded-xl font-bold text-lg shadow-2xl transition-all duration-300 hover:shadow-3xl transform hover:scale-105"
            style={{ 
              backgroundColor: '#F58634',
              color: '#FFFFFF'
            }}
          >
            Comienza Hoy Mismo
          </button>
        </div>
      </section>
    </main>
  );
}