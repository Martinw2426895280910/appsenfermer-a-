import React from 'react';
import { Droplets, Utensils } from 'lucide-react';
import { PatientRecord } from '../types';
import { calculateFluidBalance } from '../utils/clinicalCalculations';

interface FluidRenalSectionProps {
  patient: PatientRecord;
  onChange: (fields: Partial<PatientRecord>) => void;
}

const URINE_TRAITS = [
  'Clara / Normocoloreada',
  'Colúrica (oscura)',
  'Hemática (con sangre)',
  'Turbia con sedimentos',
  'Concentrada / Oliguria',
];

const DIET_PRESETS = [
  'General completa',
  'Blanda digestiva',
  'Hiposódica',
  'Para diabético',
  'Líquida amplia',
  'NPO (Ayuno estricto)',
];

export const FluidRenalSection: React.FC<FluidRenalSectionProps> = ({
  patient,
  onChange,
}) => {
  const balance = calculateFluidBalance(patient);

  return (
    <div className="space-y-5">
      {/* 1. BALANCE HÍDRICO */}
      <div className="space-y-3 pb-4 border-b border-slate-200">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-cyan-600" />
            <h4 className="text-xs font-extrabold uppercase text-cyan-950 tracking-wider">
              Balance Hídrico del Turno
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600">Balance Neto:</span>
            <span
              className={`px-3 py-1 rounded-lg text-xs font-black border ${
                balance.balance > 0
                  ? 'bg-sky-100 text-sky-900 border-sky-300'
                  : balance.balance < 0
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-emerald-100 text-emerald-900 border-emerald-300'
              }`}
            >
              {balance.balanceFormatted}
            </span>
          </div>
        </div>

        {/* Ingresos */}
        <div className="p-3 bg-cyan-50/50 rounded-xl border border-cyan-200">
          <span className="text-xs font-bold text-cyan-950 block mb-2">
            ➕ Total Ingresos: <strong className="text-cyan-800">{balance.inTotal} ml</strong>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                Vía Oral / Sonda (ml)
              </label>
              <input
                type="number"
                id="input_b_vo"
                min="0"
                value={patient.b_vo}
                onChange={(e) => onChange({ b_vo: e.target.value === '' ? '' : Number(e.target.value) })}
                placeholder="0"
                className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-cyan-600 font-semibold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                Vía Intravenosa / Sueros (ml)
              </label>
              <input
                type="number"
                id="input_b_iv"
                min="0"
                value={patient.b_iv}
                onChange={(e) => onChange({ b_iv: e.target.value === '' ? '' : Number(e.target.value) })}
                placeholder="0"
                className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-cyan-600 font-semibold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                Otros Ingresos (ml)
              </label>
              <input
                type="number"
                id="input_b_otrosIn"
                min="0"
                value={patient.b_otrosIn}
                onChange={(e) => onChange({ b_otrosIn: e.target.value === '' ? '' : Number(e.target.value) })}
                placeholder="0"
                className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-cyan-600 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* Egresos */}
        <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200">
          <span className="text-xs font-bold text-amber-950 block mb-2">
            ➖ Total Egresos: <strong className="text-amber-800">{balance.outTotal} ml</strong>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                Diuresis (ml)
              </label>
              <input
                type="number"
                id="input_b_diuresis"
                min="0"
                value={patient.b_diuresis}
                onChange={(e) => onChange({ b_diuresis: e.target.value === '' ? '' : Number(e.target.value) })}
                placeholder="0"
                className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-amber-600 font-semibold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                Drenajes Quirúrgicos (ml)
              </label>
              <input
                type="number"
                id="input_b_drenajes"
                min="0"
                value={patient.b_drenajes}
                onChange={(e) => onChange({ b_drenajes: e.target.value === '' ? '' : Number(e.target.value) })}
                placeholder="0"
                className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-amber-600 font-semibold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                Pérdidas Insensibles / Otras (ml)
              </label>
              <input
                type="number"
                id="input_b_otrosOut"
                min="0"
                value={patient.b_otrosOut}
                onChange={(e) => onChange({ b_otrosOut: e.target.value === '' ? '' : Number(e.target.value) })}
                placeholder="0"
                className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-amber-600 font-semibold"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. URINARIO */}
      <div className="space-y-3 pb-4 border-b border-slate-200">
        <h4 className="text-xs font-extrabold uppercase text-slate-900 tracking-wider">
          Función Renal & Sonda Vesical
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Diuresis del Turno / Tasa
            </label>
            <input
              type="text"
              id="input_u_diuresis"
              value={patient.u_diuresis}
              onChange={(e) => onChange({ u_diuresis: e.target.value })}
              placeholder="Ej. 1200 ml en 12h (~100 ml/h), espontánea..."
              className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-teal-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ¿Posee Sonda Vesical (Foley)?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChange({ u_sonda: 'No' })}
                className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  patient.u_sonda === 'No'
                    ? 'bg-teal-700 text-white border-teal-700'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                No (Espontánea)
              </button>
              <button
                type="button"
                onClick={() => onChange({ u_sonda: 'Sí' })}
                className={`py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  patient.u_sonda === 'Sí'
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Sí (Sonda Foley)
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Aspecto y Características de la Orina
          </label>
          <input
            type="text"
            id="input_u_caract"
            value={patient.u_caract}
            onChange={(e) => onChange({ u_caract: e.target.value })}
            placeholder="Color, sedimento, olor..."
            className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-teal-600"
          />
          <div className="flex gap-1.5 mt-1.5 flex-wrap">
            {URINE_TRAITS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onChange({ u_caract: t })}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium"
              >
                + {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. NUTRICIÓN */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Utensils className="w-4 h-4 text-orange-600" />
          <h4 className="text-xs font-extrabold uppercase text-orange-950 tracking-wider">
            Nutrición y Vía Digestiva
          </h4>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Tipo de Dieta Prescripta
          </label>
          <input
            type="text"
            id="input_nu_dieta"
            value={patient.nu_dieta}
            onChange={(e) => onChange({ nu_dieta: e.target.value })}
            placeholder="Ej. Blanda hiposódica para patología respiratoria..."
            className="w-full px-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-orange-600"
          />
          <div className="flex gap-1.5 mt-1.5 flex-wrap">
            {DIET_PRESETS.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => onChange({ nu_dieta: d })}
                className="text-[10px] px-2 py-0.5 rounded bg-orange-100 hover:bg-orange-200 text-orange-900 font-semibold"
              >
                + {d}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Vía</label>
            <select
              id="select_nu_via"
              value={patient.nu_via}
              onChange={(e) => onChange({ nu_via: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-orange-600 font-medium"
            >
              <option>Oral</option>
              <option>Enteral (SNG / K108)</option>
              <option>Parenteral (NPT)</option>
              <option>NPO (Ayuno)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Tolerancia</label>
            <select
              id="select_nu_tolerancia"
              value={patient.nu_tolerancia}
              onChange={(e) => onChange({ nu_tolerancia: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-orange-600 font-medium"
            >
              <option>Buena</option>
              <option>Regular</option>
              <option>Mala (náuseas / vómitos / reflujo)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Apetito</label>
            <select
              id="select_nu_apetito"
              value={patient.nu_apetito}
              onChange={(e) => onChange({ nu_apetito: e.target.value })}
              className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-orange-600 font-medium"
            >
              <option>Conservado</option>
              <option>Disminuido / hiporexia</option>
              <option>Anorexia</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
