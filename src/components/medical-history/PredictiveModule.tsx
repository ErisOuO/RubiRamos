'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  Activity,
  AlertTriangle,
  BrainCircuit,
  ChevronDown,
  ChevronUp,
  Droplets,
  Dumbbell,
  RefreshCw,
  Scale,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

import { toast } from 'react-hot-toast';

import {
  calculatePredictiveModel,
} from '@/lib/predictive-actions';


interface PredictiveModuleProps {
  patientId: number;
}


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


interface PatientData {
  id: number;
  nombre_completo: string;
  height: number | null;
  email: string | null;
  username: string | null;
}


interface PredictionStatistics {
  initialWeight: number;
  currentWeight: number;
  weightChange: number;
  bmi: number | null;
  idealWeight: number | null;
  height: number | null;
}


interface EvaluationData {
  evaluationId: number;
  date: string;
  weight: number;
  bodyFat?: number | null;
  muscle?: number | null;
  totalWater?: number | null;
}


interface PredictionInput {
  current_weight: number;
  previous_weight_change: number;
  days_since_previous: number;
  body_fat_percentage: number;
  muscle_percentage: number;
  total_water_percentage: number;
}


interface WeightPrediction {
  currentWeight: number;
  predictedWeightChange: number;
  predictedNextWeight: number;
  tendency: string;
  interpretation: string;
  estimatedAverageErrorKg: number | null;
  modelName: string;
  featuresUsed: string[];
  warning: string;
}


interface PredictiveModelData {
  patient: PatientData;
  weightHistory: WeightHistoryItem[];
  statistics: PredictionStatistics;

  latestEvaluation: EvaluationData;

  previousEvaluation: {
    evaluationId: number;
    date: string;
    weight: number;
  };

  predictionInput: PredictionInput;
  prediction: WeightPrediction;
}


const FEATURE_LABELS: Record<string, string> = {
  current_weight:
    'Peso actual',

  previous_weight_change:
    'Cambio de peso anterior',

  days_since_previous:
    'Días desde la evaluación anterior',

  body_fat_percentage:
    'Porcentaje de grasa corporal',

  muscle_percentage:
    'Porcentaje de músculo',

  total_water_percentage:
    'Porcentaje de agua corporal',
};


function formatDate(
  date: string | Date,
): string {
  return new Date(
    date,
  ).toLocaleDateString(
    'es-MX',
    {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    },
  );
}


function formatWeight(
  weight: number,
  decimals = 1,
): string {
  return `${weight.toFixed(decimals)} kg`;
}


function formatPercentage(
  value: number | null | undefined,
): string {
  if (
    value === null ||
    value === undefined
  ) {
    return '—';
  }

  return `${value.toFixed(1)}%`;
}


function getBmiCategory(
  bmi: number | null,
): {
  label: string;
  className: string;
} {
  if (bmi === null) {
    return {
      label: 'No disponible',
      className:
        'text-gray-500',
    };
  }

  if (bmi < 18.5) {
    return {
      label: 'Bajo peso',
      className:
        'text-blue-600',
    };
  }

  if (bmi < 25) {
    return {
      label: 'Peso saludable',
      className:
        'text-[#5A8C7A]',
    };
  }

  if (bmi < 30) {
    return {
      label: 'Sobrepeso',
      className:
        'text-[#BD7D4A]',
    };
  }

  if (bmi < 35) {
    return {
      label: 'Obesidad grado I',
      className:
        'text-orange-600',
    };
  }

  if (bmi < 40) {
    return {
      label: 'Obesidad grado II',
      className:
        'text-red-600',
    };
  }

  return {
    label: 'Obesidad grado III',
    className:
      'text-red-700',
  };
}


function getProgressStatus(
  progress: number,
  weightLost: number,
): string {
  if (progress >= 75) {
    return 'Muy cerca de la meta';
  }

  if (progress >= 50) {
    return 'Buen progreso';
  }

  if (progress >= 25) {
    return 'Progreso moderado';
  }

  if (progress > 0) {
    return 'Iniciando el proceso';
  }

  if (weightLost < 0) {
    return 'Aumento de peso detectado';
  }

  return 'Sin cambios significativos';
}


