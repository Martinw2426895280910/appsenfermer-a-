import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Phone, 
  Send, 
  FileText, 
  ExternalLink,
  Printer,
  Sparkles
} from 'lucide-react';
import { PatientRecord } from '../types';
import { generateWhatsAppReport } from '../utils/clinicalCalculations';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientRecord;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  patient,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const reportText = generateWhatsAppReport(patient);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = reportText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSendWhatsApp = () => {
    const encoded = encodeURIComponent(reportText);
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');

    let url = `https://api.whatsapp.com/send?text=${encoded}`;
    if (cleanPhone) {
      url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`;
    }

    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Informe Enfermería - Cama ${patient.cama || 'S/C'} - ${patient.nombre || 'Paciente'}`,
          text: reportText,
        });
      } catch (e) {
        // Ignored or cancelled
      }
    } else {
      handleCopy();
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Informe de Enfermería - ${patient.nombre || 'Paciente'}</title>
            <style>
              body { font-family: monospace; padding: 20px; white-space: pre-wrap; font-size: 13px; color: #111; line-height: 1.5; }
            </style>
          </head>
          <body>
            ${reportText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl border border-slate-200 flex flex-col max-h-[94vh] overflow-hidden">
        {/* WhatsApp Top Bar Styling */}
        <div className="bg-[#075E54] text-white p-3.5 sm:p-4 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-sm font-bold">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold flex items-center gap-2">
                Informe para WhatsApp / Chat
              </h2>
              <p className="text-xs text-emerald-100 font-medium">
                {patient.nombre || 'Paciente'} · {patient.cama || 'Sin cama'} · Listo para enviar
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-[#128C7E] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* WhatsApp Recipient Phone Input (Optional) */}
        <div className="p-3 bg-emerald-50/70 border-b border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Phone className="w-4 h-4 text-[#075E54] shrink-0" />
            <span className="text-xs font-bold text-slate-700 whitespace-nowrap">
              Número de destino (opcional):
            </span>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Ej. +54911... o dejar vacío"
              className="flex-1 sm:w-60 px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-lg focus:outline-[#075E54]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handlePrint}
              title="Imprimir informe clínico"
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Imprimir</span>
            </button>

            {typeof navigator.share === 'function' && (
              <button
                onClick={handleNativeShare}
                className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1 shadow-2xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Compartir...</span>
              </button>
            )}

            <button
              onClick={handleCopy}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                copied
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                  : 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-50'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
            </button>
          </div>
        </div>

        {/* WhatsApp Chat Preview Area */}
        <div className="flex-1 p-3 sm:p-4 overflow-y-auto bg-[#ECE5DD] relative">
          <div className="max-w-2xl mx-auto">
            {/* WhatsApp Message Bubble */}
            <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md border border-slate-200/80 relative">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-[11px] text-slate-500 font-semibold">
                <span className="flex items-center gap-1 text-[#075E54]">
                  <Sparkles className="w-3 h-3" /> Formato WhatsApp optimizado con negritas y emojis
                </span>
                <span>Hoy {new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              {/* Text content */}
              <pre className="font-mono text-[12px] sm:text-[13px] text-slate-900 whitespace-pre-wrap leading-relaxed select-all">
                {reportText}
              </pre>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Aplicación generada por Agencia digital métele apps</span>
                <span className="text-[#34B7F1] font-bold">✓✓ Leído</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            Si dejas el número vacío, WhatsApp se abrirá y podrás elegir cualquier chat o grupo de enfermería.
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 bg-white hover:bg-slate-100 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? '¡Copiado al portapapeles!' : 'Copiar Texto'}</span>
            </button>

            <button
              onClick={handleSendWhatsApp}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 active:scale-95 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Abrir en WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
