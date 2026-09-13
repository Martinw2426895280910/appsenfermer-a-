import React, { useState, useMemo } from 'react';
import {
  Activity,
  Droplet,
  Clock,
  FlaskConical,
  ShieldAlert,
  Microscope,
  Wind,
  TestTube2,
  Plus,
  Trash2,
  Zap,
  Check,
  AlertTriangle,
  AlertCircle,
  Search,
  Layers,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { LabItem, PatientRecord } from '../types';
import { LAB_CATEGORIES, LabCategoryMeta } from '../constants/labData';

interface LabSectionProps {
  patient: PatientRecord;
  onChange: (fields: Partial<PatientRecord>) => void;
}

export const LabSection: React.FC<LabSectionProps> = ({
  patient,
  onChange,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const labs = patient.labs || [];

  // Count items per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    labs.forEach((l) => {
      const cat = l.category || 'otros';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [labs]);

  // Total stats
  const stats = useMemo(() => {
    let outOfRange = 0;
    let normal = 0;
    labs.forEach((l) => {
      if (!l.value) return;
      if (l.flag === 'high' || l.flag === 'low' || l.flag === 'crit') {
        outOfRange++;
      } else {
        const vLower = l.value.toLowerCase();
        if ((vLower.includes('reactivo') && !vLower.includes('no reactivo')) || vLower.includes('positivo')) {
          outOfRange++;
        } else {
          normal++;
        }
      }
    });
    return { total: labs.length, outOfRange, normal };
  }, [labs]);

  // Filtered labs
  const filteredLabs = useMemo(() => {
    return labs.filter((l) => {
      const matchesCategory =
        selectedCategory === 'all' || (l.category || 'otros') === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.unit.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [labs, selectedCategory, searchQuery]);

  // Function to evaluate flag for numeric or qualitative lab
  const evaluateLabFlag = (
    value: string,
    reference?: [number, number],
    isQualitative?: boolean
  ): 'ok' | 'low' | 'high' | 'crit' => {
    if (!value || value.trim() === '') return 'ok';

    if (isQualitative) {
      const vLower = value.toLowerCase();
      if ((vLower.includes('reactivo') && !vLower.includes('no reactivo')) || vLower.includes('positivo')) {
        return 'crit';
      }
      return 'ok';
    }

    if (reference) {
      const num = parseFloat(value.replace(',', '.'));
      if (!isNaN(num)) {
        if (num < reference[0]) return 'low';
        if (num > reference[1]) return 'high';
        return 'ok';
      }
    }
    return 'ok';
  };

  // Add individual lab
  const addLab = (preset?: Partial<LabItem>) => {
    const defaultCat = selectedCategory !== 'all' ? selectedCategory : 'quimica';
    const cat = preset?.category || defaultCat;
    const isQualitative = preset?.isQualitative || cat === 'serologia' || cat === 'cultivos';

    const newLab: LabItem = {
      id: `lab_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: preset?.name || '',
      value: preset?.value || '',
      unit: preset?.unit || (isQualitative ? 'Cualitativo' : 'mg/dL'),
      category: cat,
      reference: preset?.reference,
      isQualitative,
      flag: evaluateLabFlag(preset?.value || '', preset?.reference, isQualitative),
    };

    onChange({
      labs: [...labs, newLab],
    });
  };

  // Add entire category profile at once
  const loadCategoryProfile = (cat: LabCategoryMeta) => {
    const existingNames = new Set(labs.map((l) => l.name.toLowerCase()));
    const newItems: LabItem[] = cat.analytes
      .filter((a) => !existingNames.has(a.name.toLowerCase()))
      .map((a) => ({
        id: `lab_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        name: a.name,
        value: a.value || '',
        unit: a.unit,
        category: cat.id,
        reference: a.reference,
        isQualitative: a.isQualitative,
        flag: 'ok',
      }));

    if (newItems.length > 0) {
      onChange({
        labs: [...labs, ...newItems],
      });
    }
  };

  // Update lab
  const updateLab = (id: string, fields: Partial<LabItem>) => {
    const updated = labs.map((l) => {
      if (l.id !== id) return l;
      const merged = { ...l, ...fields };

      // Re-evaluate flag if value changed and user didn't explicitly override flag
      if (fields.value !== undefined && fields.flag === undefined) {
        merged.flag = evaluateLabFlag(merged.value, merged.reference, merged.isQualitative);
      }
      return merged;
    });
    onChange({ labs: updated });
  };

  // Remove lab
  const removeLab = (id: string) => {
    onChange({ labs: labs.filter((l) => l.id !== id) });
  };

  // Clear all in current category or all
  const clearFilteredLabs = () => {
    if (selectedCategory === 'all') {
      if (window.confirm('¿Deseas eliminar todos los análisis de laboratorio cargados?')) {
        onChange({ labs: [] });
      }
    } else {
      onChange({ labs: labs.filter((l) => l.category !== selectedCategory) });
    }
  };

  // Render category icon
  const renderCategoryIcon = (iconName: string, className: string = 'w-4 h-4') => {
    switch (iconName) {
      case 'Activity':
        return <Activity className={className} />;
      case 'Droplet':
        return <Droplet className={className} />;
      case 'Clock':
        return <Clock className={className} />;
      case 'FlaskConical':
        return <FlaskConical className={className} />;
      case 'ShieldAlert':
        return <ShieldAlert className={className} />;
      case 'Microscope':
        return <Microscope className={className} />;
      case 'Wind':
        return <Wind className={className} />;
      case 'TestTube2':
        return <TestTube2 className={className} />;
      default:
        return <FlaskConical className={className} />;
    }
  };

  const activeCategoryMeta = LAB_CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <div className="space-y-4" id="laboratory-panel">
      {/* Top Header & Overview Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 border border-teal-300 flex items-center justify-center text-teal-800 shadow-2xs">
              <FlaskConical className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Panel de Laboratorio Clínico Multidisciplinario
              </h3>
              <p className="text-[11px] text-slate-500">
                Selecciona las áreas por color para cargar analitos orientados a informes de enfermería
              </p>
            </div>
          </div>
        </div>

        {/* Global Summary Badge */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-semibold rounded-lg border border-slate-200">
            Total: <strong className="text-slate-900">{stats.total}</strong>
          </span>
          {stats.outOfRange > 0 && (
            <span className="px-2.5 py-1 bg-rose-50 text-rose-700 font-bold rounded-lg border border-rose-200 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              {stats.outOfRange} Fuera de rango / reactivo
            </span>
          )}
          <button
            type="button"
            onClick={() => addLab()}
            className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-bold flex items-center gap-1.5 transition-colors shadow-xs ml-auto sm:ml-0 text-xs"
            id="btn-add-custom-lab"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Añadir Valor</span>
          </button>
        </div>
      </div>

      {/* COLOR PANEL: Area Selector Grid */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-teal-600" />
            Áreas de Laboratorio por Color:
          </span>
          <span className="text-[11px] text-slate-400">
            {selectedCategory === 'all'
              ? 'Mostrando todas las áreas'
              : `Filtrando: ${activeCategoryMeta?.shortName}`}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-9 gap-2">
          {/* Button All */}
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
              selectedCategory === 'all'
                ? 'bg-slate-800 border-slate-900 text-white shadow-md ring-2 ring-slate-400'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            id="tab-lab-all"
          >
            <div className="flex items-center justify-between w-full mb-1">
              <Layers className="w-4 h-4 text-teal-400" />
              <span
                className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                  selectedCategory === 'all'
                    ? 'bg-slate-700 text-slate-200'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {labs.length}
              </span>
            </div>
            <div className="text-xs font-bold leading-tight">Todas las áreas</div>
            <div className={`text-[10px] truncate ${selectedCategory === 'all' ? 'text-slate-300' : 'text-slate-400'}`}>
              Vista general
            </div>
          </button>

          {/* Categories */}
          {LAB_CATEGORIES.map((cat) => {
            const count = categoryCounts[cat.id] || 0;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? `${cat.theme.activeBg} ${cat.theme.activeBorder} shadow-md ring-2 ring-offset-1 ring-slate-400 ${cat.theme.accentGlow}`
                    : `bg-white ${cat.theme.border} hover:${cat.theme.badgeBg} hover:shadow-2xs`
                }`}
                id={`tab-lab-${cat.id}`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : `${cat.theme.badgeBg}`
                    }`}
                  >
                    {renderCategoryIcon(cat.iconName, 'w-3.5 h-3.5')}
                  </div>
                  {count > 0 && (
                    <span
                      className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                        isSelected
                          ? 'bg-white text-slate-900 shadow-xs'
                          : `${cat.theme.badgeBg}`
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </div>
                <div
                  className={`text-xs font-bold leading-tight ${
                    isSelected ? 'text-white' : 'text-slate-800'
                  }`}
                >
                  {cat.shortName}
                </div>
                <div
                  className={`text-[10px] truncate ${
                    isSelected ? 'text-white/80' : 'text-slate-500'
                  }`}
                  title={cat.description}
                >
                  {cat.analytes.length} presets
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SELECTED AREA ACTION BAR / PRESETS */}
      {activeCategoryMeta && (
        <div
          className={`p-3 rounded-xl border ${activeCategoryMeta.theme.border} ${activeCategoryMeta.theme.badgeBg} flex flex-col gap-2 transition-all`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white rounded-lg shadow-2xs">
                {renderCategoryIcon(activeCategoryMeta.iconName, 'w-4 h-4 text-slate-800')}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  {activeCategoryMeta.name}
                </h4>
                <p className="text-[11px] text-slate-600">
                  {activeCategoryMeta.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-end sm:self-center">
              <button
                type="button"
                onClick={() => loadCategoryProfile(activeCategoryMeta)}
                className="px-2.5 py-1 text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-lg shadow-2xs flex items-center gap-1 transition-colors"
                title={`Carga todos los analitos del perfil de ${activeCategoryMeta.shortName}`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Cargar Perfil Completo ({activeCategoryMeta.analytes.length})</span>
              </button>
            </div>
          </div>

          {/* Quick preset chips */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1 mr-0.5">
              <Zap className="w-3 h-3 text-amber-600" /> Clic para agregar:
            </span>
            {activeCategoryMeta.analytes.map((analyte) => {
              const alreadyAdded = labs.some(
                (l) => l.name.toLowerCase() === analyte.name.toLowerCase()
              );
              return (
                <button
                  key={analyte.name}
                  type="button"
                  onClick={() => addLab(analyte)}
                  className={`text-[11px] px-2 py-0.5 rounded-md font-semibold border transition-all flex items-center gap-1 ${
                    alreadyAdded
                      ? 'bg-white/90 text-slate-700 border-slate-300 shadow-2xs'
                      : 'bg-white hover:bg-slate-100 text-slate-900 border-slate-300 shadow-2xs active:scale-95'
                  }`}
                >
                  <span>+ {analyte.name}</span>
                  {analyte.unit && analyte.unit !== 'Cualitativo' && (
                    <span className="text-[9px] text-slate-400 font-normal">({analyte.unit})</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* QUICK ALL-PRESETS ACCORDION/PILLS IF 'ALL' IS SELECTED */}
      {selectedCategory === 'all' && (
        <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex flex-col gap-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              Perfiles Rápidos Frecuentes:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {LAB_CATEGORIES.slice(0, 5).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => loadCategoryProfile(cat)}
                  className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${cat.theme.chipBg} ${cat.theme.chipText} ${cat.theme.chipBorder}`}
                >
                  + Cargar {cat.shortName}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FILTER & SEARCH TOOLBAR FOR LOADED ITEMS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar analito cargado o resultado..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-teal-600 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 justify-between sm:justify-end text-xs text-slate-500">
          <span>
            Mostrando <strong>{filteredLabs.length}</strong> de <strong>{labs.length}</strong>
          </span>
          {filteredLabs.length > 0 && (
            <button
              type="button"
              onClick={clearFilteredLabs}
              className="text-[11px] text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
              title="Borrar analitos de esta vista"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Limpiar vista</span>
            </button>
          )}
        </div>
      </div>

      {/* LAB ITEMS LIST */}
      <div className="space-y-2">
        {filteredLabs.length === 0 ? (
          <div className="p-6 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-500 bg-slate-50/50 flex flex-col items-center justify-center gap-2">
            <FlaskConical className="w-8 h-8 text-slate-300" />
            <p className="font-semibold text-slate-700">
              {searchQuery
                ? `No se encontraron analitos que coincidan con "${searchQuery}"`
                : selectedCategory !== 'all'
                ? `No hay analitos cargados para ${activeCategoryMeta?.name || selectedCategory}.`
                : 'No hay análisis de laboratorio registrados para este paciente.'}
            </p>
            <p className="text-[11px] text-slate-400 max-w-md">
              Haz clic en cualquiera de las áreas de colores superiores para añadir determinaciones individuales o cargar el perfil completo.
            </p>
            {activeCategoryMeta && (
              <button
                type="button"
                onClick={() => loadCategoryProfile(activeCategoryMeta)}
                className="mt-1 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Cargar perfil de {activeCategoryMeta.shortName}</span>
              </button>
            )}
          </div>
        ) : (
          filteredLabs.map((lab) => {
            const categoryMeta = LAB_CATEGORIES.find((c) => c.id === lab.category);
            const presetMeta = categoryMeta?.analytes.find(
              (a) => a.name.toLowerCase() === lab.name.toLowerCase()
            );
            const suggestedOptions = presetMeta?.suggestedValues || (
              lab.isQualitative
                ? ['No reactivo', 'Reactivo', 'Negativo', 'Positivo', 'Sin desarrollo', 'En incubación']
                : undefined
            );

            const isHighOrLow = lab.flag === 'high' || lab.flag === 'low' || lab.flag === 'crit';
            const isCritical =
              lab.flag === 'crit' ||
              (lab.isQualitative &&
                lab.value &&
                ((lab.value.toLowerCase().includes('reactivo') &&
                  !lab.value.toLowerCase().includes('no reactivo')) ||
                  lab.value.toLowerCase().includes('positivo')));

            return (
              <div
                key={lab.id}
                className={`p-3 rounded-xl border transition-all ${
                  isCritical
                    ? 'bg-rose-50/70 border-rose-300 ring-1 ring-rose-200'
                    : isHighOrLow
                    ? 'bg-amber-50/70 border-amber-300'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col gap-2">
                  {/* Top row: Category badge + Name + Reference hint + Delete */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {categoryMeta ? (
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border flex items-center gap-1 ${categoryMeta.theme.badgeBg}`}
                        >
                          {renderCategoryIcon(categoryMeta.iconName, 'w-3 h-3')}
                          {categoryMeta.shortName}
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                          Analito
                        </span>
                      )}

                      {/* Reference range hint */}
                      {lab.reference ? (
                        <span className="text-[10px] text-slate-500 font-mono">
                          Ref normal: {lab.reference[0]} – {lab.reference[1]} {lab.unit}
                        </span>
                      ) : presetMeta?.normalHint ? (
                        <span className="text-[10px] text-slate-500">
                          Ref: {presetMeta.normalHint}
                        </span>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Flag state tag */}
                      {isCritical ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center gap-1 shadow-2xs animate-pulse">
                          <AlertCircle className="w-3 h-3" />
                          Reactivo / Crítico
                        </span>
                      ) : lab.flag === 'high' ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-[10px] font-bold">
                          ↑ Alto
                        </span>
                      ) : lab.flag === 'low' ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold">
                          ↓ Bajo
                        </span>
                      ) : lab.value ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Normal
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Sin cargar</span>
                      )}

                      <button
                        type="button"
                        onClick={() => removeLab(lab.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Eliminar este analito"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Middle row: Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                    {/* Parameter name */}
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        value={lab.name}
                        onChange={(e) => updateLab(lab.id, { name: e.target.value })}
                        placeholder="Nombre de la prueba (ej. Bilirrubina Total)"
                        className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-teal-600 font-bold text-slate-800"
                      />
                    </div>

                    {/* Result Value */}
                    <div className={lab.isQualitative ? 'sm:col-span-5' : 'sm:col-span-4'}>
                      <input
                        type="text"
                        value={lab.value}
                        onChange={(e) => updateLab(lab.id, { value: e.target.value })}
                        placeholder={
                          lab.isQualitative
                            ? 'Resultado (ej. No reactivo, Negativo, E. coli)'
                            : 'Valor (ej. 1.25)'
                        }
                        className={`w-full px-2.5 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-teal-600 font-extrabold ${
                          isCritical
                            ? 'text-rose-700 bg-rose-50/50'
                            : isHighOrLow
                            ? 'text-amber-900 bg-amber-50/50'
                            : 'text-teal-950'
                        }`}
                      />
                    </div>

                    {/* Unit */}
                    <div className={lab.isQualitative ? 'sm:col-span-3' : 'sm:col-span-2'}>
                      <input
                        type="text"
                        value={lab.unit}
                        onChange={(e) => updateLab(lab.id, { unit: e.target.value })}
                        placeholder="Unidad (mg/dL, mm/h)"
                        className="w-full px-2 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-teal-600 text-slate-600"
                      />
                    </div>

                    {/* Reference Editor (Numeric only) */}
                    {!lab.isQualitative && (
                      <div className="sm:col-span-2 flex items-center gap-1">
                        <input
                          type="number"
                          step="any"
                          value={lab.reference ? lab.reference[0] : ''}
                          onChange={(e) => {
                            const minVal = parseFloat(e.target.value);
                            const maxVal = lab.reference ? lab.reference[1] : 100;
                            updateLab(lab.id, {
                              reference: !isNaN(minVal) ? [minVal, maxVal] : undefined,
                            });
                          }}
                          placeholder="Mín"
                          className="w-1/2 p-1 text-[11px] bg-slate-50 border border-slate-200 rounded text-center text-slate-500 font-mono"
                          title="Límite inferior de referencia"
                        />
                        <span className="text-slate-300">-</span>
                        <input
                          type="number"
                          step="any"
                          value={lab.reference ? lab.reference[1] : ''}
                          onChange={(e) => {
                            const minVal = lab.reference ? lab.reference[0] : 0;
                            const maxVal = parseFloat(e.target.value);
                            updateLab(lab.id, {
                              reference: !isNaN(maxVal) ? [minVal, maxVal] : undefined,
                            });
                          }}
                          placeholder="Máx"
                          className="w-1/2 p-1 text-[11px] bg-slate-50 border border-slate-200 rounded text-center text-slate-500 font-mono"
                          title="Límite superior de referencia"
                        />
                      </div>
                    )}
                  </div>

                  {/* Suggested quick chips for qualitative tests or quick results */}
                  {suggestedOptions && suggestedOptions.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap pt-1">
                      <span className="text-[10px] text-slate-400 font-semibold mr-1">Opciones:</span>
                      {suggestedOptions.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => updateLab(lab.id, { value: opt })}
                          className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors ${
                            lab.value === opt
                              ? 'bg-teal-700 text-white border-teal-800 font-bold'
                              : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200 font-medium'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
