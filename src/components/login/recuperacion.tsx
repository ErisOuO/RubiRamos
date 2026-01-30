'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/button';
import { Mail, Clock, RefreshCw, ShieldCheck, Key } from 'lucide-react';

export default function RecuperacionForm() {
  const router = useRouter();
  const [usuario, setUsuario] = useState('');
  const [fase, setFase] = useState<'email' | 'verificar'>('email');
  const [codigo, setCodigo] = useState(Array(6).fill(''));
  const [counter, setCounter] = useState(180);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const enviado = useRef(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (fase === 'verificar') {
      const t = setInterval(() => setCounter((c) => (c > 0 ? c - 1 : 0)), 1000);
      return () => clearInterval(t);
    }
  }, [fase]);

  // Enfocar el primer input cuando cambie a fase de verificación
  useEffect(() => {
    if (fase === 'verificar' && inputsRef.current[0]) {
      inputsRef.current[0]?.focus();
    }
  }, [fase]);

  async function enviarEmail() {
    setError('');
    setMensaje('');
    setLoading(true);

    try {
      const res = await fetch('/api/enviar-codigo', {
        method: 'POST',
        body: JSON.stringify({ usuario }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setMensaje('');
        setLoading(false);
        return;
      }

      setMensaje(`Código enviado a ${enmascararEmail(data.email || usuario)}`);
      setFase('verificar');
      enviado.current = true;
      setCounter(180);
    } catch {
      setError('Error en la conexión. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  }

  async function verificar() {
    const full = codigo.join('');
    setError('');
    setMensaje('');
    setLoading(true);

    try {
      const res = await fetch('/api/verificar-codigo', {
        method: 'POST',
        body: JSON.stringify({ usuario, code: full }),
        headers: { 'Content-Type': 'application/json' },
      });
      const d = await res.json();

      if (d.success) {
        router.push(
          `/login/recuperacion/reestablecer?user=${encodeURIComponent(usuario)}&token=${encodeURIComponent(d.token)}`
        );
      } else {
        setError(d.error || 'Código inválido o expirado');
      }
    } catch {
      setError('Error en la verificación');
    } finally {
      setLoading(false);
    }
  }

  function enmascararEmail(email: string) {
    const [local, domain] = email.split('@');
    const visible = local.slice(-3);
    return `${'*'.repeat(local.length - 3)}${visible}@${domain}`;
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !codigo[index] && index > 0) {
      const prev = document.getElementById('dig' + (index - 1));
      prev?.focus();
    }
  }

  // Función para manejar el pegado de código
  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    
    // Filtrar solo dígitos
    const digits = pastedData.replace(/\D/g, '');
    
    if (digits.length === 6) {
      // Crear array con los 6 dígitos
      const newCodigo = digits.split('').slice(0, 6);
      setCodigo(newCodigo);
      
      // Enfocar el último input después de pegar
      setTimeout(() => {
        if (inputsRef.current[5]) {
          inputsRef.current[5]?.focus();
        }
      }, 10);
    }
  }

  // Función modificada para manejar cambios en los inputs
  function handleChange(index: number, value: string) {
    // Si el valor tiene más de 1 carácter (posible pegado), manejar como pegado
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '');
      if (digits.length >= 6) {
        const newCodigo = digits.split('').slice(0, 6);
        setCodigo(newCodigo);
        
        // Enfocar el último input
        setTimeout(() => {
          if (inputsRef.current[5]) {
            inputsRef.current[5]?.focus();
          }
        }, 10);
        return;
      }
    }
    
    // Manejo normal de un solo dígito
    if (/\d/.test(value) || value === '') {
      const arr = [...codigo];
      arr[index] = value;
      setCodigo(arr);
      
      // Mover al siguiente input si se ingresó un dígito
      if (value !== '' && index < 5) {
        setTimeout(() => {
          if (inputsRef.current[index + 1]) {
            inputsRef.current[index + 1]?.focus();
          }
        }, 10);
      }
    }
  }

  return (
    <div className="relative w-full max-w-md bg-white/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-green-800">
      {/* Elementos decorativos */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-green-400 rounded-full opacity-20 blur-2xl"></div>
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-green-700 rounded-full opacity-20 blur-xl"></div>
      </div>

      <div className="relative z-10">
        {/* Encabezado con degradado verde y borde naranja */}
        <div className="bg-gradient-to-r from-green-700 via-green-600 to-green-500 p-6 text-white text-center border-b-4 border-orange-500">
          <div className="flex items-center justify-center space-x-2">
            <Key className="h-6 w-6 text-orange-300" />
            <h2 className="text-xl font-bold">Recuperación de Contraseña</h2>
          </div>
          <p className="text-orange-100 text-sm mt-1">
            Restablece tu acceso al sistema del consultorio
          </p>
        </div>

        {/* Cuerpo */}
        <div className="p-8 space-y-6">
          {fase === 'email' && (
            <>
              <div className="space-y-4">
                <label
                  htmlFor="usuario"
                  className="text-sm font-medium text-green-900 mb-1 flex items-center"
                >
                  <Mail className="h-4 w-4 text-green-600 mr-2" />
                  Usuario
                </label>
                <input
                  id="usuario"
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value.trim())}
                  required
                  className="border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition"
                  placeholder="Ingresa tu usuario"
                  disabled={loading}
                />
                {error && (
                  <div className="mt-2 bg-red-50 border-l-4 border-red-500 p-3 rounded">
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                )}
              </div>

              <Button
                type="button"
                onClick={enviarEmail}
                className="w-full py-3 bg-green-700 hover:bg-green-800 text-white font-medium mt-4"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
                      ></path>
                    </svg>
                    Procesando...
                  </span>
                ) : (
                  'Enviar código de recuperación'
                )}
              </Button>
            </>
          )}

          {fase === 'verificar' && (
            <>
              <div className="text-center space-y-3">
                <div className="text-sm text-gray-700">{mensaje}</div>
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2 text-green-700" />
                  <p>
                    Expira en:{' '}
                    <b className="text-green-700">
                      {Math.floor(counter / 60)}:{(counter % 60)
                        .toString()
                        .padStart(2, '0')}
                    </b>
                  </p>
                </div>
                <p className="text-xs text-gray-500">
                  Ingresa el código de 6 dígitos que recibiste
                </p>
                <p className="text-xs text-gray-400">
                  Puedes copiar y pegar todo el código de 6 dígitos en cualquier campo
                </p>
              </div>

              <div className="flex justify-center gap-3">
                {codigo.map((digit, idx) => (
                  <input
                    title='pin'
                    key={idx}
                    id={`dig${idx}`}
                    ref={(el) => {
                      inputsRef.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={6} // Permitir hasta 6 caracteres para pegado
                    value={digit}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onPaste={handlePaste}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-12 h-14 text-2xl font-medium text-center border border-green-500 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                  />
                ))}
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <Button
                  onClick={verificar}
                  className="bg-green-700 hover:bg-green-800 text-white flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
                        ></path>
                      </svg>
                      Verificando...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      Verificar código
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  onClick={() => {
                    enviado.current = false;
                    setCounter(180);
                    setMensaje('');
                    setError('');
                    setFase('email');
                  }}
                  disabled={counter > 0}
                  className={`flex items-center justify-center gap-2 transition-all ${
                    counter > 0
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'text-green-700 border border-green-700 hover:bg-green-50'
                  }`}
                >
                  <RefreshCw className="h-4 w-4" />
                  Reenviar código
                </Button>
              </div>
            </>
          )}
        </div>

        <div className="bg-gradient-to-r from-orange-100 to-orange-200 px-8 py-4 border-t border-orange-400">
          <p className="text-center text-xs text-green-800 font-medium">
            © {new Date().getFullYear()} Consultorio Nutricional — Sistema Interno
          </p>
        </div>
      </div>
    </div>
  );
}