'use server';

import postgres from 'postgres';
import { revalidatePath } from 'next/cache';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Obtener configuración del calendario
export async function getCalendarSettings() {
  try {
    const [settings] = await sql`
      SELECT * FROM tblcalendar_settings LIMIT 1
    `;
    return settings;
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    return {
      start_time: '08:00:00',
      end_time: '18:00:00',
      lunch_start: '12:00:00',
      lunch_end: '13:00:00',
      slot_duration: 30,
      deposit_amount: 100
    };
  }
}

// Obtener excepciones para un rango de fechas
export async function getExceptions(startDate: Date, endDate: Date) {
  try {
    const exceptions = await sql`
      SELECT * FROM tblcalendar_exceptions
      WHERE exception_date BETWEEN ${startDate} AND ${endDate}
    `;
    return exceptions;
  } catch (error) {
    console.error('Error al obtener excepciones:', error);
    return [];
  }
}

// Obtener citas del paciente por rango de fechas
export async function getPatientAppointmentsByDateRange(patientId: number, startDate: Date, endDate: Date) {
  try {
    const appointments = await sql`
      SELECT appointment_date, COUNT(*) as total, array_agg(start_time) as times
      FROM tblappointments
      WHERE patient_id = ${patientId}
        AND appointment_date BETWEEN ${startDate} AND ${endDate}
        AND status NOT IN ('cancelled', 'no_show')
      GROUP BY appointment_date
    `;
    return appointments;
  } catch (error) {
    console.error('Error al obtener citas del paciente:', error);
    return [];
  }
}

// Obtener todas las citas del paciente (próximas)
export async function getPatientUpcomingAppointments(patientId: number) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];
    
    const appointments = await sql`
      SELECT 
        a.*,
        a.id as appointment_id
      FROM tblappointments a
      WHERE a.patient_id = ${patientId}
        AND a.appointment_date >= ${todayStr}
        AND a.status NOT IN ('cancelled', 'no_show')
      ORDER BY a.appointment_date ASC, a.start_time ASC
    `;
    
    return appointments.map(app => ({
      id: app.appointment_id,
      appointment_date: app.appointment_date,
      start_time: app.start_time,
      end_time: app.end_time,
      status: app.status,
      deposit_paid: app.deposit_paid,
      deposit_amount: app.deposit_amount,
      notes: app.notes
    }));
  } catch (error) {
    console.error('Error al obtener citas del paciente:', error);
    return [];
  }
}

// Obtener horarios disponibles para un día específico
export async function getAvailableSlotsForPatient(date: Date, patientId: number) {
  try {
    const settings = await getCalendarSettings();
    const dateStr = date.toISOString().split('T')[0];
    
    // Verificar excepción del día
    const exception = await sql`
      SELECT * FROM tblcalendar_exceptions WHERE exception_date = ${dateStr}
    `;
    const isException = exception.length > 0;
    const ex = exception[0];

    if (isException && ex.is_working_day === false) {
      return [];
    }

    let start = ex?.start_time || settings.start_time;
    let end = ex?.end_time || settings.end_time;
    let lunchStart = ex?.lunch_start || settings.lunch_start;
    let lunchEnd = ex?.lunch_end || settings.lunch_end;
    const slotDuration = settings.slot_duration;

    const toMinutes = (time: string) => {
      const [h, m] = time.split(':').map(Number);
      return h * 60 + m;
    };
    
    let startMin = toMinutes(start);
    let endMin = toMinutes(end);
    let lunchStartMin = toMinutes(lunchStart);
    let lunchEndMin = toMinutes(lunchEnd);

    // Generar slots
    const slots = [];
    for (let t = startMin; t < endMin; t += slotDuration) {
      if (t >= lunchStartMin && t < lunchEndMin) continue;
      const hour = Math.floor(t / 60);
      const minute = t % 60;
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
      slots.push(timeStr);
    }

    // Obtener slots ocupados por otras citas
    const booked = await sql`
      SELECT start_time FROM tblappointments
      WHERE appointment_date = ${dateStr} 
        AND status NOT IN ('cancelled', 'no_show')
    `;
    const bookedSet = new Set(booked.map(b => b.start_time));

    // Obtener horas deshabilitadas
    let disabledHoursSet = new Set<string>();
    if (ex?.disabled_hours) {
      let disabledHours = ex.disabled_hours;
      if (typeof disabledHours === 'string') {
        disabledHours = JSON.parse(disabledHours);
      }
      if (Array.isArray(disabledHours)) {
        disabledHours.forEach((hour: string) => disabledHoursSet.add(hour + ':00'));
      }
    }

    const available = slots.filter(slot => !bookedSet.has(slot) && !disabledHoursSet.has(slot));
    return available;
  } catch (error) {
    console.error('Error al obtener horarios disponibles:', error);
    return [];
  }
}

