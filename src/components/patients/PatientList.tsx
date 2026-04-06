'use client';

import { useState, useEffect, useCallback } from 'react';
import { getPatients, getPatientsStats, deletePatient } from '@/lib/patients-actions';
import PatientModal from './PatientModal';
import { toast } from 'react-hot-toast';

interface PatientsListProps {
  initialPatients: any[];
  initialTotal: number;
  initialStats: any;
}

export default function PatientsList({ initialPatients, initialTotal, initialStats }: PatientsListProps) {
  const [patients, setPatients] = useState(initialPatients);
  const [total, setTotal] = useState(initialTotal);
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('todos');
  const [sortBy, setSortBy] = useState<'first_name' | 'first_lastname' | 'email' | 'created_at'>('first_name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
  const pageSize = 10;

  const loadPatients = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getPatients({
        search: searchTerm,
        gender: genderFilter,
        sortBy,
        sortOrder,
        page: currentPage,
        pageSize
      });
      setPatients(result.patients);
      setTotal(result.total);
      
      const newStats = await getPatientsStats();
      setStats(newStats);
    } catch (error) {
      toast.error('Error al cargar pacientes');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, genderFilter, sortBy, sortOrder, currentPage, pageSize]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadPatients();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, genderFilter, sortBy, sortOrder, currentPage, loadPatients]);

  const handleSort = (field: 'first_name' | 'first_lastname' | 'email' | 'created_at') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const handleViewPatient = async (id: number) => {
    const { getPatientById } = await import('@/lib/patients-actions');
    const patient = await getPatientById(id);
    setSelectedPatient(patient);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleEditPatient = async (id: number) => {
    const { getPatientById } = await import('@/lib/patients-actions');
    const patient = await getPatientById(id);
    setSelectedPatient(patient);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleDeletePatient = async (id: number, name: string) => {
    if (confirm(`¿Estás seguro de que deseas eliminar a ${name}?`)) {
      try {
        await deletePatient(id);
        toast.success('Paciente eliminado exitosamente');
        loadPatients();
      } catch (error) {
        toast.error('Error al eliminar paciente');
      }
    }
  };

  const handlePatientUpdated = () => {
    loadPatients();
    setModalOpen(false);
  };

  const getSortIcon = (field: string) => {
    if (sortBy !== field) {
      return (
        <svg className="w-3 h-3 inline-block ml-1 text-[#6E7C72]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortOrder === 'asc' ? (
      <svg className="w-3 h-3 inline-block ml-1 text-[#5A8C7A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-3 h-3 inline-block ml-1 text-[#5A8C7A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="p-6">
      {/* Título de la página */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#5A8C7A]">Pacientes</h1>
        <p className="text-sm text-[#6E7C72] mt-1">Gestión de pacientes y seguimiento de citas</p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-[#5A8C7A]">
          <p className="text-[#6E7C72] text-sm">Total Pacientes</p>
          <p className="text-2xl font-bold text-[#2C3E34]">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-[#BD7D4A]">
          <p className="text-[#6E7C72] text-sm">Hombres</p>
          <p className="text-2xl font-bold text-[#2C3E34]">{stats.masculinos}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-[#A8CF45]">
          <p className="text-[#6E7C72] text-sm">Mujeres</p>
          <p className="text-2xl font-bold text-[#2C3E34]">{stats.femeninos}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-[#F58634]">
          <p className="text-[#6E7C72] text-sm">Nuevos (30 días)</p>
          <p className="text-2xl font-bold text-[#2C3E34]">{stats.nuevosUltimos30Dias}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-[#E6E3DE]">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-[#2C3E34] mb-2">Buscar</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nombre, apellido, email o usuario..."
              className="w-full px-3 py-2 border border-[#E6E3DE] rounded-lg focus:ring-2 focus:ring-[#5A8C7A]"
            />
          </div>
          <div className="w-48">
            <label className="block text-sm font-semibold text-[#2C3E34] mb-2">Género</label>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="w-full px-3 py-2 border border-[#E6E3DE] rounded-lg focus:ring-2 focus:ring-[#5A8C7A]"
            >
              <option value="todos">Todos</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de pacientes */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-[#E6E3DE]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#E6E3DE]">
            <thead className="bg-[#FAF9F7]">
              <tr>
                <th onClick={() => handleSort('first_name')} className="px-6 py-3 text-left text-xs font-semibold text-[#6E7C72] uppercase tracking-wider cursor-pointer hover:text-[#5A8C7A]">
                  <span className="flex items-center gap-1">Nombre {getSortIcon('first_name')}</span>
                </th>
                <th onClick={() => handleSort('first_lastname')} className="px-6 py-3 text-left text-xs font-semibold text-[#6E7C72] uppercase tracking-wider cursor-pointer hover:text-[#5A8C7A]">
                  <span className="flex items-center gap-1">Apellido {getSortIcon('first_lastname')}</span>
                </th>
                <th onClick={() => handleSort('email')} className="px-6 py-3 text-left text-xs font-semibold text-[#6E7C72] uppercase tracking-wider cursor-pointer hover:text-[#5A8C7A]">
                  <span className="flex items-center gap-1">Email {getSortIcon('email')}</span>
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#6E7C72] uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#6E7C72] uppercase tracking-wider">Edad</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#6E7C72] uppercase tracking-wider">Género</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#6E7C72] uppercase tracking-wider">Teléfono</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[#6E7C72] uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#E6E3DE]">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-[#6E7C72]">Cargando...</td>
                </tr>
              ) : patients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-[#6E7C72]">No hay pacientes registrados</td>
                </tr>
              ) : (
                patients.map(patient => (
                  <tr key={patient.id} className="hover:bg-[#FAF9F7] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2C3E34]">{patient.first_name} {patient.second_name || ''}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2C3E34]">{patient.first_lastname} {patient.second_lastname || ''}</td>
                    <td className="px-6 py-4 text-sm text-[#2C3E34]">{patient.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2C3E34]">{patient.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2C3E34]">{patient.age}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2C3E34]">{patient.gender === 'M' ? 'Masculino' : patient.gender === 'F' ? 'Femenino' : 'No especificado'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#2C3E34]">{patient.phone || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button onClick={() => handleViewPatient(patient.id)} className="text-[#5A8C7A] hover:text-[#4A7C6A]">Ver</button>
                      <button onClick={() => handleEditPatient(patient.id)} className="text-[#BD7D4A] hover:text-[#F58634]">Editar</button>
                      <button onClick={() => handleDeletePatient(patient.id, patient.first_name)} className="text-[#F58634] hover:text-[#BD7D4A]">Eliminar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Paginación */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-[#E6E3DE] flex justify-between items-center">
            <div className="text-sm text-[#6E7C72]">
              Mostrando {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, total)} de {total}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-[#E6E3DE] rounded-lg text-[#2C3E34] hover:bg-[#FAF9F7] disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="px-3 py-1 text-[#2C3E34]">{currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-[#E6E3DE] rounded-lg text-[#2C3E34] hover:bg-[#FAF9F7] disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      <PatientModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        patient={selectedPatient}
        mode={modalMode}
        onSuccess={handlePatientUpdated}
      />
    </div>
  );
}