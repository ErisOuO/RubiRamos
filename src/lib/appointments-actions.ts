'use server';

import postgres from 'postgres';
import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Obtener configuración del calendario (global)
export async function getCalendarSettings() {
  try {
    const [settings] = await sql`
      SELECT * FROM tblcalendar_settings LIMIT 1
    `;
    return settings;
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    // Valores por defecto
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

// Obtener citas para un rango de fechas (para contar por día)
export async function getAppointmentsByDateRange(startDate: Date, endDate: Date) {
  try {
    const appointments = await sql`
      SELECT appointment_date, COUNT(*) as total
      FROM tblappointments
      WHERE appointment_date BETWEEN ${startDate} AND ${endDate}
        AND status NOT IN ('cancelled', 'no_show')
      GROUP BY appointment_date
    `;
    return appointments;
  } catch (error) {
    console.error('Error al obtener citas:', error);
    return [];
  }
}

// Obtener citas de un día específico con datos del paciente
export async function getAppointmentsByDay(date: Date) {
  try {
    const dateStr = date.toISOString().split('T')[0];
    console.log('Buscando citas para:', dateStr);
    
    const appointments = await sql`
      SELECT 
        a.*,
        a.id as appointment_id,
        p.id as patient_id,
        p.first_name,
        p.second_name,
        p.first_lastname,
        p.second_lastname,
        p.phone,
        p.age,
        p.gender,
        u.email
      FROM tblappointments a
      JOIN tblpatients p ON a.patient_id = p.id
      JOIN tblusers u ON p.user_id = u.id
      WHERE a.appointment_date = ${dateStr}
        AND a.status NOT IN ('cancelled', 'no_show')
      ORDER BY a.start_time
    `;
    
    console.log('Citas encontradas:', appointments.length);
    
    return appointments.map(app => ({
      id: app.appointment_id,
      patient_id: app.patient_id,
      appointment_date: app.appointment_date,
      start_time: app.start_time,
      end_time: app.end_time,
      status: app.status,
      deposit_paid: app.deposit_paid,
      deposit_amount: app.deposit_amount,
      notes: app.notes,
      first_name: app.first_name,
      second_name: app.second_name,
      first_lastname: app.first_lastname,
      second_lastname: app.second_lastname,
      phone: app.phone,
      email: app.email,
      nombre_completo: `${app.first_name} ${app.second_name || ''} ${app.first_lastname} ${app.second_lastname || ''}`.trim().replace(/\s+/g, ' ')
    }));
  } catch (error) {
    console.error('Error al obtener citas del día:', error);
    return [];
  }
}

// Buscar pacientes por nombre completo (búsqueda por cualquier parte)
export async function searchPatients(query: string) {
  try {
    const searchTerm = `%${query.trim()}%`;
    const patients = await sql`
      SELECT p.*, u.email
      FROM tblpatients p
      JOIN tblusers u ON p.user_id = u.id
      WHERE u.active = true AND p.active = true
        AND (
          p.first_name ILIKE ${searchTerm} OR
          p.second_name ILIKE ${searchTerm} OR
          p.first_lastname ILIKE ${searchTerm} OR
          p.second_lastname ILIKE ${searchTerm} OR
          CONCAT(p.first_name, ' ', p.first_lastname) ILIKE ${searchTerm} OR
          CONCAT(p.first_name, ' ', p.second_name, ' ', p.first_lastname, ' ', p.second_lastname) ILIKE ${searchTerm}
        )
      ORDER BY p.first_name, p.first_lastname
      LIMIT 20
    `;
    return patients;
  } catch (error) {
    console.error('Error al buscar pacientes:', error);
    return [];
  }
}

// Crear nuevo usuario (rol paciente) y paciente asociado
export async function createPatientAndUser(data: {
  username: string;
  email: string;
  first_name: string;
  second_name?: string | null;
  first_lastname: string;
  second_lastname?: string | null;
  age: number;
  gender?: string | null;
  phone?: string | null;
  notes?: string | null;
}) {
  try {
    // Verificar si el email ya existe
    const existingUser = await sql`SELECT id FROM tblusers WHERE email = ${data.email}`;
    if (existingUser.length > 0) {
      throw new Error('El correo electrónico ya está registrado');
    }

    // Generar username si no viene (usamos email)
    const username = data.username || data.email.split('@')[0];

    // Crear usuario con rol_id=2 (paciente), password_hash = 'x' para que tenga que recuperar
    const [newUser] = await sql`
      INSERT INTO tblusers (rol_id, username, email, password_hash, verified, active)
      VALUES (2, ${username}, ${data.email}, 'x', false, true)
      RETURNING id
    `;

    // Crear paciente
    const [newPatient] = await sql`
      INSERT INTO tblpatients (
        user_id, first_name, second_name, first_lastname, second_lastname,
        age, gender, phone, notes, active
      ) VALUES (
        ${newUser.id}, ${data.first_name}, ${data.second_name || null},
        ${data.first_lastname}, ${data.second_lastname || null},
        ${data.age}, ${data.gender || null}, ${data.phone || null},
        ${data.notes || null}, true
      )
      RETURNING id
    `;

    return { success: true, patientId: newPatient.id, userId: newUser.id };
  } catch (error) {
    console.error('Error al crear paciente y usuario:', error);
    throw new Error(error instanceof Error ? error.message : 'Error al crear paciente');
  }
}

// Crear cita
export async function createAppointment(data: {
  patientId: number;
  appointmentDate: Date;
  startTime: string;
  endTime: string;
  depositPaid: boolean;
  depositAmount: number;
  notes?: string;
}) {
  try {
    await sql`
      INSERT INTO tblappointments (
        patient_id, appointment_date, start_time, end_time,
        deposit_paid, deposit_amount, notes, status
      ) VALUES (
        ${data.patientId}, ${data.appointmentDate}, ${data.startTime},
        ${data.endTime}, ${data.depositPaid}, ${data.depositAmount},
        ${data.notes || null}, 'scheduled'
      )
    `;
    revalidatePath('/calendar');
    return { success: true };
  } catch (error) {
    console.error('Error al crear cita:', error);
    throw new Error('No se pudo crear la cita. Es posible que el horario ya esté ocupado.');
  }
}

// Obtener todos los horarios disponibles para un día específico
export async function getAvailableSlots(date: Date) {
  try {
    const settings = await getCalendarSettings();
    const dateStr = date.toISOString().split('T')[0];
    
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

    const slots = [];
    for (let t = startMin; t < endMin; t += slotDuration) {
      if (t >= lunchStartMin && t < lunchEndMin) continue;
      const hour = Math.floor(t / 60);
      const minute = t % 60;
      const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
      slots.push(timeStr);
    }

    // Obtener slots ocupados
    const booked = await sql`
      SELECT start_time FROM tblappointments
      WHERE appointment_date = ${dateStr} AND status NOT IN ('cancelled', 'no_show')
    `;
    const bookedSet = new Set(booked.map(b => b.start_time));

    // Obtener horas deshabilitadas de la excepción
    let disabledHoursSet = new Set<string>();
    if (ex?.disabled_hours) {
      let disabledHours = ex.disabled_hours;
      if (typeof disabledHours === 'string') {
        disabledHours = JSON.parse(disabledHours);
      }
      if (Array.isArray(disabledHours)) {
        disabledHours.forEach((hour: string) => disabledHoursSet.add(hour));
      }
    }

    const available = slots.filter(slot => !bookedSet.has(slot) && !disabledHoursSet.has(slot));
    return available;
  } catch (error) {
    console.error('Error al obtener horarios disponibles:', error);
    return [];
  }
}

// Obtener total de citas de la semana actual (lunes a domingo)
export async function getWeeklyAppointmentsCount(referenceDate: Date = new Date()) {
  try {
    // Obtener domingo de la semana (inicio de semana)
    const date = new Date(referenceDate);
    const day = date.getDay(); // 0 = domingo, 1 = lunes, etc.
    // Ajustar para que la semana comience el domingo (day 0)
    const sunday = new Date(date);
    sunday.setDate(date.getDate() - day);
    sunday.setHours(0, 0, 0, 0);
    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);
    saturday.setHours(23, 59, 59, 999);

    const result = await sql`
      SELECT COUNT(*) as total FROM tblappointments
      WHERE appointment_date BETWEEN ${sunday} AND ${saturday}
        AND status NOT IN ('cancelled', 'no_show')
    `;
    return Number(result[0]?.total || 0);
  } catch (error) {
    console.error('Error al obtener citas semanales:', error);
    return 0;
  }
}

export async function getTodayAppointments() {
  try {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const appointments = await sql`
      SELECT 
        a.*,
        a.id as appointment_id,
        p.id as patient_id,
        p.first_name,
        p.second_name,
        p.first_lastname,
        p.second_lastname,
        p.phone,
        u.email
      FROM tblappointments a
      JOIN tblpatients p ON a.patient_id = p.id
      JOIN tblusers u ON p.user_id = u.id
      WHERE a.appointment_date = ${todayStr}
        AND a.status NOT IN ('cancelled', 'no_show')
      ORDER BY a.start_time
    `;
    
    console.log('Citas de hoy encontradas:', appointments.length);
    
    return appointments.map(app => ({
      id: app.appointment_id,
      patient_id: app.patient_id,
      appointment_date: app.appointment_date,
      start_time: app.start_time,
      end_time: app.end_time,
      status: app.status,
      deposit_paid: app.deposit_paid,
      deposit_amount: app.deposit_amount,
      notes: app.notes,
      first_name: app.first_name,
      second_name: app.second_name,
      first_lastname: app.first_lastname,
      second_lastname: app.second_lastname,
      phone: app.phone,
      email: app.email,
      nombre_completo: `${app.first_name} ${app.second_name || ''} ${app.first_lastname} ${app.second_lastname || ''}`.trim().replace(/\s+/g, ' ')
    }));
  } catch (error) {
    console.error('Error al obtener citas de hoy:', error);
    return [];
  }
}

// Guardar configuración general
export async function saveGeneralSettings(data: {
  startTime: string;
  endTime: string;
  lunchStart: string;
  lunchEnd: string;
  depositAmount: number;
}) {
  try {
    // Actualizar la configuración general (solo hay una fila)
    await sql`
      UPDATE tblcalendar_settings
      SET 
        start_time = ${data.startTime},
        end_time = ${data.endTime},
        lunch_start = ${data.lunchStart},
        lunch_end = ${data.lunchEnd},
        deposit_amount = ${data.depositAmount},
        updated_at = NOW()
      WHERE id = 1
    `;
    
    revalidatePath('/calendar');
    return { success: true };
  } catch (error) {
    console.error('Error al guardar configuración general:', error);
    throw new Error('No se pudo guardar la configuración general');
  }
}

// Guardar excepción por día
export async function saveDayException(data: {
  date: Date;
  startTime: string;
  endTime: string;
  lunchStart: string;
  lunchEnd: string;
  isWorkingDay: boolean;
  disabledHours: string[];
}) {
  try {
    const dateStr = data.date.toISOString().split('T')[0];
    
    // Primero eliminar cualquier excepción existente para esta fecha
    await sql`
      DELETE FROM tblcalendar_exceptions 
      WHERE exception_date = ${dateStr}
    `;
    
    // Si es día laborable y no tiene configuraciones especiales, no crear excepción
    // Solo crear excepción si no es día laborable o tiene configuraciones diferentes a las generales
    const settings = await getCalendarSettings();
    
    const isDefaultConfig = 
      data.isWorkingDay === true &&
      data.startTime === settings.start_time.slice(0, 5) &&
      data.endTime === settings.end_time.slice(0, 5) &&
      data.lunchStart === settings.lunch_start.slice(0, 5) &&
      data.lunchEnd === settings.lunch_end.slice(0, 5) &&
      data.disabledHours.length === 0;
    
    if (isDefaultConfig) {
      // Si es configuración por defecto, no guardar excepción
      revalidatePath('/calendar');
      return { success: true };
    }
    
    // Insertar nueva excepción
    await sql`
      INSERT INTO tblcalendar_exceptions (
        exception_date,
        is_working_day,
        start_time,
        end_time,
        lunch_start,
        lunch_end,
        disabled_hours
      ) VALUES (
        ${dateStr},
        ${data.isWorkingDay},
        ${data.startTime},
        ${data.endTime},
        ${data.lunchStart},
        ${data.lunchEnd},
        ${JSON.stringify(data.disabledHours)}::jsonb
      )
    `;
    
    revalidatePath('/calendar');
    return { success: true };
  } catch (error) {
    console.error('Error al guardar excepción del día:', error);
    throw new Error('No se pudo guardar la configuración del día');
  }
}

// Función para eliminar excepción y restaurar configuración general
export async function restoreDefaultDayConfig(date: Date) {
  try {
    const dateStr = date.toISOString().split('T')[0];
    await sql`
      DELETE FROM tblcalendar_exceptions 
      WHERE exception_date = ${dateStr}
    `;
    revalidatePath('/calendar');
    return { success: true };
  } catch (error) {
    console.error('Error al restaurar configuración del día:', error);
    throw new Error('No se pudo restaurar la configuración del día');
  }
}

// Eliminar excepción por día (restaurar configuración general)
export async function deleteDayException(date: Date) {
  try {
    await sql`
      DELETE FROM tblcalendar_exceptions
      WHERE exception_date = ${date}
    `;
    
    revalidatePath('/calendar');
    return { success: true };
  } catch (error) {
    console.error('Error al eliminar excepción del día:', error);
    throw new Error('No se pudo eliminar la configuración del día');
  }
}

// Obtiene las citas pendientes 
export async function getPendingAppointmentsCount() {
  try {
    const result = await sql`
      SELECT COUNT(*) as total FROM tblappointments
      WHERE appointment_date >= NOW()::date
        AND status = 'scheduled'
    `;
    return Number(result[0]?.total || 0);
  } catch (error) {
    console.error('Error al obtener citas pendientes:', error);
    return 0;
  }
}