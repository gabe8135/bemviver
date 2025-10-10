'use client';
import { useEffect, useState } from 'react';
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

// Helpers
function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function parseLocalISODate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}
function getNextBusinessLabels(dates: string[]) {
  return dates.map((iso) => {
    const d = parseLocalISODate(iso);
    const label = d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' });
    return { date: iso, label };
  });
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
  const [availability, setAvailability] = useState<{ date: string; blocked: boolean; times: { time: string; available: boolean }[] }[]>([]);
  const [loadingAvail, setLoadingAvail] = useState(false);
  const [availError, setAvailError] = useState<string | null>(null);

  const fetchAvailability = async (svc: string) => {
    try {
      setLoadingAvail(true);
      setAvailError(null);
      const from = toISODate(new Date());
      const url = `/api/availability?from=${encodeURIComponent(from)}&days=14&service=${encodeURIComponent(svc)}`;
      const res = await fetch(url, { cache: 'no-store' });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Falha ao carregar disponibilidade');
      setAvailability(Array.isArray(data?.days) ? data.days : []);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro ao carregar disponibilidade';
      setAvailError(msg);
      setAvailability([]);
    } finally {
      setLoadingAvail(false);
    }
  };

  useEffect(() => {
    // ao carregar e quando o serviço muda
    fetchAvailability(form.service);
    // limpar seleção ao trocar serviço
    setForm((f) => ({ ...f, date: '', time: '' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.service]);

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
  const svc = form.service;
  setForm({ name: '', phone: '', service: svc, date: '', time: '', notes: '' });
  // Recarrega disponibilidade do mesmo serviço para refletir o novo horário ocupado
  fetchAvailability(svc);
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
                  <p className="text-xs text-gray-500">Disponibilidade é por serviço. Se quiser ver ocupações de Psicologia, selecione o serviço correspondente.</p>
                  {loadingAvail && (
                    <p className="text-sm text-gray-500">Carregando disponibilidade…</p>
                  )}
                  {availError && (
                    <p className="text-sm text-red-500">{availError}</p>
                  )}
                  {!loadingAvail && !availError && availability.length === 0 && (
                    <p className="text-sm text-gray-500">Sem disponibilidade para os próximos dias.</p>
                  )}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {(() => {
                      const days = availability.map((d) => d.date);
                      const labeled = getNextBusinessLabels(days);
                      return labeled.map(({ date, label }) => {
                        const day = availability.find((d) => d.date === date);
                        const fullBlocked = !!day?.blocked || day?.times.every(t => !t.available);
                        const selected = form.date === date;
                        const hoverClass = !fullBlocked && !selected ? 'hover:bg-gray-50' : '';
                        const fullBlockedStyle = fullBlocked ? 'bg-red-50 text-red-700 border-red-200' : '';
                        return (
                          <button
                            key={date}
                            type="button"
                            onClick={() => setForm(f => ({ ...f, date, time: '' }))}
                            disabled={fullBlocked}
                            className={`rounded-md border px-3 py-2 text-sm ${selected ? 'bg-primary text-white border-primary' : 'bg-white text-gray-900 border-gray-300'} ${fullBlocked ? 'cursor-not-allowed' : hoverClass} ${fullBlockedStyle}`}
                            title={fullBlocked ? 'Sem vagas neste dia' : ''}
                          >
                            {label}
                          </button>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* Seleção de horário (apenas horário comercial) */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Escolha o horário</label>
                  {!form.date ? (
                    <p className="text-sm text-gray-500">Selecione um dia para ver os horários disponíveis.</p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {(availability.find(d => d.date === form.date)?.times || []).map(({ time: t, available }) => {
                        const blocked = !available;
                        const selected = form.time === t;
                        const hoverClass = !blocked && !selected ? 'hover:bg-gray-50' : '';
                        const blockedStyle = blocked ? 'bg-red-50 text-red-700 border-red-200' : '';
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setForm(f => ({ ...f, time: t }))}
                            disabled={blocked}
                            className={`rounded-md border px-3 py-2 text-sm ${selected ? 'bg-primary text-white border-primary' : 'bg-white text-gray-900 border-gray-300'} ${blocked ? 'cursor-not-allowed' : hoverClass} ${blockedStyle}`}
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
