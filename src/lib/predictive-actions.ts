'use server';

import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, {
  ssl: 'require',
});

const WEIGHT_API_URL =
  process.env.WEIGHT_ML_API_URL?.trim() ||
  'https://rubi-ramos-weight-api.vercel.app';

const API_TIMEOUT_MS = 20_000;

interface WeightHistoryItem {
  evaluationId: number;
  date: string;
  weight: number;
  bodyFat: number | null;
  visceralFat: number | null;
  muscle: number | null;
  totalWater: number | null;
  waist: number | null;
  height: number | null;
}

interface WeightPredictionResponse {
  current_weight: number;
  predicted_weight_change: number;
  predicted_next_weight: number;
  tendency: string;
  interpretation: string;
  estimated_average_error_kg: number | null;
  model_name: string;
  features_used: string[];
  warning: string;
}

interface PredictionApiError {
  detail?: string;
  message?: string;
}

function toNullableNumber(value: unknown): number | null {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return null;
  }

  const numericValue = Number(value);

  return Number.isFinite(numericValue)
    ? numericValue
    : null;
}

/**
 * Convierte la estatura a centímetros.
 *
 * Ejemplos:
 * 1.60 -> 160 cm
 * 160  -> 160 cm
 */
function normalizeHeightToCentimeters(
  height: number | null,
): number | null {
  if (
    height === null ||
    height <= 0
  ) {
    return null;
  }

  if (
    height >= 1 &&
    height <= 3
  ) {
    return height * 100;
  }

  if (
    height > 3 &&
    height <= 300
  ) {
    return height;
  }

  return null;
}

function calculateDaysBetween(
  previousDate: string,
  currentDate: string,
): number {
  const previous = new Date(previousDate);
  const current = new Date(currentDate);

  const millisecondsPerDay =
    1000 * 60 * 60 * 24;

  const difference = Math.round(
    (
      current.getTime() -
      previous.getTime()
    ) / millisecondsPerDay,
  );

  return Math.max(
    difference,
    1,
  );
}

function buildPatientName(
  patient: Record<string, unknown>,
): string {
  return [
    patient.first_name,
    patient.second_name,
    patient.first_lastname,
    patient.second_lastname,
  ]
    .filter(Boolean)
    .join(' ')
    .trim()
    .replace(/\s+/g, ' ');
}

