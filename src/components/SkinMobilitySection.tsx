import React from 'react';
import { Shield, Activity, AlertTriangle, Zap } from 'lucide-react';
import { PatientRecord } from '../types';
import { BRADEN_CRITERIA } from '../constants/medicalData';
import { calculateBraden, calculateDownton } from '../utils/clinicalCalculations';

interface SkinMobilitySectionProps {
  patient: PatientRecord;
  onChange: (fields: Partial<PatientRecord>) => void;
}

const MOBILITY_LEVELS = [
  'Independiente',
  'Requiere ayuda parcial',
  'Dependiente total',
  'Encamado estricto',
];

export const SkinMobilitySection: React.FC<SkinMobilitySectionProps> = ({
  patient,
  onChange,
}) => {
  const braden = calculateBraden(
    patient.br_1,
    patient.br_2,
    patient.br_3,
    patient.br_4,
    patient.br_5,
    patient.br_6
  );

  const downton = calculateDownton(
    patient.dt_1,
    patient.dt_2,
    patient.dt_3,
    patient.dt_4,
    patient.dt_5
  );

  const applyBradenPreset = (p1: number, p2: number, p3: number, p4: number, p5: number, p6: number) => {
    onChange({
      br_1: p1,
      br_2: p2,
      br_3: p3,
      br_4: p4,
      br_5: p5,
      br_6: p6,
    });
  };

  return (
    <div className="space-y-5">
      {/* 1. PIEL E INTEGRIDAD CUTÁNEA */}
      <div className="space-y-3 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-purple-600" />
          <h4 className="text-xs font-extrabold uppercase text-purple-950 tracking-wider">
            Integridad Cutánea
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Estado de la Piel
            </label>
            <select
              id="select_pi_integridad"
              value={patient.pi_integridad}
              onChange={(e) => onChange({ pi_integridad: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-purple-600 font-semibold"
            >
              <option value="Íntegra">Íntegra (sin lesiones activas)</option>
              <option value="Eritema no blanqueable (Grado I)">Eritema no blanqueable (Grado I)</option>
              <option value="Úlcera por presión / herida presente">Úlcera por presión presente</option>
              <option value="Herida quirúrgica / sutura">Herida quirúrgica / apósito limpio</option>
              <option value="Hematomas / escoriaciones">Hematomas / escoriaciones</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Localización y Descripción de la Lesión
            </label>
            <input
              type="text"
              id="input_pi_loc"
              value={patient.pi_loc}
              onChange={(e) => onChange({ pi_loc: e.target.value })}
              placeholder="Ej. Región sacra, talón derecho, trocánter..."
              className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-purple-600"
            />
          </div>
        </div>

        {/* ESCALA DE BRADEN */}
        <div className="p-3.5 bg-purple-50/50 rounded-xl border border-purple-200 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-xs font-extrabold text-purple-950 uppercase tracking-wider block">
                Escala de Braden (Riesgo de Úlceras por Presión - UPP)
              </span>
              <span className="text-[11px] text-purple-800 font-medium">
                Puntaje de 6 a 23 puntos. Menor puntaje = Mayor riesgo.
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-purple-950 font-bold">Total:</span>
              <div className="px-3 py-1 bg-white border border-purple-300 rounded-lg text-sm font-black text-purple-900 shadow-2xs">
                {braden.total} / 23
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${braden.colorClass}`}>
                {braden.risk}
              </span>
            </div>
          </div>

          {/* Quick presets Braden */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
              <Zap className="w-3 h-3 text-purple-600" /> Presets rápidos:
            </span>
            <button
              type="button"
              onClick={() => applyBradenPreset(4, 4, 4, 4, 4, 3)}
              className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-semibold"
            >
              ✨ Sin riesgo (23)
            </button>
            <button
              type="button"
              onClick={() => applyBradenPreset(3, 3, 2, 2, 2, 2)}
              className="text-[11px] px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold"
            >
              ⚠️ Riesgo moderado (14)
            </button>
            <button
              type="button"
              onClick={() => applyBradenPreset(2, 2, 1, 2, 2, 1)}
              className="text-[11px] px-2 py-0.5 rounded bg-rose-100 hover:bg-rose-200 text-rose-900 font-semibold"
            >
              🚨 Alto riesgo (10)
            </button>
          </div>

          {/* 6 Selects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                1. Percepción Sensorial (1-4)
              </label>
              <select
                id="select_br_1"
                value={patient.br_1}
                onChange={(e) => onChange({ br_1: Number(e.target.value) })}
                className="w-full p-1.5 text-xs bg-white border border-purple-200 rounded-md font-semibold"
              >
                {BRADEN_CRITERIA.percepcion.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                2. Exposición a Humedad (1-4)
              </label>
              <select
                id="select_br_2"
                value={patient.br_2}
                onChange={(e) => onChange({ br_2: Number(e.target.value) })}
                className="w-full p-1.5 text-xs bg-white border border-purple-200 rounded-md font-semibold"
              >
                {BRADEN_CRITERIA.humedad.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                3. Actividad Física (1-4)
              </label>
              <select
                id="select_br_3"
                value={patient.br_3}
                onChange={(e) => onChange({ br_3: Number(e.target.value) })}
                className="w-full p-1.5 text-xs bg-white border border-purple-200 rounded-md font-semibold"
              >
                {BRADEN_CRITERIA.actividad.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                4. Movilidad Corporal (1-4)
              </label>
              <select
                id="select_br_4"
                value={patient.br_4}
                onChange={(e) => onChange({ br_4: Number(e.target.value) })}
                className="w-full p-1.5 text-xs bg-white border border-purple-200 rounded-md font-semibold"
              >
                {BRADEN_CRITERIA.movilidad.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                5. Nutrición (1-4)
              </label>
              <select
                id="select_br_5"
                value={patient.br_5}
                onChange={(e) => onChange({ br_5: Number(e.target.value) })}
                className="w-full p-1.5 text-xs bg-white border border-purple-200 rounded-md font-semibold"
              >
                {BRADEN_CRITERIA.nutricion.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-0.5">
                6. Fricción y Cizallamiento (1-3)
              </label>
              <select
                id="select_br_6"
                value={patient.br_6}
                onChange={(e) => onChange({ br_6: Number(e.target.value) })}
                className="w-full p-1.5 text-xs bg-white border border-purple-200 rounded-md font-semibold"
              >
                {BRADEN_CRITERIA.friccion.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MOVILIDAD Y RIESGO DE CAÍDAS (DOWNTON) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-violet-600" />
          <h4 className="text-xs font-extrabold uppercase text-violet-950 tracking-wider">
            Movilidad y Escala de Downton (Prevención de Caídas)
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nivel de Movilidad Funcional
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {MOBILITY_LEVELS.map((m) => {
                const isSelected = patient.m_nivel === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => onChange({ m_nivel: m })}
                    className={`p-2 rounded-lg text-xs font-semibold border transition-all text-center ${
                      isSelected
                        ? 'bg-violet-700 text-white border-violet-700 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Dispositivos de Asistencia / Ayudas Técnicas
            </label>
            <input
              type="text"
              id="input_m_disp"
              value={patient.m_disp}
              onChange={(e) => onChange({ m_disp: e.target.value })}
              placeholder="Ej. Andador con ruedas, bastón canadiense, asistencia de 1 enfermero..."
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-violet-600 font-medium"
            />
          </div>
        </div>

        {/* Checkbox checklist Downton */}
        <div className="p-3.5 bg-violet-50/50 rounded-xl border border-violet-200 space-y-2.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-extrabold text-violet-950 uppercase tracking-wider">
              Ítems Escala Downton (Marca los que apliquen):
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-violet-950">Puntaje:</span>
              <span className="px-2.5 py-0.5 bg-white border border-violet-300 rounded-md text-xs font-black text-violet-950">
                {downton.total} / 5
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  downton.isHighRisk
                    ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}
              >
                {downton.risk}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-violet-100 cursor-pointer hover:bg-violet-50/50">
              <input
                type="checkbox"
                id="checkbox_dt_1"
                checked={patient.dt_1}
                onChange={(e) => onChange({ dt_1: e.target.checked })}
                className="w-4 h-4 rounded text-violet-600 accent-violet-600"
              />
              <span className="font-semibold text-slate-800">1. Caídas previas en los últimos 12 meses (+1)</span>
            </label>

            <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-violet-100 cursor-pointer hover:bg-violet-50/50">
              <input
                type="checkbox"
                id="checkbox_dt_2"
                checked={patient.dt_2}
                onChange={(e) => onChange({ dt_2: e.target.checked })}
                className="w-4 h-4 rounded text-violet-600 accent-violet-600"
              />
              <span className="font-semibold text-slate-800">2. Medicación de riesgo (&gt;4 fármacos o sedantes) (+1)</span>
            </label>

            <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-violet-100 cursor-pointer hover:bg-violet-50/50">
              <input
                type="checkbox"
                id="checkbox_dt_3"
                checked={patient.dt_3}
                onChange={(e) => onChange({ dt_3: e.target.checked })}
                className="w-4 h-4 rounded text-violet-600 accent-violet-600"
              />
              <span className="font-semibold text-slate-800">3. Déficits sensoriales (visual / auditivo) (+1)</span>
            </label>

            <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-violet-100 cursor-pointer hover:bg-violet-50/50">
              <input
                type="checkbox"
                id="checkbox_dt_4"
                checked={patient.dt_4}
                onChange={(e) => onChange({ dt_4: e.target.checked })}
                className="w-4 h-4 rounded text-violet-600 accent-violet-600"
              />
              <span className="font-semibold text-slate-800">4. Estado mental alterado / confuso (+1)</span>
            </label>

            <label className="flex items-center gap-2 p-2 bg-white rounded-lg border border-violet-100 cursor-pointer hover:bg-violet-50/50 sm:col-span-2">
              <input
                type="checkbox"
                id="checkbox_dt_5"
                checked={patient.dt_5}
                onChange={(e) => onChange({ dt_5: e.target.checked })}
                className="w-4 h-4 rounded text-violet-600 accent-violet-600"
              />
              <span className="font-semibold text-slate-800">5. Marcha inestable / requiere ayuda o deambulación asistida (+1)</span>
            </label>
          </div>

          {downton.isHighRisk && (
            <div className="p-2 bg-amber-100 border border-amber-300 rounded-lg text-amber-950 text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Precaución: Alto riesgo de caídas. Mantener barandas de cama elevadas, timbre al alcance y asistencia obligatoria para el baño.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
