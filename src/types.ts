export type AgeGroupKey = 
  | 'neonato'
  | 'lactante'
  | 'preescolar'
  | 'escolar'
  | 'adolescente'
  | 'adulto'
  | 'adulto_mayor';

export interface AgeGroupRange {
  label: string;
  sublabel: string;
  fc: [number, number];
  fr: [number, number];
  tas: [number, number];
  tad: [number, number];
  temp: [number, number];
  spo2: number;
}

export interface MedicationItem {
  id: string;
  name: string;
  dose: string;
  route: string;
  time: string;
  given: boolean;
  notes?: string;
}

export interface LabItem {
  id: string;
  name: string;
  value: string;
  unit: string;
  category?: string;
  reference?: [number, number];
  flag?: 'ok' | 'low' | 'high' | 'crit';
  isQualitative?: boolean;
}

export interface PatientRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
  nurseName: string;
  shift: 'Mañana' | 'Tarde' | 'Noche' | 'Guardia 24h';
  
  // Datos del paciente
  nombre: string;
  cama: string;
  historiaClinica: string;
  edad: number | '';
  unidadEdad: 'anios' | 'meses' | 'dias';
  sexo: 'F' | 'M' | 'Otro';
  grupoEtario: AgeGroupKey;
  peso: number | '';
  talla: number | '';
  dx: string;
  alergias: string;
  aislamiento: 'Ninguno' | 'Contacto' | 'Gotitas' | 'Aéreo' | 'Protector';

  // Signos vitales
  v_fc: number | '';
  v_fr: number | '';
  v_tas: number | '';
  v_tad: number | '';
  v_temp: number | '';
  v_spo2: number | '';

  // Neurológico
  n_conciencia: string;
  n_go: number; // 1-4
  n_gv: number; // 1-5
  n_gm: number; // 1-6
  n_pupilas: string;
  n_reactivas: string;
  n_obs: string;

  // Respiratorio
  r_patron: string;
  r_ruidos: string;
  r_o2: string; // 'No' | 'Sí'
  r_o2det: string;
  r_tos: string;

  // Cardiovascular
  c_ritmo: string;
  c_pulsos: string;
  c_relleno: string;
  c_edemas: string;
  c_perfusion: string;

  // Balance Hídrico
  b_vo: number | '';
  b_iv: number | '';
  b_otrosIn: number | '';
  b_diuresis: number | '';
  b_drenajes: number | '';
  b_otrosOut: number | '';

  // Urinario
  u_diuresis: string;
  u_sonda: string;
  u_caract: string;

  // Nutrición
  nu_dieta: string;
  nu_via: string;
  nu_tolerancia: string;
  nu_apetito: string;

  // Dolor (EVA)
  d_eva: number; // 0-10
  d_loc: string;
  d_tipo: string;
  d_tto: string;

  // Piel (Braden)
  pi_integridad: string;
  pi_loc: string;
  br_1: number; // Percepción sensorial 1-4
  br_2: number; // Humedad 1-4
  br_3: number; // Actividad 1-4
  br_4: number; // Movilidad 1-4
  br_5: number; // Nutrición 1-4
  br_6: number; // Fricción y cizallamiento 1-3

  // Movilidad / Caídas (Downton)
  m_nivel: string;
  m_disp: string;
  dt_1: boolean; // Caídas previas
  dt_2: boolean; // Medicamentos
  dt_3: boolean; // Déficits sensoriales
  dt_4: boolean; // Estado mental
  dt_5: boolean; // Deambulación / marcha

  // Medicación & Laboratorio
  meds: MedicationItem[];
  labs: LabItem[];

  // Evolución & Pendientes
  ev_nota: string;
  pendientes: string;
}

export interface ClinicalAlert {
  id: string;
  level: 'crit' | 'warn' | 'info';
  system: string;
  text: string;
}
