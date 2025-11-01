'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/button';
import { Eye, EyeOff, BriefcaseMedical, Lock, User, HelpCircle, Phone, Mail } from 'lucide-react';

export default function LoginForm() {
  const router = useRouter();
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      redirect: false,
      usuario,
      contrasena,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      sessionStorage.setItem('usuario', usuario);
      router.push('/login/verificacion');
    }

    setLoading(false);
  }

  return (
    <div className="relative w-full max-w-md bg-white/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-[#25631a] mb-8">

      {/* Fondos decorativos en verde más oscuro */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#3b7d2b] rounded-full opacity-25"></div>
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-[#2f6e1c] rounded-full opacity-20"></div>
        <div className="absolute right-1/4 bottom-1/3 w-32 h-32 bg-[#225514] rounded-lg opacity-15 rotate-45"></div>
      </div>

      <div className="relative z-10">
        <div className="bg-gradient-to-r from-[#64C23A] via-[#4CA32E] to-[#2F6E1C] p-6 text-white border-b-2 border-[#FF7C00]">
          <div className="flex items-center justify-center space-x-3">
            <BriefcaseMedical className="h-8 w-8 text-[#FFB84C]" />
            <h2 className="text-2xl font-bold tracking-tight">Rubí Ramos</h2>
          </div>
          <p className="text-center text-[#d9ffd4] text-sm mt-1">
            Sistema Integral de Gestión de Consultorio
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <h3 className="text-xl font-semibold text-[#225514] text-center">
            Iniciar sesión
          </h3>
          <p className="text-center text-sm text-gray-600 pb-2">
            Acceso exclusivo para pacientes
          </p>

          <div className="space-y-5">
            <div className="flex flex-col relative">
              <label htmlFor="usuario" className="text-sm font-medium text-[#225514] mb-1 flex items-center">
                <User className="h-4 w-4 text-[#64C23A] mr-2" />
                Usuario
              </label>
              <input
                id="usuario"
                type="text"
                value={usuario}
                onChange={e => setUsuario(e.target.value)}
                required
                className="border border-gray-400 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#64C23A] focus:border-[#64C23A] focus:outline-none transition pl-10"
                placeholder="Ingresa tu usuario"
                disabled={loading}
              />
              <User className="absolute ml-3 mt-10 h-4 w-4 text-gray-500" />
            </div>

            <div className="flex flex-col relative">
              <label htmlFor="contrasena" className="text-sm font-medium text-[#225514] mb-1 flex items-center">
                <Lock className="h-4 w-4 text-[#64C23A] mr-2" />
                Contraseña
              </label>
              <input
                id="contrasena"
                type={showPassword ? 'text' : 'password'}
                value={contrasena}
                onChange={e => setContrasena(e.target.value)}
                required
                className="border border-gray-400 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#64C23A] focus:border-[#64C23A] focus:outline-none transition pl-10 pr-10"
                placeholder="Ingresa tu contraseña"
                disabled={loading}
              />
              <Lock className="absolute ml-3 mt-10 h-4 w-4 text-gray-500" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 text-gray-500 hover:text-[#225514] transition"
                tabIndex={-1}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-600 p-3 rounded">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="flex justify-between items-center pt-1">
            <Link
              href="/login/recuperacion"
              className="text-sm text-[#2F6E1C] hover:text-[#FF7C00] underline transition flex items-center"
            >
              <HelpCircle className="h-4 w-4 mr-1" />
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full py-3 bg-[#2F6E1C] hover:bg-[#225514] text-white transition-colors shadow-md border-b-2 border-[#FF7C00]"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </span>
              ) : 'Iniciar sesión'}
            </Button>
          </div>
        </form>

        <div className="bg-[#f3fff0] px-8 py-4 border-t border-[#c0e8b8]">
          <div className="flex items-center justify-center space-x-4 text-xs text-[#225514]">
            <div className="flex items-center">
              <Mail className="h-3 w-3 mr-1 text-[#64C23A]" />
              <span>soporte@rubiramos.com</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-3 w-3 mr-1 text-[#64C23A]" />
              <span>+52 77 **** ****</span>
            </div>
          </div>
          <p className="text-center text-xs text-gray-500 mt-2">
            © {new Date().getFullYear()} Rubí Ramos - Todos los derechos reservados
          </p>
        </div>
      </div>
    </div>
  );
}