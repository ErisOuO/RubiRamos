'use client';

import Link from 'next/link';

interface DashboardStats {
  todayAppointments: number;
  weeklyAppointments: number;
  totalPatients: number;
  newPatientsMonth: number;
  completionRate: number;
  nextAppointment: {
    id: number;
    patientName: string;
    time: string;
    type: string;
    duration: string;
  } | null;
  todayAppointmentsList: Array<{
    id: number;
    time: string;
    patientName: string;
    status: string;
  }>;
  recentPatients: Array<{
    id: number;
    name: string;
    lastVisit: string;
    status: string;
  }>;
  weeklyStats: Array<{
    day: string;
    appointments: number;
  }>;
}

interface DashboardClientProps {
  stats: DashboardStats;
  userName: string;
}

export default function DashboardClient({ stats, userName }: DashboardClientProps) {
  const maxWeeklyAppointments = Math.max(...stats.weeklyStats.map(s => s.appointments), 1);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#6B8E7B]">
            Bienvenida, {userName}
          </h1>
          <p className="text-sm text-[#6E7C72] mt-1">
            Hoy es {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Citas hoy */}
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-[#6B8E7B]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#6E7C72] text-sm font-medium">Citas Hoy</p>
                <p className="text-2xl font-bold text-[#2C3E34] mt-1">{stats.todayAppointments}</p>
              </div>
              <div className="w-10 h-10 bg-[#6B8E7B]/10 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-[#6B8E7B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Citas semanales */}
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-[#BD7D4A]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#6E7C72] text-sm font-medium">Esta Semana</p>
                <p className="text-2xl font-bold text-[#2C3E34] mt-1">{stats.weeklyAppointments}</p>
              </div>
              <div className="w-10 h-10 bg-[#BD7D4A]/10 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-[#BD7D4A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Pacientes totales */}
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-[#A8CF45]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#6E7C72] text-sm font-medium">Pacientes Activos</p>
                <p className="text-2xl font-bold text-[#2C3E34] mt-1">{stats.totalPatients}</p>
              </div>
              <div className="w-10 h-10 bg-[#A8CF45]/10 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-[#A8CF45]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-2 text-xs text-[#6E7C72]">
              +{stats.newPatientsMonth} nuevos este mes
            </div>
          </div>

          {/* Tasa de completación */}
          <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-[#F58634]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#6E7C72] text-sm font-medium">Completación</p>
                <p className="text-2xl font-bold text-[#2C3E34] mt-1">{stats.completionRate}%</p>
              </div>
              <div className="w-10 h-10 bg-[#F58634]/10 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-[#F58634]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Próxima cita */}
            {stats.nextAppointment && (
              <div className="bg-white rounded-xl shadow-sm border border-[#E6E3DE] overflow-hidden">
                <div className="bg-[#FAF9F7] px-6 py-4 border-b border-[#E6E3DE]">
                  <h2 className="text-lg font-bold text-[#6B8E7B] flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Próxima Cita
                  </h2>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-[#2C3E34]">{stats.nextAppointment.patientName}</h3>
                      <p className="text-[#6E7C72] text-sm mt-1">{stats.nextAppointment.type}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#BD7D4A]">{stats.nextAppointment.time}</div>
                      <div className="text-sm text-[#6E7C72]">{stats.nextAppointment.duration}</div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-6">
                    <Link
                      href={`/admin/patients?patient=${stats.nextAppointment.id}`}
                      className="flex-1 py-2 bg-[#6B8E7B] text-white text-center font-semibold rounded-lg hover:bg-[#4A7C6A] transition-colors"
                    >
                      Ver Historial
                    </Link>
                    <button className="flex-1 py-2 bg-[#BD7D4A] text-white font-semibold rounded-lg hover:bg-[#F58634] transition-colors">
                      Iniciar Consulta
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Citas de hoy */}
            <div className="bg-white rounded-xl shadow-sm border border-[#E6E3DE] overflow-hidden">
              <div className="bg-[#FAF9F7] px-6 py-4 border-b border-[#E6E3DE]">
                <h3 className="text-lg font-bold text-[#6B8E7B] flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Citas de Hoy
                </h3>
              </div>
              <div className="p-4 space-y-2">
                {stats.todayAppointmentsList.length === 0 ? (
                  <p className="text-center text-[#6E7C72] py-4">No hay citas programadas para hoy</p>
                ) : (
                  stats.todayAppointmentsList.map((appointment, index) => (
                    <div key={appointment.id} className="flex items-center justify-between p-3 bg-[#FAF9F7] rounded-lg">
                      <div>
                        <span className="font-medium text-[#2C3E34]">{appointment.time} - {appointment.patientName}</span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'completado' 
                          ? 'bg-[#A8CF45]/20 text-[#2C3E34]' 
                          : 'bg-[#BD7D4A]/20 text-[#2C3E34]'
                      }`}>
                        {appointment.status === 'completado' ? 'Completado' : 'Pendiente'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Gráfica de citas semanales */}
            <div className="bg-white rounded-xl shadow-sm border border-[#E6E3DE] overflow-hidden">
              <div className="bg-[#FAF9F7] px-6 py-4 border-b border-[#E6E3DE]">
                <h3 className="text-lg font-bold text-[#6B8E7B] flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Citas Esta Semana
                </h3>
              </div>
              <div className="p-6 space-y-3">
                {stats.weeklyStats.map((day) => (
                  <div key={day.day} className="flex items-center justify-between">
                    <span className="text-sm text-[#6E7C72] w-8">{day.day}</span>
                    <div className="flex-1 mx-3">
                      <div 
                        className="bg-[#6B8E7B] rounded-full h-2 transition-all duration-300"
                        style={{ width: `${(day.appointments / maxWeeklyAppointments) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-[#2C3E34] w-8 text-right">
                      {day.appointments}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pacientes recientes */}
            <div className="bg-white rounded-xl shadow-sm border border-[#E6E3DE] overflow-hidden">
              <div className="bg-[#FAF9F7] px-6 py-4 border-b border-[#E6E3DE]">
                <h3 className="text-lg font-bold text-[#6B8E7B] flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Pacientes Recientes
                </h3>
              </div>
              <div className="p-4 space-y-2">
                {stats.recentPatients.length === 0 ? (
                  <p className="text-center text-[#6E7C72] py-4">No hay pacientes registrados</p>
                ) : (
                  stats.recentPatients.map((patient) => (
                    <div key={patient.id} className="flex items-center justify-between p-3 bg-[#FAF9F7] rounded-lg">
                      <div>
                        <p className="font-medium text-[#2C3E34]">{patient.name}</p>
                        <p className="text-xs text-[#6E7C72]">Última visita: {patient.lastVisit}</p>
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#A8CF45]/20 text-[#2C3E34]">
                        {patient.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}