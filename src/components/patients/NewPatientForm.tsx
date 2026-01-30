'use client';

import { useState } from 'react';
import { crearPaciente } from '@/lib/actions';
import { FaUser, FaPhone, FaEnvelope, FaCalendarAlt, FaKey } from 'react-icons/fa';

interface NewPatientFormProps {
  onClose: () => void;
  onPatientCreated: () => void;
}

export default function NewPatientForm({ onClose, onPatientCreated }: NewPatientFormProps) {
  const [formData, setFormData] = useState({
    first_name: '',
    second_name: '',
    last_name: '',
    second_last_name: '',
    age: '',
    phone: '',
    email: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [passwordModalLocked, setPasswordModalLocked] = useState(true);
  const [isCopying, setIsCopying] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'El primer nombre es requerido';
    } else if (formData.first_name.length < 2) {
      newErrors.first_name = 'El primer nombre debe tener al menos 2 caracteres';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'El apellido paterno es requerido';
    } else if (formData.last_name.length < 2) {
      newErrors.last_name = 'El apellido paterno debe tener al menos 2 caracteres';
    }

    if (!formData.age) {
      newErrors.age = 'La edad es requerida';
    } else {
      const ageNum = parseInt(formData.age);
      if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
        newErrors.age = 'La edad debe ser entre 1 y 120 años';
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'El teléfono debe tener 10 dígitos';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ingrese un email válido';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const result = await crearPaciente(formDataToSend);
      
      if (result.success && result.contrasenaGenerada) {
        setGeneratedPassword(result.contrasenaGenerada);
        setShowPasswordModal(true);
        
        // Bloquear el cierre por 5 segundos
        setPasswordModalLocked(true);
        setTimeout(() => {
          setPasswordModalLocked(false);
        }, 5000);
        
        // Reset form
        setFormData({
          first_name: '',
          second_name: '',
          last_name: '',
          second_last_name: '',
          age: '',
          phone: '',
          email: ''
        });
        
        // Notificar al componente padre
        onPatientCreated();
      }
    } catch (error: unknown) {
    if (error instanceof Error) {
        if (error.message.includes('ya está registrado')) {
        setErrors({ email: error.message });
        } else {
        setErrors({ _form: error.message });
        }
    } else {
        setErrors({ _form: 'Error al crear el paciente' });
    }
    }
  };

  const handleCopyPassword = async () => {
    try {
      setIsCopying(true);
      await navigator.clipboard.writeText(generatedPassword);
      setTimeout(() => setIsCopying(false), 2000);
    } catch (err) {
      console.error('Error al copiar:', err);
    }
  };

  const closePasswordModal = () => {
    if (!passwordModalLocked) {
      setShowPasswordModal(false);
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Nuevo Paciente</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-xl"
              >
                ×
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Primer Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <FaUser className="text-blue-500" />
                      Primer Nombre *
                    </div>
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.first_name ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent`}
                    placeholder="Ej: María"
                  />
                  {errors.first_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>
                  )}
                </div>

                {/* Segundo Nombre */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Segundo Nombre (Opcional)
                  </label>
                  <input
                    type="text"
                    name="second_name"
                    value={formData.second_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="Ej: Elena"
                  />
                </div>

                {/* Apellido Paterno */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido Paterno *
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.last_name ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent`}
                    placeholder="Ej: González"
                  />
                  {errors.last_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>
                  )}
                </div>

                {/* Apellido Materno */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido Materno (Opcional)
                  </label>
                  <input
                    type="text"
                    name="second_last_name"
                    value={formData.second_last_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                    placeholder="Ej: López"
                  />
                </div>

                {/* Edad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-blue-500" />
                      Edad *
                    </div>
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="1"
                    max="120"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.age ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent`}
                    placeholder="Ej: 34"
                  />
                  {errors.age && (
                    <p className="mt-1 text-sm text-red-600">{errors.age}</p>
                  )}
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <FaPhone className="text-blue-500" />
                      Teléfono *
                    </div>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent`}
                    placeholder="10 dígitos sin espacios"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <FaEnvelope className="text-blue-500" />
                      Email *
                    </div>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent`}
                    placeholder="ejemplo@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Error general del formulario */}
              {errors._form && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{errors._form}</p>
                </div>
              )}

              {/* Botones */}
              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors font-medium"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Creando...
                    </>
                  ) : (
                    'Crear Paciente'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal de Contraseña Generada */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FaKey className="text-green-500" />
                  Contraseña Generada
                </h3>
                {!passwordModalLocked && (
                  <button
                    onClick={closePasswordModal}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors text-xl"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Mensaje */}
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Se ha creado el paciente exitosamente. Esta es la contraseña generada automáticamente:
                </p>
                
                {/* Contraseña en display */}
                <div className="relative mb-4">
                  <div className="bg-gray-50 p-4 rounded-lg border-2 border-blue-200">
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-1">Contraseña del paciente:</p>
                      <p className="text-2xl font-mono font-bold text-gray-800 tracking-wider">
                        {generatedPassword}
                      </p>
                    </div>
                  </div>
                  
                  {/* Botón de copiar */}
                  <button
                    onClick={handleCopyPassword}
                    className="absolute right-2 top-2 px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium flex items-center gap-1"
                  >
                    {isCopying ? (
                      <>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copiada!
                      </>
                    ) : (
                      'Copiar'
                    )}
                  </button>
                </div>

                {/* Instrucciones */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <p className="text-sm text-yellow-800">
                    <strong>Importante:</strong> Esta contraseña se muestra solo una vez. 
                    Asegúrate de copiarla y proporcionarla al paciente de manera segura.
                  </p>
                </div>
              </div>

              {/* Timer y botón */}
              <div className="border-t border-gray-200 pt-4">
                <div className="text-center mb-4">
                  {passwordModalLocked ? (
                    <div className="inline-flex items-center gap-2 text-orange-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
                      <span className="text-sm font-medium">
                        Espera 5 segundos para poder cerrar...
                      </span>
                    </div>
                  ) : (
                    <p className="text-green-600 text-sm font-medium">
                      ✓ Ya puedes cerrar esta ventana
                    </p>
                  )}
                </div>
                
                <button
                  onClick={closePasswordModal}
                  disabled={passwordModalLocked}
                  className={`w-full py-3 rounded-xl font-medium transition-colors ${
                    passwordModalLocked
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-500 text-white hover:bg-green-600'
                  }`}
                >
                  {passwordModalLocked ? 'Espera...' : 'Continuar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}