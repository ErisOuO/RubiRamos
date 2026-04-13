'use client';

import { useState, useEffect } from 'react';
import { getActiveNutritionPlan, saveNutritionPlan, getMenuTemplates } from '@/lib/nutrition-plans-actions';
import { getPatientInitialEvaluation } from '@/lib/medical-history-actions';
import { toast } from 'react-hot-toast';

interface NutritionPlanProps {
  patientId: number;
  onRefresh?: () => void;
}

// Definir tipos
type MealType = 'DESAYUNO' | 'ALMUERZO' | 'COLACION' | 'COMIDA' | 'CENA';
type MenuType = 'MENU_1' | 'MENU_2' | 'MENU_3' | 'MENU_4';

interface MealTime {
  start: string;
  end: string;
  label: string;
}

interface MealTimes {
  DESAYUNO: MealTime;
  ALMUERZO: MealTime;
  COLACION: MealTime;
  COMIDA: MealTime;
  CENA: MealTime;
}

interface MealContent {
  description: string;
}

interface MenuData {
  days: string[];
  meals: {
    [key in MealType]?: MealContent;
  };
}

interface MenusData {
  MENU_1: MenuData;
  MENU_2: MenuData;
  MENU_3: MenuData;
  MENU_4: MenuData;
}

const MEAL_TYPES: MealType[] = ['DESAYUNO', 'ALMUERZO', 'COLACION', 'COMIDA', 'CENA'];
const MENUS: { id: MenuType; name: string; days: string[] }[] = [
  { id: 'MENU_1', name: 'Menú 1', days: ['LUNES', 'MIERCOLES'] },
  { id: 'MENU_2', name: 'Menú 2', days: ['MARTES', 'VIERNES'] },
  { id: 'MENU_3', name: 'Menú 3', days: ['JUEVES'] },
  { id: 'MENU_4', name: 'Menú 4', days: ['SABADO', 'DOMINGO'] }
];

// Horarios por defecto
const DEFAULT_MEAL_TIMES: MealTimes = {
  DESAYUNO: { start: "08:00", end: "09:00", label: "8-9 AM" },
  ALMUERZO: { start: "09:00", end: "10:00", label: "9-10 AM" },
  COLACION: { start: "", end: "", label: "" },
  COMIDA: { start: "14:00", end: "15:00", label: "2-3 PM" },
  CENA: { start: "19:00", end: "20:00", label: "7-8 PM" }
};

// Estructura inicial de menús
const DEFAULT_MENUS: MenusData = {
  MENU_1: { days: ['LUNES', 'MIERCOLES'], meals: {} },
  MENU_2: { days: ['MARTES', 'VIERNES'], meals: {} },
  MENU_3: { days: ['JUEVES'], meals: {} },
  MENU_4: { days: ['SABADO', 'DOMINGO'], meals: {} }
};

