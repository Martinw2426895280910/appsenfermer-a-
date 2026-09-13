import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ClinicalAlert } from '../types';

interface AlertsCardProps {
  alerts: ClinicalAlert[];
}

export const AlertsCard: React.FC<AlertsCardProps> = ({ alerts }) => {
  const criticals = alerts.filter((a) => a.level === 'crit');
  const warnings = alerts.filter((a) => a.level === 'warn');

  return (
    <div
      id="alerts-card"
      className={`rounded-xl border p-3.5 sm:p-4 transition-all ${
        criticals.length > 0
          ? 'bg-rose-50/90 border-rose-300 ring-1 ring-rose-300 shadow-sm'
          : warnings.length > 0
          ? 'bg-amber-50/80 border-amber-300 shadow-sm'
          : 'bg-emerald-50/70 border-emerald-200'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {criticals.length > 0 ? (
            <ShieldAlert className="w-5 h-5 text-rose-600 animate-bounce" />
          ) : warnings.length > 0 ? (
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          )}
          <h3
            className={`text-sm font-extrabold uppercase tracking-wider ${
              criticals.length > 0
                ? 'text-rose-950'
                : warnings.length > 0
                ? 'text-amber-950'
                : 'text-emerald-950'
            }`}
          >
            Alertas Clínicas en Tiempo Real
          </h3>
        </div>

        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/80 border border-slate-200">
          {alerts.length === 0 ? 'Normal' : `${alerts.length} Detectada(s)`}
        </span>
      </div>

      {alerts.length === 0 ? (
        <div className="text-xs text-emerald-800 font-semibold flex items-center gap-1.5 py-1">
          <span>✓ Todos los signos vitales, escalas (Glasgow, EVA, Braden, Downton) y parámetros están en rango seguro.</span>
        </div>
      ) : (
        <div className="space-y-1.5 mt-2">
          {criticals.map((c) => (
            <div
              key={c.id}
              className="p-2 rounded-lg bg-rose-500 text-white text-xs font-bold flex items-center justify-between gap-2 shadow-xs"
            >
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-rose-700 text-[10px] uppercase tracking-wider">
                  {c.system}
                </span>
                <span>{c.text}</span>
              </div>
              <span className="text-[10px] uppercase font-black tracking-widest bg-rose-700/80 px-2 py-0.5 rounded">
                CRÍTICO
              </span>
            </div>
          ))}

          {warnings.map((w) => (
            <div
              key={w.id}
              className="p-2 rounded-lg bg-amber-100 text-amber-950 border border-amber-300 text-xs font-semibold flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 text-[10px] font-bold uppercase">
                  {w.system}
                </span>
                <span>{w.text}</span>
              </div>
              <span className="text-[10px] uppercase font-bold text-amber-800">
                ALERTA
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
