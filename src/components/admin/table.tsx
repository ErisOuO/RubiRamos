'use client';

import { Accion } from '@/lib/definitions';

const columns = [
  { label: 'Usuario', key: 'usuario' },
  { label: 'Fecha y hora', key: 'fecha_hora' },
  { label: 'Acción', key: 'accion' },
  { label: 'Tabla afectada', key: 'tabla_afectada' },
  { label: 'Detalles', key: 'detalles' },
];

export default function AccionesTable({ acciones }: { acciones: Accion[] }) {
  return (
    <div className="space-y-4 mt-6">
      <h2 className="text-lg font-semibold text-[#1e343b]">Últimas 10 acciones realizadas</h2>
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#1e343b]">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {acciones.map((accion) => (
              <tr key={accion.id} className="hover:bg-gray-50 transition-colors">
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{accion.usuario}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{new Date(accion.fecha_hora).toLocaleString('es-MX', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                  })}
                  </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{accion.accion}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{accion.tabla_afectada}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">{accion.detalles}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}