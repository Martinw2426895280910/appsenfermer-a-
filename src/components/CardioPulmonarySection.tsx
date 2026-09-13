import React from 'react';
import { Wind, Heart, Activity } from 'lucide-react';
import { PatientRecord } from '../types';

interface CardioPulmonarySectionProps {
  patient: PatientRecord;
  onChange: (fields: Partial<PatientRecord>) => void;
}

const PATTERNS = ['Eupneico', 'Taquipneico', 'Bradipneico', 'Disneico', 'Cheyne-Stokes'];
const SOUNDS = ['Normales', 'Sibilancias', 'Crepitantes', 'Roncus', 'Estridor', 'Ausentes'];
const O2_DEVICES = [
  'Cánula nasal 2 L/min',
  'Cánula nasal 3-4 L/min',
  'Máscara simple 6 L/min',
  'Máscara reservorio 10-15 L/min',
  'Máscara Venturi 28%-35%',
  'Máscara Venturi 50%',
  'VNI (BiPAP/CPAP)',
  'ARM (Vía aérea artificial)',
];

export const CardioPulmonarySection: React.FC<CardioPulmonarySectionProps> = ({
  patient,
  onChange,
}) => {
  return (
    <div className="space-y-5">
      {/* 1. RESPIRATORIO */}
      <div className="space-y-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-sky-600" />
          <h4 className="text-xs font-extrabold uppercase text-sky-950 tracking-wider">
            Evaluación Respiratoria
          </h4>
        </div>

        {/* Patrón respiratorio */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Patrón Respiratorio
          </label>
          <div className="flex flex-wrap gap-1.5">
            {PATTERNS.map((p) => {
              const isSelected = patient.r_patron === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => onChange({ r_patron: p })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    isSelected
                      ? p === 'Eupneico'
                        ? 'bg-sky-700 text-white border-sky-700 shadow-xs'
                        : 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Ruidos auscultatorios */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Ruidos Respiratorios (Auscultación)
          </label>
          <div className="flex flex-wrap gap-1.5">
            {SOUNDS.map((s) => {
              const isSelected = patient.r_ruidos === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => onChange({ r_ruidos: s })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    isSelected
                      ? s === 'Normales'
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Oxígeno suplementario */}
        <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-200 space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="text-xs font-bold text-sky-950">
              ¿Requiere Oxígeno Suplementario?
            </label>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => onChange({ r_o2: 'No', r_o2det: '' })}
                className={`px-3 py-1 text-xs font-bold rounded-md border ${
                  patient.r_o2 === 'No'
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                No (Aire ambiental)
              </button>
              <button
                type="button"
                onClick={() => onChange({ r_o2: 'Sí', r_o2det: patient.r_o2det || 'Cánula nasal 2 L/min' })}
                className={`px-3 py-1 text-xs font-bold rounded-md border ${
                  patient.r_o2 === 'Sí'
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-white text-slate-700 border-slate-300'
                }`}
              >
                Sí (Oxigenoterapia)
              </button>
            </div>
          </div>

          {patient.r_o2 === 'Sí' && (
            <div className="pt-2 border-t border-sky-200/80 space-y-2">
              <label className="block text-xs font-bold text-sky-900">
                Dispositivo y Flujo / Concentración
              </label>
              <div className="flex flex-wrap gap-1">
                {O2_DEVICES.map((dev) => (
                  <button
                    key={dev}
                    type="button"
                    onClick={() => onChange({ r_o2det: dev })}
                    className={`text-[11px] px-2 py-1 rounded border font-medium ${
                      patient.r_o2det === dev
                        ? 'bg-sky-700 text-white border-sky-700'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-sky-50'
                    }`}
                  >
                    {dev}
                  </button>
                ))}
              </div>
              <input
                type="text"
                id="input_r_o2det"
                value={patient.r_o2det}
                onChange={(e) => onChange({ r_o2det: e.target.value })}
                placeholder="O especifica dispositivo y litros (ej. Cánula a 3 L/min, Venturi al 35%)..."
                className="w-full px-3 py-1.5 text-xs bg-white border border-sky-300 rounded-lg focus:outline-sky-600"
              />
            </div>
          )}
        </div>

        {/* Tos y secreciones */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Tos / Características de las Secreciones
          </label>
          <input
            type="text"
            id="input_r_tos"
            value={patient.r_tos}
            onChange={(e) => onChange({ r_tos: e.target.value })}
            placeholder="Ej. Tos productiva con expectoración mucosa blanquecina, sin disnea..."
            className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-sky-600"
          />
        </div>
      </div>

      {/* 2. CARDIOVASCULAR & PERFUSIÓN */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-600" />
          <h4 className="text-xs font-extrabold uppercase text-rose-950 tracking-wider">
            Evaluación Cardiovascular y Perfusión Periférica
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Ritmo cardíaco */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Ritmo Cardíaco
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChange({ c_ritmo: 'Regular' })}
                className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  patient.c_ritmo === 'Regular'
                    ? 'bg-teal-700 text-white border-teal-700'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                ✓ Regular (Sinusal)
              </button>
              <button
                type="button"
                onClick={() => onChange({ c_ritmo: 'Irregular' })}
                className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  patient.c_ritmo === 'Irregular'
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                ⚠️ Irregular (Arritmia)
              </button>
            </div>
          </div>

          {/* Pulsos periféricos */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Pulsos Periféricos
            </label>
            <select
              id="select_c_pulsos"
              value={patient.c_pulsos}
              onChange={(e) => onChange({ c_pulsos: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-teal-600 font-semibold"
            >
              <option value="Presentes / simétricos">Presentes y simétricos (Normosfígmicos)</option>
              <option value="Disminuidos / débiles">Disminuidos / filiformes</option>
              <option value="Ausentes">Ausentes</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Relleno capilar */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Relleno Capilar
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChange({ c_relleno: '< 2 s' })}
                className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  patient.c_relleno === '< 2 s'
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                &lt; 2 seg (Normal)
              </button>
              <button
                type="button"
                onClick={() => onChange({ c_relleno: '> 2 s' })}
                className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  patient.c_relleno === '> 2 s'
                    ? 'bg-rose-600 text-white border-rose-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                &gt; 2 seg (Enlentecido)
              </button>
            </div>
          </div>

          {/* Edemas */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Edemas Periféricos
            </label>
            <select
              id="select_c_edemas"
              value={patient.c_edemas}
              onChange={(e) => onChange({ c_edemas: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-teal-600 font-semibold"
            >
              <option value="No">No presenta edemas</option>
              <option value="Sí — leve (+/++++)">Sí — Leve (+/++++) maleolar</option>
              <option value="Sí — moderado (++/++++)">Sí — Moderado (++/++++) hasta tercio medio</option>
              <option value="Sí — severo (+++/++++)">Sí — Severo (+++/++++) hasta rodilla / muslo</option>
              <option value="Anasarca (++++)">Anasarca generalizada</option>
            </select>
          </div>
        </div>

        {/* Perfusión y coloración */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Perfusión, Temperatura y Coloración Cutánea
          </label>
          <input
            type="text"
            id="input_c_perfusion"
            value={patient.c_perfusion}
            onChange={(e) => onChange({ c_perfusion: e.target.value })}
            placeholder="Ej. Piel rosada, tibia, sin frialdad distal ni cianosis..."
            className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-teal-600"
          />
          <div className="flex gap-1.5 mt-1.5 flex-wrap">
            {['Rosada y tibia', 'Pálida y fría', 'Cianosis distal', 'Moteada / Livedo'].map((desc) => (
              <button
                key={desc}
                type="button"
                onClick={() => onChange({ c_perfusion: desc })}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium"
              >
                + {desc}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
