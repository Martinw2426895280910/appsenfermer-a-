import React from 'react';
import { 
  Stethoscope, 
  Users, 
  Plus, 
  FileText, 
  Share2, 
  Bed, 
  CheckCircle2, 
  ShieldAlert,
  Clock
} from 'lucide-react';
import { PatientRecord } from '../types';
import { SYSTEM_IMAGES } from '../constants/images';

interface HeaderProps {
  activePatient: PatientRecord;
  patientCount: number;
  criticalAlertCount: number;
  warningAlertCount: number;
  onOpenPatientModal: () => void;
  onNewPatient: () => void;
  onOpenReport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePatient,
  patientCount,
  criticalAlertCount,
  warningAlertCount,
  onOpenPatientModal,
  onNewPatient,
  onOpenReport,
}) => {
  return (
    <header className="relative bg-teal-950 text-white shadow-lg border-b border-teal-800">
      {/* Visual background pattern */}
      <div className="absolute inset-0 opacity-15 overflow-hidden pointer-events-none">
        <img 
          src={SYSTEM_IMAGES.heroBanner} 
          alt="Enfermería Banner" 
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-teal-950 via-teal-950/90 to-teal-900/80" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 pt-4 pb-3">
        {/* Top brand row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-teal-800/60">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-teal-900/40 ring-2 ring-teal-400/30">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  Enfermería WhatsApp
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Clínico v2.5
                </span>
              </div>
              <p className="text-xs text-teal-200/90 font-medium">
                Registro de pacientes y generación de informes para WhatsApp · <span className="text-teal-300 font-semibold">Agencia digital métele apps</span>
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              id="btn-patients-drawer"
              onClick={onOpenPatientModal}
              className="px-3 py-2 rounded-lg bg-teal-900/80 hover:bg-teal-800 text-teal-100 border border-teal-700/60 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              title="Ver lista de pacientes registrados"
            >
              <Users className="w-4 h-4 text-teal-300" />
              <span>Pacientes ({patientCount})</span>
            </button>

            <button
              id="btn-new-patient"
              onClick={onNewPatient}
              className="px-3 py-2 rounded-lg bg-teal-700 hover:bg-teal-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              title="Registrar nuevo paciente"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo</span>
            </button>

            <button
              id="btn-generate-whatsapp-report"
              onClick={onOpenReport}
              className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-950/30 active:scale-95"
            >
              <Share2 className="w-4 h-4" />
              <span>Informe WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Active Patient Bar */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-teal-900/90 px-2.5 py-1 rounded-md border border-teal-700/50">
              <Bed className="w-3.5 h-3.5 text-teal-300" />
              <span className="font-bold text-white">
                {activePatient.cama || 'Sin cama asignada'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-teal-900/60 px-2.5 py-1 rounded-md text-teal-100 border border-teal-800/40">
              <span className="text-teal-300 font-semibold">Paciente:</span>
              <span className="font-bold text-white truncate max-w-[180px] sm:max-w-[240px]">
                {activePatient.nombre || 'Sin nombre registrado'}
              </span>
              {activePatient.edad !== '' && (
                <span className="text-teal-200">
                  ({activePatient.edad} {activePatient.unidadEdad})
                </span>
              )}
            </div>

            <div className="hidden md:flex items-center gap-1.5 text-teal-300/80 bg-teal-900/40 px-2.5 py-1 rounded-md">
              <Clock className="w-3.5 h-3.5" />
              <span>Turno: <strong className="text-teal-100">{activePatient.shift}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {criticalAlertCount > 0 ? (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/50 text-[11px] font-bold animate-pulse">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>{criticalAlertCount} Alertas Críticas</span>
              </div>
            ) : warningAlertCount > 0 ? (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>{warningAlertCount} Advertencias</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Signos Estables</span>
              </div>
            )}

            <span className="text-[11px] text-teal-300/70 font-medium">
              Autoguardado en dispositivo
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
