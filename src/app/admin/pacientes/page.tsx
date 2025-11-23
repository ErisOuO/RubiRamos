'use client';

import { useState } from 'react';
import { FaSearch, FaUser, FaClock, FaCalendar, FaEllipsisV } from 'react-icons/fa';

// Interface para el tipo Patient
interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  totalAppointments: number;
  punctuality: number;
  lastVisit: string;
  nextAppointment: string | null;
  status: string;
  notes: string;
}

// Datos de ejemplo para pacientes
const patientsData: Patient[] = [
  {
    id: 1,
    name: 'María González',
    email: 'maria.gonzalez@email.com',
    phone: '+52 55 1234 5678',
    age: 34,
    gender: 'Femenino',
    totalAppointments: 12,
    punctuality: 92,
    lastVisit: '2024-12-10',
    nextAppointment: '2024-12-20',
    status: 'Activo',
    notes: 'Seguimiento de pérdida de peso'
  },
  {
    id: 2,
    name: 'Carlos López',
    email: 'carlos.lopez@email.com',
    phone: '+52 55 2345 6789',
    age: 28,
    gender: 'Masculino',
    totalAppointments: 8,
    punctuality: 85,
    lastVisit: '2024-12-08',
    nextAppointment: '2024-12-22',
    status: 'Activo',
    notes: 'Plan de ganancia muscular'
  },
  {
    id: 3,
    name: 'Ana Martínez',
    email: 'ana.martinez@email.com',
    phone: '+52 55 3456 7890',
    age: 45,
    gender: 'Femenino',
    totalAppointments: 15,
    punctuality: 78,
    lastVisit: '2024-12-05',
    nextAppointment: null,
    status: 'Activo',
    notes: 'Control de diabetes tipo 2'
  },
  {
    id: 4,
    name: 'Roberto Sánchez',
    email: 'roberto.sanchez@email.com',
    phone: '+52 55 4567 8901',
    age: 52,
    gender: 'Masculino',
    totalAppointments: 6,
    punctuality: 95,
    lastVisit: '2024-12-03',
    nextAppointment: '2024-12-17',
    status: 'Activo',
    notes: 'Plan nutricional post-cirugía'
  },
  {
    id: 5,
    name: 'Laura Díaz',
    email: 'laura.diaz@email.com',
    phone: '+52 55 5678 9012',
    age: 29,
    gender: 'Femenino',
    totalAppointments: 4,
    punctuality: 88,
    lastVisit: '2024-11-28',
    nextAppointment: '2024-12-15',
    status: 'En pausa',
    notes: 'Embarazo - primer trimestre'
  },
  {
    id: 6,
    name: 'Juan Pérez',
    email: 'juan.perez@email.com',
    phone: '+52 55 6789 0123',
    age: 38,
    gender: 'Masculino',
    totalAppointments: 20,
    punctuality: 96,
    lastVisit: '2024-12-09',
    nextAppointment: '2024-12-23',
    status: 'Activo',
    notes: 'Atleta - optimización rendimiento'
  },
  {
    id: 7,
    name: 'Sofía Ramírez',
    email: 'sofia.ramirez@email.com',
    phone: '+52 55 7890 1234',
    age: 31,
    gender: 'Femenino',
    totalAppointments: 3,
    punctuality: 65,
    lastVisit: '2024-11-25',
    nextAppointment: '2024-12-18',
    status: 'Activo',
    notes: 'Nueva paciente - evaluación inicial'
  },
  {
    id: 8,
    name: 'Miguel Torres',
    email: 'miguel.torres@email.com',
    phone: '+52 55 8901 2345',
    age: 41,
    gender: 'Masculino',
    totalAppointments: 11,
    punctuality: 90,
    lastVisit: '2024-12-07',
    nextAppointment: null,
    status: 'Inactivo',
    notes: 'Completó tratamiento'
  }
];

