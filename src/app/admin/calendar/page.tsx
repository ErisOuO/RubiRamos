'use client';

import { useState } from 'react';
import { FaSearch, FaUser, FaPhone, FaEnvelope, FaStethoscope } from 'react-icons/fa';

// Datos de ejemplo para diciembre 2024 con información de pacientes
const december2024 = {
  month: 'Diciembre',
  year: 2024,
  days: [
    { day: 1, appointments: 2, patients: ['María González', 'Carlos López'] },
    { day: 2, appointments: 5, patients: ['Ana Martínez', 'Roberto Sánchez', 'Laura Díaz', 'Juan Pérez', 'Sofía Ramírez'] },
    { day: 3, appointments: 8, patients: ['Miguel Torres', 'Adriana López', 'David Hernández', 'Elena Castro', 'Jorge Ramírez', 'Carmen Ruiz', 'Pedro García', 'Isabel Mendoza'] },
    { day: 4, appointments: 12, patients: Array(12).fill('Paciente') },
    { day: 5, appointments: 15, patients: Array(15).fill('Paciente') },
    { day: 6, appointments: 1, patients: ['Carlos Rodríguez'] },
    { day: 7, appointments: 0, patients: [] },
    { day: 8, appointments: 3, patients: ['Ana Silva', 'Luis Morales', 'Patricia Reyes'] },
    { day: 9, appointments: 7, patients: Array(7).fill('Paciente') },
    { day: 10, appointments: 14, patients: Array(14).fill('Paciente') },
    { day: 11, appointments: 9, patients: Array(9).fill('Paciente') },
    { day: 12, appointments: 4, patients: ['Fernando Castro', 'Gabriela Ortiz', 'Ricardo Luna', 'Diana Mejía'] },
    { day: 13, appointments: 11, patients: Array(11).fill('Paciente') },
    { day: 14, appointments: 6, patients: Array(6).fill('Paciente') },
    { day: 15, appointments: 2, patients: ['Sara Jiménez', 'Alejandro Vargas'] },
    { day: 16, appointments: 0, patients: [] },
    { day: 17, appointments: 8, patients: Array(8).fill('Paciente') },
    { day: 18, appointments: 13, patients: Array(13).fill('Paciente') },
    { day: 19, appointments: 5, patients: Array(5).fill('Paciente') },
    { day: 20, appointments: 10, patients: Array(10).fill('Paciente') },
    { day: 21, appointments: 3, patients: ['Mónica Herrera', 'Raúl Ortega', 'Teresa Ríos'] },
    { day: 22, appointments: 7, patients: Array(7).fill('Paciente') },
    { day: 23, appointments: 15, patients: Array(15).fill('Paciente') },
    { day: 24, appointments: 4, patients: ['Natalia Vega', 'Oscar Paredes', 'Verónica Mora', 'Héctor Guzmán'] },
    { day: 25, appointments: 1, patients: ['Emergency'] },
    { day: 26, appointments: 9, patients: Array(9).fill('Paciente') },
    { day: 27, appointments: 12, patients: Array(12).fill('Paciente') },
    { day: 28, appointments: 6, patients: Array(6).fill('Paciente') },
    { day: 29, appointments: 2, patients: ['Lucía Mendoza', 'Francisco Reyes'] },
    { day: 30, appointments: 8, patients: Array(8).fill('Paciente') },
    { day: 31, appointments: 5, patients: Array(5).fill('Paciente') },
  ]
};

const getColorByAppointments = (count: number) => {
  if (count === 0) return 'bg-gray-100 border-gray-200';
  if (count <= 3) return 'bg-green-100 border-green-300 hover:bg-green-200';
  if (count <= 6) return 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200';
  if (count <= 10) return 'bg-orange-100 border-orange-300 hover:bg-orange-200';
  return 'bg-red-100 border-red-300 hover:bg-red-200';
};

const getTextColorByAppointments = (count: number) => {
  if (count === 0) return 'text-gray-600';
  if (count <= 3) return 'text-green-800';
  if (count <= 6) return 'text-yellow-800';
  if (count <= 10) return 'text-orange-800';
  return 'text-red-800';
};

const getWorkloadLevel = (count: number) => {
  if (count === 0) return 'Día ligero';
  if (count <= 3) return 'Carga normal';
  if (count <= 6) return 'Carga moderada';
  if (count <= 10) return 'Carga alta';
  return 'Carga muy alta';
};

