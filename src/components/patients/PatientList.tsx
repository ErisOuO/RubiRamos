'use client';

import { FaUser, FaEllipsisV } from 'react-icons/fa';

interface Patient {
  id: number;
  nombre_completo: string;
  phone: string;
  email: string;
  estado: string;
  age?: number;
}

interface PatientListProps {
  patients: Patient[];
  loading: boolean;
  onViewDetails: (patient: Patient) => void;
}

export default function PatientList({ patients, loading, onViewDetails }: PatientListProps) {
  const getStatusColor = (status: string) => {
    if (status.includes('Activo y verificado')) return 'text-green-800 bg-green-100';
    if (status.includes('Activo')) return 'text-blue-800 bg-blue-100';
    if (status.includes('Inactivo')) return 'text-red-800 bg-red-100';
    return 'text-gray-800 bg-gray-100';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando pacientes...</p>
        </div>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12">
        <div className="text-center">
          <FaUser className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No hay pacientes registrados</p>
          <p className="text-sm text-gray-400 mt-1">Comienza agregando un nuevo paciente</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header de la tabla */}
      <div className="grid grid-cols-12 gap-4 p-6 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700">
        <div className="col-span-4">Paciente</div>
        <div className="col-span-3 text-center">Contacto</div>
        <div className="col-span-3 text-center">Estado</div>
        <div className="col-span-2 text-center">Acciones</div>
      </div>

      {/* Lista de pacientes */}
      <div className="divide-y divide-gray-200">
        {patients.map((patient) => (
          <div key={patient.id} className="grid grid-cols-12 gap-4 p-6 hover:bg-gray-50 transition-colors">
            {/* Información del paciente */}
            <div className="col-span-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaUser className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{patient.nombre_completo}</h3>
                  <p className="text-sm text-gray-500">{patient.email}</p>
                </div>
              </div>
            </div>

            {/* Contacto */}
            <div className="col-span-3 flex items-center justify-center">
              <div className="text-center">
                <span className="text-sm font-medium text-gray-800">{patient.phone}</span>
                <p className="text-xs text-gray-500">Teléfono</p>
              </div>
            </div>

            {/* Estado */}
            <div className="col-span-3 flex items-center justify-center">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(patient.estado)}`}>
                {patient.estado}
              </span>
            </div>

            {/* Acciones */}
            <div className="col-span-2 flex items-center justify-center gap-2">
              <button
                onClick={() => onViewDetails(patient)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                Ver Detalles
              </button>
              <button title='Detalles' className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <FaEllipsisV />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}