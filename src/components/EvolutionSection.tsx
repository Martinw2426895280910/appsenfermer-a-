import React from 'react';
import { FileText, Sparkles, CheckSquare } from 'lucide-react';
import { PatientRecord } from '../types';

interface EvolutionSectionProps {
  patient: PatientRecord;
  onChange: (fields: Partial<PatientRecord>) => void;
}

export const EvolutionSection: React.FC<EvolutionSectionProps> = ({
  patient,
  onChange,
}) => {
  const insertSoapTemplate = () => {
    const template = `S (Subjetivo): Paciente refiere encontrarse con buen descanso, refiere leve molestia en tórax derecho con la tos.
O (Objetivo): Lúcido, afebril, hemodinámicamente estable. TA: ${patient.v_tas || '120'}/${patient.v_tad || '80'} mmHg, FC: ${patient.v_fc || '80'} lpm, SpO2: ${patient.v_spo2 || '96'}% con cánula nasal. Diuresis conservada.
A (Apreciación): Evolución clínica favorable de su cuadro respiratorio en su segundo día de antibióticoterapia.
P (Plan): Continuar con hidratación EV y antibióticos pautados. Fisioterapia respiratoria. Control de signos por turno.`;
    onChange({ ev_nota: template });
  };

  const insertDarTemplate = () => {
    const template = `D (Datos): Paciente manifiesta dolor en herida quirúrgica EVA ${patient.d_eva || '4'}/10 tras deambulación. TA: ${patient.v_tas || '130'}/${patient.v_tad || '85'} mmHg.
A (Acción): Se administra analgesia pautada (Paracetamol 1g EV) previa comprobación de accesos venosos permeables. Se coloca en posición semifowler confortable.
R (Respuesta): A los 40 minutos paciente refiere descenso del dolor a EVA 1/10. Signos vitales estables. Descansa tranquilamente.`;
    onChange({ ev_nota: template });
  };

  const insertStandardStable = () => {
    const template = `Paciente descansando confortablemente en su cama, lúcido, ubicado en tiempo y espacio. Signos vitales dentro de parámetros fisiológicos normales. Tolera adecuadamente la dieta asignada y medicación por vía oral/EV. Diuresis y catarsis presentes de características normales. Sin signos de alarma al momento del pase de guardia.`;
    onChange({ ev_nota: template });
  };

  return (
    <div className="space-y-4">
      {/* Quick Templates Bar */}
      <div>
        <div className="flex items-center justify-between flex-wrap gap-2 mb-1.5">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-teal-700" />
            Nota de Evolución del Turno de Enfermería
          </label>
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Plantillas rápidas:
            </span>
            <button
              type="button"
              onClick={insertSoapTemplate}
              className="text-[10px] px-2 py-0.5 rounded bg-teal-100 hover:bg-teal-200 text-teal-900 font-bold"
            >
              Formato SOAP
            </button>
            <button
              type="button"
              onClick={insertDarTemplate}
              className="text-[10px] px-2 py-0.5 rounded bg-indigo-100 hover:bg-indigo-200 text-indigo-900 font-bold"
            >
              Formato DAR
            </button>
            <button
              type="button"
              onClick={insertStandardStable}
              className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold"
            >
              Estable / Favorable
            </button>
          </div>
        </div>

        <textarea
          rows={5}
          id="textarea_ev_nota"
          value={patient.ev_nota}
          onChange={(e) => onChange({ ev_nota: e.target.value })}
          placeholder="Describe la evolución durante el turno, tolerancia a medicamentos, eventos especiales, respuesta a procedimientos..."
          className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-teal-600 font-medium leading-relaxed"
        />
      </div>

      {/* Pendientes y Pase de Guardia */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
          <CheckSquare className="w-4 h-4 text-amber-600" />
          Pendientes y Observaciones para el Pase de Guardia (Próximo Turno)
        </label>
        <textarea
          rows={3}
          id="textarea_pendientes"
          value={patient.pendientes}
          onChange={(e) => onChange({ pendientes: e.target.value })}
          placeholder="• Control horario de glucemia a las 18 hs.
• Retirar vía periférica y rotar sitio de punción.
• Pendiente control radiológico o analítica de orina..."
          className="w-full px-3 py-2 text-xs sm:text-sm bg-amber-50/40 border border-amber-300/80 rounded-lg focus:bg-white focus:outline-amber-600 font-medium"
        />
      </div>
    </div>
  );
};
