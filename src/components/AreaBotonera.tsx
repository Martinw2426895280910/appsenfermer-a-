import React from 'react';
import {
  User,
  Heart,
  Brain,
  Wind,
  Droplets,
  Smile,
  Shield,
  Pill,
  TestTube,
  FileText,
  ArrowRight,
  Layers,
  ChevronDown,
  ChevronUp,
  LucideIcon,
  Sparkles,
} from 'lucide-react';
import { PatientRecord } from '../types';
import { SYSTEM_IMAGES } from '../constants/images';
import {
  calculateBraden,
  calculateDownton,
  calculateFluidBalance,
  calculateGlasgow,
} from '../utils/clinicalCalculations';

export interface AreaItem {
  id: string;
  cardId: string;
  number: number;
  title: string;
  shortTitle: string;
  description: string;
  icon: LucideIcon;
  imageSrc: string;
  accentColor: 'teal' | 'rose' | 'indigo' | 'sky' | 'emerald' | 'amber' | 'purple' | 'slate';
  theme: {
    badgeBg: string;
    badgeText: string;
    buttonBg: string;
    buttonHover: string;
    borderHover: string;
    iconBg: string;
    gradient: string;
  };
  getLiveBadge: (p: PatientRecord) => string | null;
}

interface AreaBotoneraProps {
  patient: PatientRecord;
  onEnterArea: (cardId: string) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  allExpanded?: boolean;
}