const getPunctualityColor = (percentage: number) => {
  if (percentage >= 90) return 'text-green-600 bg-green-100';
  if (percentage >= 80) return 'text-yellow-600 bg-yellow-100';
  if (percentage >= 70) return 'text-orange-600 bg-orange-100';
  return 'text-red-600 bg-red-100';
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Activo': return 'text-green-800 bg-green-100';
    case 'En pausa': return 'text-yellow-800 bg-yellow-100';
    case 'Inactivo': return 'text-red-800 bg-red-100';
    default: return 'text-gray-800 bg-gray-100';
  }
};

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Filtrar pacientes
  const filteredPatients = patientsData.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Todos' || patient.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowDetails(true);
  };

  const closeDetails = () => {
    setShowDetails(false);
    setSelectedPatient(null);
  };

  return (
    <main className="min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Gestión de Pacientes
          </h1>
          <p className="text-xl text-gray-600">
            Lista completa de pacientes
          </p>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Pacientes</p>
                <p className="text-2xl font-bold text-gray-800">{patientsData.length}</p>
              </div>
              <FaUser className="text-blue-500 text-xl" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pacientes Activos</p>
                <p className="text-2xl font-bold text-gray-800">
                  {patientsData.filter(p => p.status === 'Activo').length}
                </p>
              </div>
              <FaUser className="text-green-500 text-xl" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Puntualidad Promedio</p>
                <p className="text-2xl font-bold text-gray-800">
                  {Math.round(patientsData.reduce((acc, p) => acc + p.punctuality, 0) / patientsData.length)}%
                </p>
              </div>
              <FaClock className="text-purple-500 text-xl" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Citas Este Mes</p>
                <p className="text-2xl font-bold text-gray-800">42</p>
              </div>
              <FaCalendar className="text-orange-500 text-xl" />
            </div>
          </div>
        </div>

        {/* Controles de búsqueda y filtros */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex-1 w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar pacientes por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                />
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                title='Pacientes'
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              >
                <option value="Todos">Todos los estados</option>
                <option value="Activo">Activos</option>
                <option value="En pausa">En pausa</option>
                <option value="Inactivo">Inactivos</option>
              </select>
              
              <button className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium">
                + Nuevo Paciente
              </button>
            </div>
          </div>
        </div>

        {/* Lista de pacientes */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header de la tabla */}
          <div className="grid grid-cols-12 gap-4 p-6 bg-gray-50 border-b border-gray-200 font-semibold text-gray-700">
            <div className="col-span-3">Paciente</div>
            <div className="col-span-2 text-center">Total Citas</div>
            <div className="col-span-2 text-center">Puntualidad</div>
            <div className="col-span-3 text-center">Próxima Cita</div>
            <div className="col-span-2 text-center">Acciones</div>
          </div>

          {/* Lista de pacientes */}
          <div className="divide-y divide-gray-200">
            {filteredPatients.map((patient) => (
              <div key={patient.id} className="grid grid-cols-12 gap-4 p-6 hover:bg-gray-50 transition-colors">
                {/* Información del paciente */}
                <div className="col-span-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <FaUser className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{patient.name}</h3>
                      <p className="text-sm text-gray-500">{patient.email}</p>
                    </div>
                  </div>
                </div>

                {/* Total de citas */}
                <div className="col-span-2 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-lg font-bold text-gray-800">{patient.totalAppointments}</span>
                    <p className="text-xs text-gray-500">citas</p>
                  </div>
                </div>

                {/* Puntualidad */}
                <div className="col-span-2 flex items-center justify-center">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPunctualityColor(patient.punctuality)}`}>
                    {patient.punctuality}%
                  </span>
                </div>

                {/* Próxima cita */}
                <div className="col-span-3 flex items-center justify-center">
                  {patient.nextAppointment ? (
                    <div className="text-center">
                      <span className="text-sm font-medium text-gray-800">
                        {new Date(patient.nextAppointment).toLocaleDateString('es-ES')}
                      </span>
                      <p className="text-xs text-gray-500">Próxima cita</p>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">Sin cita programada</span>
                  )}
                </div>

                {/* Acciones */}
                <div className="col-span-2 flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleViewDetails(patient)}
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

          {/* Mensaje si no hay resultados */}
          {filteredPatients.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FaUser className="text-4xl text-gray-300 mx-auto mb-3" />
              <p>No se encontraron pacientes con los filtros aplicados</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de detalles del paciente */}
      {showDetails && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header del modal */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Detalles del Paciente</h2>
                <button
                  onClick={closeDetails}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ×
                </button>
              </div>

              {/* Información del paciente */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-4">Información Personal</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-500">Nombre completo</label>
                      <p className="font-medium">{selectedPatient.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Email</label>
                      <p className="font-medium">{selectedPatient.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Teléfono</label>
                      <p className="font-medium">{selectedPatient.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Edad</label>
                      <p className="font-medium">{selectedPatient.age} años</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Género</label>
                      <p className="font-medium">{selectedPatient.gender}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-4">Información Médica</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Total de citas</span>
                      <span className="font-medium">{selectedPatient.totalAppointments}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Puntualidad</span>
                      <span className={`font-medium ${getPunctualityColor(selectedPatient.punctuality).split(' ')[0]}`}>
                        {selectedPatient.punctuality}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Estado</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedPatient.status)}`}>
                        {selectedPatient.status}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Última visita</label>
                      <p className="font-medium">
                        {new Date(selectedPatient.lastVisit).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    {selectedPatient.nextAppointment && (
                      <div>
                        <label className="text-sm text-gray-500">Próxima cita</label>
                        <p className="font-medium text-blue-600">
                          {new Date(selectedPatient.nextAppointment).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Notas */}
              <div className="mt-6">
                <h3 className="font-semibold text-gray-700 mb-3">Notas del Paciente</h3>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                  {selectedPatient.notes}
                </p>
              </div>

              {/* Acciones */}
              <div className="flex gap-3 mt-8">
                <button className="flex-1 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium">
                  Agendar Cita
                </button>
                <button className="flex-1 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium">
                  Enviar Recordatorio
                </button>
                <button className="flex-1 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors font-medium">
                  Editar Paciente
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}