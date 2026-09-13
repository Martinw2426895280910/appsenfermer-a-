import { AGE_GROUP_RANGES } from '../constants/medicalData';
import { AgeGroupKey, ClinicalAlert, PatientRecord } from '../types';

export function determineAgeGroup(edad: number | '', unidad: 'anios' | 'meses' | 'dias'): AgeGroupKey {
  if (edad === '' || isNaN(Number(edad))) return 'adulto';
  const num = Number(edad);

  let days = num;
  if (unidad === 'anios') days = num * 365;
  if (unidad === 'meses') days = num * 30;
  if (unidad === 'dias') days = num;

  if (days <= 28) return 'neonato';
  if (days <= 365) return 'lactante';
  if (days <= 365 * 5) return 'preescolar';
  if (days <= 365 * 12) return 'escolar';
  if (days <= 365 * 18) return 'adolescente';
  if (days < 365 * 65) return 'adulto';
  return 'adulto_mayor';
}

export function calculateIMC(peso: number | '', talla: number | '', grupo: AgeGroupKey): {
  imcValue: string;
  classification: string;
  flag: 'ok' | 'low' | 'high' | 'crit' | '';
  hint: string;
} {
  const w = Number(peso);
  const h = Number(talla) / 100;

  if (!(w > 0 && h > 0)) {
    return { imcValue: '', classification: '', flag: '', hint: 'Ingresa peso y talla para calcular el IMC' };
  }

  const imc = w / (h * h);
  const imcValue = imc.toFixed(1);

  // Pediatría menor de 2 años
  if (grupo === 'neonato' || grupo === 'lactante') {
    return {
      imcValue,
      classification: 'Valoración Pediátrica',
      flag: 'ok',
      hint: 'En menores de 2 años se evalúa peso/talla o peso/edad según tablas OMS, no IMC aislado.',
    };
  }

  // Preescolar, escolar, adolescente
  const PED_CUTS: Record<string, { bajo: number; normal: number; sobre: number }> = {
    preescolar: { bajo: 14, normal: 17, sobre: 18.5 },
    escolar: { bajo: 14, normal: 19, sobre: 21 },
    adolescente: { bajo: 17, normal: 23, sobre: 27 },
  };

  if (PED_CUTS[grupo]) {
    const c = PED_CUTS[grupo];
    if (imc < c.bajo) {
      return { imcValue, classification: 'Bajo peso (orientativo)', flag: 'low', hint: 'Confirmar con percentiles OMS/CDC según sexo y edad exacta.' };
    }
    if (imc < c.normal) {
      return { imcValue, classification: 'Eutrófico / Normal', flag: 'ok', hint: 'Dentro de percentiles normales de referencia.' };
    }
    if (imc < c.sobre) {
      return { imcValue, classification: 'Sobrepeso (orientativo)', flag: 'high', hint: 'Percentil >85. Requiere seguimiento nutricional.' };
    }
    return { imcValue, classification: 'Obesidad (orientativo)', flag: 'crit', hint: 'Percentil >95. Requiere evaluación médica integral.' };
  }

  // Adultos
  if (imc < 18.5) {
    return { imcValue, classification: 'Bajo peso', flag: 'low', hint: 'IMC < 18.5 kg/m²: Valorar riesgo de desnutrición.' };
  }
  if (imc < 25) {
    return { imcValue, classification: 'Normal / Eutrófico', flag: 'ok', hint: 'Rango saludable de 18.5 a 24.9 kg/m².' };
  }
  if (imc < 30) {
    return { imcValue, classification: 'Sobrepeso', flag: 'high', hint: 'Rango de 25.0 a 29.9 kg/m².' };
  }
  if (imc < 35) {
    return { imcValue, classification: 'Obesidad Grado I', flag: 'high', hint: 'Riesgo cardiovascular moderado.' };
  }
  if (imc < 40) {
    return { imcValue, classification: 'Obesidad Grado II', flag: 'crit', hint: 'Riesgo cardiovascular severo.' };
  }
  return { imcValue, classification: 'Obesidad Grado III (Mórbida)', flag: 'crit', hint: 'Alto riesgo clínico global.' };
}

