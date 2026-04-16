'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import TimeSlotPicker from './TimeSlotPicker';

interface PatientAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedDate: Date | null;
  patientId: number;
  depositAmount: number;
}

export default function PatientAppointmentModal({
  isOpen,
  onClose,
  onSuccess,
  selectedDate,
  patientId,
  depositAmount
}: PatientAppointmentModalProps) {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !selectedDate) return null;

  const handleSubmit = async () => {
    if (!selectedTime) {
      toast.error('Selecciona un horario');
      return;
    }

    setLoading(true);
    try {
      const { createPatientAppointment } = await import('@/lib/patient-appointments-actions');
      
      await createPatientAppointment({
        patientId,
        appointmentDate: selectedDate,
        startTime: selectedTime + ':00',
        endTime: '', // Se calculará automáticamente
        depositPaid: false, // Por defecto no pagado, se paga en consultorio
        depositAmount,
        notes: notes || undefined
      });

      toast.success('Cita agendada exitosamente');
      onSuccess();
      onClose();
      setSelectedTime(null);
      setNotes('');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al agendar cita');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-[#E6E3DE]">
        <div className="p-6">
          <h3 className="text-lg font-bold text-[#6B8E7B] mb-4">Agendar nueva cita</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-semibold text-[#2C3E34] mb-2">
              Fecha: {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </label>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-[#2C3E34] mb-2">
              Selecciona un horario
            </label>
            <TimeSlotPicker
              date={selectedDate}
              patientId={patientId}
              onSelectSlot={setSelectedTime}
              selectedTime={selectedTime}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-[#2C3E34] mb-2">
              Notas adicionales (opcional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-[#E6E3DE] rounded-lg resize-none"
              placeholder="Ej: Necesito llegar tarde, etc."
            />
          </div>

          <div className="bg-[#FAF9F7] p-3 rounded-lg mb-4 border-l-4 border-[#BD7D4A]">
            <p className="text-xs text-[#6E7C72]">
              El anticipo de <strong>${depositAmount}</strong> se paga en el consultorio el día de la cita.
              Por favor, llega con 10 minutos de anticipación.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#E6E3DE] rounded-lg text-[#6E7C72] hover:bg-[#FAF9F7]"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || !selectedTime}
              className="px-4 py-2 bg-[#BD7D4A] text-white rounded-lg hover:bg-[#F58634] disabled:opacity-50"
            >
              {loading ? 'Agendando...' : 'Agendar cita'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}