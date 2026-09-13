import React, { useState, useEffect } from 'react';
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
  Share2, 
  Plus, 
  Users, 
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { PatientRecord } from './types';
import { createEmptyPatient, INITIAL_SAMPLE_PATIENT } from './constants/medicalData';
import { SYSTEM_IMAGES } from './constants/images';
import { 
  calculateBraden, 
  calculateDownton, 
  calculateFluidBalance, 
  calculateGlasgow, 
  collectClinicalAlerts 
} from './utils/clinicalCalculations';
import { Header } from './components/Header';
import { SystemCard } from './components/SystemCard';
import { PatientDataSection } from './components/PatientDataSection';
import { VitalSignsSection } from './components/VitalSignsSection';
import { NeurologySection } from './components/NeurologySection';
import { CardioPulmonarySection } from './components/CardioPulmonarySection';
import { FluidRenalSection } from './components/FluidRenalSection';
import { PainSection } from './components/PainSection';
import { SkinMobilitySection } from './components/SkinMobilitySection';
import { MedicationSection } from './components/MedicationSection';
import { LabSection } from './components/LabSection';
import { EvolutionSection } from './components/EvolutionSection';
import { AlertsCard } from './components/AlertsCard';
import { ReportModal } from './components/ReportModal';
import { PatientSelectorModal } from './components/PatientSelectorModal';

const STORAGE_KEY_PATIENTS = 'ENFERMERIA_APP_PATIENTS_V2';
const STORAGE_KEY_ACTIVE_ID = 'ENFERMERIA_APP_ACTIVE_ID_V2';

