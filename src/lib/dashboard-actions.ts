'use server';

import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function getDashboardStats() {
  try {
    // Fechas en formato YYYY-MM-DD para comparación correcta
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const startOfWeek = new Date(today);
    const day = today.getDay();
    const diff = day === 0 ? 6 : day - 1;
    startOfWeek.setDate(today.getDate() - diff);
    const startOfWeekStr = startOfWeek.toISOString().split('T')[0];
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    const endOfWeekStr = endOfWeek.toISOString().split('T')[0];
    
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfMonthStr = startOfMonth.toISOString().split('T')[0];
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const endOfMonthStr = endOfMonth.toISOString().split('T')[0];
    
    console.log('Buscando citas para hoy:', todayStr);
    
    // Citas de hoy (scheduled o completed, no cancelled/no_show)
    const [todayAppointments] = await sql`
      SELECT COUNT(*) as count FROM tblappointments
      WHERE appointment_date = ${todayStr}
        AND status NOT IN ('cancelled', 'no_show')
    `;
    console.log('Citas de hoy encontradas:', todayAppointments.count);
    
    // Citas de la semana
    const [weeklyAppointments] = await sql`
      SELECT COUNT(*) as count FROM tblappointments
      WHERE appointment_date >= ${startOfWeekStr}
        AND appointment_date <= ${endOfWeekStr}
        AND status NOT IN ('cancelled', 'no_show')
    `;
    console.log('Citas de la semana encontradas:', weeklyAppointments.count);
    
    // Pacientes activos totales
    const [totalPatients] = await sql`
      SELECT COUNT(*) as count FROM tblpatients WHERE active = true
    `;
    
    // Nuevos pacientes este mes
    const [newPatientsMonth] = await sql`
      SELECT COUNT(*) as count FROM tblpatients
      WHERE created_at >= ${startOfMonthStr}
        AND created_at <= ${endOfMonthStr}
    `;
    
    // Tasa de completación (citas completadas en los últimos 30 días vs total de citas programadas)
    const [completionRate] = await sql`
      SELECT 
        ROUND(
          COUNT(CASE WHEN status = 'completed' THEN 1 END)::decimal / 
          NULLIF(COUNT(CASE WHEN status IN ('scheduled', 'completed') THEN 1 END), 0) * 100, 
          1
        ) as rate
      FROM tblappointments
      WHERE created_at >= NOW() - INTERVAL '30 days'
    `;
    
    // Próxima cita
    const [nextAppointment] = await sql`
      SELECT a.*, 
             p.first_name, p.second_name, p.first_lastname, p.second_lastname
      FROM tblappointments a
      JOIN tblpatients p ON a.patient_id = p.id
      WHERE a.appointment_date >= ${todayStr}
        AND a.status = 'scheduled'
      ORDER BY a.appointment_date, a.start_time
      LIMIT 1
    `;
    
    // Citas de hoy con detalles
    const todayAppointmentsList = await sql`
      SELECT a.*, 
             p.first_name, p.second_name, p.first_lastname, p.second_lastname,
             p.phone, u.email
      FROM tblappointments a
      JOIN tblpatients p ON a.patient_id = p.id
      JOIN tblusers u ON p.user_id = u.id
      WHERE a.appointment_date = ${todayStr}
        AND a.status NOT IN ('cancelled', 'no_show')
      ORDER BY a.start_time
    `;
    
    // Pacientes recientes
    const recentPatients = await sql`
      SELECT p.*, u.email
      FROM tblpatients p
      JOIN tblusers u ON p.user_id = u.id
      WHERE p.active = true
      ORDER BY p.created_at DESC
      LIMIT 5
    `;
    
    // Estadísticas semanales para gráfico (por día)
    const weeklyStats = await sql`
      SELECT 
        EXTRACT(DOW FROM appointment_date) as day_of_week,
        COUNT(*) as count
      FROM tblappointments
      WHERE appointment_date >= ${startOfWeekStr}
        AND appointment_date <= ${endOfWeekStr}
        AND status NOT IN ('cancelled', 'no_show')
      GROUP BY EXTRACT(DOW FROM appointment_date)
    `;
    
    // Mapeo de días (DOW: 0=domingo, 1=lunes, etc.)
    const daysMap: { [key: number]: string } = {
      1: 'Lun', 2: 'Mar', 3: 'Mié', 4: 'Jue', 5: 'Vie', 6: 'Sáb', 0: 'Dom'
    };
    
    const weeklyStatsFormatted = weeklyStats.map(stat => ({
      day: daysMap[stat.day_of_week],
      appointments: Number(stat.count)
    }));
    
    // Completar días sin citas
    const allDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    const finalWeeklyStats = allDays.map(day => {
      const found = weeklyStatsFormatted.find(s => s.day === day);
      return { day, appointments: found ? found.appointments : 0 };
    });
    
    // Obtener la hora actual para determinar estado de citas
    const currentHour = today.getHours();
    const currentMinute = today.getMinutes();
    const currentTimeMinutes = currentHour * 60 + currentMinute;
    
    return {
      todayAppointments: Number(todayAppointments.count),
      weeklyAppointments: Number(weeklyAppointments.count),
      totalPatients: Number(totalPatients.count),
      newPatientsMonth: Number(newPatientsMonth.count),
      completionRate: Number(completionRate?.rate || 0),
      nextAppointment: nextAppointment ? {
        id: nextAppointment.id,
        patientName: `${nextAppointment.first_name} ${nextAppointment.second_name || ''} ${nextAppointment.first_lastname} ${nextAppointment.second_lastname || ''}`.trim().replace(/\s+/g, ' '),
        time: nextAppointment.start_time.slice(0, 5),
        type: nextAppointment.notes || 'Consulta nutricional',
        duration: '30 min'
      } : null,
      todayAppointmentsList: todayAppointmentsList.map(app => {
        const [hour, minute] = app.start_time.split(':').map(Number);
        const appointmentTimeMinutes = hour * 60 + minute;
        const isCompleted = appointmentTimeMinutes < currentTimeMinutes;
        
        return {
          id: app.id,
          time: app.start_time.slice(0, 5),
          patientName: `${app.first_name} ${app.first_lastname}`,
          status: isCompleted ? 'completado' : 'pendiente'
        };
      }),
      recentPatients: recentPatients.map(patient => ({
        id: patient.id,
        name: `${patient.first_name} ${patient.first_lastname}`,
        lastVisit: patient.updated_at ? new Date(patient.updated_at).toLocaleDateString('es-ES') : 'Sin visitas',
        status: 'Activo'
      })),
      weeklyStats: finalWeeklyStats
    };
  } catch (error) {
    console.error('Error al obtener estadísticas del dashboard:', error);
    return {
      todayAppointments: 0,
      weeklyAppointments: 0,
      totalPatients: 0,
      newPatientsMonth: 0,
      completionRate: 0,
      nextAppointment: null,
      todayAppointmentsList: [],
      recentPatients: [],
      weeklyStats: [
        { day: 'Lun', appointments: 0 },
        { day: 'Mar', appointments: 0 },
        { day: 'Mié', appointments: 0 },
        { day: 'Jue', appointments: 0 },
        { day: 'Vie', appointments: 0 },
        { day: 'Sáb', appointments: 0 },
        { day: 'Dom', appointments: 0 }
      ]
    };
  }
}