import Form from "@/components/login/form"; 
import { HelpCircle } from "lucide-react";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Acceso al Consultorio',
  description: 'Sistema interno de gestión de pacientes y citas del Consultorio Nutricional.',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FAF9F7]">
      <div className="relative w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 p-6">
        {/* Sección informativa */}
        <div className="w-full lg:w-1/2 max-w-md space-y-6 text-center lg:text-left">
          <div>
            <h1 className="text-3xl font-bold text-[#5A8C7A]">Rubí Ramos</h1>
            <p className="text-sm text-[#6E7C72] mt-1">Consultorio Nutricional</p>
          </div>
          
          <h2 className="text-xl font-semibold text-[#2C3E34]">
            Sistema de gestión del consultorio
          </h2>
          
          <p className="text-[#6E7C72]">
            Plataforma interna para el control de pacientes, citas y expedientes clínicos. 
            El acceso está restringido únicamente al personal autorizado.
          </p>
          
          <div className="hidden lg:block pt-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#E6E3DE]">
              <h3 className="font-medium text-[#2C3E34] mb-3 flex items-center">
                <HelpCircle className="h-5 w-5 text-[#5A8C7A] mr-2" />
                ¿Necesitas ayuda?
              </h3>
              <p className="text-sm text-[#6E7C72]">
                Si tienes problemas para iniciar sesión o necesitas asistencia, 
                contacta al área administrativa del consultorio.
              </p>
            </div>
          </div>
        </div>

        {/* Formulario de inicio de sesión */}
        <div className="w-full max-w-md flex items-center justify-center">
          <Form />
        </div>
      </div>
    </main>
  );
}