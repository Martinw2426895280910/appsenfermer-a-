import React from 'react';
import { Brain, Eye, Zap, AlertTriangle } from 'lucide-react';
import { PatientRecord } from '../types';
import { GLASGOW_OPTIONS } from '../constants/medicalData';
import { calculateGlasgow } from '../utils/clinicalCalculations';

interface NeurologySectionProps {
  patient: PatientRecord;
  onChange: (fields: Partial<PatientRecord>) => void;
}

const CONSCIOUSNESS_LEVELS = [
  'Alerta',
  'Somnoliento',
  'Confuso',
  'Estuporoso',
  'Inconsciente',
];

const PUPIL_TYPES = [
  'Isocóricas',
  'Anisocóricas',
  'Mióticas',
  'Midriáticas',
];

export const NeurologySection: React.FC<NeurologySectionProps> = ({
  patient,
  onChange,
}) => {
  const gcs = calculateGlasgow(patient.n_go, patient.n_gv, patient.n_gm);

  const applyGcsPreset = (go: number, gv: number, gm: number, conciencia: string) => {
    onChange({
      n_go: go,
      n_gv: gv,
      n_gm: gm,
      n_conciencia: conciencia,
    });
  };

  return (
    <div className="space-y-4">
      {/* Quick Presets */}
      <div className="flex items-center gap-1.5 flex-wrap pb-2 border-b border-slate-100">
        <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mr-1">
          <Zap className="w-3 h-3 text-indigo-500" /> Presets Glasgow:
        </span>
        <button
          type="button"
          onClick={() => applyGcsPreset(4, 5, 6, 'Alerta')}
          className="text-xs px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold border border-emerald-200 transition-colors"
        >
          ✨ Lúcido (15/15)
        </button>
        <button
          type="button"
          onClick={() => applyGcsPreset(3, 4, 6, 'Somnoliento')}
          className="text-xs px-2.5 py-1 rounded-md bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold border border-sky-200 transition-colors"
        >
          😴 Somnoliento (13/15)
        </button>
        <button
          type="button"
          onClick={() => applyGcsPreset(2, 3, 5, 'Confuso')}
          className="text-xs px-2.5 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold border border-amber-200 transition-colors"
        >
          ⚠️ Confuso (10/15)
        </button>
        <button
          type="button"
          onClick={() => applyGcsPreset(1, 1, 1, 'Inconsciente')}
          className="text-xs px-2.5 py-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold border border-rose-200 transition-colors"
        >
          🚨 Coma (3/15)
        </button>
      </div>

      {/* Consciousness level selector */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">
          Nivel de Conciencia
        </label>
        <div className="flex flex-wrap gap-1.5">
          {CONSCIOUSNESS_LEVELS.map((level) => {
            const isSelected = patient.n_conciencia === level;
            return (
              <button
                key={level}
                type="button"
                onClick={() => onChange({ n_conciencia: level })}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  isSelected
                    ? 'bg-indigo-700 text-white border-indigo-700 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {level}
              </button>
            );
          })}
        </div>
      </div>

      {/* Glasgow Scale details */}
      <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-200/80 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-indigo-700" />
            <span className="text-xs font-extrabold text-indigo-950 uppercase tracking-wider">
              Escala de Coma de Glasgow (GCS)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-indigo-900 font-semibold">Total:</span>
            <div className="px-3 py-1 bg-white border border-indigo-300 rounded-lg text-sm font-black text-indigo-900 shadow-2xs">
              {gcs.total} / 15
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${gcs.badgeColor}`}>
              {gcs.severity}
            </span>
          </div>
        </div>

        {/* 3 Glasgow criteria */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Ocular */}
          <div className="bg-white p-2.5 rounded-lg border border-indigo-100 shadow-2xs">
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>Apertura Ocular (1-4)</span>
              <span className="font-extrabold text-indigo-600">Puntaje: {patient.n_go}</span>
            </label>
            <select
              id="select_gcs_ocular"
              value={patient.n_go}
              onChange={(e) => onChange({ n_go: Number(e.target.value) })}
              className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-md font-semibold text-slate-800"
            >
              {GLASGOW_OPTIONS.ocular.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label} - {o.desc}
                </option>
              ))}
            </select>
          </div>

          {/* Verbal */}
          <div className="bg-white p-2.5 rounded-lg border border-indigo-100 shadow-2xs">
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>Respuesta Verbal (1-5)</span>
              <span className="font-extrabold text-indigo-600">Puntaje: {patient.n_gv}</span>
            </label>
            <select
              id="select_gcs_verbal"
              value={patient.n_gv}
              onChange={(e) => onChange({ n_gv: Number(e.target.value) })}
              className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-md font-semibold text-slate-800"
            >
              {GLASGOW_OPTIONS.verbal.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label} - {o.desc}
                </option>
              ))}
            </select>
          </div>

          {/* Motor */}
          <div className="bg-white p-2.5 rounded-lg border border-indigo-100 shadow-2xs">
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>Respuesta Motora (1-6)</span>
              <span className="font-extrabold text-indigo-600">Puntaje: {patient.n_gm}</span>
            </label>
            <select
              id="select_gcs_motor"
              value={patient.n_gm}
              onChange={(e) => onChange({ n_gm: Number(e.target.value) })}
              className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-md font-semibold text-slate-800"
            >
              {GLASGOW_OPTIONS.motor.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label} - {o.desc}
                </option>
              ))}
            </select>
          </div>
        </div>

        {gcs.total <= 8 && (
          <div className="p-2 bg-rose-100 border border-rose-300 rounded-lg text-rose-900 text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Alerta: Glasgow ≤ 8 es indicación de protección de vía aérea e intubación orotraqueal según protocolo.</span>
          </div>
        )}
      </div>

      {/* Pupilas y Reactividad */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-indigo-600" /> Pupilas
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {PUPIL_TYPES.map((pt) => {
              const isSelected = patient.n_pupilas === pt;
              return (
                <button
                  key={pt}
                  type="button"
                  onClick={() => onChange({ n_pupilas: pt })}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all text-center ${
                    isSelected
                      ? pt === 'Anisocóricas'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-indigo-700 text-white border-indigo-700 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {pt}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Fotorreactividad a la Luz
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onChange({ n_reactivas: 'Sí' })}
              className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                patient.n_reactivas === 'Sí'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              ✓ Reactivas (Sí)
            </button>
            <button
              type="button"
              onClick={() => onChange({ n_reactivas: 'No' })}
              className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                patient.n_reactivas === 'No'
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              ✕ Arreactivas (No)
            </button>
          </div>
        </div>
      </div>

      {/* Observations */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Observaciones Neurológicas Adicionales
        </label>
        <textarea
          rows={2}
          id="textarea_n_obs"
          value={patient.n_obs}
          onChange={(e) => onChange({ n_obs: e.target.value })}
          placeholder="Ej. Moviliza 4 extremidades de forma simétrica, sin signos meníngeos..."
          className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-indigo-600 font-medium"
        />
      </div>
    </div>
  );
};
