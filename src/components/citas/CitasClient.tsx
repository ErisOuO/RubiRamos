'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ClinicalEvaluationModal from './ClinicalEvaluationModal';
import { toast } from 'react-hot-toast';

interface CitasClientProps {
  initialAppointments: any[];
}

export default function CitasClient({ initialAppointments }: CitasClientProps) {
  const router = useRouter();
  const [appointments, setAppointments] = useState(initialAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [evaluationType, setEvaluationType] = useState<'initial' | 'followup'>('initial');

  const handleOpenEvaluation = (appointment: any, type: 'initial' | 'followup') => {
    setSelectedAppointment(appointment);
    setEvaluationType(type);
    setModalOpen(true);
  };

  const handleEvaluationComplete = () => {
    setModalOpen(false);
    setSelectedAppointment(null);
    router.refresh();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <span className="px-2 py-1 text-xs rounded-full bg-[#5A8C7A]/20 text-[#2C3E34]">Programada</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs rounded-full bg-[#A8CF45]/20 text-[#2C3E34]">Completada</span>;
      case 'cancelled':
        return <span className="px-2 py-1 text-xs rounded-full bg-[#F58634]/20 text-[#2C3E34]">Cancelada</span>;
      default:
        return null;
    }
  };

  const getDepositBadge = (depositPaid: boolean, depositAmount: number) => {
    if (depositPaid) {
      return <span className="px-2 py-1 text-xs rounded-full bg-[#A8CF45]/20 text-[#2C3E34]">Anticipo pagado (${depositAmount})</span>;
    }
    return <span className="px-2 py-1 text-xs rounded-full bg-[#F58634]/20 text-[#2C3E34]">Anticipo pendiente (${depositAmount})</span>;
  };

  return (
    <div className="space-y-4">
      {appointments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-[#E6E3DE] p-8 text-center">
          <p className="text-[#6E7C72]">No hay citas programadas para hoy</p>
        </div>
      ) : (
        appointments.map((appointment) => (
          <div
            key={appointment.id}
            className={`bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow ${
              appointment.status === 'completed'
                ? 'border-2 border-[#A8CF45]'
                : 'border border-[#E6E3DE]'
            }`}
          >
            <div className="p-5">
              <div className="flex flex-wrap justify-between items-start gap-4">
                {/* Información del paciente */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-[#2C3E34]">
                      {appointment.patient.nombre_completo}
                    </h3>
                    {getStatusBadge(appointment.status)}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    <p className="text-[#6E7C72]">
                      <span className="font-medium text-[#2C3E34]">Hora:</span> {appointment.start_time.slice(0,5)} - {appointment.end_time.slice(0,5)}
                    </p>
                    <p className="text-[#6E7C72]">
                      <span className="font-medium text-[#2C3E34]">Edad:</span> {appointment.patient.age} años
                    </p>
                    <p className="text-[#6E7C72]">
                      <span className="font-medium text-[#2C3E34]">Género:</span> {appointment.patient.gender === 'M' ? 'Masculino' : appointment.patient.gender === 'F' ? 'Femenino' : 'No especificado'}
                    </p>
                    <p className="text-[#6E7C72]">
                      <span className="font-medium text-[#2C3E34]">Teléfono:</span> {appointment.patient.phone || '—'}
                    </p>
                    <p className="text-[#6E7C72] col-span-2">
                      <span className="font-medium text-[#2C3E34]">Email:</span> {appointment.patient.email}
                    </p>
                  </div>
                  <div className="mt-3">
                    {getDepositBadge(appointment.deposit_paid, appointment.deposit_amount)}
                  </div>
                  {appointment.notes && (
                    <p className="mt-2 text-sm text-[#6E7C72]">
                      <span className="font-medium text-[#2C3E34]">Notas:</span> {appointment.notes}
                    </p>
                  )}
                </div>

                {/* Botones de acción */}
                <div className="flex-shrink-0 flex flex-col gap-2">
                  <button
                    onClick={() => handleOpenEvaluation(appointment, 'initial')}
                    className={`px-5 py-2 rounded-lg transition-colors font-semibold text-sm ${
                      appointment.has_initial_evaluation
                        ? 'bg-[#5A8C7A] text-white hover:bg-[#4A7C6A]'
                        : 'bg-[#5A8C7A] text-white hover:bg-[#4A7C6A]'
                    }`}
                  >
                    {appointment.has_initial_evaluation ? 'Ver Evaluación Inicial' : 'Evaluación Inicial'}
                  </button>
                  <button
                    onClick={() => handleOpenEvaluation(appointment, 'followup')}
                    className={`px-5 py-2 rounded-lg transition-colors font-semibold text-sm ${
                      appointment.status === 'completed'
                        ? 'bg-[#5A8C7A] text-white hover:bg-[#4A7C6A]'
                        : 'bg-[#BD7D4A] text-white hover:bg-[#F58634]'
                    }`}
                  >
                    {appointment.status === 'completed' ? 'Ver Evaluación' : 'Iniciar Consulta'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}

      <ClinicalEvaluationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        appointment={selectedAppointment}
        evaluationType={evaluationType}
        onSuccess={handleEvaluationComplete}
      />
    </div>
  );
}