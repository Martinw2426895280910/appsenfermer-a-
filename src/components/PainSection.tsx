import React from 'react';
import { Smile, Meh, Frown, AlertCircle } from 'lucide-react';
import { PatientRecord } from '../types';

interface PainSectionProps {
  patient: PatientRecord;
  onChange: (fields: Partial<PatientRecord>) => void;
}

const PAIN_TYPES = [
  'Punzante',
  'Opresivo',
  'Cólico',
  'Ardor / Quemante',
  'Sordo / Constante',
  'Pulsátil',
  'Irradiado',
];

const EVA_LEVELS = [
  { val: 0, label: 'Sin dolor', icon: '😃', color: 'bg-emerald-500 text-white' },
  { val: 2, label: 'Leve', icon: '🙂', color: 'bg-teal-500 text-white' },
  { val: 4, label: 'Moderado', icon: '😐', color: 'bg-amber-500 text-white' },
  { val: 6, label: 'Intenso', icon: '🙁', color: 'bg-orange-500 text-white' },
  { val: 8, label: 'Muy fuerte', icon: '😣', color: 'bg-rose-500 text-white' },
  { val: 10, label: 'Máximo', icon: '😫', color: 'bg-red-700 text-white' },
];

export const PainSection: React.FC<PainSectionProps> = ({
  patient,
  onChange,
}) => {
  const getEvaColorClass = (v: number) => {
    if (v === 0) return 'text-emerald-600';
    if (v <= 3) return 'text-teal-600';
    if (v <= 6) return 'text-amber-600';
    if (v <= 8) return 'text-rose-600';
    return 'text-red-700';
  };

  const getEvaLabel = (v: number) => {
    if (v === 0) return '0 / 10 - Sin Dolor';
    if (v <= 3) return `${v} / 10 - Dolor Leve`;
    if (v <= 6) return `${v} / 10 - Dolor Moderado`;
    if (v <= 8) return `${v} / 10 - Dolor Severo`;
    return `${v} / 10 - Dolor Inaguantable / Máximo`;
  };

  return (
    <div className="space-y-4">
      {/* Visual EVA Card */}
      <div className="p-4 bg-amber-50/40 rounded-xl border border-amber-200/80 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-amber-950 uppercase tracking-wider">
            Escala Visual Analógica (EVA 0 – 10)
          </label>
          <span className={`text-sm font-black ${getEvaColorClass(patient.d_eva)}`}>
            {getEvaLabel(patient.d_eva)}
          </span>
        </div>

        {/* Big number and interactive faces */}
        <div className="flex items-center justify-center gap-4 py-2">
          <div className="flex flex-col items-center">
            <span className={`text-4xl font-black ${getEvaColorClass(patient.d_eva)}`}>
              {patient.d_eva}
            </span>
            <span className="text-[10px] text-slate-500 font-semibold mt-0.5">Puntaje actual</span>
          </div>

          {/* Quick preset faces */}
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
            {EVA_LEVELS.map((lvl) => {
              const isSelected = patient.d_eva === lvl.val;
              return (
                <button
                  key={lvl.val}
                  type="button"
                  onClick={() => onChange({ d_eva: lvl.val })}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all border ${
                    isSelected
                      ? `${lvl.color} shadow-md scale-105 border-transparent ring-2 ring-amber-400`
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xl">{lvl.icon}</span>
                  <span className="text-[10px] font-bold mt-0.5">{lvl.val}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Range Slider */}
        <div className="px-2">
          <input
            type="range"
            min="0"
            max="10"
            step="1"
            id="range_d_eva"
            value={patient.d_eva}
            onChange={(e) => onChange({ d_eva: Number(e.target.value) })}
            className="w-full accent-amber-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-bold px-1 mt-1">
            <span>0 (Sin dolor)</span>
            <span>5 (Moderado)</span>
            <span>10 (Máximo)</span>
          </div>
        </div>
      </div>

      {/* Location and Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Localización Anatómica del Dolor
          </label>
          <input
            type="text"
            id="input_d_loc"
            value={patient.d_loc}
            onChange={(e) => onChange({ d_loc: e.target.value })}
            placeholder="Ej. Tórax hemisferio derecho, herida quirúrgica..."
            className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-amber-600"
          />
          <div className="flex gap-1 mt-1.5 flex-wrap">
            {['Abdominal', 'Torácico', 'Cefálico', 'Lumbar', 'Extremidades', 'Herida quirúrgica'].map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => onChange({ d_loc: loc })}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium"
              >
                + {loc}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Tipo / Carácter del Dolor
          </label>
          <select
            id="select_d_tipo"
            value={patient.d_tipo}
            onChange={(e) => onChange({ d_tipo: e.target.value })}
            className="w-full px-2.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-amber-600 font-semibold"
          >
            {PAIN_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Treatment administered */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Tratamiento Analgésico Administrado / Medidas de Alivio
        </label>
        <input
          type="text"
          id="input_d_tto"
          value={patient.d_tto}
          onChange={(e) => onChange({ d_tto: e.target.value })}
          placeholder="Ej. Paracetamol 1g EV reglado, morfina 2mg SC de rescate, cambios posturales..."
          className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-amber-600"
        />
      </div>

      {patient.d_eva >= 7 && (
        <div className="p-2.5 bg-rose-100 border border-rose-300 rounded-lg text-rose-900 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>Alerta de Dolor Severo (EVA ≥ 7): Informar de inmediato al médico a cargo y valorar analgesia de rescate según prescripción.</span>
        </div>
      )}
    </div>
  );
};