export function evaluateVitalSign(
  value: number | '',
  range: [number, number],
  criticalDeltaPercent = 0.2
): { flag: 'ok' | 'low' | 'high' | 'crit' | ''; label: string } {
  if (value === '' || isNaN(Number(value))) {
    return { flag: '', label: 'Sin dato' };
  }
  const val = Number(value);
  const [min, max] = range;

  if (val < min) {
    const isCrit = val < min * (1 - criticalDeltaPercent);
    return {
      flag: isCrit ? 'crit' : 'low',
      label: isCrit ? 'Crítico Bajo' : 'Bajo',
    };
  }
  if (val > max) {
    const isCrit = val > max * (1 + criticalDeltaPercent);
    return {
      flag: isCrit ? 'crit' : 'high',
      label: isCrit ? 'Crítico Alto' : 'Alto',
    };
  }
  return { flag: 'ok', label: 'Normal' };
}

export function evaluateSpo2(value: number | '', targetMin: number): {
  flag: 'ok' | 'low' | 'crit' | '';
  label: string;
} {
  if (value === '' || isNaN(Number(value))) {
    return { flag: '', label: 'Sin dato' };
  }
  const val = Number(value);
  if (val < targetMin - 5) {
    return { flag: 'crit', label: 'Crítico (<' + (targetMin - 5) + '%)' };
  }
  if (val < targetMin) {
    return { flag: 'low', label: 'Desaturación leve (<' + targetMin + '%)' };
  }
  return { flag: 'ok', label: 'Óptima (≥' + targetMin + '%)' };
}

