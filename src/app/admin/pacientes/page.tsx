'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaUser, FaClock, FaCalendar } from 'react-icons/fa';
import NewPatientForm from '@/components/patients/NewPatientForm';
import PatientList from '@/components/patients/PatientList';
import { obtenerPacientesBasicos } from '@/lib/actions';

/* =========================
   Tipos
========================= */

interface Patient {
  id: number;
  nombre_completo: string;
  phone: string;
  email: string;
  estado: string;
  age?: number;
}

interface PacienteDB {
  id: number;
  nombre_completo: string;
  phone: string;
  email: string;
  estado: string;
  age: number | null;
}

interface ObtenerPacientesResult {
  pacientes: PacienteDB[];
  total: number;
  activos: number;
  verificados: number;
}

/* =========================
   Componente
========================= */

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [, setSelectedPatient] = useState<Patient | null>(null);
  const [, setShowDetails] = useState(false);
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    activos: 0,
    verificados: 0,
    promedioPuntualidad: 85
  });

  /* =========================
     Cargar pacientes
  ========================= */

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);

      const rawResult = await obtenerPacientesBasicos();
      const result: ObtenerPacientesResult = {
        pacientes: Array.isArray(rawResult.pacientes)
          ? rawResult.pacientes.map((row) => ({
              id: row.id,
              nombre_completo: row.nombre_completo,
              phone: row.phone,
              email: row.email,
              estado: row.estado,
              age: row.age,
            }))
          : [],
        total: rawResult.total,
        activos: rawResult.activos,
        verificados: rawResult.verificados
      };

      const mappedPatients: Patient[] = result.pacientes.map((row) => ({
        id: row.id,
        nombre_completo: row.nombre_completo,
        phone: row.phone,
        email: row.email,
        estado: row.estado,
        age: row.age ?? undefined
      }));

      setPatients(mappedPatients);
      setStats({
        total: result.total,
        activos: result.activos,
        verificados: result.verificados,
        promedioPuntualidad: 85
      });
    } catch (error) {
      console.error('Error al cargar pacientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewPatientCreated = () => {
    loadPatients();
  };

  /* =========================
     Filtros
  ========================= */

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm);

    const matchesStatus =
      statusFilter === 'Todos' || patient.estado.includes(statusFilter);

    return matchesSearch && matchesStatus;
  });

  /* =========================
     Helpers
  ========================= */

  const handleViewDetails = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowDetails(true);
  };

  /* =========================
     Render
  ========================= */

  return (
    <main className="min-h-screen w-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Gestión de Pacientes
          </h1>
          <p className="text-xl text-gray-600">
            Lista completa de pacientes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Pacientes" value={stats.total} icon={<FaUser />} color="blue" />
          <StatCard title="Pacientes Activos" value={stats.activos} icon={<FaUser />} color="green" />
          <StatCard title="Pacientes Verificados" value={stats.verificados} icon={<FaClock />} color="purple" />
          <StatCard title="Puntualidad Promedio" value={`${stats.promedioPuntualidad}%`} icon={<FaCalendar />} color="orange" />
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex-1 w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar pacientes por nombre, email o teléfono..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400"
                />
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-300"
              >
                <option value="Todos">Todos</option>
                <option value="Activo">Activos</option>
                <option value="Inactivo">Inactivos</option>
                <option value="verificado">Verificados</option>
              </select>

              <button
                onClick={() => setShowNewPatientForm(true)}
                className="px-6 py-3 bg-blue-500 text-white rounded-xl"
              >
                + Nuevo Paciente
              </button>
            </div>
          </div>
        </div>

        <PatientList
          patients={filteredPatients}
          loading={loading}
          onViewDetails={handleViewDetails}
        />
      </div>

      {showNewPatientForm && (
        <NewPatientForm
          onClose={() => setShowNewPatientForm(false)}
          onPatientCreated={handleNewPatientCreated}
        />
      )}
    </main>
  );
}

/* =========================
   Subcomponentes
========================= */

function StatCard({
  title,
  value,
  icon,
  color
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className={`bg-white rounded-xl p-4 shadow-sm border-l-4 border-${color}-500`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`text-${color}-500 text-xl`}>{icon}</div>
      </div>
    </div>
  );
}