// Crear cita para paciente
export async function createPatientAppointment(data: {
  patientId: number;
  appointmentDate: Date;
  startTime: string;
  endTime: string;
  depositPaid: boolean;
  depositAmount: number;
  notes?: string;
}) {
  try {
    // Verificar que el horario no esté ocupado
    const dateStr = data.appointmentDate.toISOString().split('T')[0];
    const existing = await sql`
      SELECT id FROM tblappointments
      WHERE appointment_date = ${dateStr}
        AND start_time = ${data.startTime}
        AND status NOT IN ('cancelled', 'no_show')
    `;
    
    if (existing.length > 0) {
      throw new Error('Este horario ya no está disponible');
    }

    // Calcular end_time (30 minutos después)
    const [hour, minute] = data.startTime.split(':').map(Number);
    const endDate = new Date();
    endDate.setHours(hour, minute + 30, 0);
    const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}:00`;

    await sql`
      INSERT INTO tblappointments (
        patient_id, appointment_date, start_time, end_time,
        deposit_paid, deposit_amount, notes, status
      ) VALUES (
        ${data.patientId}, ${dateStr}, ${data.startTime},
        ${endTime}, ${data.depositPaid}, ${data.depositAmount},
        ${data.notes || null}, 'scheduled'
      )
    `;
    
    revalidatePath('/patient/calendar');
    return { success: true };
  } catch (error) {
    console.error('Error al crear cita:', error);
    throw new Error(error instanceof Error ? error.message : 'No se pudo crear la cita');
  }
}

// Cancelar cita
export async function cancelAppointment(appointmentId: number, patientId: number) {
  try {
    const result = await sql`
      UPDATE tblappointments
      SET status = 'cancelled'
      WHERE id = ${appointmentId} AND patient_id = ${patientId}
      RETURNING id
    `;
    
    if (result.length === 0) {
      throw new Error('Cita no encontrada o no pertenece al paciente');
    }
    
    revalidatePath('/patient/calendar');
    return { success: true };
  } catch (error) {
    console.error('Error al cancelar cita:', error);
    throw new Error('No se pudo cancelar la cita');
  }
}

// Editar cita (cambiar fecha/hora)
export async function rescheduleAppointment(
  appointmentId: number, 
  patientId: number, 
  newDate: Date, 
  newStartTime: string
) {
  try {
    const dateStr = newDate.toISOString().split('T')[0];
    
    // Verificar que el nuevo horario esté disponible
    const existing = await sql`
      SELECT id FROM tblappointments
      WHERE appointment_date = ${dateStr}
        AND start_time = ${newStartTime}
        AND status NOT IN ('cancelled', 'no_show')
        AND id != ${appointmentId}
    `;
    
    if (existing.length > 0) {
      throw new Error('El nuevo horario no está disponible');
    }

    // Calcular end_time
    const [hour, minute] = newStartTime.split(':').map(Number);
    const endDate = new Date();
    endDate.setHours(hour, minute + 30, 0);
    const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}:00`;

    const result = await sql`
      UPDATE tblappointments
      SET appointment_date = ${dateStr},
          start_time = ${newStartTime},
          end_time = ${endTime},
          status = 'scheduled'
      WHERE id = ${appointmentId} AND patient_id = ${patientId}
      RETURNING id
    `;
    
    if (result.length === 0) {
      throw new Error('Cita no encontrada o no pertenece al paciente');
    }
    
    revalidatePath('/patient/calendar');
    return { success: true };
  } catch (error) {
    console.error('Error al reagendar cita:', error);
    throw new Error(error instanceof Error ? error.message : 'No se pudo reagendar la cita');
  }
}

// Obtener datos del paciente por userId
export async function getPatientByUserId(userId: number) {
  try {
    const [patient] = await sql`
      SELECT p.*, u.email, u.username
      FROM tblpatients p
      JOIN tblusers u ON p.user_id = u.id
      WHERE p.user_id = ${userId} AND p.active = true
    `;
    return patient;
  } catch (error) {
    console.error('Error al obtener paciente:', error);
    return null;
  }
}