import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Plus, 
  Bed, 
  User, 
  Copy, 
  Trash2, 
  Check, 
  Download, 
  Upload,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { PatientRecord } from '../types';

interface PatientSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: PatientRecord[];
  activePatientId: string;
  onSelectPatient: (id: string) => void;
  onNewPatient: () => void;
  onDuplicatePatient: (id: string) => void;
  onDeletePatient: (id: string) => void;
  onExportAll: () => void;
  onImportBackup: (importedPatients: PatientRecord[]) => void;
}

export const PatientSelectorModal: React.FC<PatientSelectorModalProps> = ({
  isOpen,
  onClose,
  patients,
  activePatientId,
  onSelectPatient,
  onNewPatient,
  onDuplicatePatient,
  onDeletePatient,
  onExportAll,
  onImportBackup,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredPatients = patients.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      (p.nombre && p.nombre.toLowerCase().includes(q)) ||
      (p.cama && p.cama.toLowerCase().includes(q)) ||
      (p.dx && p.dx.toLowerCase().includes(q)) ||
      (p.historiaClinica && p.historiaClinica.toLowerCase().includes(q))
    );
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (Array.isArray(data)) {
          onImportBackup(data);
        } else if (data.id && data.nombre !== undefined) {
          onImportBackup([data]);
        }
      } catch (err) {
        alert('Archivo de copia de seguridad no válido');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-800 rounded-lg">
              <Bed className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <h2 className="text-base font-bold">Registro de Pacientes</h2>
              <p className="text-xs text-teal-200">
                {patients.length} paciente(s) guardados en el dispositivo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-teal-200 hover:text-white hover:bg-teal-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Actions toolbar */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, cama o diagnóstico..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-teal-600"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onNewPatient}
              className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Paciente</span>
            </button>

            <button
              onClick={onExportAll}
              title="Descargar copia de seguridad en JSON"
              className="p-2 text-slate-600 hover:text-teal-700 bg-white border border-slate-300 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>

            <label
              title="Restaurar copia de seguridad"
              className="p-2 text-slate-600 hover:text-teal-700 bg-white border border-slate-300 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Patients List */}
        <div className="p-3 overflow-y-auto flex-1 divide-y divide-slate-100 space-y-2">
          {filteredPatients.length === 0 ? (
            <div className="text-center py-10 px-4 text-slate-500">
              <AlertCircle className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p className="font-semibold text-sm">No se encontraron pacientes</p>
              <p className="text-xs text-slate-400 mt-1">
                Haz clic en "Nuevo Paciente" para comenzar a registrar.
              </p>
            </div>
          ) : (
            filteredPatients.map((p) => {
              const isActive = p.id === activePatientId;
              return (
                <div
                  key={p.id}
                  className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isActive
                      ? 'bg-teal-50/70 border-teal-400 ring-1 ring-teal-400/30'
                      : 'bg-white border-slate-200 hover:border-teal-200 hover:bg-slate-50/50'
                  }`}
                >
                  {/* Info */}
                  <div
                    onClick={() => {
                      onSelectPatient(p.id);
                      onClose();
                    }}
                    className="cursor-pointer flex-1"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                        <User className="w-4 h-4 text-teal-700" />
                        {p.nombre || 'Paciente Sin Nombre'}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 font-bold text-xs">
                        {p.cama || 'Sin cama'}
                      </span>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Activo
                        </span>
                      )}
                    </div>

                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                      <span>
                        {p.edad ? `${p.edad} ${p.unidadEdad}` : 'Edad sin registrar'} • {p.sexo}
                      </span>
                      {p.dx && (
                        <>
                          <span>•</span>
                          <span className="text-slate-700 font-medium truncate max-w-xs">
                            {p.dx}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(p.updatedAt).toLocaleDateString('es-AR')} {new Date(p.updatedAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span>Turno: {p.shift}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    {!isActive && (
                      <button
                        onClick={() => {
                          onSelectPatient(p.id);
                          onClose();
                        }}
                        className="px-2.5 py-1.5 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
                      >
                        Abrir
                      </button>
                    )}

                    <button
                      onClick={() => onDuplicatePatient(p.id)}
                      title="Duplicar paciente para nuevo turno o pase de guardia"
                      className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {confirmDeleteId === p.id ? (
                      <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-lg border border-rose-200">
                        <span className="text-[10px] text-rose-700 font-bold px-1">¿Borrar?</span>
                        <button
                          onClick={() => {
                            onDeletePatient(p.id);
                            setConfirmDeleteId(null);
                          }}
                          className="px-1.5 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold"
                        >
                          Sí
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px]"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(p.id)}
                        disabled={patients.length <= 1}
                        title={patients.length <= 1 ? 'Debe haber al menos 1 paciente' : 'Eliminar paciente'}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-30 disabled:pointer-events-none"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>Los datos se guardan de forma privada en este navegador.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
