import { Suspense } from 'react';
import MedicalHistoryClient from '@/components/medical-history/MedicalHistoryClient';

export default async function MedicalHistoryPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <Suspense fallback={<div className="p-6 text-center text-[#6E7C72]">Cargando historial médico...</div>}>
        <MedicalHistoryClient />
      </Suspense>
    </div>
  );
}