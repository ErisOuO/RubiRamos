"use server";

import postgres from "postgres";

const sql = postgres(
  process.env.POSTGRES_URL!,
  {
    ssl: "require",
  },
);

const ML_API_URL = (
  process.env.ML_API_URL ||
  "http://127.0.0.1:8000"
).replace(/\/+$/, "");

export interface AttendancePrediction {
  no_show_probability: number;
  attendance_probability: number;
  no_show_percentage: number;
  attendance_percentage: number;
  risk_level: "Bajo" | "Medio" | "Alto";
  predicted_no_show: number;
  prediction: string;
}

interface PredictionResult {
  success: boolean;
  message: string;
  prediction?: AttendancePrediction;
}

function numberValue(value: unknown): number {
  const convertedValue = Number(value);

  return Number.isFinite(convertedValue)
    ? convertedValue
    : 0;
}

/**
 * Obtiene la información de una cita y consulta
 * el modelo de Machine Learning.
 */
export async function predictAppointmentAttendance(
  appointmentId: number,
): Promise<PredictionResult> {
  try {
    if (
      !Number.isInteger(appointmentId) ||
      appointmentId <= 0
    ) {
      return {
        success: false,
        message:
          "El identificador de la cita no es válido.",
      };
    }

    const [appointment] = await sql`
      SELECT
        a.id,
        a.patient_id,
        a.status,

        p.age,

        CASE
          WHEN p.gender = 'F' THEN 1
          ELSE 0
        END AS gender_female,

        CASE
          WHEN a.deposit_paid = true THEN 1
          ELSE 0
        END AS deposit_paid,

        COALESCE(
          a.deposit_amount,
          0
        )::float8 AS deposit_amount,

        EXTRACT(
          ISODOW FROM a.appointment_date
        )::integer AS day_of_week,

        EXTRACT(
          HOUR FROM a.start_time
        )::integer AS appointment_hour,

        CASE
          WHEN EXTRACT(
            ISODOW FROM a.appointment_date
          )::integer = 6
            THEN 1
          ELSE 0
        END AS is_saturday,

        COUNT(previous.id) FILTER (
          WHERE previous.status = 'completed'
        )::integer AS previous_completed,

        COUNT(previous.id) FILTER (
          WHERE previous.status = 'no_show'
        )::integer AS previous_no_show,

        COUNT(previous.id) FILTER (
          WHERE previous.status = 'cancelled'
        )::integer AS previous_cancelled

      FROM tblappointments a

      JOIN tblpatients p
        ON p.id = a.patient_id

      LEFT JOIN tblappointments previous
        ON previous.patient_id = a.patient_id
        AND (
          previous.appointment_date <
            a.appointment_date
          OR (
            previous.appointment_date =
              a.appointment_date
            AND previous.start_time <
              a.start_time
          )
        )

      WHERE a.id = ${appointmentId}

      GROUP BY
        a.id,
        a.patient_id,
        a.status,
        a.appointment_date,
        a.start_time,
        a.deposit_paid,
        a.deposit_amount,
        p.age,
        p.gender

      LIMIT 1
    `;

    if (!appointment) {
      return {
        success: false,
        message: "No se encontró la cita.",
      };
    }

    const previousCompleted = numberValue(
      appointment.previous_completed,
    );

    const previousNoShow = numberValue(
      appointment.previous_no_show,
    );

    const previousCancelled = numberValue(
      appointment.previous_cancelled,
    );

    const previousAppointments =
      previousCompleted +
      previousNoShow +
      previousCancelled;

    const attendanceHistory =
      previousCompleted + previousNoShow;

    const previousAttendanceRate =
      attendanceHistory > 0
        ? previousCompleted / attendanceHistory
        : 0;

    const requestBody = {
      age: numberValue(appointment.age),

      gender_female: numberValue(
        appointment.gender_female,
      ),

      deposit_paid: numberValue(
        appointment.deposit_paid,
      ),

      deposit_amount: numberValue(
        appointment.deposit_amount,
      ),

      day_of_week: numberValue(
        appointment.day_of_week,
      ),

      appointment_hour: numberValue(
        appointment.appointment_hour,
      ),

      is_saturday: numberValue(
        appointment.is_saturday,
      ),

      previous_completed: previousCompleted,
      previous_no_show: previousNoShow,
      previous_cancelled: previousCancelled,
      previous_appointments: previousAppointments,

      previous_attendance_rate:
        previousAttendanceRate,
    };
    
    console.log(
      "Variables enviadas al modelo:",
      requestBody,
    );
    const controller = new AbortController();

    const timeout = setTimeout(
      () => controller.abort(),
      10000,
    );

    let response: Response;

    try {
      response = await fetch(
        `${ML_API_URL}/predict`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(requestBody),

          cache: "no-store",

          signal: controller.signal,
        },
      );
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        "Respuesta incorrecta de la API ML:",
        response.status,
        errorText,
      );

      return {
        success: false,
        message:
          "La API de predicción no pudo procesar la cita.",
      };
    }

    const prediction =
      (await response.json()) as AttendancePrediction;

    return {
      success: true,
      message:
        "La predicción se generó correctamente.",
      prediction,
    };
  } catch (error) {
    console.error(
      "Error al predecir la asistencia:",
      error,
    );

    const isConnectionError =
      error instanceof Error &&
      (
        error.name === "AbortError" ||
        error.message.includes("fetch failed")
      );

    return {
      success: false,

      message: isConnectionError
        ? "No se pudo conectar con la API de Machine Learning. Verifica que FastAPI esté funcionando en el puerto 8000."
        : "No se pudo generar la predicción de asistencia.",
    };
  }
}