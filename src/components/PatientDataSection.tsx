import React from 'react';
import { User, Bed, ShieldAlert, Scale } from 'lucide-react';
import { AgeGroupKey, PatientRecord } from '../types';
import { AGE_GROUP_RANGES } from '../constants/medicalData';
import { calculateIMC, determineAgeGroup } from '../utils/clinicalCalculations';

interface PatientDataSectionProps {
  patient: PatientRecord;
  onChange: (fields: Partial<PatientRecord>) => void;
}

const COMMON_ALLERGIES = [
  'Sin alergias (NKDA)',
  'Penicilina',
  'AINEs (Ibuprofeno/Dipirona)',
  'Cefalosporinas',
  'Látex',
  'Yodo / Medios de contraste',
];

export const PatientDataSection: React.FC<PatientDataSectionProps> = ({
  patient,
  onChange,
}) => {
  const imcInfo = calculateIMC(patient.peso, patient.talla, patient.grupoEtario);

  const handleAgeChange = (edadVal: string) => {
    const num = edadVal === '' ? '' : Number(edadVal);
    const suggestedGroup = determineAgeGroup(num, patient.unidadEdad);
    onChange({
      edad: num,
      grupoEtario: suggestedGroup,
    });
  };

  const handleUnitChange = (unit: 'anios' | 'meses' | 'dias') => {
    const suggestedGroup = determineAgeGroup(patient.edad, unit);
    onChange({
      unidadEdad: unit,
      grupoEtario: suggestedGroup,
    });
  };

  return (
    <div className="space-y-4">
      {/* Name and Bed */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-6">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Nombre y Apellido del Paciente *
          </label>
          <div className="relative">
            <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              id="input_p_nombre"
              value={patient.nombre}
              onChange={(e) => onChange({ nombre: e.target.value })}
              placeholder="Ej. Gómez, Alberto María"
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-teal-600 font-medium"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Cama / Habitación *
          </label>
          <div className="relative">
            <Bed className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              id="input_p_cama"
              value={patient.cama}
              onChange={(e) => onChange({ cama: e.target.value })}
              placeholder="Ej. Cama 204-A"
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-teal-600 font-bold text-teal-900"
            />
          </div>
        </div>

        <div className="sm:col-span-3">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Historia Clínica (HC)
          </label>
          <input
            type="text"
            id="input_p_hc"
            value={patient.historiaClinica}
            onChange={(e) => onChange({ historiaClinica: e.target.value })}
            placeholder="Ej. HC-94821"
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-teal-600"
          />
        </div>
      </div>

      {/* Age, Unit, Sex, Shift, Nurse */}
      <div className="grid grid-cols-2 sm:grid-cols-12 gap-3">
        <div className="col-span-1 sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1">Edad</label>
          <input
            type="number"
            id="input_p_edad"
            min="0"
            value={patient.edad}
            onChange={(e) => handleAgeChange(e.target.value)}
            placeholder="0"
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-teal-600"
          />
        </div>

        <div className="col-span-1 sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1">Unidad</label>
          <select
            id="select_p_unidad"
            value={patient.unidadEdad}
            onChange={(e) => handleUnitChange(e.target.value as any)}
            className="w-full px-2.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-teal-600"
          >
            <option value="anios">años</option>
            <option value="meses">meses</option>
            <option value="dias">días</option>
          </select>
        </div>

        <div className="col-span-1 sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1">Sexo</label>
          <select
            id="select_p_sexo"
            value={patient.sexo}
            onChange={(e) => onChange({ sexo: e.target.value as any })}
            className="w-full px-2.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-teal-600"
          >
            <option value="F">Femenino</option>
            <option value="M">Masculino</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div className="col-span-1 sm:col-span-3">
          <label className="block text-xs font-bold text-slate-700 mb-1">Turno</label>
          <select
            id="select_p_shift"
            value={patient.shift}
            onChange={(e) => onChange({ shift: e.target.value as any })}
            className="w-full px-2.5 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-teal-600 font-medium"
          >
            <option value="Mañana">Mañana (06 - 14 hs)</option>
            <option value="Tarde">Tarde (14 - 22 hs)</option>
            <option value="Noche">Noche (22 - 06 hs)</option>
            <option value="Guardia 24h">Guardia 24 hs</option>
          </select>
        </div>

        <div className="col-span-2 sm:col-span-3">
          <label className="block text-xs font-bold text-slate-700 mb-1">Enfermero/a a Cargo</label>
          <input
            type="text"
            id="input_p_nurse"
            value={patient.nurseName}
            onChange={(e) => onChange({ nurseName: e.target.value })}
            placeholder="Lic. / Enf."
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-teal-600"
          />
        </div>
      </div>

      {/* Age Group Selector Buttons */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
          <span>Grupo Etario y Rango de Referencia Clínico</span>
          <span className="text-[11px] text-teal-700 font-semibold">
            Activo: {AGE_GROUP_RANGES[patient.grupoEtario].label} ({AGE_GROUP_RANGES[patient.grupoEtario].sublabel})
          </span>
        </label>
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(AGE_GROUP_RANGES) as AgeGroupKey[]).map((key) => {
            const item = AGE_GROUP_RANGES[key];
            const isSelected = patient.grupoEtario === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onChange({ grupoEtario: key })}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  isSelected
                    ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Ajusta automáticamente los rangos de normalidad de signos vitales (pediatría vs adultos).
        </p>
      </div>

      {/* Weight, Height, BMI */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Peso (kg)
            </label>
            <input
              type="number"
              step="0.1"
              id="input_p_peso"
              value={patient.peso}
              onChange={(e) => onChange({ peso: e.target.value === '' ? '' : Number(e.target.value) })}
              placeholder="Ej. 70.5"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-teal-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Talla / Longitud (cm)
            </label>
            <input
              type="number"
              step="1"
              id="input_p_talla"
              value={patient.talla}
              onChange={(e) => onChange({ talla: e.target.value === '' ? '' : Number(e.target.value) })}
              placeholder="Ej. 170"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-teal-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-teal-700" />
              IMC Calculado
            </label>
            <div className="flex items-center gap-2">
              <div className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-extrabold text-slate-800 min-w-[70px] text-center">
                {imcInfo.imcValue || '—'}
              </div>
              {imcInfo.classification && (
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                    imcInfo.flag === 'ok'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      : imcInfo.flag === 'high'
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : imcInfo.flag === 'crit'
                      ? 'bg-rose-100 text-rose-800 border-rose-300'
                      : 'bg-sky-100 text-sky-800 border-sky-300'
                  }`}
                >
                  {imcInfo.classification}
                </span>
              )}
            </div>
          </div>
        </div>
        {imcInfo.hint && (
          <p className="text-[11px] text-slate-500 mt-2 font-medium">
            ℹ️ {imcInfo.hint}
          </p>
        )}
      </div>

      {/* Diagnosis & Motivo */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Diagnóstico Médico Principal / Motivo de Ingreso
        </label>
        <textarea
          id="input_p_dx"
          rows={2}
          value={patient.dx}
          onChange={(e) => onChange({ dx: e.target.value })}
          placeholder="Ej. Neumonía adquirida en la comunidad, Insuficiencia Cardíaca Congestiva descompensada..."
          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-teal-600 font-medium"
        />
      </div>

      {/* Allergies & Isolation */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-8">
          <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            Alergias Conocidas
          </label>
          <input
            type="text"
            id="input_p_alergias"
            value={patient.alergias}
            onChange={(e) => onChange({ alergias: e.target.value })}
            placeholder="Ej. Penicilina (rash cutáneo), Dipirona..."
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-teal-600 font-medium ${
              patient.alergias && !patient.alergias.includes('NKDA') && !patient.alergias.includes('Ninguna')
                ? 'bg-rose-50 border-rose-300 text-rose-900'
                : 'bg-slate-50 border-slate-300 text-slate-900'
            }`}
          />
          <div className="flex flex-wrap gap-1 mt-1.5">
            {COMMON_ALLERGIES.map((alg) => (
              <button
                key={alg}
                type="button"
                onClick={() => {
                  if (alg === 'Sin alergias (NKDA)') {
                    onChange({ alergias: 'Sin alergias conocidas (NKDA)' });
                  } else {
                    const current = patient.alergias || '';
                    if (current.includes('Sin alergias')) {
                      onChange({ alergias: alg });
                    } else if (!current.includes(alg)) {
                      onChange({ alergias: current ? `${current}, ${alg}` : alg });
                    }
                  }
                }}
                className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 font-semibold transition-colors"
              >
                + {alg}
              </button>
            ))}
          </div>
        </div>

        <div className="sm:col-span-4">
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Tipo de Aislamiento
          </label>
          <select
            id="select_p_aislamiento"
            value={patient.aislamiento}
            onChange={(e) => onChange({ aislamiento: e.target.value as any })}
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-teal-600 font-semibold ${
              patient.aislamiento !== 'Ninguno'
                ? 'bg-amber-50 border-amber-400 text-amber-950'
                : 'bg-slate-50 border-slate-300 text-slate-800'
            }`}
          >
            <option value="Ninguno">Ninguno (Precauciones estándar)</option>
            <option value="Contacto">Contacto (Guantes y bata)</option>
            <option value="Gotitas">Gotitas (Barbijo quirúrgico)</option>
            <option value="Aéreo">Aéreo / Respiratorio (N95/FFP2)</option>
            <option value="Protector">Protector / Inverso</option>
          </select>
        </div>
      </div>
    </div>
  );
};
