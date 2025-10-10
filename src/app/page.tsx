'use client';
import { useState } from 'react';
import Modal from '@/components/Modal';

type FormState = {
  name: string;
  phone: string;
  service: string;
  date: string; // yyyy-mm-dd
  time: string; // HH:mm
  notes?: string;
};

const services = [
  { id: 'consulta_geral', label: 'Consulta Geral' },
  { id: 'avaliacao_nutricao', label: 'Avaliação de Nutrição' },
  { id: 'psicologia', label: 'Psicologia' },
];

// Configuração de agenda (simulação)
const BUSINESS_START_HOUR = 8; // 08:00
const BUSINESS_END_HOUR = 18; // 18:00 (último slot começa às 17:30)
const SLOT_MINUTES = 30;

// Dias totalmente sem atendimento (yyyy-mm-dd)
const blockedDates = new Set<string>([
  // Exemplos de simulação
  '2025-10-20',
  '2025-10-22',
]);

// Horários indisponíveis por dia específico
const blockedSlots: Record<string, string[]> = {
  // Exemplo: dia 2025-10-16 sem 09:00 e 14:30
  '2025-10-16': ['09:00', '14:30'],
};

function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function isWeekend(d: Date) {
  const day = d.getDay(); // 0=Dom, 6=Sáb
  return day === 0 || day === 6;
}

function getNextBusinessDays(count = 14) {
  const days: { date: string; label: string }[] = [];
  const now = new Date();
  for (let i = 0; days.length < count && i < 60; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    if (isWeekend(d)) continue;
    const iso = toISODate(d);
    const label = d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
    days.push({ date: iso, label });
  }
  return days;
}

function generateTimeSlots(startHour: number, endHour: number, stepMin: number) {
  const slots: string[] = [];
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += stepMin) {
      const hh = String(h).padStart(2, '0');
      const mm = String(m).padStart(2, '0');
      const t = `${hh}:${mm}`;
      // garantir que o último intervalo seja até 17:30 quando endHour = 18
      if (h === endHour - 1 && m > 30) continue;
      slots.push(t);
    }
  }
  return slots;
}

