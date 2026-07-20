from __future__ import annotations

from pathlib import Path
from typing import Any, Literal

import joblib
import pandas as pd

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field


# ============================================================
# MODELO
# ============================================================

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = (
    BASE_DIR
    / "modelo_inasistencia.joblib"
)


if not MODEL_PATH.exists():
    raise FileNotFoundError(
        f"No se encontró el modelo en: {MODEL_PATH}"
    )


model_package: dict[str, Any] = joblib.load(
    MODEL_PATH
)

model = model_package["model"]

feature_columns: list[str] = model_package[
    "feature_columns"
]


# ============================================================
# FASTAPI
# ============================================================

app = FastAPI(
    title="API de predicción de asistencia",
    description=(
        "Predice el riesgo de inasistencia de pacientes "
        "a citas nutricionales."
    ),
    version="1.1.0",

    # Documentación adaptada a las rutas de Vercel.
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)


# ============================================================
# ENTRADA
# ============================================================

class AppointmentPredictionInput(BaseModel):
    age: int = Field(
        ge=0,
        le=120,
    )

    gender_female: int = Field(
        ge=0,
        le=1,
    )

    # Se reciben por compatibilidad con Next.js,
    # pero no forman parte del modelo actual.
    deposit_paid: int = Field(
        default=0,
        ge=0,
        le=1,
    )

    deposit_amount: float = Field(
        default=0,
        ge=0,
    )

    day_of_week: int = Field(
        ge=1,
        le=7,
    )

    appointment_hour: int = Field(
        ge=0,
        le=23,
    )

    is_saturday: int = Field(
        ge=0,
        le=1,
    )

    previous_completed: int = Field(
        ge=0,
    )

    previous_no_show: int = Field(
        ge=0,
    )

    previous_cancelled: int = Field(
        ge=0,
    )

    previous_appointments: int = Field(
        ge=0,
    )

    previous_attendance_rate: float = Field(
        ge=0,
        le=1,
    )


# ============================================================
# SALIDA
# ============================================================

class AppointmentPredictionOutput(BaseModel):
    no_show_probability: float

    attendance_probability: float

    no_show_percentage: float

    attendance_percentage: float

    risk_level: Literal[
        "Bajo",
        "Medio",
        "Alto",
    ]

    predicted_no_show: int

    prediction: str


# ============================================================
# ENDPOINT PRINCIPAL
# ============================================================

@app.get("/api")
def root():
    return {
        "service":
            "Predicción de asistencia",

        "status":
            "online",

        "model":
            model_package.get(
                "model_name",
                "modelo_desconocido",
            ),

        "version":
            "1.1.0",
    }


# ============================================================
# ESTADO DE LA API
# ============================================================

@app.get("/api/health")
def health():
    return {
        "success":
            True,

        "model_loaded":
            True,

        "model_name":
            model_package.get(
                "model_name",
                "modelo_desconocido",
            ),

        "feature_columns":
            feature_columns,
    }


# ============================================================
# PREDICCIÓN
# ============================================================

@app.post(
    "/api/predict",
    response_model=AppointmentPredictionOutput,
)
def predict_attendance(
    input_data: AppointmentPredictionInput,
):
    try:
        values = input_data.model_dump()

        # ----------------------------------------------------
        # HISTORIAL DEL PACIENTE
        # ----------------------------------------------------

        previous_completed = int(
            input_data.previous_completed
        )

        previous_no_show = int(
            input_data.previous_no_show
        )

        previous_cancelled = int(
            input_data.previous_cancelled
        )

        previous_appointments = (
            previous_completed
            + previous_no_show
            + previous_cancelled
        )

        previous_attendance_total = (
            previous_completed
            + previous_no_show
        )

        previous_attendance_rate = (
            previous_completed
            / previous_attendance_total
            if previous_attendance_total > 0
            else 0.0
        )

        # Se reemplazan los valores recibidos para garantizar
        # que sean consistentes con el historial real.
        values.update(
            {
                "previous_completed":
                    previous_completed,

                "previous_no_show":
                    previous_no_show,

                "previous_cancelled":
                    previous_cancelled,

                "previous_appointments":
                    previous_appointments,

                "previous_attendance_rate":
                    previous_attendance_rate,
            }
        )

        # ----------------------------------------------------
        # PREPARACIÓN DE VARIABLES
        # ----------------------------------------------------

        # Solo se utilizan las columnas con las que fue
        # entrenado el modelo. El anticipo queda excluido.
        features = pd.DataFrame(
            [values],
            columns=feature_columns,
        )

        # ----------------------------------------------------
        # PROBABILIDAD DEL MODELO
        # ----------------------------------------------------

        probabilities = model.predict_proba(
            features
        )[0]

        model_classes = list(
            model.classes_
        )

        if 1 not in model_classes:
            raise RuntimeError(
                "El modelo no contiene la clase "
                "de inasistencia."
            )

        no_show_class_index = (
            model_classes.index(1)
        )

        model_no_show_probability = float(
            probabilities[
                no_show_class_index
            ]
        )

        # ----------------------------------------------------
        # PROBABILIDAD HISTÓRICA
        # ----------------------------------------------------

        # El historial se toma en cuenta cuando existen
        # al menos tres citas completadas o no atendidas.
        historical_no_show_probability = (
            previous_no_show
            / previous_attendance_total
            if previous_attendance_total >= 3
            else 0.0
        )

        # Se utiliza la probabilidad mayor para evitar que
        # el modelo ignore un historial importante de faltas.
        no_show_probability = max(
            model_no_show_probability,
            historical_no_show_probability,
        )

        # Garantiza que la probabilidad permanezca entre 0 y 1.
        no_show_probability = min(
            max(
                no_show_probability,
                0.0,
            ),
            1.0,
        )

        attendance_probability = (
            1.0
            - no_show_probability
        )

        # ----------------------------------------------------
        # CLASIFICACIÓN DEL RIESGO
        # ----------------------------------------------------

        predicted_no_show = int(
            no_show_probability >= 0.50
        )

        risk_level: Literal[
            "Bajo",
            "Medio",
            "Alto",
        ]

        if no_show_probability >= 0.50:
            risk_level = "Alto"

        elif no_show_probability >= 0.25:
            risk_level = "Medio"

        else:
            risk_level = "Bajo"

        prediction = (
            "No asistirá"
            if predicted_no_show == 1
            else "Sí asistirá"
        )

        # ----------------------------------------------------
        # RESPUESTA
        # ----------------------------------------------------

        return AppointmentPredictionOutput(
            no_show_probability=round(
                no_show_probability,
                6,
            ),

            attendance_probability=round(
                attendance_probability,
                6,
            ),

            no_show_percentage=round(
                no_show_probability
                * 100,
                2,
            ),

            attendance_percentage=round(
                attendance_probability
                * 100,
                2,
            ),

            risk_level=risk_level,

            predicted_no_show=(
                predicted_no_show
            ),

            prediction=prediction,
        )

    except HTTPException:
        raise

    except Exception as error:
        print(
            "Error al generar la predicción:",
            repr(error),
        )

        raise HTTPException(
            status_code=500,
            detail=(
                "No se pudo generar la predicción "
                "de asistencia."
            ),
        ) from error