export const AreaBotonera: React.FC<AreaBotoneraProps> = ({
  patient,
  onEnterArea,
  onExpandAll,
  onCollapseAll,
  allExpanded = false,
}) => {
  const gcs = calculateGlasgow(patient.n_go, patient.n_gv, patient.n_gm);
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
  const balance = calculateFluidBalance(patient);

  const areas: AreaItem[] = [
    {
      id: 'patient-data',
      cardId: 'card-patient-data',
      number: 1,
      title: 'Datos del Paciente',
      shortTitle: 'Filiación & Cama',
      description: 'Cama, filiación, historia clínica, diagnóstico y aislamiento',
      icon: User,
      imageSrc: SYSTEM_IMAGES.patientDataArt,
      accentColor: 'teal',
      theme: {
        badgeBg: 'bg-teal-100',
        badgeText: 'text-teal-900',
        buttonBg: 'bg-teal-700 hover:bg-teal-800',
        buttonHover: 'hover:bg-teal-800',
        borderHover: 'hover:border-teal-400',
        iconBg: 'bg-teal-700',
        gradient: 'from-teal-950/80 via-teal-900/30 to-transparent',
      },
      getLiveBadge: (p) => (p.cama ? `Cama: ${p.cama}` : 'Sin asignar'),
    },
    {
      id: 'vital-signs',
      cardId: 'card-vital-signs',
      number: 2,
      title: 'Signos Vitales',
      shortTitle: 'Signos Vitales',
      description: 'FC, FR, TA sistólica/diastólica, temperatura y SpO₂ en tiempo real',
      icon: Heart,
      imageSrc: SYSTEM_IMAGES.vitalSignsArt,
      accentColor: 'rose',
      theme: {
        badgeBg: 'bg-rose-100',
        badgeText: 'text-rose-900',
        buttonBg: 'bg-rose-600 hover:bg-rose-700',
        buttonHover: 'hover:bg-rose-700',
        borderHover: 'hover:border-rose-400',
        iconBg: 'bg-rose-600',
        gradient: 'from-rose-950/80 via-rose-900/30 to-transparent',
      },
      getLiveBadge: (p) =>
        p.v_fc && p.v_tas ? `${p.v_tas}/${p.v_tad} mmHg · ${p.v_fc} lpm` : 'Sin registros',
    },
    {
      id: 'neurology',
      cardId: 'card-neurology',
      number: 3,
      title: 'Neurológico & Glasgow',
      shortTitle: 'Neurológico',
      description: 'Escala de Glasgow 3–15, reflejo pupilar y nivel de conciencia',
      icon: Brain,
      imageSrc: SYSTEM_IMAGES.neuroArt,
      accentColor: 'indigo',
      theme: {
        badgeBg: 'bg-indigo-100',
        badgeText: 'text-indigo-900',
        buttonBg: 'bg-indigo-700 hover:bg-indigo-800',
        buttonHover: 'hover:bg-indigo-800',
        borderHover: 'hover:border-indigo-400',
        iconBg: 'bg-indigo-700',
        gradient: 'from-indigo-950/80 via-indigo-900/30 to-transparent',
      },
      getLiveBadge: () => `GCS ${gcs.total}/15 (${gcs.severity})`,
    },
    {
      id: 'cardiorespiratory',
      cardId: 'card-cardiorespiratory',
      number: 4,
      title: 'Respiratorio & Cardio',
      shortTitle: 'Respiratorio & Cardio',
      description: 'Patrón ventilatorio, oxigenoterapia, ritmo, pulsos y perfusión',
      icon: Wind,
      imageSrc: SYSTEM_IMAGES.cardioRespArt,
      accentColor: 'sky',
      theme: {
        badgeBg: 'bg-sky-100',
        badgeText: 'text-sky-900',
        buttonBg: 'bg-sky-700 hover:bg-sky-800',
        buttonHover: 'hover:bg-sky-800',
        borderHover: 'hover:border-sky-400',
        iconBg: 'bg-sky-600',
        gradient: 'from-sky-950/80 via-sky-900/30 to-transparent',
      },
      getLiveBadge: (p) => (p.r_o2 === 'Sí' ? 'Con O₂ suplementario' : 'Aire ambiente'),
    },
    {
      id: 'fluids',
      cardId: 'card-fluids',
      number: 5,
      title: 'Balance Hídrico & Renal',
      shortTitle: 'Balance & Nutrición',
      description: 'Ingresos/egresos, diuresis del turno, sonda vesical y nutrición',
      icon: Droplets,
      imageSrc: SYSTEM_IMAGES.fluidRenalArt,
      accentColor: 'emerald',
      theme: {
        badgeBg: 'bg-emerald-100',
        badgeText: 'text-emerald-900',
        buttonBg: 'bg-emerald-700 hover:bg-emerald-800',
        buttonHover: 'hover:bg-emerald-800',
        borderHover: 'hover:border-emerald-400',
        iconBg: 'bg-emerald-600',
        gradient: 'from-emerald-950/80 via-emerald-900/30 to-transparent',
      },
      getLiveBadge: () => `Neto: ${balance.balance > 0 ? `+${balance.balance}` : balance.balance} ml`,
    },
    {
      id: 'pain',
      cardId: 'card-pain',
      number: 6,
      title: 'Evaluación del Dolor (EVA)',
      shortTitle: 'Escala del Dolor',
      description: 'Escala visual analógica 0–10, características y respuesta al tratamiento',
      icon: Smile,
      imageSrc: SYSTEM_IMAGES.painArt,
      accentColor: 'amber',
      theme: {
        badgeBg: 'bg-amber-100',
        badgeText: 'text-amber-900',
        buttonBg: 'bg-amber-600 hover:bg-amber-700',
        buttonHover: 'hover:bg-amber-700',
        borderHover: 'hover:border-amber-400',
        iconBg: 'bg-amber-600',
        gradient: 'from-amber-950/80 via-amber-900/30 to-transparent',
      },
      getLiveBadge: (p) => `EVA ${p.d_eva}/10 ${p.d_eva >= 7 ? '⚠️ Severo' : p.d_eva >= 4 ? 'Moderado' : 'Leve/Nulo'}`,
    },
    {
      id: 'skin-mobility',
      cardId: 'card-skin-mobility',
      number: 7,
      title: 'Piel & Movilidad',
      shortTitle: 'Piel & Caídas',
      description: 'Escala Braden (prevención de UPP) y Escala Downton (riesgo de caídas)',
      icon: Shield,
      imageSrc: SYSTEM_IMAGES.skinMobilityArt,
      accentColor: 'purple',
      theme: {
        badgeBg: 'bg-purple-100',
        badgeText: 'text-purple-900',
        buttonBg: 'bg-purple-700 hover:bg-purple-800',
        buttonHover: 'hover:bg-purple-800',
        borderHover: 'hover:border-purple-400',
        iconBg: 'bg-purple-700',
        gradient: 'from-purple-950/80 via-purple-900/30 to-transparent',
      },
      getLiveBadge: () => `Braden: ${braden.total}/23 · Downton: ${downton.total}p`,
    },
    {
      id: 'medications',
      cardId: 'card-medications',
      number: 8,
      title: 'Medicación del Turno',
      shortTitle: 'Medicación',
      description: 'Fármacos prescriptos, dosis, vía, horarios y control de administración',
      icon: Pill,
      imageSrc: SYSTEM_IMAGES.medicationArt,
      accentColor: 'emerald',
      theme: {
        badgeBg: 'bg-emerald-100',
        badgeText: 'text-emerald-900',
        buttonBg: 'bg-emerald-700 hover:bg-emerald-800',
        buttonHover: 'hover:bg-emerald-800',
        borderHover: 'hover:border-emerald-400',
        iconBg: 'bg-emerald-700',
        gradient: 'from-emerald-950/80 via-emerald-900/30 to-transparent',
      },
      getLiveBadge: (p) =>
        `${p.meds?.filter((m) => m.given).length || 0}/${p.meds?.length || 0} administrados`,
    },
    {
      id: 'labs',
      cardId: 'card-labs',
      number: 9,
      title: 'Laboratorio & Microbiología',
      shortTitle: 'Laboratorio',
      description: 'Hepatograma, VSG, Coagulograma, Cultivos, Serología, EAB y Orina',
      icon: TestTube,
      imageSrc: SYSTEM_IMAGES.labArt,
      accentColor: 'teal',
      theme: {
        badgeBg: 'bg-teal-100',
        badgeText: 'text-teal-900',
        buttonBg: 'bg-teal-700 hover:bg-teal-800',
        buttonHover: 'hover:bg-teal-800',
        borderHover: 'hover:border-teal-400',
        iconBg: 'bg-teal-700',
        gradient: 'from-teal-950/80 via-teal-900/30 to-transparent',
      },
      getLiveBadge: (p) => `${p.labs?.length || 0} analitos cargados`,
    },
    {
      id: 'evolution',
      cardId: 'card-evolution',
      number: 10,
      title: 'Evolución & Guardia',
      shortTitle: 'Evolución & Pase',
      description: 'Nota narrativa clínica SOAP/DAR y pendientes para pase de guardia',
      icon: FileText,
      imageSrc: SYSTEM_IMAGES.evolutionArt,
      accentColor: 'slate',
      theme: {
        badgeBg: 'bg-slate-100',
        badgeText: 'text-slate-900',
        buttonBg: 'bg-slate-800 hover:bg-slate-900',
        buttonHover: 'hover:bg-slate-900',
        borderHover: 'hover:border-slate-400',
        iconBg: 'bg-slate-800',
        gradient: 'from-slate-950/80 via-slate-900/30 to-transparent',
      },
      getLiveBadge: (p) => (p.pendientes ? '📌 Con pendientes' : '✅ Al día'),
    },
  ];

  return (
    <section
      id="botonera-areas"
      className="bg-white rounded-2xl border border-slate-200 shadow-md p-4 sm:p-5 mb-5 relative overflow-hidden"
    >
      {/* Decorative top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-500 via-emerald-500 to-sky-500" />

      {/* Header bar of the Botonera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 shadow-2xs">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900 flex items-center gap-2">
                Botonera de Áreas de Valoración
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                  10 Áreas Clínicas
                </span>
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Selecciona cualquier área con su botón específico e imagen representativa para ingresar a su registro
              </p>
            </div>
          </div>
        </div>

        {/* Global accordion expand / collapse toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {allExpanded ? (
            <button
              type="button"
              onClick={onCollapseAll}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-200 shadow-2xs"
            >
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Colapsar todas</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onExpandAll}
              className="px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold flex items-center gap-1.5 transition-colors border border-teal-200 shadow-2xs"
            >
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Expandir todas</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of Area Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5">
        {areas.map((area) => {
          const AreaIcon = area.icon;
          const liveBadge = area.getLiveBadge(patient);

          return (
            <div
              key={area.id}
              className={`bg-slate-50/70 hover:bg-white rounded-2xl border border-slate-200/90 ${area.theme.borderHover} shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group relative`}
            >
              {/* Representative Image Banner */}
              <div className="relative w-full h-28 sm:h-32 overflow-hidden bg-slate-200 shrink-0">
                <img
                  src={area.imageSrc}
                  alt={area.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${area.theme.gradient}`} />

                {/* Number & Icon badge on image */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  <div
                    className={`w-6 h-6 rounded-lg ${area.theme.iconBg} text-white flex items-center justify-center shadow-md`}
                  >
                    <AreaIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-slate-900/80 text-white backdrop-blur-xs border border-white/20">
                    Área {area.number}
                  </span>
                </div>

                {/* Live indicator on image */}
                {liveBadge && (
                  <div className="absolute bottom-2 left-2 right-2 truncate">
                    <span className="inline-block max-w-full truncate text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-white/95 text-slate-900 shadow-sm border border-slate-200/80 backdrop-blur-xs">
                      {liveBadge}
                    </span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-3 flex-1 flex flex-col justify-between gap-2.5">
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-teal-900 transition-colors line-clamp-1">
                    {area.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                    {area.description}
                  </p>
                </div>

                {/* Specific Entry Button */}
                <button
                  type="button"
                  id={`btn-enter-area-${area.id}`}
                  onClick={() => onEnterArea(area.cardId)}
                  className={`w-full py-2 px-3 rounded-xl ${area.theme.buttonBg} text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95`}
                  title={`Ingresar y desplazarse a ${area.title}`}
                >
                  <span>Ingresar al Área</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
