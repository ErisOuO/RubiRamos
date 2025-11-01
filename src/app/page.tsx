import { Metadata } from 'next';
import {
  HeartIcon,
  UserCircleIcon,
  ChatBubbleLeftRightIcon,
  BeakerIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import FeatureCard from '@/components/FeatureCard/featureCard';

export const metadata: Metadata = {
  title: 'Consultorio VitalCare',
  description: 'Atención médica y nutricional personalizada para tu bienestar integral. Agenda tus citas fácilmente y mejora tu salud con nosotros.',
};

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* HERO */}
      <section className="hero bg-gradient-to-br from-emerald-100 via-teal-100 to-cyan-100 text-gray-900 py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-emerald-800 drop-shadow-sm">
              Bienvenido a Consultorio Rubí Ramos
            </h1>
            <h2 className="text-xl md:text-2xl font-light mb-6 text-teal-800">
              Tu salud y bienestar, en manos de una experta
            </h2>
            <p className="text-lg mb-8 text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Brindamos atención médica y nutricional con un enfoque integral y un trato humano. Mejora tu estilo 
              de vida con el acompañamiento de una profesional dedicada a tu bienestar.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-emerald-900 mb-12">
            ¿Por qué elegir nuestro consultorio?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={HeartIcon}
              title="Salud Integral"
              description="Atención personalizada que combina nutrición, control médico y bienestar emocional para mejorar tu calidad de vida."
            />
            <FeatureCard
              icon={BeakerIcon}
              title="Tecnología Médica"
              description="Usamos herramientas digitales para el seguimiento de tu progreso y la gestión de tus consultas."
            />
            <FeatureCard
              icon={ChatBubbleLeftRightIcon}
              title="Comunicación Directa"
              description="Mantente en contacto con tu médico o nutriólogo desde nuestra plataforma, sin esperas innecesarias."
            />
            <FeatureCard
              icon={UserCircleIcon}
              title="Atención Personalizada"
              description="Cada paciente recibe un plan adaptado a sus necesidades, con seguimiento constante y orientación profesional."
            />
          </div>
        </div>
      </section>

      {/* ABOUT / COMMITMENT */}
      <section className="py-16 bg-white border-t border-emerald-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full mx-auto mb-8 flex items-center justify-center text-6xl shadow-lg">
              <UsersIcon className="h-20 w-20 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-emerald-900 mb-8">
              Nuestro Compromiso Contigo
            </h2>
            <p className="text-xl text-gray-600 italic leading-relaxed mb-8">
              En <span className="font-semibold text-emerald-700">Consultorio VitalCare</span> 
              trabajamos para cuidar tu bienestar físico y mental. Cada consulta 
              es una oportunidad para acompañarte en la construcción de una vida más sana, 
              equilibrada y feliz. 
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
