"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

import {
  predictAppointmentAttendance,
  type AttendancePrediction,
} from "@/lib/ml-prediction-actions";

interface AttendancePredictionButtonProps {
  appointmentId: number;
}

export default function AttendancePredictionButton({
  appointmentId,
}: AttendancePredictionButtonProps) {
  const [loading, setLoading] = useState(false);

  const [prediction, setPrediction] =
    useState<AttendancePrediction | null>(null);

  const handlePrediction = async () => {
    setLoading(true);

    try {
      const result =
        await predictAppointmentAttendance(
          appointmentId,
        );

      if (!result.success || !result.prediction) {
        toast.error(result.message);
        return;
      }

      setPrediction(result.prediction);

      toast.success(
        "Predicción generada correctamente.",
      );
    } catch (error) {
      console.error(
        "Error al consultar la predicción:",
        error,
      );

      toast.error(
        "No se pudo obtener la predicción.",
      );
    } finally {
      setLoading(false);
    }
  };

  const getRiskStyles = () => {
    switch (prediction?.risk_level) {
      case "Alto":
        return {
          container:
            "border-red-300 bg-red-50",
          title: "text-red-700",
          badge:
            "bg-red-100 text-red-700",
          recommendation:
            "border-red-200 bg-white/70",
        };

      case "Medio":
        return {
          container:
            "border-orange-300 bg-orange-50",
          title: "text-orange-700",
          badge:
            "bg-orange-100 text-orange-700",
          recommendation:
            "border-orange-200 bg-white/70",
        };

      default:
        return {
          container:
            "border-green-300 bg-green-50",
          title: "text-green-700",
          badge:
            "bg-green-100 text-green-700",
          recommendation:
            "border-green-200 bg-white/70",
        };
    }
  };

  const getRecommendation = () => {
    switch (prediction?.risk_level) {
      case "Alto":
        return (
          "Solicitar anticipo obligatorio y enviar " +
          "recordatorios adicionales."
        );

      case "Medio":
        return (
          "Enviar un recordatorio adicional antes " +
          "de la cita."
        );

      default:
        return (
          "Mantener el proceso normal de confirmación."
        );
    }
  };

  const riskStyles = getRiskStyles();
  const recommendation = getRecommendation();

  if (prediction) {
    return (
      <div
        className={`rounded-lg border p-3 ${riskStyles.container}`}
      >
        <div className="flex items-center justify-between gap-3">
          <p
            className={`text-sm font-semibold ${riskStyles.title}`}
          >
            Predicción de asistencia
          </p>

          <span
            className={`rounded-full px-2 py-1 text-xs font-semibold ${riskStyles.badge}`}
          >
            Riesgo {prediction.risk_level}
          </span>
        </div>

        <div className="mt-2 space-y-1 text-sm">
          <p className="text-[#2C3E34]">
            <span className="font-semibold">
              Inasistencia:
            </span>{" "}
            {prediction.no_show_percentage.toFixed(
              2,
            )}
            %
          </p>

          <p className="text-[#2C3E34]">
            <span className="font-semibold">
              Asistencia:
            </span>{" "}
            {prediction.attendance_percentage.toFixed(
              2,
            )}
            %
          </p>

          <p className="font-semibold text-[#2C3E34]">
            {prediction.prediction}
          </p>
        </div>

        <div
          className={`mt-3 rounded-lg border p-2 ${riskStyles.recommendation}`}
        >
          <p className="text-xs font-semibold text-[#2C3E34]">
            Acción recomendada
          </p>

          <p className="mt-1 text-xs leading-relaxed text-[#6E7C72]">
            {recommendation}
          </p>
        </div>

        <button
          type="button"
          onClick={handlePrediction}
          disabled={loading}
          className="mt-3 w-full rounded-lg border border-[#5A8C7A] px-3 py-2 text-xs font-semibold text-[#5A8C7A] transition-colors hover:bg-[#5A8C7A] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Actualizando..."
            : "Actualizar predicción"}
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handlePrediction}
      disabled={loading}
      className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {loading
        ? "Calculando..."
        : "Predecir asistencia"}
    </button>
  );
}