export function calculateGlasgow(go: number, gv: number, gm: number): {
  total: number;
  severity: string;
  badgeColor: string;
} {
  const total = (go || 0) + (gv || 0) + (gm || 0);
  if (total <= 8) {
    return { total, severity: 'TCE Severo / Coma (Intubación)', badgeColor: 'bg-rose-100 text-rose-800 border-rose-300' };
  }
  if (total <= 12) {
    return { total, severity: 'TCE Moderado / Depresión neuro', badgeColor: 'bg-amber-100 text-amber-800 border-amber-300' };
  }
  if (total < 15) {
    return { total, severity: 'TCE Leve / Alteración leve', badgeColor: 'bg-sky-100 text-sky-800 border-sky-300' };
  }
  return { total, severity: 'Normal / Lúcido (15/15)', badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
}

export function calculateBraden(br1: number, br2: number, br3: number, br4: number, br5: number, br6: number): {
  total: number;
  risk: string;
  colorClass: string;
} {
  const total = br1 + br2 + br3 + br4 + br5 + br6;
  if (total <= 9) return { total, risk: 'Riesgo Muy Alto (≤9)', colorClass: 'bg-rose-500 text-white' };
  if (total <= 12) return { total, risk: 'Riesgo Alto (10–12)', colorClass: 'bg-rose-100 text-rose-800 border-rose-300' };
  if (total <= 14) return { total, risk: 'Riesgo Moderado (13–14)', colorClass: 'bg-amber-100 text-amber-800 border-amber-300' };
  if (total <= 18) return { total, risk: 'Riesgo Bajo (15–18)', colorClass: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
  return { total, risk: 'Sin Riesgo (19–23)', colorClass: 'bg-teal-100 text-teal-800 border-teal-300' };
}

export function calculateDownton(dt1: boolean, dt2: boolean, dt3: boolean, dt4: boolean, dt5: boolean): {
  total: number;
  risk: string;
  isHighRisk: boolean;
} {
  const total = (dt1 ? 1 : 0) + (dt2 ? 1 : 0) + (dt3 ? 1 : 0) + (dt4 ? 1 : 0) + (dt5 ? 1 : 0);
  const isHighRisk = total >= 3;
  return {
    total,
    risk: isHighRisk ? 'Alto Riesgo de Caídas (≥3 puntos)' : 'Bajo Riesgo (<3 puntos)',
    isHighRisk,
  };
}

export function calculateFluidBalance(p: PatientRecord): {
  inTotal: number;
  outTotal: number;
  balance: number;
  balanceFormatted: string;
} {
  const inTotal = Number(p.b_vo || 0) + Number(p.b_iv || 0) + Number(p.b_otrosIn || 0);
  const outTotal = Number(p.b_diuresis || 0) + Number(p.b_drenajes || 0) + Number(p.b_otrosOut || 0);
  const balance = inTotal - outTotal;
  const sign = balance > 0 ? '+' : '';
  const balanceFormatted = `${sign}${balance} ml (Ingresos: ${inTotal} ml | Egresos: ${outTotal} ml)`;
  return { inTotal, outTotal, balance, balanceFormatted };
}

export function collectClinicalAlerts(p: PatientRecord): ClinicalAlert[] {
  const alerts: ClinicalAlert[] = [];
  const r = AGE_GROUP_RANGES[p.grupoEtario];

  // Vitals checks
  const fcEval = evaluateVitalSign(p.v_fc, r.fc);
  if (fcEval.flag === 'crit') {
    alerts.push({ id: 'alt_fc', level: 'crit', system: 'Cardiovascular', text: `FC ${p.v_fc} lpm: Alteración crítica (${fcEval.label})` });
  } else if (fcEval.flag === 'high' || fcEval.flag === 'low') {
    alerts.push({ id: 'alt_fc', level: 'warn', system: 'Cardiovascular', text: `FC ${p.v_fc} lpm fuera de rango normal (${r.fc[0]}-${r.fc[1]})` });
  }

  const frEval = evaluateVitalSign(p.v_fr, r.fr);
  if (frEval.flag === 'crit') {
    alerts.push({ id: 'alt_fr', level: 'crit', system: 'Respiratorio', text: `FR ${p.v_fr} rpm: Frecuencia respiratoria crítica` });
  } else if (frEval.flag === 'high' || frEval.flag === 'low') {
    alerts.push({ id: 'alt_fr', level: 'warn', system: 'Respiratorio', text: `FR ${p.v_fr} rpm fuera de rango (${r.fr[0]}-${r.fr[1]})` });
  }

  const tasEval = evaluateVitalSign(p.v_tas, r.tas);
  if (tasEval.flag === 'crit') {
    alerts.push({ id: 'alt_tas', level: 'crit', system: 'Presión Arterial', text: `TA Sistólica ${p.v_tas} mmHg en valor crítico` });
  } else if (tasEval.flag === 'high' || tasEval.flag === 'low') {
    alerts.push({ id: 'alt_tas', level: 'warn', system: 'Presión Arterial', text: `TA Sistólica ${p.v_tas} mmHg fuera de rango` });
  }

  const tempEval = evaluateVitalSign(p.v_temp, r.temp, 0.05);
  if (tempEval.flag === 'crit' || (Number(p.v_temp) >= 38.5)) {
    alerts.push({ id: 'alt_temp', level: 'crit', system: 'Temperatura', text: `Temperatura ${p.v_temp} °C: Fiebre alta o hipotermia` });
  } else if (Number(p.v_temp) >= 37.8) {
    alerts.push({ id: 'alt_temp', level: 'warn', system: 'Temperatura', text: `Temperatura ${p.v_temp} °C: Febrícula` });
  }

  const spo2Eval = evaluateSpo2(p.v_spo2, r.spo2);
  if (spo2Eval.flag === 'crit') {
    alerts.push({ id: 'alt_spo2', level: 'crit', system: 'Oxigenación', text: `SpO₂ ${p.v_spo2}%: Hipoxemia severa (Objetivo ≥${r.spo2}%)` });
  } else if (spo2Eval.flag === 'low') {
    alerts.push({ id: 'alt_spo2', level: 'warn', system: 'Oxigenación', text: `SpO₂ ${p.v_spo2}%: Por debajo de meta (${r.spo2}%)` });
  }

  // Glasgow
  const glasgow = calculateGlasgow(p.n_go, p.n_gv, p.n_gm);
  if (glasgow.total <= 8) {
    alerts.push({ id: 'alt_gcs_crit', level: 'crit', system: 'Neurológico', text: `Glasgow ${glasgow.total}/15: Coma / Deterioro neurológico severo` });
  } else if (glasgow.total < 15) {
    alerts.push({ id: 'alt_gcs_warn', level: 'warn', system: 'Neurológico', text: `Glasgow ${glasgow.total}/15: Alteración de la conciencia` });
  }

  // Pupilas
  if (p.n_pupilas === 'Anisocóricas') {
    alerts.push({ id: 'alt_pupilas', level: 'crit', system: 'Neurológico', text: 'Pupilas Anisocóricas: Evaluar asimetría y signos de herniación' });
  }
  if (p.n_reactivas === 'No') {
    alerts.push({ id: 'alt_react', level: 'crit', system: 'Neurológico', text: 'Pupilas arreactivas a la luz' });
  }

  // Dolor EVA
  if (p.d_eva >= 7) {
    alerts.push({ id: 'alt_eva_crit', level: 'crit', system: 'Dolor', text: `Dolor Severo EVA ${p.d_eva}/10: Requiere analgesia de rescate urgente` });
  } else if (p.d_eva >= 4) {
    alerts.push({ id: 'alt_eva_warn', level: 'warn', system: 'Dolor', text: `Dolor Moderado EVA ${p.d_eva}/10: Monitorear respuesta analgésica` });
  }

  // Braden
  const braden = calculateBraden(p.br_1, p.br_2, p.br_3, p.br_4, p.br_5, p.br_6);
  if (braden.total <= 12) {
    alerts.push({ id: 'alt_braden', level: braden.total <= 9 ? 'crit' : 'warn', system: 'Piel / UPP', text: `Braden ${braden.total}/23: ${braden.risk}` });
  }

  // Downton
  const downton = calculateDownton(p.dt_1, p.dt_2, p.dt_3, p.dt_4, p.dt_5);
  if (downton.isHighRisk) {
    alerts.push({ id: 'alt_downton', level: 'warn', system: 'Seguridad', text: `Downton ${downton.total} ptos: Alto Riesgo de Caídas. Mantener barandas arriba y timbre al alcance` });
  }

  // Alertas de laboratorio
  if (p.labs && p.labs.length > 0) {
    p.labs.forEach((l) => {
      if (!l.value || l.value.trim() === '') return;
      if (l.isQualitative) {
        const vLower = l.value.toLowerCase();
        if ((vLower.includes('reactivo') && !vLower.includes('no reactivo')) || vLower.includes('positivo')) {
          alerts.push({
            id: `alt_lab_${l.id}`,
            level: 'crit',
            system: l.category === 'cultivos' ? 'Microbiología' : 'Serología / Inmuno',
            text: `${l.name}: ${l.value}`,
          });
        }
      } else {
        if (l.flag === 'crit') {
          alerts.push({
            id: `alt_lab_${l.id}`,
            level: 'crit',
            system: 'Laboratorio',
            text: `${l.name} en valor crítico: ${l.value} ${l.unit}`,
          });
        }
      }
    });
  }

  // Alergias
  if (p.alergias && !p.alergias.toLowerCase().includes('ninguna') && !p.alergias.toLowerCase().includes('nkda')) {
    alerts.push({ id: 'alt_alergia', level: 'warn', system: 'Alergias', text: `Alergia confirmada: ${p.alergias}` });
  }

  return alerts;
}

export function generateWhatsAppReport(p: PatientRecord): string {
  const dateStr = new Date().toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const timeStr = new Date().toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const r = AGE_GROUP_RANGES[p.grupoEtario];
  const imcCalc = calculateIMC(p.peso, p.talla, p.grupoEtario);
  const glasgow = calculateGlasgow(p.n_go, p.n_gv, p.n_gm);
  const braden = calculateBraden(p.br_1, p.br_2, p.br_3, p.br_4, p.br_5, p.br_6);
  const downton = calculateDownton(p.dt_1, p.dt_2, p.dt_3, p.dt_4, p.dt_5);
  const balance = calculateFluidBalance(p);
  const alerts = collectClinicalAlerts(p);

  const medsText = p.meds && p.meds.length > 0
    ? p.meds.map(m => `  • ${m.given ? '✅' : '⏳'} *${m.name}* ${m.dose} (${m.route}) - ${m.time} hs ${m.notes ? `_(${m.notes})_` : ''}`).join('\n')
    : '  • Sin medicación registrada';

  let labsText = '  • Sin laboratorio cargado';
  if (p.labs && p.labs.length > 0) {
    const validLabs = p.labs.filter((l) => l.value && l.value.trim() !== '');
    if (validLabs.length > 0) {
      const categoryTitles: Record<string, string> = {
        hepatograma: '🫀 Hepatograma & Función Hepática',
        hematologia: '🔴 Hematología & Eritrosedimentación (VSG)',
        coagulograma: '⏱️ Coagulograma & Hemostasia',
        quimica: '🧪 Química Clínica & Medio Interno',
        serologia: '🧬 Serología & Inmunología',
        cultivos: '🧫 Cultivos & Microbiología',
        gases: '🫁 Gases Arteriales (EAB)',
        orina: '🟡 Orina Completa & Sedimento',
      };

      const groups = new Map<string, typeof validLabs>();
      validLabs.forEach((l) => {
        const cat = l.category || 'otros';
        if (!groups.has(cat)) groups.set(cat, []);
        groups.get(cat)!.push(l);
      });

      const blocks: string[] = [];
      groups.forEach((items, cat) => {
        const title = categoryTitles[cat] || (cat !== 'otros' ? `🔹 ${cat}` : '🔹 Otros análisis');
        const lines = items.map((l) => {
          let flagStr = '';
          if (l.isQualitative) {
            const vLower = l.value.toLowerCase();
            if ((vLower.includes('reactivo') && !vLower.includes('no reactivo')) || vLower.includes('positivo')) {
              flagStr = ' 🚨 [REACTIVO / POSITIVO]';
            } else if (vLower.includes('no reactivo') || vLower.includes('negativo') || vLower.includes('sin desarrollo')) {
              flagStr = ' ✓';
            } else if (vLower.includes('incubaci')) {
              flagStr = ' ⏳ [En curso]';
            }
          } else {
            flagStr = l.flag === 'high' ? ' ⚠️ (↑ Alto)' : l.flag === 'low' ? ' ⚠️ (↓ Bajo)' : ' ✓ (Normal)';
          }
          const unitStr = l.unit && l.unit !== 'Cualitativo' && l.unit !== 'Informe' && l.unit !== 'Microbiología' ? ` ${l.unit}` : '';
          return `    - *${l.name}:* ${l.value}${unitStr}${flagStr}`;
        });
        blocks.push(`  ${title}:\n${lines.join('\n')}`);
      });
      labsText = blocks.join('\n\n');
    }
  }

  const alertsBlock = alerts.length > 0
    ? alerts.map(a => `  ${a.level === 'crit' ? '🚨 *CRÍTICO*' : '⚠️ *ALERTA*'} [${a.system}]: ${a.text}`).join('\n')
    : '  ✅ Sin alertas clínicas activas. Parámetros estables.';

  return `*🩺 INFORME CLÍNICO DE ENFERMERÍA*
*Fecha:* ${dateStr} - *Hora:* ${timeStr} hs
*Enfermero/a:* ${p.nurseName || 'A cargo'} | *Turno:* ${p.shift}
*Aislamiento:* ${p.aislamiento || 'Ninguno'}
────────────────────────────
*👤 DATOS DEL PACIENTE*
• *Nombre:* ${p.nombre || 'No especificado'}
• *Cama/Hab:* ${p.cama || 'Sin asignar'} ${p.historiaClinica ? `| *HC:* ${p.historiaClinica}` : ''}
• *Edad:* ${p.edad !== '' ? `${p.edad} ${p.unidadEdad}` : '—'} (${r.label}) | *Sexo:* ${p.sexo}
• *Peso/Talla:* ${p.peso || '—'} kg / ${p.talla || '—'} cm
• *IMC:* ${imcCalc.imcValue ? `${imcCalc.imcValue} kg/m² (${imcCalc.classification})` : 'No calculado'}
• *Dx / Motivo:* ${p.dx || 'En valoración'}
• *⚠️ Alergias:* ${p.alergias || 'Ninguna conocida'}

────────────────────────────
*❤️ SIGNOS VITALES*
• *FC:* ${p.v_fc !== '' ? `${p.v_fc} lpm` : '—'} (Ref: ${r.fc[0]}-${r.fc[1]})
• *FR:* ${p.v_fr !== '' ? `${p.v_fr} rpm` : '—'} (Ref: ${r.fr[0]}-${r.fr[1]})
• *TA:* ${p.v_tas !== '' && p.v_tad !== '' ? `${p.v_tas}/${p.v_tad} mmHg` : '—'}
• *Temp:* ${p.v_temp !== '' ? `${p.v_temp} °C` : '—'}
• *SpO₂:* ${p.v_spo2 !== '' ? `${p.v_spo2}%` : '—'} (Meta: ≥${r.spo2}%)

────────────────────────────
*🧠 NEUROLÓGICO & CONCIENCIA*
• *Estado:* ${p.n_conciencia}
• *Glasgow:* ${glasgow.total}/15 (O:${p.n_go}, V:${p.n_gv}, M:${p.n_gm}) - ${glasgow.severity}
• *Pupilas:* ${p.n_pupilas} | *Reactivas:* ${p.n_reactivas}
• *Obs:* ${p.n_obs || 'Sin particularidades'}

────────────────────────────
*🫁 RESPIRATORIO*
• *Patrón:* ${p.r_patron} | *Ruidos:* ${p.r_ruidos}
• *O₂ suplementario:* ${p.r_o2} ${p.r_o2 === 'Sí' && p.r_o2det ? `(${p.r_o2det})` : ''}
• *Tos / Secreciones:* ${p.r_tos || 'No refiere'}

────────────────────────────
*❤️ CARDIOVASCULAR & PERFUSIÓN*
• *Ritmo:* ${p.c_ritmo} | *Pulsos:* ${p.c_pulsos}
• *Relleno capilar:* ${p.c_relleno} | *Edemas:* ${p.c_edemas}
• *Piel/Perfusión:* ${p.c_perfusion || 'Normocoloreada'}

────────────────────────────
*💧 BALANCE HÍDRICO & RENAL*
• *Balance del turno:* ${balance.balanceFormatted}
• *Diuresis:* ${p.u_diuresis || 'Espontánea'} | *Sonda vesical:* ${p.u_sonda}
• *Características orina:* ${p.u_caract || 'Normocoloreada'}

────────────────────────────
*🍽️ NUTRICIÓN & DIGESTIVO*
• *Dieta:* ${p.nu_dieta} | *Vía:* ${p.nu_via}
• *Tolerancia:* ${p.nu_tolerancia} | *Apetito:* ${p.nu_apetito}

────────────────────────────
*😖 EVALUACIÓN DEL DOLOR (EVA)*
• *Escala EVA:* ${p.d_eva}/10 ${p.d_eva === 0 ? '😃 Sin dolor' : p.d_eva < 4 ? '🙂 Leve' : p.d_eva < 7 ? '😐 Moderado' : '😫 Severo'}
• *Localización:* ${p.d_loc || 'No refiere'} | *Tipo:* ${p.d_tipo}
• *Tratamiento:* ${p.d_tto || 'Sin requerimiento actual'}

────────────────────────────
*🩴 PIEL & CAÍDAS (ESCALAS)*
• *Integridad cutánea:* ${p.pi_integridad} ${p.pi_loc ? `(${p.pi_loc})` : ''}
• *Escala Braden (UPP):* ${braden.total}/23 - ${braden.risk}
• *Movilidad:* ${p.m_nivel} ${p.m_disp ? `| Ayudas: ${p.m_disp}` : ''}
• *Escala Downton (Caídas):* ${downton.total} ptos - ${downton.risk}

────────────────────────────
*💊 MEDICACIÓN DEL TURNO*
${medsText}

────────────────────────────
*🧪 LABORATORIO RELEVANTE*
${labsText}

────────────────────────────
*🚨 ALERTAS CLÍNICAS ACTIVAS*
${alertsBlock}

────────────────────────────
*📈 NOTA DE EVOLUCIÓN DE ENFERMERÍA*
${p.ev_nota || 'Paciente estable durante el turno, sin eventualidades.'}

${p.pendientes ? `*📌 PENDIENTES Y PASE DE GUARDIA:*\n${p.pendientes}\n` : ''}────────────────────────────
_Aplicación generada por Agencia digital métele apps_`;
}