export default function HomePage() {
  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
    service: services[0].id,
    date: '',
    time: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{ name: string; phone: string; date: string; time: string } | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erro ao agendar');
  // Sucesso: abre modal com dados e limpa formulário
  setSuccessInfo({ name: form.name, phone: form.phone, date: form.date, time: form.time });
  setShowSuccess(true);
      setForm({ name: '', phone: '', service: services[0].id, date: '', time: '', notes: '' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Falha ao enviar.';
      setMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      {/* Hero sofisticado */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient opacity-60 pointer-events-none" />
        <div className="container py-16 relative">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">Clínica BemViver</h1>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl">Cuide da sua saúde com rapidez e praticidade. Agende sua consulta online e receba confirmação automática no WhatsApp.</p>
              <div className="mt-6 flex gap-3">
                <a href="#agendar" className="btn-primary shadow-glow">Agendar agora</a>
                <a href="#beneficios" className="btn-outline">Saiba mais</a>
              </div>
            </div>
            <div className="relative order-first md:order-none">
              <img src="/images/agendamento.jpg" alt="Profissional de saúde atendendo ao telefone" className="w-full h-auto rounded-2xl border border-gray-200 shadow-lg" />
            </div>
            {/* Formulário em cartão */}
            <form id="agendar" onSubmit={onSubmit} className="card p-6 w-full space-y-4 md:col-span-2 lg:col-span-1">
              <h3 className="text-xl font-semibold">Agende sua consulta</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium">Nome completo</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full rounded-md px-3 py-2 bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="Seu nome" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium">WhatsApp</label>
                  <input required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full rounded-md px-3 py-2 bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="(11) 99999-9999" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Serviço</label>
                  <select value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))} className="w-full rounded-md px-3 py-2 bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/40">
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>
                {/* Seleção de dia (somente seg–sex) */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Escolha o dia (seg–sex)</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {getNextBusinessDays(14).map(({ date, label }) => {
                      const fullBlocked = blockedDates.has(date);
                      const selected = form.date === date;
                      const hoverClass = !fullBlocked && !selected ? 'hover:bg-gray-50' : '';
                      return (
                        <button
                          key={date}
                          type="button"
                          onClick={() => setForm(f => ({ ...f, date, time: '' }))}
                          disabled={fullBlocked}
                          className={`rounded-md border px-3 py-2 text-sm ${selected ? 'bg-primary text-white border-primary' : 'bg-white text-gray-900 border-gray-300'} ${fullBlocked ? 'opacity-50 cursor-not-allowed' : hoverClass}`}
                          title={fullBlocked ? 'Sem vagas neste dia' : ''}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Seleção de horário (apenas horário comercial) */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Escolha o horário</label>
                  {!form.date ? (
                    <p className="text-sm text-gray-500">Selecione um dia para ver os horários disponíveis.</p>
                  ) : blockedDates.has(form.date) ? (
                    <p className="text-sm text-gray-500">Sem vagas para o dia selecionado. Escolha outro dia.</p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {generateTimeSlots(BUSINESS_START_HOUR, BUSINESS_END_HOUR, SLOT_MINUTES).map((t) => {
                        const blocked = (blockedSlots[form.date] || []).includes(t);
                        const selected = form.time === t;
                        const hoverClass = !blocked && !selected ? 'hover:bg-gray-50' : '';
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setForm(f => ({ ...f, time: t }))}
                            disabled={blocked}
                            className={`rounded-md border px-3 py-2 text-sm ${selected ? 'bg-primary text-white border-primary' : 'bg-white text-gray-900 border-gray-300'} ${blocked ? 'opacity-40 cursor-not-allowed' : hoverClass}`}
                            title={blocked ? 'Horário indisponível' : ''}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium">Observações</label>
                  <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className="w-full rounded-md px-3 py-2 bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40" placeholder="Informações adicionais (opcional)" rows={3} />
                </div>
              </div>
              <button disabled={submitting || !form.date || !form.time} className="btn-primary disabled:opacity-60">
                {submitting ? 'Enviando...' : 'Confirmar agendamento'}
              </button>
              {message && (
                <p className="text-sm text-red-300">{message}</p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Seção de benefícios */}
      <section id="beneficios" className="py-16">
        <div className="container">
          <h2 className="text-2xl font-semibold">Por que escolher a BemViver?</h2>
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            <div className="card p-5">
              <h4 className="font-semibold text-gray-900">Agendamento em minutos</h4>
              <p className="text-sm text-gray-600 mt-2">Escolha data e horário de forma prática, sem burocracia.</p>
            </div>
            <div className="card p-5">
              <h4 className="font-semibold text-gray-900">Confirmação no WhatsApp</h4>
              <p className="text-sm text-gray-600 mt-2">Receba confirmação e lembretes diretamente no seu WhatsApp.</p>
            </div>
            <div className="card p-5">
              <h4 className="font-semibold text-gray-900">Cuidado de ponta a ponta</h4>
              <p className="text-sm text-gray-600 mt-2">Equipe dedicada e processos automatizados para você.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de sucesso */}
      <Modal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="✅ Agendamento realizado!"
        actions={<button onClick={() => setShowSuccess(false)} className="btn-primary">Ok</button>}
      >
        <p>
          {successInfo ? (
            <>Olá {successInfo.name}! Enviaremos a confirmação para o WhatsApp {successInfo.phone}.<br />
            Data: {successInfo.date} às {successInfo.time}.</>
          ) : (
            <>Pronto! Recebemos seu pedido de agendamento. Você receberá uma mensagem no WhatsApp com a confirmação.</>
          )}
        </p>
      </Modal>
    </main>
  );
}
