import { Metadata } from 'next';
import {
  HeartIcon,
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
  BeakerIcon,
  CalendarIcon,
  DocumentTextIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';
import FeatureCard from '@/components/FeatureCard/featureCard';
import CarouselProducts from '@/components/catalog/CarouselProducts';

export const metadata: Metadata = {
  title: 'Consultorio de Nutriología - Dra. Rubi Ramos',
  description: 'Nutrióloga certificada en Hospital Huejutla. Gestión integral de salud, planes nutricionales personalizados y seguimiento profesional.',
};

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* HERO SECTION */}
      <section className="hero bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white shadow-lg">
                <HeartIcon className="h-12 w-12" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-800">
                Consultorio de Nutriología
              </h1>
              <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-emerald-700">
                Dra. Rubi Ramos
              </h2>
              <p className="text-lg text-gray-600 mb-2">
                Hospital Huejutla • Nutrióloga Certificada
              </p>
            </div>
            
            <p className="text-xl mb-10 text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Transformamos tu salud mediante planes nutricionales personalizados, 
              seguimiento profesional y tecnología de vanguardia para lograr 
              resultados sostenibles.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors duration-300 font-semibold text-lg shadow-lg">
                Agendar Mi Primera Cita
              </button>
              <button className="px-8 py-4 border-2 border-emerald-600 text-emerald-600 rounded-xl hover:bg-emerald-50 transition-colors duration-300 font-semibold text-lg">
                Conocer Más Servicios
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Solución Integral para Tu Salud
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Modernizamos la experiencia en nutrición con tecnología que optimiza 
              tu seguimiento y mejora tus resultados
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={CalendarIcon}
              title="Agenda Digital Inteligente"
              description="Sistema automatizado de citas que evita empalmes y olvidos. Recibe recordatorios automáticos y gestiona tus horarios fácilmente."
            />
            <FeatureCard
              icon={DocumentTextIcon}
              title="Expedientes Digitales Seguros"
              description="Historial clínico centralizado con mediciones antropométricas, progreso mensual y planes alimenticios organizados."
            />
            <FeatureCard
              icon={ChatBubbleLeftRightIcon}
              title="Comunicación Organizada"
              description="Canal formal para recibir recetas, tips nutricionales y seguimiento sin perder información importante."
            />
            <FeatureCard
              icon={BeakerIcon}
              title="Seguimiento Científico"
              description="Control profesional de peso, porcentaje de grasa, músculo, agua y grasa visceral con análisis detallado."
            />
          </div>
        </div>
      </section>

      {/* PRODUCTS CAROUSEL SECTION */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <CarouselProducts />
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Servicios Profesionales
            </h2>
            <p className="text-xl text-gray-600">
              Atención especializada adaptada a tus necesidades específicas
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8 text-center border border-green-200">
              <UserCircleIcon className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Consulta Inicial</h3>
              <p className="text-gray-600 mb-6">
                Evaluación completa, historial clínico y establecimiento de objetivos personalizados
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl p-8 text-center border border-blue-200">
              <HeartIcon className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Seguimiento Mensual</h3>
              <p className="text-gray-600 mb-6">
                Control de progreso, ajuste de planes y mediciones antropométricas detalladas
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-8 text-center border border-purple-200">
              <DevicePhoneMobileIcon className="h-16 w-16 text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Plan Nutricional</h3>
              <p className="text-gray-600 mb-6">
                Diseño de alimentación personalizada con recetas y tips específicos
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}