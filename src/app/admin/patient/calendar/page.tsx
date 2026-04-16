'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { getCalendarSettings, getPatientUpcomingAppointments, getPatientByUserId, getExceptions, getPatientAppointmentsByDateRange } from '@/lib/patient-appointments-actions';
import PatientAppointmentModal from '@/components/patient/PatientAppointmentModal';
import PatientAppointmentActionsModal from '@/components/patient/PatientAppointmentActionsModal';
import { toast } from 'react-hot-toast';

interface DayInfo {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  hasAppointment: boolean;
  isException?: boolean;
  isWorkingDay?: boolean;
}

interface Appointment {
  id: number;
  appointment_date: string;
  start_time: string;
  end_time: string;
  deposit_paid: boolean;
  deposit_amount: number;
  notes?: string;
}

export default function PatientCalendarPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<DayInfo[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [depositAmount, setDepositAmount] = useState(100);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionsModalOpen, setActionsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [patientId, setPatientId] = useState<number | null>(null);
  const [exceptionsMap, setExceptionsMap] = useState<Map<string, any>>(new Map());

  // Verificar autenticación y rol
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      // Verificar que sea paciente (rol_id = 2)
      if (session?.user?.rol_id !== 2) {
        toast.error('Acceso no autorizado');
        router.push('/dashboard');
      } else {
        loadPatientData();
      }
    }
  }, [status, session, router]);

  const loadPatientData = async () => {
    try {
      const patient = await getPatientByUserId(Number(session!.user.id));
      if (patient) {
        setPatientId(patient.id);
      } else {
        toast.error('No se encontró información del paciente');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error al cargar datos del paciente:', error);
      toast.error('Error al cargar datos');
    }
  };

  const changeMonth = (increment: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  const loadMonthData = useCallback(async () => {
    if (!patientId) return;
    
    setLoading(true);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay());
    const endDate = new Date(lastDayOfMonth);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    try {
      // Obtener configuración general
      const settings = await getCalendarSettings();
      setDepositAmount(settings.deposit_amount);

      // Obtener citas del paciente y excepciones
      const [appointments, exceptions] = await Promise.all([
        getPatientAppointmentsByDateRange(patientId, startDate, endDate),
        getExceptions(startDate, endDate)
      ]);

      const appointmentsMap = new Map();
      appointments.forEach((app: any) => {
        appointmentsMap.set(app.appointment_date.toISOString().split('T')[0], true);
      });

      const exceptionsMapTemp = new Map();
      exceptions.forEach((ex: any) => {
        exceptionsMapTemp.set(ex.exception_date.toISOString().split('T')[0], ex);
      });
      setExceptionsMap(exceptionsMapTemp);

      // Obtener citas próximas del paciente
      const upcoming = await getPatientUpcomingAppointments(patientId);
      setUpcomingAppointments(upcoming);

      const days: DayInfo[] = [];
      let current = new Date(startDate);
      while (current <= endDate) {
        const dateStr = current.toISOString().split('T')[0];
        const exception = exceptionsMapTemp.get(dateStr);
        days.push({
          date: new Date(current),
          dayOfMonth: current.getDate(),
          isCurrentMonth: current.getMonth() === month,
          hasAppointment: appointmentsMap.get(dateStr) || false,
          isException: !!exception,
          isWorkingDay: exception ? exception.is_working_day : true
        });
        current.setDate(current.getDate() + 1);
      }
      setCalendarDays(days);
    } catch (error) {
      console.error('Error al cargar datos del mes:', error);
      toast.error('Error al cargar los datos del calendario');
    } finally {
      setLoading(false);
    }
  }, [currentDate, patientId]);

  useEffect(() => {
    if (patientId) {
      loadMonthData();
    }
  }, [loadMonthData, patientId]);

  const handleDayClick = (day: DayInfo) => {
    if (!day.isWorkingDay || day.date.getDay() === 0) {
      toast.error('No hay atención este día');
      return;
    }
    setSelectedDay(day.date);
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setActionsModalOpen(true);
  };

  const getDayColorClass = (day: DayInfo) => {
    if (!day.isWorkingDay) return 'bg-gray-300 border-gray-400 cursor-not-allowed';
    if (day.date.getDay() === 0) return 'bg-gray-300 border-gray-400 cursor-not-allowed';
    if (day.hasAppointment) return 'bg-[#BD7D4A]/20 border-[#BD7D4A]';
    return 'bg-white border-[#E6E3DE] hover:bg-[#FAF9F7]';
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  if (loading || !patientId) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] p-6 flex items-center justify-center">
        <div className="text-[#6E7C72]">Cargando calendario...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F7] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#5A8C7A]">Mis Citas</h1>
          <p className="text-[#6E7C72] mt-1">Agenda, reprograma o cancela tus citas fácilmente</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendario */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-[#E6E3DE] p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#5A8C7A]">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
              <div className="flex gap-2">
                <button onClick={() => changeMonth(-1)} className="px-3 py-1 border border-[#E6E3DE] rounded-lg hover:bg-[#FAF9F7]">←</button>
                <button onClick={() => changeMonth(1)} className="px-3 py-1 border border-[#E6E3DE] rounded-lg hover:bg-[#FAF9F7]">→</button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                <div key={day} className="text-center text-sm font-semibold text-[#6E7C72] py-2">{day}</div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDayClick(day)}
                  disabled={!day.isWorkingDay || day.date.getDay() === 0}
                  className={`p-3 rounded-xl border-2 transition-all text-center min-h-20 ${getDayColorClass(day)} ${
                    day.isCurrentMonth ? '' : 'opacity-50'
                  } ${selectedDay?.toDateString() === day.date.toDateString() ? 'ring-2 ring-[#5A8C7A] ring-offset-2' : ''} ${
                    isToday(day.date) ? 'ring-2 ring-[#F58634] ring-offset-2' : ''
                  }`}
                >
                  <div className={`font-bold ${!day.isWorkingDay || day.date.getDay() === 0 ? 'text-gray-500' : 'text-[#2C3E34]'}`}>
                    {day.dayOfMonth}
                  </div>
                  {day.hasAppointment && (
                    <div className="text-xs mt-1 text-[#BD7D4A] font-semibold">✓ Cita</div>
                  )}
                  {day.isWorkingDay === false && (
                    <div className="text-xs mt-1 text-gray-500">No laborable</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Panel lateral - Próximas citas */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-[#E6E3DE] p-6 sticky top-4">
              <h3 className="text-lg font-bold text-[#5A8C7A] mb-4">Mis Próximas Citas</h3>
              
              <button
                onClick={() => setModalOpen(true)}
                disabled={!selectedDay}
                className="w-full py-2 bg-[#BD7D4A] text-white rounded-lg hover:bg-[#F58634] transition-colors text-sm font-semibold mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Agendar nueva cita {selectedDay ? `(${selectedDay.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })})` : ''}
              </button>

              {!selectedDay && (
                <p className="text-xs text-[#6E7C72] text-center mb-4">Selecciona un día en el calendario para agendar</p>
              )}

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {upcomingAppointments.length === 0 ? (
                  <p className="text-center text-[#6E7C72] py-4">No tienes citas próximas</p>
                ) : (
                  upcomingAppointments.map(app => (
                    <div
                      key={app.id}
                      onClick={() => handleAppointmentClick(app)}
                      className="p-4 rounded-lg border border-[#E6E3DE] bg-white hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-lg font-bold text-[#6B8E7B]">{app.start_time.slice(0, 5)}</span>
                        <span className="text-xs text-[#6E7C72]">- {app.end_time.slice(0, 5)}</span>
                      </div>
                      
                      <div className="mb-2">
                        <div className="text-sm text-[#2C3E34]">
                          {new Date(app.appointment_date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </div>
                      </div>
                      
                      <div className="mb-2">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${app.deposit_paid ? 'bg-[#A8CF45]/20 text-[#2C3E34]' : 'bg-[#F58634]/20 text-[#2C3E34]'}`}>
                          {app.deposit_paid ? `✓ Anticipo pagado ($${app.deposit_amount})` : `⚠ Anticipo pendiente ($${app.deposit_amount})`}
                        </span>
                      </div>
                      
                      <div className="text-xs text-[#6E7C72] mt-2 pt-2 border-t border-[#E6E3DE]">
                        Click para gestionar
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <PatientAppointmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={loadMonthData}
        selectedDate={selectedDay}
        patientId={patientId}
        depositAmount={depositAmount}
      />

      <PatientAppointmentActionsModal
        isOpen={actionsModalOpen}
        onClose={() => {
          setActionsModalOpen(false);
          setSelectedAppointment(null);
        }}
        onSuccess={loadMonthData}
        appointment={selectedAppointment}
        patientId={patientId}
      />
    </div>
  );
}