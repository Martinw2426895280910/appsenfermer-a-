import React from 'react';
import { Heart, Activity, Thermometer, Wind, Zap } from 'lucide-react';
import { PatientRecord } from '../types';
import { AGE_GROUP_RANGES } from '../constants/medicalData';
import { evaluateSpo2, evaluateVitalSign } from '../utils/clinicalCalculations';

interface VitalSignsSectionProps {
  patient: PatientRecord;
  onChange: (fields: Partial<PatientRecord>) => void;
}

export const VitalSignsSection: React.FC<VitalSignsSectionProps> = ({
  patient,
  onChange,
}) => {
  const r = AGE_GROUP_RANGES[patient.grupoEtario];

  const fcEval = evaluateVitalSign(patient.v_fc, r.fc);
  const frEval = evaluateVitalSign(patient.v_fr, r.fr);
  const tasEval = evaluateVitalSign(patient.v_tas, r.tas);
  const tadEval = evaluateVitalSign(patient.v_tad, r.tad);
  const tempEval = evaluateVitalSign(patient.v_temp, r.temp, 0.05);
  const spo2Eval = evaluateSpo2(patient.v_spo2, r.spo2);

  const getBadgeClass = (flag: string) => {
    switch (flag) {
      case 'ok':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'low':
      case 'high':
        return 'bg-amber-100 text-amber-800 border-amber-300 font-bold';
      case 'crit':
        return 'bg-rose-500 text-white font-extrabold animate-pulse';
      default:
        return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  // Quick Preset Handlers
  const applyNormalPreset = () => {
    onChange({
      v_fc: Math.round((r.fc[0] + r.fc[1]) / 2),
      v_fr: Math.round((r.fr[0] + r.fr[1]) / 2),
      v_tas: Math.round((r.tas[0] + r.tas[1]) / 2),
      v_tad: Math.round((r.tad[0] + r.tad[1]) / 2),
      v_temp: 36.6,
      v_spo2: 98,
    });
  };

  const applyFeverPreset = () => {
    onChange({
      v_fc: 104,
      v_fr: 22,
      v_temp: 38.6,
    });
  };

  const applyHypertensionPreset = () => {
    onChange({
      v_tas: 175,
      v_tad: 105,
      v_fc: 92,
    });
  };

  const applyHypoxiaPreset = () => {
    onChange({
      v_spo2: 89,
      v_fr: 28,
      v_fc: 110,
    });
  };

  return (
    <div className="space-y-4">
      {/* Quick Clinical Presets Bar */}
      <div className="flex items-center gap-1.5 flex-wrap pb-2 border-b border-slate-100">
        <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mr-1">
          <Zap className="w-3 h-3 text-amber-500" /> Presets rápidos:
        </span>
        <button
          type="button"
          onClick={applyNormalPreset}
          className="text-xs px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold border border-emerald-200 transition-colors"
        >
          ✨ Normal ({r.label})
        </button>
        <button
          type="button"
          onClick={applyFeverPreset}
          className="text-xs px-2.5 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold border border-amber-200 transition-colors"
        >
          🔥 Cuadro Febril
        </button>
        <button
          type="button"
          onClick={applyHypertensionPreset}
          className="text-xs px-2.5 py-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold border border-rose-200 transition-colors"
        >
          🫀 Crisis HTA
        </button>
        <button
          type="button"
          onClick={applyHypoxiaPreset}
          className="text-xs px-2.5 py-1 rounded-md bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold border border-sky-200 transition-colors"
        >
          🫁 Hipoxemia
        </button>
      </div>

      {/* Grid of 6 vitals */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* FC */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-600" /> FC
              </label>
              <span className="text-[10px] text-slate-400 font-mono">lpm</span>
            </div>
            <input
              type="number"
              id="input_v_fc"
              value={patient.v_fc}
              onChange={(e) => onChange({ v_fc: e.target.value === '' ? '' : Number(e.target.value) })}
              placeholder={`${r.fc[0]}-${r.fc[1]}`}
              className="mt-1.5 w-full text-center text-lg font-extrabold bg-white border border-slate-300 rounded-lg py-1.5 focus:outline-teal-600"
            />
          </div>
          <div className="mt-2 text-center">
            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] border ${getBadgeClass(fcEval.flag)}`}>
              {fcEval.label}
            </span>
          </div>
        </div>

        {/* FR */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-sky-600" /> FR
              </label>
              <span className="text-[10px] text-slate-400 font-mono">rpm</span>
            </div>
            <input
              type="number"
              id="input_v_fr"
              value={patient.v_fr}
              onChange={(e) => onChange({ v_fr: e.target.value === '' ? '' : Number(e.target.value) })}
              placeholder={`${r.fr[0]}-${r.fr[1]}`}
              className="mt-1.5 w-full text-center text-lg font-extrabold bg-white border border-slate-300 rounded-lg py-1.5 focus:outline-teal-600"
            />
          </div>
          <div className="mt-2 text-center">
            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] border ${getBadgeClass(frEval.flag)}`}>
              {frEval.label}
            </span>
          </div>
        </div>

        {/* TA Sistólica */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-indigo-600" /> TA Sistólica
              </label>
              <span className="text-[10px] text-slate-400 font-mono">mmHg</span>
            </div>
            <input
              type="number"
              id="input_v_tas"
              value={patient.v_tas}
              onChange={(e) => onChange({ v_tas: e.target.value === '' ? '' : Number(e.target.value) })}
              placeholder={`${r.tas[0]}-${r.tas[1]}`}
              className="mt-1.5 w-full text-center text-lg font-extrabold bg-white border border-slate-300 rounded-lg py-1.5 focus:outline-teal-600"
            />
          </div>
          <div className="mt-2 text-center">
            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] border ${getBadgeClass(tasEval.flag)}`}>
              {tasEval.label}
            </span>
          </div>
        </div>

        {/* TA Diastólica */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-indigo-600" /> TA Diastólica
              </label>
              <span className="text-[10px] text-slate-400 font-mono">mmHg</span>
            </div>
            <input
              type="number"
              id="input_v_tad"
              value={patient.v_tad}
              onChange={(e) => onChange({ v_tad: e.target.value === '' ? '' : Number(e.target.value) })}
              placeholder={`${r.tad[0]}-${r.tad[1]}`}
              className="mt-1.5 w-full text-center text-lg font-extrabold bg-white border border-slate-300 rounded-lg py-1.5 focus:outline-teal-600"
            />
          </div>
          <div className="mt-2 text-center">
            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] border ${getBadgeClass(tadEval.flag)}`}>
              {tadEval.label}
            </span>
          </div>
        </div>

        {/* Temperatura */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-amber-600" /> Temp
              </label>
              <span className="text-[10px] text-slate-400 font-mono">°C</span>
            </div>
            <input
              type="number"
              step="0.1"
              id="input_v_temp"
              value={patient.v_temp}
              onChange={(e) => onChange({ v_temp: e.target.value === '' ? '' : Number(e.target.value) })}
              placeholder="36.5"
              className="mt-1.5 w-full text-center text-lg font-extrabold bg-white border border-slate-300 rounded-lg py-1.5 focus:outline-teal-600"
            />
          </div>
          <div className="mt-2 text-center">
            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] border ${getBadgeClass(tempEval.flag)}`}>
              {tempEval.label}
            </span>
          </div>
        </div>

        {/* SpO2 */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-teal-600" /> SpO₂
              </label>
              <span className="text-[10px] text-slate-400 font-mono">%</span>
            </div>
            <input
              type="number"
              id="input_v_spo2"
              value={patient.v_spo2}
              onChange={(e) => onChange({ v_spo2: e.target.value === '' ? '' : Number(e.target.value) })}
              placeholder={`≥${r.spo2}`}
              className="mt-1.5 w-full text-center text-lg font-extrabold bg-white border border-slate-300 rounded-lg py-1.5 focus:outline-teal-600"
            />
          </div>
          <div className="mt-2 text-center">
            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] border ${getBadgeClass(spo2Eval.flag)}`}>
              {spo2Eval.label}
            </span>
          </div>
        </div>
      </div>

      {/* Reference note */}
      <div className="p-2.5 rounded-lg bg-teal-50/60 border border-teal-200/80 text-[11px] text-teal-900 flex items-center justify-between flex-wrap gap-2">
        <span>
          <strong>Referencia para {r.label}:</strong> FC {r.fc[0]}–{r.fc[1]} lpm • FR {r.fr[0]}–{r.fr[1]} rpm • TA {r.tas[0]}–{r.tas[1]}/{r.tad[0]}–{r.tad[1]} mmHg • Temp {r.temp[0]}–{r.temp[1]} °C • SpO₂ ≥ {r.spo2}%
        </span>
        <span className="font-semibold text-teal-700">
          Evaluado en tiempo real
        </span>
      </div>
    </div>
  );
};
