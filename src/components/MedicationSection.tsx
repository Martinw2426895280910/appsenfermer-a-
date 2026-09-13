import React from 'react';
import { Pill, Plus, Trash2, CheckCircle2, Clock, Zap } from 'lucide-react';
import { MedicationItem, PatientRecord } from '../types';

interface MedicationSectionProps {
  patient: PatientRecord;
  onChange: (fields: Partial<PatientRecord>) => void;
}

const COMMON_DRUG_PRESETS = [
  { name: 'Paracetamol', dose: '1 g', route: 'EV', time: '08:00' },
  { name: 'Ceftriaxona', dose: '1 g', route: 'EV', time: '12:00' },
  { name: 'Omeprazol', dose: '40 mg', route: 'EV', time: '07:00' },
  { name: 'Enoxaparina', dose: '40 mg', route: 'SC', time: '20:00' },
  { name: 'Furosemida', dose: '20 mg', route: 'EV', time: '08:00' },
  { name: 'Salbutamol aerocámara', dose: '2 puffs', route: 'Inhalatoria', time: '09:00' },
  { name: 'Metoclopramida', dose: '10 mg', route: 'EV', time: '14:00' },
  { name: 'Solución Fisiológica 0.9%', dose: '500 ml', route: 'EV', time: 'Continuo' },
];

export const MedicationSection: React.FC<MedicationSectionProps> = ({
  patient,
  onChange,
}) => {
  const addMedication = (preset?: { name: string; dose: string; route: string; time: string }) => {
    const newMed: MedicationItem = {
      id: `med_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: preset ? preset.name : '',
      dose: preset ? preset.dose : '',
      route: preset ? preset.route : 'EV',
      time: preset ? preset.time : '08:00',
      given: false,
      notes: '',
    };
    onChange({
      meds: [...(patient.meds || []), newMed],
    });
  };

  const updateMedication = (id: string, fields: Partial<MedicationItem>) => {
    const updated = (patient.meds || []).map((m) =>
      m.id === id ? { ...m, ...fields } : m
    );
    onChange({ meds: updated });
  };

  const removeMedication = (id: string) => {
    const updated = (patient.meds || []).filter((m) => m.id !== id);
    onChange({ meds: updated });
  };

  return (
    <div className="space-y-4">
      {/* Header and Quick Presets */}
      <div className="space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Pill className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-700">
              Fármacos del Turno ({patient.meds?.length || 0} registrados)
            </span>
          </div>

          <button
            type="button"
            onClick={() => addMedication()}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Añadir Fármaco</span>
          </button>
        </div>

        {/* Quick add chips */}
        <div className="flex items-center gap-1 flex-wrap">
          <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mr-1">
            <Zap className="w-3 h-3 text-emerald-600" /> Agregar común:
          </span>
          {COMMON_DRUG_PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => addMedication(p)}
              className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200 transition-colors"
            >
              + {p.name} ({p.dose})
            </button>
          ))}
        </div>
      </div>

      {/* Medication List */}
      <div className="space-y-2.5">
        {(!patient.meds || patient.meds.length === 0) ? (
          <div className="p-4 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-500 bg-slate-50/50">
            No hay fármacos cargados para este turno. Haz clic en "Añadir Fármaco" o selecciona uno de los comunes.
          </div>
        ) : (
          patient.meds.map((med, idx) => (
            <div
              key={med.id}
              className={`p-3 rounded-xl border transition-all ${
                med.given
                  ? 'bg-emerald-50/50 border-emerald-300'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                {/* Status Checkbox */}
                <div className="sm:col-span-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateMedication(med.id, { given: !med.given })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      med.given
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {med.given ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Administrado</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>Pendiente</span>
                      </>
                    )}
                  </button>
                  <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                </div>

                {/* Name */}
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    value={med.name}
                    onChange={(e) => updateMedication(med.id, { name: e.target.value })}
                    placeholder="Nombre del fármaco"
                    className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-emerald-600 font-bold text-slate-900"
                  />
                </div>

                {/* Dose */}
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={med.dose}
                    onChange={(e) => updateMedication(med.id, { dose: e.target.value })}
                    placeholder="Dosis (ej. 1 g)"
                    className="w-full px-2 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-emerald-600 font-semibold"
                  />
                </div>

                {/* Route */}
                <div className="sm:col-span-2">
                  <select
                    value={med.route}
                    onChange={(e) => updateMedication(med.id, { route: e.target.value })}
                    className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-emerald-600 font-semibold text-slate-800"
                  >
                    <option value="EV">EV (Endovenoso)</option>
                    <option value="VO">VO (Vía Oral)</option>
                    <option value="SC">SC (Subcutáneo)</option>
                    <option value="IM">IM (Intramuscular)</option>
                    <option value="Inhalatoria">Inhalatoria</option>
                    <option value="Tópica">Tópica</option>
                    <option value="Rectal">Rectal</option>
                  </select>
                </div>

                {/* Time & Delete */}
                <div className="sm:col-span-2 flex items-center gap-1.5">
                  <input
                    type="text"
                    value={med.time}
                    onChange={(e) => updateMedication(med.id, { time: e.target.value })}
                    placeholder="Hora (08:00)"
                    className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-emerald-600 font-mono text-center"
                  />
                  <button
                    type="button"
                    onClick={() => removeMedication(med.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                    title="Eliminar fármaco"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Extra note field */}
              <div className="mt-2">
                <input
                  type="text"
                  value={med.notes || ''}
                  onChange={(e) => updateMedication(med.id, { notes: e.target.value })}
                  placeholder="Observación opcional (ej. diluido en 100ml de SF en 30 min, buena tolerancia)..."
                  className="w-full px-2.5 py-1 text-[11px] text-slate-600 bg-white/70 border border-slate-200 rounded-md focus:outline-emerald-600"
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
