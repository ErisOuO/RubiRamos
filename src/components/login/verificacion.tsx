'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/button';
import { Mail, Clock, RefreshCw, ShieldCheck, Lock, AlertCircle, CheckCircle } from 'lucide-react';

export default function VerificarForm() {
  const [codigo, setCodigo] = useState(Array(6).fill(''));
  const [counter, setCounter] = useState(180);
  const [email, setEmail] = useState('');
  const [usuario, setUsuario] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();

  const enviado = useRef(false);

  useEffect(() => {
    const storedUsuario = sessionStorage.getItem('usuario');

    if (storedUsuario && !enviado.current) {
      enviado.current = true;
      setUsuario(storedUsuario);

      fetch('/api/enviar-codigo', {
        method: 'POST',
        body: JSON.stringify({ usuario: storedUsuario }),
        headers: { 'Content-Type': 'application/json' },
      })
        .then(res => res.json())
        .then(data => {
          if (data.email) {
            setEmail(enmascararEmail(data.email));
          }
        });
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  function enmascararEmail(email: string) {
    const [local, domain] = email.split('@');
    const visible = local.slice(-3);
    return `${'*'.repeat(local.length - 3)}${visible}@${domain}`;
  }

  function handleDigitChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const newCode = [...codigo];
    newCode[index] = value;
    setCodigo(newCode);

    const next = document.getElementById(`digit-${index + 1}`);
    if (value && next) next.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !codigo[index] && index > 0) {
      const prev = document.getElementById(`digit-${index - 1}`);
      if (prev) prev.focus();
    }
  }

  async function verificarCodigo(e: React.FormEvent) {
    e.preventDefault();
    setIsVerifying(true);
    setMensaje('');
    
    const fullCode = codigo.join('');
    const res = await fetch('/api/verificar-codigo', {
      method: 'POST',
      body: JSON.stringify({ usuario, code: fullCode }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    
    if (data.success) {
      router.push("/admin");
    } else {
      if (data.tipo === 'expirado') {
        setMensaje('El código ha expirado. Puedes solicitar uno nuevo.');
      } else if (data.tipo === 'codigo') {
        setMensaje('El código ingresado es incorrecto.');
      } else {
        setMensaje('Error al verificar el código.');
      }
    }
    setIsVerifying(false);
  }

  async function reenviarCodigo() {
    setIsResending(true);
    setCounter(180);
    setMensaje('');
    await fetch('/api/enviar-codigo', {
      method: 'POST',
      body: JSON.stringify({ usuario }),
      headers: { 'Content-Type': 'application/json' },
    });
    setIsResending(false);
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Sección del formulario (izquierda) */}
      <div className="w-full lg:w-1/2 p-8 lg:p-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <ShieldCheck className="h-8 w-8 text-[#66b0ca]" />
              <h1 className="text-3xl font-bold text-[#1e343b]">CONSULTORIO RUBÍ RAMOS</h1>
            </div>
            <h2 className="text-2xl font-semibold text-[#1e343b]">Verificación de Seguridad</h2>
            <p className="text-[#66b0ca] mt-2">
              Asegurando el acceso seguro a la información de tus pacientes
            </p>
          </div>

          <form onSubmit={verificarCodigo} className="space-y-6">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center text-sm text-gray-600">
                <Mail className="h-5 w-5 mr-2 text-[#1e343b]" />
                <p>
                  Código enviado a: <b className="text-[#1e343b]">{email}</b>
                </p>
              </div>
              
              <div className="flex items-center justify-center text-sm text-gray-600">
                <Clock className="h-5 w-5 mr-2 text-[#1e343b]" />
                <p>
                  Expira en: <b className="text-[#1e343b]">
                    {Math.floor(counter / 60)}:{(counter % 60).toString().padStart(2, '0')}
                  </b>
                </p>
              </div>
              
              <p className="text-sm text-gray-500">
                Ingresa el código de 6 dígitos que recibiste
              </p>
            </div>

            <div className="flex justify-center gap-3">
              {codigo.map((digit, idx) => (
                <input
                  title='Ingrese un dígito del código'
                  key={idx}
                  id={`digit-${idx}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-12 h-14 text-2xl font-medium text-center border border-gray-300 rounded-lg 
                            focus:ring-2 focus:ring-[#66b0ca] focus:border-[#66b0ca] focus:outline-none
                            transition-all duration-150"
                  autoFocus={idx === 0}
                />
              ))}
            </div>

            {mensaje && (
              <div className={`p-3 rounded-lg text-center text-sm font-medium ${
                mensaje.includes('incorrecto') || mensaje.includes('Error') 
                  ? 'bg-red-50 text-red-600 border-l-4 border-red-500' 
                  : 'bg-blue-50 text-blue-600 border-l-4 border-[#66b0ca]'
              }`}>
                {mensaje}
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button
                type="button"
                onClick={reenviarCodigo}
                disabled={counter > 0 || isResending}
                className={`flex items-center justify-center gap-2 transition-all ${
                  counter > 0
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'text-[#1e343b] border border-[#1e343b] hover:bg-[#f0f8ff]'
                }`}
              >
                {isResending ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Reenviar código
                  </>
                )}
              </Button>
              
              <Button 
                type="submit" 
                className="bg-[#1e343b] hover:bg-[#14262b] text-white flex items-center justify-center gap-2"
                disabled={isVerifying}
              >
                {isVerifying ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verificando...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    Verificar
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Consultorio Vida Saludable - Sistema interno
            </p>
          </div>
        </div>
      </div>

      {/* Sección informativa (derecha) */}
      <div className="w-full lg:w-1/2 p-8 lg:p-12 flex items-center justify-center bg-gradient-to-br from-[#f0f8ff] to-[#e6f2ff]">
        <div className="w-full max-w-md">
          <h3 className="text-2xl font-bold text-[#1e343b] mb-6">
            Sobre nuestro consultorio
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-[#1e343b] p-2 rounded-lg text-white flex-shrink-0">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-[#1e343b]">Confidencialidad</h4>
                <p className="text-gray-600 mt-1">
                  Protegemos la privacidad de cada paciente, asegurando que su información médica y personal esté resguardada en todo momento.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-[#1e343b] p-2 rounded-lg text-white flex-shrink-0">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-[#1e343b]">Atención profesional</h4>
                <p className="text-gray-600 mt-1">
                  Nuestro equipo médico brinda orientación nutricional, emocional y física enfocada al bienestar integral del paciente.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-[#1e343b] p-2 rounded-lg text-white flex-shrink-0">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-[#1e343b]">Compromiso con la salud</h4>
                <p className="text-gray-600 mt-1">
                  Promovemos hábitos saludables, prevención de enfermedades y mejora del estilo de vida a través de programas personalizados.
                </p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-[#66b0ca]/30 shadow-sm mt-6">
              <p className="text-sm text-[#1e343b]">
                <strong>Nota:</strong> Este sistema digital está diseñado para facilitar el registro, seguimiento y atención continua de cada paciente del consultorio.
              </p>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                ¿Tienes dudas sobre el sistema o tu expediente médico?
              </p>
              <p className="text-sm text-[#1e343b] font-medium mt-1">
                contacto@vidasaludable.com | +52 55 4321 9876
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