function getTendencyConfiguration(
  tendency: string,
) {
  const normalizedTendency =
    tendency.toLowerCase();

  if (
    normalizedTendency ===
    'disminucion'
  ) {
    return {
      label:
        'Disminución estimada',

      icon:
        TrendingDown,

      cardClass:
        'border-emerald-200 bg-emerald-50',

      iconClass:
        'bg-emerald-100 text-emerald-700',

      valueClass:
        'text-emerald-700',
    };
  }

  if (
    normalizedTendency ===
    'aumento'
  ) {
    return {
      label:
        'Aumento estimado',

      icon:
        TrendingUp,

      cardClass:
        'border-orange-200 bg-orange-50',

      iconClass:
        'bg-orange-100 text-orange-700',

      valueClass:
        'text-orange-700',
    };
  }

  return {
    label:
      'Mantenimiento estimado',

    icon:
      Activity,

    cardClass:
      'border-blue-200 bg-blue-50',

    iconClass:
      'bg-blue-100 text-blue-700',

    valueClass:
      'text-blue-700',
  };
}


export default function PredictiveModule({
  patientId,
}: PredictiveModuleProps) {
  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    modelData,
    setModelData,
  ] = useState<PredictiveModelData | null>(
    null,
  );

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(
    null,
  );

  const [
    showDetails,
    setShowDetails,
  ] = useState(false);


  const loadPredictiveModel =
    useCallback(
      async () => {
        setLoading(true);
        setErrorMessage(null);

        try {
          const result =
            await calculatePredictiveModel(
              patientId,
            );

          if (
            !result.success ||
            !result.data
          ) {
            const message =
              result.message ||
              'No hay suficientes datos para realizar la predicción.';

            setModelData(null);
            setErrorMessage(message);

            return;
          }

          setModelData(
            result.data as PredictiveModelData,
          );
        } catch (error) {
          console.error(
            'Error al cargar el modelo predictivo:',
            error,
          );

          const message =
            error instanceof Error
              ? error.message
              : 'No se pudo cargar el modelo predictivo.';

          setModelData(null);
          setErrorMessage(message);

          toast.error(message);
        } finally {
          setLoading(false);
        }
      },
      [
        patientId,
      ],
    );


  useEffect(
    () => {
      void loadPredictiveModel();
    },
    [
      loadPredictiveModel,
    ],
  );


  if (loading) {
    return (
      <div
        className="
          flex min-h-[340px]
          items-center justify-center
          rounded-xl border
          border-[#E6E1DC]
          bg-white
        "
      >
        <div
          className="
            flex flex-col
            items-center gap-4
            text-center
          "
        >
          <div
            className="
              flex h-14 w-14
              items-center justify-center
              rounded-full
              bg-[#EEF5F2]
            "
          >
            <RefreshCw
              className="
                h-7 w-7
                animate-spin
                text-[#5A8C7A]
              "
            />
          </div>

          <div>
            <p
              className="
                font-semibold
                text-[#20433B]
              "
            >
              Generando predicción
            </p>

            <p
              className="
                mt-1 text-sm
                text-gray-500
              "
            >
              Analizando el historial
              antropométrico del paciente.
            </p>
          </div>
        </div>
      </div>
    );
  }


  if (
    !modelData
  ) {
    return (
      <div
        className="
          rounded-xl border
          border-amber-200
          bg-amber-50
          px-6 py-8
        "
      >
        <div
          className="
            flex flex-col
            items-center
            text-center
          "
        >
          <div
            className="
              mb-4 flex
              h-14 w-14
              items-center justify-center
              rounded-full
              bg-amber-100
            "
          >
            <AlertTriangle
              className="
                h-7 w-7
                text-amber-700
              "
            />
          </div>

          <h3
            className="
              text-lg font-semibold
              text-amber-900
            "
          >
            Predicción no disponible
          </h3>

          <p
            className="
              mt-2 max-w-xl
              text-sm
              text-amber-800
            "
          >
            {
              errorMessage ||
              'Se necesitan al menos dos evaluaciones completas para realizar la predicción.'
            }
          </p>

          <button
            type="button"
            onClick={
              () => {
                void loadPredictiveModel();
              }
            }
            className="
              mt-5 inline-flex
              items-center gap-2
              rounded-lg
              bg-amber-700
              px-4 py-2
              text-sm font-semibold
              text-white
              transition-colors
              hover:bg-amber-800
            "
          >
            <RefreshCw
              className="h-4 w-4"
            />

            Intentar nuevamente
          </button>
        </div>
      </div>
    );
  }


  const {
    patient,
    weightHistory,
    statistics,
    latestEvaluation,
    previousEvaluation,
    predictionInput,
    prediction,
  } = modelData;


  const sortedWeightHistory =
    [
      ...weightHistory,
    ].sort(
      (
        firstRecord,
        secondRecord,
      ) =>
        new Date(
          firstRecord.date,
        ).getTime() -
        new Date(
          secondRecord.date,
        ).getTime(),
    );


  const initialWeight =
    statistics.initialWeight;

  const currentWeight =
    statistics.currentWeight;

  const idealWeight =
    statistics.idealWeight;

  const currentBmi =
    statistics.bmi;

  const weightLost =
    initialWeight -
    currentWeight;


  const totalWeightToLose =
    idealWeight !== null
      ? initialWeight -
        idealWeight
      : null;


  const progressPercentage =
    totalWeightToLose !== null &&
    totalWeightToLose > 0 &&
    weightLost > 0
      ? Math.min(
          Math.max(
            (
              weightLost /
              totalWeightToLose
            ) * 100,
            0,
          ),
          100,
        )
      : 0;


  const progressStatus =
    getProgressStatus(
      progressPercentage,
      weightLost,
    );


  const bmiCategory =
    getBmiCategory(
      currentBmi,
    );


  const tendencyConfiguration =
    getTendencyConfiguration(
      prediction.tendency,
    );


  const TendencyIcon =
    tendencyConfiguration.icon;


  const predictedDifference =
    prediction.predictedNextWeight -
    prediction.currentWeight;


  return (
    <div
      className="
        space-y-6
      "
    >
      {/* Resumen del progreso */}
      <section
        className="
          rounded-xl
          bg-[#5A8C7A]
          p-6
          text-white
          shadow-sm
        "
      >
        <h3
          className="
            mb-5 text-lg
            font-semibold
          "
        >
          Resumen del progreso
        </h3>

        <div
          className="
            grid grid-cols-1
            gap-5
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          <div>
            <p
              className="
                text-sm
                text-white/85
              "
            >
              Peso inicial
            </p>

            <p
              className="
                mt-1 text-2xl
                font-bold
              "
            >
              {
                formatWeight(
                  initialWeight,
                )
              }
            </p>
          </div>

          <div>
            <p
              className="
                text-sm
                text-white/85
              "
            >
              Peso actual
            </p>

            <p
              className="
                mt-1 text-2xl
                font-bold
              "
            >
              {
                formatWeight(
                  currentWeight,
                )
              }
            </p>
          </div>

          <div>
            <p
              className="
                text-sm
                text-white/85
              "
            >
              {
                weightLost >= 0
                  ? 'Peso perdido'
                  : 'Peso aumentado'
              }
            </p>

            <p
              className={`
                mt-1 text-2xl
                font-bold
                ${
                  weightLost >= 0
                    ? 'text-[#C5E85B]'
                    : 'text-orange-200'
                }
              `}
            >
              {
                formatWeight(
                  Math.abs(
                    weightLost,
                  ),
                )
              }
            </p>
          </div>

          <div>
            <p
              className="
                text-sm
                text-white/85
              "
            >
              Peso objetivo
            </p>

            <p
              className="
                mt-1 text-2xl
                font-bold
              "
            >
              {
                idealWeight !== null
                  ? formatWeight(
                      idealWeight,
                    )
                  : 'No disponible'
              }
            </p>
          </div>
        </div>
      </section>


      {/* Progreso hacia la meta */}
      <section
        className="
          rounded-xl border
          border-[#E6E1DC]
          bg-white
          p-6
          shadow-sm
        "
      >
        <div
          className="
            mb-3 flex
            items-center
            justify-between
            gap-4
          "
        >
          <h3
            className="
              font-semibold
              text-[#183B33]
            "
          >
            Progreso hacia la meta
          </h3>

          <span
            className="
              text-sm font-bold
              text-[#5A8C7A]
            "
          >
            {
              progressPercentage.toFixed(
                1,
              )
            }%
          </span>
        </div>

        <div
          className="
            h-3 overflow-hidden
            rounded-full
            bg-[#E5E3E0]
          "
        >
          <div
            className="
              h-full rounded-full
              bg-[#5A8C7A]
              transition-all
              duration-500
            "
            style={{
              width:
                `${progressPercentage}%`,
            }}
          />
        </div>

        <p
          className="
            mt-3 text-sm
            text-[#52736B]
          "
        >
          {progressStatus}
        </p>
      </section>


      {/* IMC y predicción ML */}
      <div
        className="
          grid grid-cols-1
          gap-6
          lg:grid-cols-2
        "
      >
        {/* IMC */}
        <section
          className="
            rounded-xl border
            border-[#E6E1DC]
            bg-white
            p-6
            shadow-sm
          "
        >
          <div
            className="
              mb-5 flex
              items-center gap-3
            "
          >
            <div
              className="
                flex h-11 w-11
                items-center justify-center
                rounded-full
                bg-[#EEF5F2]
              "
            >
              <Activity
                className="
                  h-5 w-5
                  text-[#5A8C7A]
                "
              />
            </div>

            <h3
              className="
                text-lg font-semibold
                text-[#3F7F70]
              "
            >
              Índice de Masa Corporal
              (IMC)
            </h3>
          </div>

          {
            currentBmi !== null &&
            statistics.height !== null
              ? (
                <>
                  <p
                    className="
                      text-3xl font-bold
                      text-[#183B33]
                    "
                  >
                    {
                      currentBmi.toFixed(
                        1,
                      )
                    }
                  </p>

                  <p
                    className={`
                      mt-1 text-sm
                      font-medium
                      ${bmiCategory.className}
                    `}
                  >
                    {bmiCategory.label}
                  </p>

                  <div
                    className="
                      mt-5 border-t
                      border-[#E6E1DC]
                      pt-4
                      text-sm
                      text-gray-600
                    "
                  >
                    <p>
                      <strong>
                        Fórmula:
                      </strong>{' '}

                      IMC = Peso /
                      (Estatura en metros)²
                    </p>

                    <p
                      className="mt-2"
                    >
                      <strong>
                        Cálculo:
                      </strong>{' '}

                      {
                        currentWeight.toFixed(
                          1,
                        )
                      }{' '}
                      / (
                      {
                        (
                          statistics.height /
                          100
                        ).toFixed(
                          2,
                        )
                      }
                      )² ={' '}
                      {
                        currentBmi.toFixed(
                          1,
                        )
                      }
                    </p>
                  </div>
                </>
              )
              : (
                <p
                  className="
                    text-sm
                    text-gray-500
                  "
                >
                  Registre una estatura
                  válida para calcular el
                  IMC.
                </p>
              )
          }
        </section>


        {/* Predicción con Machine Learning */}
        <section
          className={`
            rounded-xl border
            p-6 shadow-sm
            ${tendencyConfiguration.cardClass}
          `}
        >
          <div
            className="
              mb-5 flex
              items-start
              justify-between
              gap-4
            "
          >
            <div
              className="
                flex items-center
                gap-3
              "
            >
              <div
                className={`
                  flex h-11 w-11
                  items-center justify-center
                  rounded-full
                  ${tendencyConfiguration.iconClass}
                `}
              >
                <BrainCircuit
                  className="
                    h-6 w-6
                  "
                />
              </div>

              <div>
                <h3
                  className="
                    text-lg font-semibold
                    text-[#183B33]
                  "
                >
                  Predicción de peso
                </h3>

                <p
                  className="
                    text-xs
                    text-gray-600
                  "
                >
                  Modelo de Machine Learning
                </p>
              </div>
            </div>

            <span
              className="
                rounded-full
                bg-white/80
                px-3 py-1
                text-xs font-semibold
                text-[#52736B]
              "
            >
              Bosque aleatorio
            </span>
          </div>

          <p
            className="
              text-sm
              text-gray-600
            "
          >
            Peso estimado para la
            siguiente evaluación
          </p>

          <p
            className={`
              mt-1 text-4xl
              font-bold
              ${tendencyConfiguration.valueClass}
            `}
          >
            {
              formatWeight(
                prediction.predictedNextWeight,
                2,
              )
            }
          </p>

          <div
            className="
              mt-5 grid
              grid-cols-2 gap-3
            "
          >
            <div
              className="
                rounded-lg
                bg-white/80
                p-3
              "
            >
              <p
                className="
                  text-xs
                  text-gray-500
                "
              >
                Peso actual
              </p>

              <p
                className="
                  mt-1 font-semibold
                  text-[#183B33]
                "
              >
                {
                  formatWeight(
                    prediction.currentWeight,
                    2,
                  )
                }
              </p>
            </div>

            <div
              className="
                rounded-lg
                bg-white/80
                p-3
              "
            >
              <p
                className="
                  text-xs
                  text-gray-500
                "
              >
                Cambio estimado
              </p>

              <p
                className={`
                  mt-1 font-semibold
                  ${tendencyConfiguration.valueClass}
                `}
              >
                {
                  predictedDifference > 0
                    ? '+'
                    : ''
                }

                {
                  predictedDifference.toFixed(
                    2,
                  )
                } kg
              </p>
            </div>
          </div>

          <div
            className="
              mt-4 flex
              items-center gap-2
            "
          >
            <TendencyIcon
              className={`
                h-5 w-5
                ${tendencyConfiguration.valueClass}
              `}
            />

            <p
              className="
                text-sm font-semibold
                text-[#183B33]
              "
            >
              {
                tendencyConfiguration.label
              }
            </p>
          </div>

          <p
            className="
              mt-2 text-sm
              text-gray-700
            "
          >
            {
              prediction.interpretation
            }
          </p>

          {
            prediction.estimatedAverageErrorKg !==
            null && (
              <p
                className="
                  mt-3 text-xs
                  text-gray-500
                "
              >
                Error promedio del modelo:
                aproximadamente{' '}
                {
                  prediction
                    .estimatedAverageErrorKg
                    .toFixed(
                      2,
                    )
                } kg.
              </p>
            )
          }
        </section>
      </div>


      {/* Datos utilizados por el modelo */}
      <section
        className="
          rounded-xl border
          border-[#E6E1DC]
          bg-white
          p-6
          shadow-sm
        "
      >
        <div
          className="
            mb-5 flex
            items-center
            justify-between
            gap-4
          "
        >
          <div>
            <h3
              className="
                text-lg font-semibold
                text-[#3F7F70]
              "
            >
              Datos utilizados en la
              predicción
            </h3>

            <p
              className="
                mt-1 text-sm
                text-gray-500
              "
            >
              Información de la evaluación
              antropométrica más reciente.
            </p>
          </div>

          <span
            className="
              rounded-full
              bg-[#EEF5F2]
              px-3 py-1
              text-xs font-semibold
              text-[#5A8C7A]
            "
          >
            {
              formatDate(
                latestEvaluation.date,
              )
            }
          </span>
        </div>

        <div
          className="
            grid grid-cols-1
            gap-4
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          <div
            className="
              flex items-center
              gap-3 rounded-lg
              bg-[#FAF9F7]
              p-4
            "
          >
            <Scale
              className="
                h-5 w-5
                text-[#5A8C7A]
              "
            />

            <div>
              <p
                className="
                  text-xs
                  text-gray-500
                "
              >
                Peso actual
              </p>

              <p
                className="
                  font-semibold
                  text-[#183B33]
                "
              >
                {
                  formatWeight(
                    predictionInput.current_weight,
                    2,
                  )
                }
              </p>
            </div>
          </div>

          <div
            className="
              flex items-center
              gap-3 rounded-lg
              bg-[#FAF9F7]
              p-4
            "
          >
            <TrendingDown
              className="
                h-5 w-5
                text-[#5A8C7A]
              "
            />

            <div>
              <p
                className="
                  text-xs
                  text-gray-500
                "
              >
                Cambio anterior
              </p>

              <p
                className="
                  font-semibold
                  text-[#183B33]
                "
              >
                {
                  predictionInput
                    .previous_weight_change >
                  0
                    ? '+'
                    : ''
                }

                {
                  predictionInput
                    .previous_weight_change
                    .toFixed(
                      2,
                    )
                } kg
              </p>
            </div>
          </div>

          <div
            className="
              flex items-center
              gap-3 rounded-lg
              bg-[#FAF9F7]
              p-4
            "
          >
            <Activity
              className="
                h-5 w-5
                text-[#5A8C7A]
              "
            />

            <div>
              <p
                className="
                  text-xs
                  text-gray-500
                "
              >
                Días entre evaluaciones
              </p>

              <p
                className="
                  font-semibold
                  text-[#183B33]
                "
              >
                {
                  predictionInput
                    .days_since_previous
                } días
              </p>
            </div>
          </div>

          <div
            className="
              flex items-center
              gap-3 rounded-lg
              bg-[#FAF9F7]
              p-4
            "
          >
            <Activity
              className="
                h-5 w-5
                text-[#BD7D4A]
              "
            />

            <div>
              <p
                className="
                  text-xs
                  text-gray-500
                "
              >
                Grasa corporal
              </p>

              <p
                className="
                  font-semibold
                  text-[#183B33]
                "
              >
                {
                  formatPercentage(
                    predictionInput
                      .body_fat_percentage,
                  )
                }
              </p>
            </div>
          </div>

          <div
            className="
              flex items-center
              gap-3 rounded-lg
              bg-[#FAF9F7]
              p-4
            "
          >
            <Dumbbell
              className="
                h-5 w-5
                text-[#5A8C7A]
              "
            />

            <div>
              <p
                className="
                  text-xs
                  text-gray-500
                "
              >
                Músculo
              </p>

              <p
                className="
                  font-semibold
                  text-[#183B33]
                "
              >
                {
                  formatPercentage(
                    predictionInput
                      .muscle_percentage,
                  )
                }
              </p>
            </div>
          </div>

          <div
            className="
              flex items-center
              gap-3 rounded-lg
              bg-[#FAF9F7]
              p-4
            "
          >
            <Droplets
              className="
                h-5 w-5
                text-blue-600
              "
            />

            <div>
              <p
                className="
                  text-xs
                  text-gray-500
                "
              >
                Agua corporal
              </p>

              <p
                className="
                  font-semibold
                  text-[#183B33]
                "
              >
                {
                  formatPercentage(
                    predictionInput
                      .total_water_percentage,
                  )
                }
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Peso objetivo */}
      {
        statistics.height !== null &&
        idealWeight !== null && (
          <section
            className="
              rounded-xl border
              border-[#E6E1DC]
              bg-white
              p-6
              shadow-sm
            "
          >
            <h3
              className="
                text-lg font-semibold
                text-[#3F7F70]
              "
            >
              Determinación del peso
              objetivo
            </h3>

            <div
              className="
                mt-4 space-y-2
                text-sm
                text-gray-700
              "
            >
              <p>
                <strong>
                  Fórmula:
                </strong>{' '}

                Peso objetivo = IMC ideal ×
                (Estatura en metros)²
              </p>

              <p>
                <strong>
                  IMC ideal utilizado:
                </strong>{' '}

                22
              </p>

              <p>
                <strong>
                  Estatura:
                </strong>{' '}

                {
                  statistics.height.toFixed(
                    1,
                  )
                } cm ={' '}
                {
                  (
                    statistics.height /
                    100
                  ).toFixed(
                    2,
                  )
                } m
              </p>

              <p>
                <strong>
                  Resultado:
                </strong>{' '}

                22 × (
                {
                  (
                    statistics.height /
                    100
                  ).toFixed(
                    2,
                  )
                }
                )² ={' '}
                {
                  idealWeight.toFixed(
                    2,
                  )
                } kg
              </p>
            </div>
          </section>
        )
      }


      {/* Historial de mediciones */}
      <section
        className="
          overflow-hidden
          rounded-xl border
          border-[#E6E1DC]
          bg-white
          shadow-sm
        "
      >
        <div
          className="
            border-b
            border-[#E6E1DC]
            px-6 py-5
          "
        >
          <h3
            className="
              text-lg font-semibold
              text-[#3F7F70]
            "
          >
            Historial de mediciones
          </h3>

          <p
            className="
              mt-1 text-sm
              text-gray-500
            "
          >
            Evolución antropométrica
            utilizada como referencia.
          </p>
        </div>

        <div
          className="
            overflow-x-auto
          "
        >
          <table
            className="
              min-w-full
              divide-y
              divide-[#E6E1DC]
            "
          >
            <thead
              className="
                bg-[#FAF9F7]
              "
            >
              <tr>
                <th
                  className="
                    px-6 py-3
                    text-left
                    text-xs font-semibold
                    uppercase
                    tracking-wide
                    text-gray-500
                  "
                >
                  Fecha
                </th>

                <th
                  className="
                    px-6 py-3
                    text-left
                    text-xs font-semibold
                    uppercase
                    tracking-wide
                    text-gray-500
                  "
                >
                  Peso
                </th>

                <th
                  className="
                    px-6 py-3
                    text-left
                    text-xs font-semibold
                    uppercase
                    tracking-wide
                    text-gray-500
                  "
                >
                  Grasa
                </th>

                <th
                  className="
                    px-6 py-3
                    text-left
                    text-xs font-semibold
                    uppercase
                    tracking-wide
                    text-gray-500
                  "
                >
                  Músculo
                </th>

                <th
                  className="
                    px-6 py-3
                    text-left
                    text-xs font-semibold
                    uppercase
                    tracking-wide
                    text-gray-500
                  "
                >
                  Agua
                </th>

                <th
                  className="
                    px-6 py-3
                    text-left
                    text-xs font-semibold
                    uppercase
                    tracking-wide
                    text-gray-500
                  "
                >
                  Cintura
                </th>
              </tr>
            </thead>

            <tbody
              className="
                divide-y
                divide-[#E6E1DC]
                bg-white
              "
            >
              {
                sortedWeightHistory.map(
                  (
                    record,
                  ) => (
                    <tr
                      key={
                        record.evaluationId
                      }
                      className="
                        transition-colors
                        hover:bg-[#FAF9F7]
                      "
                    >
                      <td
                        className="
                          whitespace-nowrap
                          px-6 py-4
                          text-sm
                          text-gray-700
                        "
                      >
                        {
                          formatDate(
                            record.date,
                          )
                        }
                      </td>

                      <td
                        className="
                          whitespace-nowrap
                          px-6 py-4
                          text-sm font-semibold
                          text-[#183B33]
                        "
                      >
                        {
                          formatWeight(
                            record.weight,
                          )
                        }
                      </td>

                      <td
                        className="
                          whitespace-nowrap
                          px-6 py-4
                          text-sm
                          text-gray-600
                        "
                      >
                        {
                          formatPercentage(
                            record.bodyFat,
                          )
                        }
                      </td>

                      <td
                        className="
                          whitespace-nowrap
                          px-6 py-4
                          text-sm
                          text-gray-600
                        "
                      >
                        {
                          formatPercentage(
                            record.muscle,
                          )
                        }
                      </td>

                      <td
                        className="
                          whitespace-nowrap
                          px-6 py-4
                          text-sm
                          text-gray-600
                        "
                      >
                        {
                          formatPercentage(
                            record.totalWater,
                          )
                        }
                      </td>

                      <td
                        className="
                          whitespace-nowrap
                          px-6 py-4
                          text-sm
                          text-gray-600
                        "
                      >
                        {
                          record.waist !== null
                            ? `${record.waist.toFixed(
                                1,
                              )} cm`
                            : '—'
                        }
                      </td>
                    </tr>
                  ),
                )
              }
            </tbody>
          </table>
        </div>
      </section>


      {/* Detalles del modelo */}
      <section
        className="
          overflow-hidden
          rounded-xl border
          border-[#E6E1DC]
          bg-white
          shadow-sm
        "
      >
        <button
          type="button"
          onClick={
            () =>
              setShowDetails(
                (
                  currentValue,
                ) =>
                  !currentValue,
              )
          }
          className="
            flex w-full
            items-center
            justify-between
            gap-4
            px-6 py-4
            text-left
            transition-colors
            hover:bg-[#FAF9F7]
          "
        >
          <div
            className="
              flex items-center gap-3
            "
          >
            <BrainCircuit
              className="
                h-5 w-5
                text-[#5A8C7A]
              "
            />

            <span
              className="
                font-semibold
                text-[#183B33]
              "
            >
              Ver detalles del modelo
              predictivo
            </span>
          </div>

          {
            showDetails
              ? (
                <ChevronUp
                  className="
                    h-5 w-5
                    text-gray-500
                  "
                />
              )
              : (
                <ChevronDown
                  className="
                    h-5 w-5
                    text-gray-500
                  "
                />
              )
          }
        </button>

        {
          showDetails && (
            <div
              className="
                border-t
                border-[#E6E1DC]
                bg-[#FAF9F7]
                px-6 py-5
              "
            >
              <div
                className="
                  grid grid-cols-1
                  gap-6
                  lg:grid-cols-2
                "
              >
                <div>
                  <h4
                    className="
                      font-semibold
                      text-[#183B33]
                    "
                  >
                    Información del modelo
                  </h4>

                  <dl
                    className="
                      mt-3 space-y-3
                      text-sm
                    "
                  >
                    <div>
                      <dt
                        className="
                          text-gray-500
                        "
                      >
                        Algoritmo
                      </dt>

                      <dd
                        className="
                          font-medium
                          text-gray-800
                        "
                      >
                        Bosque aleatorio
                        para regresión
                      </dd>
                    </div>

                    <div>
                      <dt
                        className="
                          text-gray-500
                        "
                      >
                        Variable predicha
                      </dt>

                      <dd
                        className="
                          font-medium
                          text-gray-800
                        "
                      >
                        Cambio de peso en la
                        siguiente evaluación
                      </dd>
                    </div>

                    <div>
                      <dt
                        className="
                          text-gray-500
                        "
                      >
                        Evaluación anterior
                      </dt>

                      <dd
                        className="
                          font-medium
                          text-gray-800
                        "
                      >
                        {
                          formatDate(
                            previousEvaluation.date,
                          )
                        }{' '}
                        —{' '}
                        {
                          formatWeight(
                            previousEvaluation.weight,
                            2,
                          )
                        }
                      </dd>
                    </div>

                    <div>
                      <dt
                        className="
                          text-gray-500
                        "
                      >
                        Evaluación actual
                      </dt>

                      <dd
                        className="
                          font-medium
                          text-gray-800
                        "
                      >
                        {
                          formatDate(
                            latestEvaluation.date,
                          )
                        }{' '}
                        —{' '}
                        {
                          formatWeight(
                            latestEvaluation.weight,
                            2,
                          )
                        }
                      </dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h4
                    className="
                      font-semibold
                      text-[#183B33]
                    "
                  >
                    Variables analizadas
                  </h4>

                  <ul
                    className="
                      mt-3 space-y-2
                      text-sm
                      text-gray-700
                    "
                  >
                    {
                      prediction.featuresUsed.map(
                        (
                          feature,
                        ) => (
                          <li
                            key={
                              feature
                            }
                            className="
                              flex items-center
                              gap-2
                            "
                          >
                            <span
                              className="
                                h-2 w-2
                                rounded-full
                                bg-[#5A8C7A]
                              "
                            />

                            {
                              FEATURE_LABELS[
                                feature
                              ] ||
                              feature
                            }
                          </li>
                        ),
                      )
                    }
                  </ul>
                </div>
              </div>

              <div
                className="
                  mt-6 rounded-lg
                  border border-amber-200
                  bg-amber-50
                  p-4
                "
              >
                <div
                  className="
                    flex items-start
                    gap-3
                  "
                >
                  <AlertTriangle
                    className="
                      mt-0.5 h-5 w-5
                      shrink-0
                      text-amber-700
                    "
                  />

                  <p
                    className="
                      text-sm
                      text-amber-900
                    "
                  >
                    {
                      prediction.warning
                    }
                  </p>
                </div>
              </div>
            </div>
          )
        }
      </section>
    </div>
  );
}