'use client';

import { useState } from 'react';

// Datos de ejemplo para diciembre 2024
const december2024 = {
  month: 'Diciembre',
  year: 2024,
  days: [
    { day: 1, appointments: 2 },
    { day: 2, appointments: 5 },
    { day: 3, appointments: 8 },
    { day: 4, appointments: 12 },
    { day: 5, appointments: 15 },
    { day: 6, appointments: 1 },
    { day: 7, appointments: 0 },
    { day: 8, appointments: 3 },
    { day: 9, appointments: 7 },
    { day: 10, appointments: 14 },
    { day: 11, appointments: 9 },
    { day: 12, appointments: 4 },
    { day: 13, appointments: 11 },
    { day: 14, appointments: 6 },
    { day: 15, appointments: 2 },
    { day: 16, appointments: 0 },
    { day: 17, appointments: 8 },
    { day: 18, appointments: 13 },
    { day: 19, appointments: 5 },
    { day: 20, appointments: 10 },
    { day: 21, appointments: 3 },
    { day: 22, appointments: 7 },
    { day: 23, appointments: 15 },
    { day: 24, appointments: 4 },
    { day: 25, appointments: 1 },
    { day: 26, appointments: 9 },
    { day: 27, appointments: 12 },
    { day: 28, appointments: 6 },
    { day: 29, appointments: 2 },
    { day: 30, appointments: 8 },
    { day: 31, appointments: 5 },
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

const getAvailabilityLevel = (count: number) => {
  if (count === 0) return 'Disponibilidad alta';
  if (count <= 3) return 'Disponibilidad buena';
  if (count <= 6) return 'Disponibilidad media';
  if (count <= 10) return 'Disponibilidad baja';
  return 'Disponibilidad muy baja';
};

export default function AppointmentCalendar() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const selectedDayData = selectedDay 
    ? december2024.days.find(day => day.day === selectedDay)
    : null;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Calendario de Citas - Diciembre 2024
        </h1>
        <p className="text-gray-600">
          Selecciona un día para ver la disponibilidad de citas
        </p>
      </div>

      {/* Instrucciones */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
        <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
          💡 Instrucciones
        </h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Los colores indican la cantidad de citas agendadas por día</li>
          <li>• Haz clic en cualquier día para ver detalles de disponibilidad</li>
          <li>• Días con menos citas tienen mayor disponibilidad para agendar</li>
        </ul>
      </div>

      {/* Leyenda de colores */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
          <span>0 citas</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
          <span>1-3 citas</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
          <span>4-6 citas</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></div>
          <span>7-10 citas</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
          <span>11-15 citas</span>
        </div>
      </div>

      {/* Calendario */}
      <div className="grid grid-cols-7 gap-3 mb-8">
        {/* Días de la semana */}
        {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
          <div key={day} className="text-center font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}

        {/* Espacios vacíos para alinear el primer día (Diciembre 2024 empieza en Domingo) */}
        <div className="col-span-6"></div>

        {/* Días del mes */}
        {december2024.days.map(({ day, appointments }) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`
              p-3 rounded-xl border-2 transition-all duration-200 text-center
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

      {/* Detalles del día seleccionado */}
      {selectedDayData && (
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            📅 Día {selectedDayData.day} de Diciembre
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Disponibilidad:</h4>
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded ${getColorByAppointments(selectedDayData.appointments).replace('hover:bg-', 'bg-').split(' ')[0]}`}></div>
                <span className="text-lg font-medium text-gray-800">
                  {getAvailabilityLevel(selectedDayData.appointments)}
                </span>
              </div>
              <p className="text-gray-600 mt-2 text-sm">
                {selectedDayData.appointments === 0 
                  ? 'Excelente día para agendar tu cita. Hay completa disponibilidad.'
                  : selectedDayData.appointments <= 3
                  ? 'Buena disponibilidad. Aún hay horarios convenientes.'
                  : selectedDayData.appointments <= 6
                  ? 'Disponibilidad moderada. Te recomendamos agendar pronto.'
                  : selectedDayData.appointments <= 10
                  ? 'Disponibilidad limitada. Pocos horarios disponibles.'
                  : 'Disponibilidad muy limitada. Considera otro día.'
                }
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Resumen:</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Citas agendadas:</span>
                  <span className="font-bold">{selectedDayData.appointments}</span>
                </div>
                <div className="flex justify-between">
                  <span>Disponibilidad:</span>
                  <span className="font-bold">{15 - selectedDayData.appointments} horarios</span>
                </div>
                <div className="flex justify-between">
                  <span>Recomendación:</span>
                  <span className={`font-bold ${
                    selectedDayData.appointments <= 3 ? 'text-green-600' :
                    selectedDayData.appointments <= 6 ? 'text-yellow-600' :
                    selectedDayData.appointments <= 10 ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {selectedDayData.appointments <= 3 ? 'Excelente' :
                     selectedDayData.appointments <= 6 ? 'Buena' :
                     selectedDayData.appointments <= 10 ? 'Regular' : 'Mala'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}