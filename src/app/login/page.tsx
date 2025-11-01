import Form from "@/components/login/form"; 
import { HelpCircle } from "lucide-react";
import { Metadata } from 'next';
//import Link from "next/link";
//import Image from 'next/image'; 

export const metadata: Metadata = {
  title: 'Acceso al Consultorio',
  description: 'Sistema interno de gestión de pacientes y citas del Consultorio Salud Integral.',
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">

      <div className="relative w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
        {/* Sección informativa */}
        <div className="w-full lg:w-1/2 max-w-md space-y-6 text-center lg:text-left">
          {/*
          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <div>
              <Link href="/">
                <Image src="/logo.png" alt="Logo Consultorio" width={270} height={50} priority />
              </Link>
            </div>
          </div>
          */}
          
          <h2 className="text-xl font-semibold text-gray-700">
            Sistema de gestión del Consultorio Salud Integral
          </h2>
          
          <p className="text-gray-600">
            Plataforma interna para el control de pacientes, citas y expedientes clínicos. 
            El acceso está restringido únicamente a los pacientes.
          </p>
          
          <div className="hidden lg:block pt-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                <HelpCircle className="h-5 w-5 text-green-600 mr-2" />
                ¿Necesitas ayuda?
              </h3>
              <p className="text-sm text-gray-600">
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