export default function App() {
  // Load patients from storage or initialize with sample patient
  const [patients, setPatients] = useState<PatientRecord[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PATIENTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading patients from localStorage', e);
    }
    return [INITIAL_SAMPLE_PATIENT];
  });

  const [activePatientId, setActivePatientId] = useState<string>(() => {
    try {
      const storedId = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
      if (storedId) return storedId;
    } catch (e) {
      // Ignored
    }
    return INITIAL_SAMPLE_PATIENT.id;
  });

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active patient object
  const activePatient = patients.find((p) => p.id === activePatientId) || patients[0] || INITIAL_SAMPLE_PATIENT;

  // Persist patients to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PATIENTS, JSON.stringify(patients));
    } catch (e) {
      console.error('Failed to save patients', e);
    }
  }, [patients]);

  // Persist active ID
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, activePatientId);
    } catch (e) {
      // Ignored
    }
  }, [activePatientId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  // Update current active patient fields
  const handleUpdatePatient = (fields: Partial<PatientRecord>) => {
    setPatients((prev) =>
      prev.map((p) =>
        p.id === activePatient.id
          ? { ...p, ...fields, updatedAt: new Date().toISOString() }
          : p
      )
    );
  };

  // Create new patient
  const handleNewPatient = () => {
    const nextBedNumber = `Cama ${100 + patients.length + 1}`;
    const newP = createEmptyPatient(nextBedNumber);
    setPatients((prev) => [newP, ...prev]);
    setActivePatientId(newP.id);
    showToast(`Nuevo paciente iniciado (${nextBedNumber})`);
  };

  // Duplicate patient for new shift
  const handleDuplicatePatient = (id: string) => {
    const source = patients.find((p) => p.id === id);
    if (!source) return;

    const copy: PatientRecord = {
      ...source,
      id: `paciente_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      shift: source.shift === 'Mañana' ? 'Tarde' : source.shift === 'Tarde' ? 'Noche' : 'Mañana',
      ev_nota: `Pase de guardia recibido del turno anterior. Paciente hemodinámicamente evaluado.`,
      b_vo: '',
      b_iv: '',
      b_otrosIn: '',
      b_diuresis: '',
      b_drenajes: '',
      b_otrosOut: '',
    };

    setPatients((prev) => [copy, ...prev]);
    setActivePatientId(copy.id);
    showToast(`Paciente duplicado para el turno de ${copy.shift}`);
  };

  // Delete patient
  const handleDeletePatient = (id: string) => {
    if (patients.length <= 1) return;
    const remaining = patients.filter((p) => p.id !== id);
    setPatients(remaining);
    if (activePatientId === id) {
      setActivePatientId(remaining[0].id);
    }
    showToast('Paciente eliminado del registro');
  };

  // Export JSON backup
  const handleExportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(patients, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `enfermeria_pacientes_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Copia de seguridad descargada en JSON');
  };

  // Import JSON backup
  const handleImportBackup = (imported: PatientRecord[]) => {
    setPatients(imported);
    if (imported.length > 0) {
      setActivePatientId(imported[0].id);
    }
    showToast(`Se importaron ${imported.length} pacientes`);
  };

  // Calculations for quick badges
  const gcs = calculateGlasgow(activePatient.n_go, activePatient.n_gv, activePatient.n_gm);
  const braden = calculateBraden(
    activePatient.br_1,
    activePatient.br_2,
    activePatient.br_3,
    activePatient.br_4,
    activePatient.br_5,
    activePatient.br_6
  );
  const downton = calculateDownton(
    activePatient.dt_1,
    activePatient.dt_2,
    activePatient.dt_3,
    activePatient.dt_4,
    activePatient.dt_5
  );
  const balance = calculateFluidBalance(activePatient);
  const alerts = collectClinicalAlerts(activePatient);
  const criticalCount = alerts.filter((a) => a.level === 'crit').length;
  const warningCount = alerts.filter((a) => a.level === 'warn').length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-24 selection:bg-teal-600 selection:text-white">
      {/* Top Application Header */}
      <Header
        activePatient={activePatient}
        patientCount={patients.length}
        criticalAlertCount={criticalCount}
        warningAlertCount={warningCount}
        onOpenPatientModal={() => setIsPatientModalOpen(true)}
        onNewPatient={handleNewPatient}
        onOpenReport={() => setIsReportOpen(true)}
      />

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4 space-y-3">
        {/* Real-time Alerts Card */}
        <AlertsCard alerts={alerts} />

        {/* Quick Clinical Scales Summary Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Glasgow */}
          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span>GLASGOW</span>
              <Brain className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-base font-extrabold text-indigo-950">
                {gcs.total}/15
              </span>
              <span className="text-[10px] text-slate-500 font-medium truncate">
                {gcs.total === 15 ? 'Normal' : gcs.severity.split('/')[0]}
              </span>
            </div>
          </div>

          {/* EVA Dolor */}
          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span>DOLOR EVA</span>
              <Smile className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className={`text-base font-extrabold ${activePatient.d_eva >= 7 ? 'text-rose-600' : 'text-amber-950'}`}>
                {activePatient.d_eva}/10
              </span>
              <span className="text-[10px] text-slate-500 font-medium truncate">
                {activePatient.d_eva === 0 ? 'Sin dolor' : activePatient.d_eva < 4 ? 'Leve' : activePatient.d_eva < 7 ? 'Moderado' : 'Severo'}
              </span>
            </div>
          </div>

          {/* Braden */}
          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span>BRADEN (UPP)</span>
              <Shield className="w-3.5 h-3.5 text-purple-600" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-base font-extrabold text-purple-950">
                {braden.total}/23
              </span>
              <span className="text-[10px] text-slate-500 font-medium truncate">
                {braden.risk.split(' ')[0]} {braden.risk.split(' ')[1]}
              </span>
            </div>
          </div>

          {/* Downton */}
          <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span>DOWNTON</span>
              <RotateCcw className="w-3.5 h-3.5 text-violet-600" />
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className={`text-base font-extrabold ${downton.isHighRisk ? 'text-rose-600' : 'text-violet-950'}`}>
                {downton.total} ptos
              </span>
              <span className="text-[10px] text-slate-500 font-medium truncate">
                {downton.isHighRisk ? 'Alto Riesgo' : 'Bajo Riesgo'}
              </span>
            </div>
          </div>
        </div>

        {/* 1. Datos del Paciente */}
        <SystemCard
          id="card-patient-data"
          title="Datos del Paciente e Historia Clínica"
          subtitle={`${activePatient.nombre || 'Sin nombre'} · ${activePatient.cama || 'Sin cama'} · ${activePatient.edad ? `${activePatient.edad} ${activePatient.unidadEdad}` : 'Edad sin definir'}`}
          icon={User}
          imageSrc={SYSTEM_IMAGES.heroBanner}
          accentColor="teal"
          defaultOpen={true}
          badgeContent={
            <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold border border-teal-200">
              {activePatient.cama || 'Sin asignar'}
            </span>
          }
        >
          <PatientDataSection
            patient={activePatient}
            onChange={handleUpdatePatient}
          />
        </SystemCard>

        {/* 2. Signos Vitales */}
        <SystemCard
          id="card-vital-signs"
          title="Signos Vitales y Parámetros Clínicos"
          subtitle="FC, FR, TA sistólica/diastólica, Temperatura y SpO₂ evaluados en vivo"
          icon={Heart}
          imageSrc={SYSTEM_IMAGES.cardioRespArt}
          accentColor="rose"
          defaultOpen={true}
          badgeContent={
            activePatient.v_fc && activePatient.v_tas ? (
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold border border-rose-200">
                {activePatient.v_tas}/{activePatient.v_tad} mmHg · {activePatient.v_fc} lpm
              </span>
            ) : null
          }
        >
          <VitalSignsSection
            patient={activePatient}
            onChange={handleUpdatePatient}
          />
        </SystemCard>

        {/* 3. Neurológico */}
        <SystemCard
          id="card-neurology"
          title="Evaluación Neurológica & Escala de Glasgow"
          subtitle={`Conciencia: ${activePatient.n_conciencia} · Glasgow: ${gcs.total}/15 · Pupilas: ${activePatient.n_pupilas}`}
          icon={Brain}
          imageSrc={SYSTEM_IMAGES.neuroArt}
          accentColor="indigo"
          defaultOpen={true}
          badgeContent={
            <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold border border-indigo-200">
              GCS {gcs.total}/15
            </span>
          }
        >
          <NeurologySection
            patient={activePatient}
            onChange={handleUpdatePatient}
          />
        </SystemCard>

        {/* 4. Respiratorio & Cardiovascular */}
        <SystemCard
          id="card-cardiorespiratory"
          title="Respiratorio & Cardiovascular"
          subtitle={`Patrón: ${activePatient.r_patron} · O₂: ${activePatient.r_o2} · Ritmo: ${activePatient.c_ritmo} · Pulsos: ${activePatient.c_pulsos}`}
          icon={Wind}
          imageSrc={SYSTEM_IMAGES.cardioRespArt}
          accentColor="sky"
          defaultOpen={false}
        >
          <CardioPulmonarySection
            patient={activePatient}
            onChange={handleUpdatePatient}
          />
        </SystemCard>

        {/* 5. Balance Hídrico & Renal & Nutrición */}
        <SystemCard
          id="card-fluids"
          title="Balance Hídrico, Renal & Nutrición"
          subtitle={`Balance: ${balance.balanceFormatted} · Sonda: ${activePatient.u_sonda} · Dieta: ${activePatient.nu_dieta}`}
          icon={Droplets}
          imageSrc={SYSTEM_IMAGES.fluidMedsArt}
          accentColor="emerald"
          defaultOpen={false}
          badgeContent={
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
              Neto: {balance.balance > 0 ? `+${balance.balance}` : balance.balance} ml
            </span>
          }
        >
          <FluidRenalSection
            patient={activePatient}
            onChange={handleUpdatePatient}
          />
        </SystemCard>

        {/* 6. Dolor EVA */}
        <SystemCard
          id="card-pain"
          title="Evaluación del Dolor (Escala EVA 0–10)"
          subtitle={`Nivel: ${activePatient.d_eva}/10 · Tipo: ${activePatient.d_tipo} · Localización: ${activePatient.d_loc || 'No especificada'}`}
          icon={Smile}
          accentColor="amber"
          defaultOpen={false}
          badgeContent={
            <span className={`px-2 py-0.5 rounded-full font-bold border ${activePatient.d_eva >= 7 ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-amber-100 text-amber-800 border-amber-200'}`}>
              EVA {activePatient.d_eva}/10
            </span>
          }
        >
          <PainSection
            patient={activePatient}
            onChange={handleUpdatePatient}
          />
        </SystemCard>

        {/* 7. Piel (Braden) & Movilidad (Downton) */}
        <SystemCard
          id="card-skin-mobility"
          title="Piel (Escala Braden) & Caídas (Escala Downton)"
          subtitle={`Braden: ${braden.total}/23 (${braden.risk}) · Downton: ${downton.total} ptos (${downton.risk})`}
          icon={Shield}
          imageSrc={SYSTEM_IMAGES.skinMobilityArt}
          accentColor="purple"
          defaultOpen={false}
        >
          <SkinMobilitySection
            patient={activePatient}
            onChange={handleUpdatePatient}
          />
        </SystemCard>

        {/* 8. Medicación del Turno */}
        <SystemCard
          id="card-medications"
          title="Medicación Prescripta del Turno"
          subtitle={`${activePatient.meds?.length || 0} fármaco(s) registrados · ${activePatient.meds?.filter((m) => m.given).length || 0} administrados`}
          icon={Pill}
          imageSrc={SYSTEM_IMAGES.fluidMedsArt}
          accentColor="emerald"
          defaultOpen={false}
          badgeContent={
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
              {activePatient.meds?.length || 0} Fármacos
            </span>
          }
        >
          <MedicationSection
            patient={activePatient}
            onChange={handleUpdatePatient}
          />
        </SystemCard>

        {/* 9. Laboratorio */}
        <SystemCard
          id="card-labs"
          title="Analítica de Laboratorio & Microbiología"
          subtitle={`${activePatient.labs?.length || 0} determinaciones: Hepatograma, VSG, Coagulograma, Cultivos, Serología, etc.`}
          icon={TestTube}
          accentColor="teal"
          defaultOpen={false}
        >
          <LabSection
            patient={activePatient}
            onChange={handleUpdatePatient}
          />
        </SystemCard>

        {/* 10. Evolución & Pendientes */}
        <SystemCard
          id="card-evolution"
          title="Nota de Evolución de Enfermería & Pase de Guardia"
          subtitle="Registro clínico con plantillas rápidas SOAP y DAR para entrega de turno"
          icon={FileText}
          accentColor="slate"
          defaultOpen={false}
        >
          <EvolutionSection
            patient={activePatient}
            onChange={handleUpdatePatient}
          />
        </SystemCard>

        {/* Clinical Disclaimer & Attribution */}
        <div className="text-center py-4 space-y-1 text-xs text-slate-500 border-t border-slate-200 mt-6">
          <p className="font-semibold text-slate-700">
            🩺 Aplicación de Valoración y Reportes de Enfermería para WhatsApp y Equipos de Salud
          </p>
          <p>
            Aplicación generada por <strong className="text-teal-800">Agencia digital métele apps</strong>. Los rangos de referencia son orientativos y no sustituyen el protocolo institucional ni el criterio médico.
          </p>
          <p className="text-[11px] text-slate-400">
            Todos los datos del paciente permanecen privados y almacenados en la memoria local de tu dispositivo.
          </p>
        </div>
      </main>

      {/* Persistent Floating Bottom Action Bar */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-300 py-2.5 px-3 sm:px-4 shadow-xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              id="bottom-btn-patients"
              onClick={() => setIsPatientModalOpen(true)}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Lista de pacientes"
            >
              <Users className="w-4 h-4 text-teal-700" />
              <span className="hidden sm:inline">Pacientes ({patients.length})</span>
            </button>

            <button
              id="bottom-btn-new-patient"
              onClick={handleNewPatient}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold border border-teal-200 flex items-center gap-1.5 transition-colors"
              title="Nuevo paciente"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nuevo</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="bottom-btn-whatsapp-share"
              onClick={() => setIsReportOpen(true)}
              className="px-4 sm:px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-lg shadow-emerald-900/20 transition-all"
            >
              <Share2 className="w-4 h-4 text-emerald-100" />
              <span>Generar Informe WhatsApp</span>
              <span className="hidden md:inline px-1.5 py-0.5 rounded bg-emerald-700 text-[11px] font-bold text-emerald-100">
                {activePatient.cama || 'Listo'}
              </span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        patient={activePatient}
      />

      <PatientSelectorModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        patients={patients}
        activePatientId={activePatient.id}
        onSelectPatient={(id) => setActivePatientId(id)}
        onNewPatient={handleNewPatient}
        onDuplicatePatient={handleDuplicatePatient}
        onDeletePatient={handleDeletePatient}
        onExportAll={handleExportBackup}
        onImportBackup={handleImportBackup}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-teal-950 text-white text-xs font-bold rounded-full shadow-2xl border border-teal-700/60 animate-in fade-in slide-in-from-bottom-2 duration-150 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