export default function NutritionPlan({ patientId, onRefresh }: NutritionPlanProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mealTimes, setMealTimes] = useState<MealTimes>(DEFAULT_MEAL_TIMES);
  const [menus, setMenus] = useState<MenusData>(DEFAULT_MENUS);
  const [templates, setTemplates] = useState<any[]>([]);
  const [initialEvaluation, setInitialEvaluation] = useState<any>(null);
  const [showPreferences, setShowPreferences] = useState(false);
  const [editingMeal, setEditingMeal] = useState<{ menuId: MenuType; meal: MealType } | null>(null);
  const [editingContent, setEditingContent] = useState('');

  useEffect(() => {
    loadData();
  }, [patientId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [plan, templatesList, initialEval] = await Promise.all([
        getActiveNutritionPlan(patientId),
        getMenuTemplates(),
        getPatientInitialEvaluation(patientId)
      ]);
      
      if (plan) {
        setMealTimes(plan.meal_times || DEFAULT_MEAL_TIMES);
        setMenus(plan.menus || DEFAULT_MENUS);
      }
      setTemplates(templatesList);
      setInitialEvaluation(initialEval);
    } catch (error) {
      toast.error('Error al cargar el plan alimenticio');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveNutritionPlan({
        patient_id: patientId,
        name: `Plan Alimenticio - ${new Date().toLocaleDateString('es-ES')}`,
        description: 'Plan personalizado',
        start_date: new Date(),
        menus: menus,
        meal_times: mealTimes
      });
      toast.success('Plan alimenticio guardado');
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error('Error al guardar el plan');
    } finally {
      setSaving(false);
    }
  };

  const handleMealTimeChange = (mealType: MealType, field: 'start' | 'end', value: string) => {
    setMealTimes((prev: MealTimes) => {
      const newMealTimes = { ...prev };
      const current = newMealTimes[mealType];
      if (field === 'start') {
        newMealTimes[mealType] = { 
          ...current, 
          start: value,
          label: value && current.end ? `${value} - ${current.end}` : ''
        };
      } else {
        newMealTimes[mealType] = { 
          ...current, 
          end: value,
          label: current.start && value ? `${current.start} - ${value}` : ''
        };
      }
      return newMealTimes;
    });
  };

  const handleMealContentChange = (menuId: MenuType, meal: MealType, content: string) => {
    setMenus((prev: MenusData) => ({
      ...prev,
      [menuId]: {
        ...prev[menuId],
        meals: {
          ...prev[menuId].meals,
          [meal]: { description: content }
        }
      }
    }));
  };

  const getMealContent = (menuId: MenuType, meal: MealType): string => {
    return menus[menuId]?.meals?.[meal]?.description || '';
  };

  const openMealEditor = (menuId: MenuType, meal: MealType) => {
    const content = getMealContent(menuId, meal);
    setEditingContent(content);
    setEditingMeal({ menuId, meal });
  };

  const saveMealContent = () => {
    if (editingMeal) {
      handleMealContentChange(editingMeal.menuId, editingMeal.meal, editingContent);
      setEditingMeal(null);
      setEditingContent('');
    }
  };

  const applyTemplate = (template: any) => {
    if (confirm('¿Deseas aplicar esta plantilla? Se sobrescribirá el plan actual.')) {
      setMenus(template.menus);
      if (template.suggested_meal_times) {
        setMealTimes(template.suggested_meal_times);
      }
      toast.success('Plantilla aplicada');
    }
  };

  const formatTextWithLineBreaks = (text: string) => {
    if (!text) return null;
    return text.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  if (loading) {
    return <div className="text-center py-8 text-[#6E7C72]">Cargando plan alimenticio...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Botones de acción */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-[#BD7D4A] text-white rounded-lg hover:bg-[#F58634] transition-colors text-sm font-semibold disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar Plan'}
          </button>
          <button
            onClick={() => setShowPreferences(!showPreferences)}
            className="px-4 py-2 border border-[#E6E3DE] text-[#5A8C7A] rounded-lg hover:bg-[#FAF9F7] transition-colors text-sm font-semibold"
          >
            {showPreferences ? 'Ocultar Preferencias' : 'Mostrar Preferencias'}
          </button>
        </div>
        {templates.length > 0 && (
          <select
            onChange={(e) => {
              const template = templates.find(t => t.id === parseInt(e.target.value));
              if (template) applyTemplate(template);
            }}
            className="px-3 py-2 border border-[#E6E3DE] rounded-lg text-sm bg-white"
            defaultValue=""
          >
            <option value="" disabled>Cargar plantilla...</option>
            {templates.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Panel de Preferencias del Paciente - Solo Antecedentes Personales y Evaluación Dietética */}
      {showPreferences && initialEvaluation && (
        <div className="bg-white rounded-xl shadow-sm border border-[#E6E3DE] overflow-hidden">
          <div className="bg-[#5A8C7A] px-6 py-3">
            <h3 className="text-md font-bold text-white">Información Base del Paciente</h3>
            <p className="text-xs text-white/80">Basado en la evaluación inicial - Utiliza esta información para personalizar el plan</p>
          </div>
          <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
            
            {/* Antecedentes Personales Patológicos */}
            {initialEvaluation.personal_history && (
              <div className="border-b border-[#E6E3DE] pb-3">
                <h4 className="font-semibold text-[#5A8C7A] mb-2">Antecedentes Personales Patológicos</h4>
                <div className="text-sm text-[#6E7C72] space-y-1">
                  <p><span className="font-medium">Enfermedades actuales:</span> {initialEvaluation.personal_history.current_diseases || '—'}</p>
                  <p><span className="font-medium">Enfermedades previas:</span> {initialEvaluation.personal_history.past_diseases || '—'}</p>
                  <p><span className="font-medium">Cirugías:</span> {initialEvaluation.personal_history.surgeries || '—'}</p>
                  <p><span className="font-medium">Medicamentos actuales:</span> {initialEvaluation.personal_history.current_medications || '—'}</p>
                  <p><span className="font-medium">Suplementos:</span> {initialEvaluation.personal_history.supplements || '—'}</p>
                  <p><span className="font-medium">Alergias/intolerancias:</span> <span className="text-[#F58634] font-medium">{initialEvaluation.personal_history.allergies_intolerances || '—'}</span></p>
                </div>
              </div>
            )}

            {/* Evaluación Dietética - Recordatorio 24 horas */}
            {initialEvaluation.dietary_recall && (
              <div className="border-b border-[#E6E3DE] pb-3">
                <h4 className="font-semibold text-[#5A8C7A] mb-2">Recordatorio 24 horas</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><span className="font-medium">Desayuno:</span> {initialEvaluation.dietary_recall.breakfast || '—'}</p>
                  <p><span className="font-medium">Colación AM:</span> {initialEvaluation.dietary_recall.morning_snack || '—'}</p>
                  <p><span className="font-medium">Comida:</span> {initialEvaluation.dietary_recall.lunch || '—'}</p>
                  <p><span className="font-medium">Colación PM:</span> {initialEvaluation.dietary_recall.afternoon_snack || '—'}</p>
                  <p><span className="font-medium">Cena:</span> {initialEvaluation.dietary_recall.dinner || '—'}</p>
                  <p><span className="font-medium">Snacks/bebidas:</span> {initialEvaluation.dietary_recall.snacks_beverages || '—'}</p>
                </div>
              </div>
            )}

            {/* Frecuencia de consumo */}
            {initialEvaluation.food_frequency && (
              <div className="border-b border-[#E6E3DE] pb-3">
                <h4 className="font-semibold text-[#5A8C7A] mb-2">Frecuencia de consumo</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><span className="font-medium">Frutas:</span> {initialEvaluation.food_frequency.fruits || '—'}</p>
                  <p><span className="font-medium">Verduras:</span> {initialEvaluation.food_frequency.vegetables || '—'}</p>
                  <p><span className="font-medium">Proteínas:</span> {initialEvaluation.food_frequency.proteins || '—'}</p>
                  <p><span className="font-medium">Lácteos:</span> {initialEvaluation.food_frequency.dairy || '—'}</p>
                  <p><span className="font-medium">Cereales:</span> {initialEvaluation.food_frequency.cereals || '—'}</p>
                  <p><span className="font-medium">Ultraprocesados:</span> {initialEvaluation.food_frequency.ultraprocessed || '—'}</p>
                  <p><span className="font-medium">Azúcares:</span> {initialEvaluation.food_frequency.sugars || '—'}</p>
                </div>
              </div>
            )}

            {/* Hábitos alimentarios */}
            {initialEvaluation.feeding_habits && (
              <div>
                <h4 className="font-semibold text-[#5A8C7A] mb-2">Hábitos alimentarios</h4>
                <div className="text-sm text-[#6E7C72] space-y-1">
                  <p><span className="font-medium">Horarios de comida:</span> {initialEvaluation.feeding_habits.meal_schedules || '—'}</p>
                  <p><span className="font-medium">Ansiedad por comer:</span> {initialEvaluation.feeding_habits.eating_anxiety || '—'}</p>
                  <p><span className="font-medium">Atracones:</span> {initialEvaluation.feeding_habits.binges || '—'}</p>
                  <p><span className="font-medium">Comer emocional:</span> {initialEvaluation.feeding_habits.emotional_eating || '—'}</p>
                  <p><span className="font-medium">Comer fuera de casa:</span> {initialEvaluation.feeding_habits.eating_out || '—'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tabla de horarios - Vertical */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E6E3DE] overflow-hidden">
        <div className="bg-[#FAF9F7] px-6 py-3 border-b border-[#E6E3DE]">
          <h3 className="text-md font-bold text-[#5A8C7A]">Horarios de Comidas</h3>
        </div>
        <div className="p-4">
          <div className="space-y-3 max-w-md">
            {MEAL_TYPES.map(meal => (
              <div key={meal} className="flex items-center gap-4">
                <div className="w-28">
                  <label className="block text-sm font-semibold text-[#2C3E34]">{meal}</label>
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="time"
                    value={mealTimes[meal]?.start || ''}
                    onChange={(e) => handleMealTimeChange(meal, 'start', e.target.value)}
                    className="w-28 px-2 py-1 border border-[#E6E3DE] rounded text-sm"
                    disabled={meal === 'COLACION'}
                  />
                  <span className="text-[#6E7C72]">-</span>
                  <input
                    type="time"
                    value={mealTimes[meal]?.end || ''}
                    onChange={(e) => handleMealTimeChange(meal, 'end', e.target.value)}
                    className="w-28 px-2 py-1 border border-[#E6E3DE] rounded text-sm"
                    disabled={meal === 'COLACION'}
                  />
                </div>
                <div className="w-24 text-xs text-[#5A8C7A] font-medium">
                  {mealTimes[meal]?.label || (meal === 'COLACION' ? 'A libre demanda' : '')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla del menú semanal */}
      <div className="bg-white rounded-xl shadow-sm border border-[#E6E3DE] overflow-hidden">
        <div className="bg-[#FAF9F7] px-6 py-3 border-b border-[#E6E3DE]">
          <h3 className="text-md font-bold text-[#5A8C7A]">Plan Alimenticio</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#E6E3DE]">
            <thead className="bg-[#FAF9F7]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6E7C72] uppercase tracking-wider align-top">Comida</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6E7C72] uppercase tracking-wider align-top">Menú 1<br/><span className="text-[10px] font-normal">Lunes, Miércoles</span></th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6E7C72] uppercase tracking-wider align-top">Menú 2<br/><span className="text-[10px] font-normal">Martes, Viernes</span></th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6E7C72] uppercase tracking-wider align-top">Menú 3<br/><span className="text-[10px] font-normal">Jueves</span></th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#6E7C72] uppercase tracking-wider align-top">Menú 4<br/><span className="text-[10px] font-normal">Sábado, Domingo</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#E6E3DE]">
              {MEAL_TYPES.map(meal => (
                <tr key={meal} className="hover:bg-[#FAF9F7] align-top">
                  <td className="px-4 py-3 text-sm font-semibold text-[#2C3E34] whitespace-nowrap align-top">
                    {meal}
                    {mealTimes[meal]?.label && (
                      <span className="block text-xs font-normal text-[#6E7C72]">{mealTimes[meal]?.label}</span>
                    )}
                    {meal === 'COLACION' && !mealTimes[meal]?.label && (
                      <span className="block text-xs font-normal text-[#6E7C72]">A libre demanda</span>
                    )}
                  </td>
                  {MENUS.map(menu => {
                    const content = getMealContent(menu.id, meal);
                    return (
                      <td key={menu.id} className="px-4 py-3 align-top">
                        <button
                          onClick={() => openMealEditor(menu.id, meal)}
                          className="text-left text-sm text-[#6E7C72] hover:text-[#5A8C7A] transition-colors w-full"
                        >
                          {content ? (
                            <div className="whitespace-pre-wrap break-words">
                              {formatTextWithLineBreaks(content)}
                            </div>
                          ) : (
                            <span className="text-[#E6E3DE] italic">Click para editar</span>
                          )}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para editar comida */}
      {editingMeal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-[#E6E3DE]">
            <div className="sticky top-0 bg-white border-b border-[#E6E3DE] px-6 py-4 bg-[#FAF9F7] flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#5A8C7A]">
                Editar {editingMeal.meal} - {MENUS.find(m => m.id === editingMeal.menuId)?.name}
              </h2>
              <button onClick={() => setEditingMeal(null)} className="text-[#6E7C72] hover:text-[#2C3E34]">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-[#2C3E34] mb-2">Descripción</label>
                <textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  rows={10}
                  className="w-full px-3 py-2 border border-[#E6E3DE] rounded-lg focus:ring-2 focus:ring-[#5A8C7A] font-mono text-sm"
                  placeholder="Ej: 1 MANZANA PICADA CON 2 CDAS DE YOGUR GRIEGO + 4 ALMENDRAS PICADAS, CANELA EN POLVO"
                />
                <p className="text-xs text-[#6E7C72] mt-1">Puedes usar saltos de línea para organizar mejor la información</p>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEditingMeal(null)}
                  className="px-4 py-2 border border-[#E6E3DE] rounded-lg text-[#6E7C72] hover:bg-[#FAF9F7]"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveMealContent}
                  className="px-4 py-2 bg-[#BD7D4A] text-white rounded-lg hover:bg-[#F58634]"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}