import { Suspense } from 'react';
import { getTodayAppointmentsWithPatients } from '@/lib/clinical-evaluations-actions';
import CitasClient from '@/components/citas/CitasClient';

export default async function CitasPage() {
  const appointments = await getTodayAppointmentsWithPatients();

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#5A8C7A]">Citas del Día</h1>
          <p className="text-sm text-[#6E7C72] mt-1">
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        
        <Suspense fallback={<div className="text-center text-[#6E7C72] py-8">Cargando citas...</div>}>
          <CitasClient initialAppointments={appointments} />
        </Suspense>
      </div>
    </div>
  );
}