export default function NutritionistCalendarPage() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedDayData = selectedDay 
    ? december2024.days.find(day => day.day === selectedDay)
    : null;

  // Filtrar pacientes si hay búsqueda
  const filteredPatients = selectedDayData?.patients.filter(patient =>
    patient.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <main className="min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Calendario de Citas
          </h1>
          <p className="text-xl text-gray-600">
            Gestión de citas - Diciembre 2024
          </p>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Citas Hoy</p>
                <p className="text-2xl font-bold text-gray-800">8</p>
              </div>
              <FaUser className="text-blue-500 text-xl" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Citas Semana</p>
                <p className="text-2xl font-bold text-gray-800">42</p>
              </div>
              <FaStethoscope className="text-green-500 text-xl" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pacientes Activos</p>
                <p className="text-2xl font-bold text-gray-800">156</p>
              </div>
              <FaUser className="text-purple-500 text-xl" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Disponibilidad</p>
                <p className="text-2xl font-bold text-gray-800">68%</p>
              </div>
              <FaStethoscope className="text-orange-500 text-xl" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Calendario */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Diciembre 2024
                </h2>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors">
                    Nueva Cita
                  </button>
                  <button className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors">
                    Exportar
                  </button>
                </div>
              </div>

              {/* Leyenda */}
              <div className="grid grid-cols-5 gap-2 mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
                  <span>0 citas</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                  <span>1-3 citas</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
                  <span>4-6 citas</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-orange-100 border border-orange-300 rounded"></div>
                  <span>7-10 citas</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                  <span>11-15 citas</span>
                </div>
              </div>

              {/* Calendario */}
              <div className="grid grid-cols-7 gap-2 mb-6">
                {/* Días de la semana */}
                {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
                  <div key={day} className="text-center font-semibold text-gray-600 py-2">
                    {day}
                  </div>
                ))}

                {/* Espacios vacíos para alinear (Diciembre 2024 empieza en Domingo) */}
                <div className="col-span-6"></div>

                {/* Días del mes */}
                {december2024.days.map(({ day, appointments }) => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`
                      p-3 rounded-xl border-2 transition-all duration-200 text-center min-h-20
                      ${getColorByAppointments(appointments)}
                      ${selectedDay === day ? 'ring-2 ring-blue-500 ring-offset-2 transform scale-105' : ''}
                    `}
                  >
                    <div className={`font-bold ${getTextColorByAppointments(appointments)}`}>
                      {day}
                    </div>
                    <div className={`text-xs mt-1 ${getTextColorByAppointments(appointments)}`}>
                      {appointments} {appointments === 1 ? 'cita' : 'citas'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Panel lateral - Detalles del día seleccionado */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-4">
              {selectedDayData ? (
                <>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">
                    📅 {selectedDayData.day} de Diciembre
                  </h3>
                  
                  {/* Resumen del día */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-semibold text-gray-700">Carga de trabajo:</span>
                      <span className={`font-bold ${
                        selectedDayData.appointments <= 3 ? 'text-green-600' :
                        selectedDayData.appointments <= 6 ? 'text-yellow-600' :
                        selectedDayData.appointments <= 10 ? 'text-orange-600' : 'text-red-600'
                      }`}>
                        {getWorkloadLevel(selectedDayData.appointments)}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Citas agendadas:</span>
                        <span className="font-bold">{selectedDayData.appointments}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Capacidad máxima:</span>
                        <span className="font-bold">15</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Disponibilidad:</span>
                        <span className="font-bold text-green-600">
                          {15 - selectedDayData.appointments} horarios
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Búsqueda de pacientes */}
                  <div className="relative mb-4">
                    <input
                      type="text"
                      placeholder="Buscar paciente..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-4 py-2 pl-10 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>

                  {/* Lista de pacientes */}
                  <div className="max-h-96 overflow-y-auto">
                    <h4 className="font-semibold text-gray-700 mb-3">
                      Pacientes ({filteredPatients.length})
                    </h4>
                    <div className="space-y-2">
                      {filteredPatients.map((patient, index) => (
                        <div
                          key={index}
                          className="p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-blue-800 text-sm">
                              {patient}
                            </span>
                            <div className="flex gap-1">
                              <button title='Phone' className="p-1 text-blue-600 hover:text-blue-800">
                                <FaPhone size={12} />
                              </button>
                              <button title='Enve' className="p-1 text-green-600 hover:text-green-800">
                                <FaEnvelope size={12} />
                              </button>
                            </div>
                          </div>
                          <div className="text-xs text-blue-600 mt-1">
                            9:00 AM - Consulta seguimiento
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="mt-6 space-y-3">
                    <button className="w-full py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors text-sm font-medium">
                      Agendar Nueva Cita
                    </button>
                    <button className="w-full py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors text-sm font-medium">
                      Enviar Recordatorio
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaStethoscope className="text-4xl text-gray-300 mx-auto mb-3" />
                  <p>Selecciona un día para ver los detalles de las citas</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}