async function requestWeightPrediction(
  input: {
    current_weight: number;
    previous_weight_change: number;
    days_since_previous: number;
    body_fat_percentage: number;
    muscle_percentage: number;
    total_water_percentage: number;
  },
): Promise<WeightPredictionResponse> {
  const controller =
    new AbortController();

  const timeout = setTimeout(
    () => controller.abort(),
    API_TIMEOUT_MS,
  );

  try {
    const baseUrl =
      WEIGHT_API_URL.replace(
        /\/+$/,
        '',
      );

    const response = await fetch(
      `${baseUrl}/predict`,
      {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/json',
          Accept:
            'application/json',
        },
        body: JSON.stringify(input),
        cache: 'no-store',
        signal: controller.signal,
      },
    );

    const responseBody =
      await response.json() as
        WeightPredictionResponse |
        PredictionApiError;

    if (!response.ok) {
      const apiError =
        responseBody as PredictionApiError;

      throw new Error(
        apiError.detail ||
        apiError.message ||
        `La API respondió con código ${response.status}`,
      );
    }

    return responseBody as
      WeightPredictionResponse;
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === 'AbortError'
    ) {
      throw new Error(
        'La API de predicción tardó demasiado en responder.',
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Obtiene el historial antropométrico del paciente.
 */
export async function getPatientWeightData(
  patientId: number,
) {
  try {
    if (
      !Number.isInteger(patientId) ||
      patientId <= 0
    ) {
      throw new Error(
        'El identificador del paciente no es válido.',
      );
    }

    const weightRows = await sql`
      SELECT
        ce.id AS evaluation_id,
        ce.evaluation_date,

        ant.weight,
        ant.height,
        ant.body_fat_percentage,
        ant.visceral_fat_percentage,
        ant.muscle_percentage,
        ant.total_water_percentage,
        ant.waist_circumference

      FROM tblclinical_evaluations ce

      INNER JOIN tblanthropometric ant
        ON ant.evaluation_id = ce.id

      WHERE ce.patient_id = ${patientId}
        AND ce.evaluation_date IS NOT NULL
        AND ant.weight IS NOT NULL

      ORDER BY
        ce.evaluation_date ASC,
        ce.id ASC
    `;

    const [patient] = await sql`
      SELECT
        p.*,
        u.email,
        u.username

      FROM tblpatients p

      INNER JOIN tblusers u
        ON u.id = p.user_id

      WHERE p.id = ${patientId}

      LIMIT 1
    `;

    if (!patient) {
      throw new Error(
        'No se encontró al paciente solicitado.',
      );
    }

    const weightHistory: WeightHistoryItem[] =
      weightRows.map((row) => {
        const evaluationDate =
          new Date(
            row.evaluation_date,
          );

        return {
          evaluationId:
            Number(
              row.evaluation_id,
            ),

          date:
            evaluationDate.toISOString(),

          weight:
            Number(
              row.weight,
            ),

          bodyFat:
            toNullableNumber(
              row.body_fat_percentage,
            ),

          visceralFat:
            toNullableNumber(
              row.visceral_fat_percentage,
            ),

          muscle:
            toNullableNumber(
              row.muscle_percentage,
            ),

          totalWater:
            toNullableNumber(
              row.total_water_percentage,
            ),

          waist:
            toNullableNumber(
              row.waist_circumference,
            ),

          height:
            toNullableNumber(
              row.height,
            ),
        };
      });

    const latestHeightRecord =
      [...weightHistory]
        .reverse()
        .find(
          (record) =>
            record.height !== null,
        );

    const heightFromEvaluation =
      latestHeightRecord?.height ??
      null;

    const heightFromPatient =
      toNullableNumber(
        patient.height,
      );

    const heightCentimeters =
      normalizeHeightToCentimeters(
        heightFromEvaluation ??
        heightFromPatient,
      );

    return {
      initialWeight:
        weightHistory[0]?.weight ??
        null,

      initialDate:
        weightHistory[0]?.date ??
        null,

      weightHistory,

      patient: {
        id:
          Number(
            patient.id,
          ),

        nombre_completo:
          buildPatientName(
            patient,
          ),

        height:
          heightCentimeters,

        email:
          patient.email
            ? String(
                patient.email,
              )
            : null,

        username:
          patient.username
            ? String(
                patient.username,
              )
            : null,
      },
    };
  } catch (error) {
    console.error(
      'Error al obtener datos de peso:',
      error,
    );

    throw new Error(
      error instanceof Error
        ? error.message
        : 'No se pudieron obtener los datos del paciente.',
    );
  }
}

/**
 * Calcula la predicción del peso para la siguiente evaluación
 * mediante el modelo de bosque aleatorio.
 */
export async function calculatePredictiveModel(
  patientId: number,
) {
  try {
    const data =
      await getPatientWeightData(
        patientId,
      );

    if (
      data.weightHistory.length < 2
    ) {
      return {
        success: false,
        message:
          'Se necesitan al menos 2 registros de peso para realizar la predicción.',
        data: null,
      };
    }

    const history =
      data.weightHistory;

    const previousRecord =
      history[
        history.length - 2
      ];

    const currentRecord =
      history[
        history.length - 1
      ];

    const missingMeasurements: string[] =
      [];

    if (
      currentRecord.bodyFat === null
    ) {
      missingMeasurements.push(
        'porcentaje de grasa corporal',
      );
    }

    if (
      currentRecord.muscle === null
    ) {
      missingMeasurements.push(
        'porcentaje de músculo',
      );
    }

    if (
      currentRecord.totalWater === null
    ) {
      missingMeasurements.push(
        'porcentaje de agua corporal',
      );
    }

    if (
      missingMeasurements.length > 0
    ) {
      return {
        success: false,
        message:
          `La evaluación más reciente debe incluir: ${missingMeasurements.join(', ')}.`,
        data: null,
      };
    }

    const previousWeightChange =
      currentRecord.weight -
      previousRecord.weight;

    const daysSincePrevious =
      calculateDaysBetween(
        previousRecord.date,
        currentRecord.date,
      );

    const predictionInput = {
      current_weight:
        currentRecord.weight,

      previous_weight_change:
        previousWeightChange,

      days_since_previous:
        daysSincePrevious,

      body_fat_percentage:
        currentRecord.bodyFat as number,

      muscle_percentage:
        currentRecord.muscle as number,

      total_water_percentage:
        currentRecord.totalWater as number,
    };

    const prediction =
      await requestWeightPrediction(
        predictionInput,
      );

    const initialWeight =
      history[0].weight;

    const currentWeight =
      currentRecord.weight;

    const heightCentimeters =
      data.patient.height;

    let bmi: number | null =
      null;

    let idealWeight: number | null =
      null;

    if (
      heightCentimeters &&
      heightCentimeters > 0
    ) {
      const heightMeters =
        heightCentimeters / 100;

      bmi =
        currentWeight /
        Math.pow(
          heightMeters,
          2,
        );

      idealWeight =
        22 *
        Math.pow(
          heightMeters,
          2,
        );
    }

    return {
      success: true,
      message:
        'Predicción realizada correctamente.',

      data: {
        patient:
          data.patient,

        weightHistory:
          history,

        statistics: {
          initialWeight,
          currentWeight,

          weightChange:
            currentWeight -
            initialWeight,

          bmi:
            bmi !== null
              ? Number(
                  bmi.toFixed(1),
                )
              : null,

          idealWeight:
            idealWeight !== null
              ? Number(
                  idealWeight.toFixed(1),
                )
              : null,

          height:
            heightCentimeters,
        },

        latestEvaluation: {
          evaluationId:
            currentRecord.evaluationId,

          date:
            currentRecord.date,

          weight:
            currentRecord.weight,

          bodyFat:
            currentRecord.bodyFat,

          muscle:
            currentRecord.muscle,

          totalWater:
            currentRecord.totalWater,
        },

        previousEvaluation: {
          evaluationId:
            previousRecord.evaluationId,

          date:
            previousRecord.date,

          weight:
            previousRecord.weight,
        },

        predictionInput,

        prediction: {
          currentWeight:
            prediction.current_weight,

          predictedWeightChange:
            prediction.predicted_weight_change,

          predictedNextWeight:
            prediction.predicted_next_weight,

          tendency:
            prediction.tendency,

          interpretation:
            prediction.interpretation,

          estimatedAverageErrorKg:
            prediction.estimated_average_error_kg,

          modelName:
            prediction.model_name,

          featuresUsed:
            prediction.features_used,

          warning:
            prediction.warning,
        },
      },
    };
  } catch (error) {
    console.error(
      'Error al realizar la predicción de peso:',
      error,
    );

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'No se pudo realizar la predicción de peso.',
      data: null,
    };
  }
}