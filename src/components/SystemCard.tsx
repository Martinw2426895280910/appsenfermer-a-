import React, { useState } from 'react';
import { ChevronDown, ChevronUp, LucideIcon, ArrowUp } from 'lucide-react';

interface SystemCardProps {
  id: string;
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  imageSrc?: string;
  accentColor: 'teal' | 'rose' | 'indigo' | 'sky' | 'amber' | 'emerald' | 'orange' | 'purple' | 'slate';
  badgeContent?: React.ReactNode;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  onBackToBotonera?: () => void;
  children: React.ReactNode;
}

const COLOR_MAP = {
  teal: {
    border: 'border-teal-200 hover:border-teal-300',
    headerBg: 'bg-teal-50/70',
    iconBg: 'bg-teal-700 text-white',
    titleColor: 'text-teal-950',
    ring: 'focus-within:ring-teal-500/20',
  },
  rose: {
    border: 'border-rose-200 hover:border-rose-300',
    headerBg: 'bg-rose-50/70',
    iconBg: 'bg-rose-600 text-white',
    titleColor: 'text-rose-950',
    ring: 'focus-within:ring-rose-500/20',
  },
  indigo: {
    border: 'border-indigo-200 hover:border-indigo-300',
    headerBg: 'bg-indigo-50/70',
    iconBg: 'bg-indigo-700 text-white',
    titleColor: 'text-indigo-950',
    ring: 'focus-within:ring-indigo-500/20',
  },
  sky: {
    border: 'border-sky-200 hover:border-sky-300',
    headerBg: 'bg-sky-50/70',
    iconBg: 'bg-sky-600 text-white',
    titleColor: 'text-sky-950',
    ring: 'focus-within:ring-sky-500/20',
  },
  amber: {
    border: 'border-amber-200 hover:border-amber-300',
    headerBg: 'bg-amber-50/70',
    iconBg: 'bg-amber-600 text-white',
    titleColor: 'text-amber-950',
    ring: 'focus-within:ring-amber-500/20',
  },
  emerald: {
    border: 'border-emerald-200 hover:border-emerald-300',
    headerBg: 'bg-emerald-50/70',
    iconBg: 'bg-emerald-600 text-white',
    titleColor: 'text-emerald-950',
    ring: 'focus-within:ring-emerald-500/20',
  },
  orange: {
    border: 'border-orange-200 hover:border-orange-300',
    headerBg: 'bg-orange-50/70',
    iconBg: 'bg-orange-600 text-white',
    titleColor: 'text-orange-950',
    ring: 'focus-within:ring-orange-500/20',
  },
  purple: {
    border: 'border-purple-200 hover:border-purple-300',
    headerBg: 'bg-purple-50/70',
    iconBg: 'bg-purple-700 text-white',
    titleColor: 'text-purple-950',
    ring: 'focus-within:ring-purple-500/20',
  },
  slate: {
    border: 'border-slate-200 hover:border-slate-300',
    headerBg: 'bg-slate-50',
    iconBg: 'bg-slate-700 text-white',
    titleColor: 'text-slate-900',
    ring: 'focus-within:ring-slate-500/20',
  },
};

export const SystemCard: React.FC<SystemCardProps> = ({
  id,
  title,
  subtitle,
  icon: Icon,
  imageSrc,
  accentColor,
  badgeContent,
  defaultOpen = false,
  isOpen: controlledIsOpen,
  onToggle,
  onBackToBotonera,
  children,
}) => {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(defaultOpen);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : uncontrolledIsOpen;
  const theme = COLOR_MAP[accentColor];

  const handleHeaderClick = () => {
    if (onToggle) {
      onToggle();
    } else {
      setUncontrolledIsOpen(!uncontrolledIsOpen);
    }
  };

  return (
    <div
      id={id}
      className={`bg-white rounded-2xl border ${theme.border} shadow-sm overflow-hidden transition-all duration-200 mb-3`}
    >
      {/* Header Button */}
      <div
        onClick={handleHeaderClick}
        className={`p-3 sm:p-4 ${theme.headerBg} cursor-pointer flex items-center justify-between gap-3 select-none hover:bg-opacity-90 transition-colors`}
      >
        <div className="flex items-center gap-3 min-w-0">
          {imageSrc ? (
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border border-slate-200/90 shadow-sm shrink-0 bg-white">
              <img
                src={imageSrc}
                alt={title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-teal-900/10 pointer-events-none" />
            </div>
          ) : (
            <div className={`w-11 h-11 rounded-xl ${theme.iconBg} flex items-center justify-center shrink-0 shadow-sm`}>
              <Icon className="w-5 h-5" />
            </div>
          )}

          <div className="min-w-0">
            <h3 className={`text-sm sm:text-base font-bold ${theme.titleColor} flex items-center gap-2 truncate`}>
              {title}
            </h3>
            {subtitle && (
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {badgeContent && (
            <div className="hidden xs:block sm:block text-xs">
              {badgeContent}
            </div>
          )}

          {onBackToBotonera && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onBackToBotonera();
              }}
              className="hidden sm:flex text-[11px] font-bold text-slate-600 hover:text-teal-800 bg-white/90 hover:bg-white px-2.5 py-1 rounded-lg border border-slate-200 transition-colors items-center gap-1 shadow-2xs"
              title="Volver a la botonera de áreas superior"
            >
              <ArrowUp className="w-3 h-3" />
              <span>Botonera</span>
            </button>
          )}

          <div className="p-1 rounded-md text-slate-500 hover:text-slate-700 bg-white/70 shadow-2xs">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Body */}
      {isOpen && (
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-white space-y-4 animate-in fade-in-50 duration-150">
          {children}

          {/* Bottom quick return to botonera */}
          {onBackToBotonera && (
            <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="text-[11px]">¿Completaste esta área?</span>
              <button
                type="button"
                onClick={onBackToBotonera}
                className="text-xs font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors shadow-2xs"
              >
                <span>Subir a la botonera de áreas</span>
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
