import { FaCalendarCheck, FaUsers, FaClock, FaChartLine, FaUserInjured, FaStethoscope } from 'react-icons/fa';

// Datos de ejemplo para el dashboard
const statsData = {
  todayAppointments: 8,
  weeklyAppointments: 42,
  monthlyPatients: 156,
  completionRate: 92
};

const nextAppointment = {
  patientName: 'María González',
  time: '10:30 AM',
  type: 'Consulta de seguimiento',
  duration: '45 min'
};

const recentPatients = [
  { name: 'Carlos Rodríguez', lastVisit: 'Hace 2 días', status: 'Completado' },
  { name: 'Ana Martínez', lastVisit: 'Hace 1 semana', status: 'Completado' },
  { name: 'Roberto Sánchez', lastVisit: 'Ayer', status: 'Completado' },
  { name: 'Laura Díaz', lastVisit: 'Hace 3 días', status: 'Completado' }
];

const weeklyStats = [
  { day: 'Lun', appointments: 12 },
  { day: 'Mar', appointments: 8 },
  { day: 'Mié', appointments: 15 },
  { day: 'Jue', appointments: 10 },
  { day: 'Vie', appointments: 7 },
  { day: 'Sáb', appointments: 4 },
  { day: 'Dom', appointments: 0 }
];

export default function NutritionistDashboard() {
  return (
    <main className="min-h-screen w-full from-blue-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="text-3xl font-bold text-gray-600 ">
            Bienvenida, Dra. Rubi Ramos
          </p>
          <div className="text-sm text-gray-500 mt-1">
            Hoy es {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Citas hoy */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Citas Hoy</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{statsData.todayAppointments}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <FaCalendarCheck className="text-blue-500 text-xl" />
              </div>
            </div>
            <div className="mt-4 text-sm text-green-600 font-medium">
              ↑ 2 más que ayer
            </div>
          </div>

          {/* Citas semanales */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Esta Semana</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{statsData.weeklyAppointments}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <FaUsers className="text-green-500 text-xl" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Promedio: 8.4/día
            </div>
          </div>

          {/* Pacientes mensuales */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pacientes Mes</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{statsData.monthlyPatients}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <FaUserInjured className="text-purple-500 text-xl" />
              </div>
            </div>
            <div className="mt-4 text-sm text-green-600 font-medium">
              ↑ 12% vs mes anterior
            </div>
          </div>

          {/* Tasa de completación */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Completación</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{statsData.completionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <FaChartLine className="text-orange-500 text-xl" />
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              Meta: 95%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Próxima cita */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <FaClock className="text-blue-500" />
                Próxima Cita
              </h2>
              
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border-2 border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{nextAppointment.patientName}</h3>
                    <p className="text-gray-600">{nextAppointment.type}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{nextAppointment.time}</div>
                    <div className="text-sm text-gray-500">{nextAppointment.duration}</div>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-6">
                  <button className="flex-1 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors">
                    Ver Historial
                  </button>
                  <button className="flex-1 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors">
                    Iniciar Consulta
                  </button>
                </div>
              </div>

              {/* Citas de hoy */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Citas de Hoy</h3>
                <div className="space-y-3">
                  {['9:00 AM - Juan Hernández', '11:15 AM - Sofía Ramírez', '2:00 PM - Miguel Torres', '4:30 PM - Adriana López'].map((appointment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">{appointment}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        index === 0 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {index === 0 ? 'En curso' : 'Próxima'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Gráfica simple de citas semanales */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaChartLine className="text-green-500" />
                Citas Esta Semana
              </h3>
              <div className="space-y-2">
                {weeklyStats.map((day) => (
                  <div key={day.day} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 w-8">{day.day}</span>
                    <div className="flex-1 mx-3">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-blue-400 rounded-full h-3 transition-all duration-300"
                        style={{ width: `${(day.appointments / 15) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 w-8 text-right">
                      {day.appointments}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pacientes recientes */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaStethoscope className="text-purple-500" />
                Pacientes Recientes
              </h3>
              <div className="space-y-3">
                {recentPatients.map((patient, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">{patient.name}</p>
                      <p className="text-xs text-gray-500">{patient.lastVisit}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      patient.status === 'Completado' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {patient.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}