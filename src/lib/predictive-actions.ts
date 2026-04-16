'use server';

import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Obtener datos de peso del paciente para el modelo predictivo
export async function getPatientWeightData(patientId: number) {
  try {
    // Obtener peso inicial (primera evaluación de seguimiento)
    const [initialWeight] = await sql`
      SELECT 
        ce.evaluation_date,
        ant.weight
      FROM tblclinical_evaluations ce
      JOIN tblanthropometric ant ON ce.id = ant.evaluation_id
      WHERE ce.patient_id = ${patientId} 
        AND ce.evaluation_type = 'followup'
        AND ant.weight IS NOT NULL
      ORDER BY ce.evaluation_date ASC
      LIMIT 1
    `;

    // Obtener todos los pesos registrados (ordenados de más antiguo a más reciente)
    const weightHistory = await sql`
      SELECT 
        ce.evaluation_date,
        ant.weight,
        ant.body_fat_percentage,
        ant.visceral_fat_percentage,
        ant.muscle_percentage,
        ant.waist_circumference
      FROM tblclinical_evaluations ce
      JOIN tblanthropometric ant ON ce.id = ant.evaluation_id
      WHERE ce.patient_id = ${patientId} 
        AND ce.evaluation_type = 'followup'
        AND ant.weight IS NOT NULL
      ORDER BY ce.evaluation_date ASC
    `;

    // Obtener la estatura de la evaluación más reciente del paciente
    const [latestHeight] = await sql`
      SELECT 
        ant.height
      FROM tblclinical_evaluations ce
      JOIN tblanthropometric ant ON ce.id = ant.evaluation_id
      WHERE ce.patient_id = ${patientId} 
        AND ce.evaluation_type = 'followup'
        AND ant.height IS NOT NULL
      ORDER BY ce.evaluation_date DESC
      LIMIT 1
    `;

    // Obtener datos del paciente
    const [patient] = await sql`
      SELECT p.*, u.email, u.username
      FROM tblpatients p
      JOIN tblusers u ON p.user_id = u.id
      WHERE p.id = ${patientId}
    `;

    // Usar la estatura de la última evaluación si existe, si no usar la del registro del paciente
    const height = latestHeight?.height || patient.height;

    return {
      initialWeight: initialWeight?.weight ? Number(initialWeight.weight) : null,
      initialDate: initialWeight?.evaluation_date || null,
      weightHistory: weightHistory.map(w => ({
        date: w.evaluation_date,
        weight: Number(w.weight),
        bodyFat: w.body_fat_percentage ? Number(w.body_fat_percentage) : null,
        visceralFat: w.visceral_fat_percentage ? Number(w.visceral_fat_percentage) : null,
        muscle: w.muscle_percentage ? Number(w.muscle_percentage) : null,
        waist: w.waist_circumference ? Number(w.waist_circumference) : null
      })),
      patient: {
        id: patient.id,
        nombre_completo: `${patient.first_name} ${patient.second_name || ''} ${patient.first_lastname} ${patient.second_lastname || ''}`.trim().replace(/\s+/g, ' '),
        height: height ? Number(height) : null,
        email: patient.email,
        username: patient.username
      }
    };
  } catch (error) {
    console.error('Error al obtener datos de peso:', error);
    throw new Error('No se pudieron obtener los datos del paciente');
  }
}

// Calcular modelo predictivo
export async function calculatePredictiveModel(patientId: number) {
  try {
    const data = await getPatientWeightData(patientId);
    
    if (!data.initialWeight || data.weightHistory.length < 2) {
      return {
        success: false,
        message: 'Se necesitan al menos 2 registros de peso para realizar la predicción',
        data: null
      };
    }

    const weights = data.weightHistory.map(w => w.weight);
    const dates = data.weightHistory.map(w => new Date(w.date));
    
    // Calcular IMC si tenemos estatura
    let bmi = null;
    let idealWeight = null;
    let currentBmi = null;
    
    if (data.patient.height) {
      const heightInMeters = data.patient.height / 100;
      currentBmi = data.weightHistory[data.weightHistory.length - 1].weight / (heightInMeters * heightInMeters);
      bmi = currentBmi;
      
      // Peso ideal con IMC de 22
      idealWeight = 22 * (heightInMeters * heightInMeters);
    }
    
    // Calcular constantes k para cada intervalo
    const kValues = [];
    for (let i = 1; i < weights.length; i++) {
      const previousWeight = weights[i - 1];
      const currentWeight = weights[i];
      const monthsDiff = getMonthsDifference(dates[i - 1], dates[i]);
      
      if (monthsDiff > 0 && previousWeight > 0) {
        const k = Math.log(currentWeight / previousWeight) / monthsDiff;
        kValues.push(k);
      }
    }
    
    // Promedio de k (tasa de decremento promedio)
    const avgK = kValues.reduce((sum, k) => sum + k, 0) / kValues.length;
    
    // Calcular tendencia (último k vs promedio)
    const lastK = kValues[kValues.length - 1] || avgK;
    const trend = lastK < avgK ? 'desacelerando' : lastK > avgK ? 'acelerando' : 'constante';
    
    return {
      success: true,
      data: {
        patient: data.patient,
        weightHistory: data.weightHistory,
        statistics: {
          initialWeight: weights[0],
          currentWeight: weights[weights.length - 1],
          averageK: avgK,
          trend,
          bmi: bmi ? bmi.toFixed(1) : null,
          idealWeight: idealWeight ? idealWeight.toFixed(1) : null,
          height: data.patient.height
        }
      }
    };
  } catch (error) {
    console.error('Error al calcular modelo predictivo:', error);
    throw new Error('No se pudo calcular el modelo predictivo');
  }
}

// Función auxiliar para calcular diferencia en meses
function getMonthsDifference(date1: Date, date2: Date): number {
  const months = (date2.getFullYear() - date1.getFullYear()) * 12;
  return months + (date2.getMonth() - date1.getMonth());
}